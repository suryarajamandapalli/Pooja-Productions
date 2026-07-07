/**
 * LaunchPage — GPU Chroma Key Cinema Reveal
 *
 * THE CRITICAL FIX vs all previous attempts:
 *   video element uses opacity:0, NOT display:none
 *   display:none stops Chrome from decoding video frames → texImage2D gets black texture
 *   opacity:0 keeps Chrome's full video decode pipeline active → texImage2D gets real frames
 *
 * Z-INDEX STACK (inside lp-stage, position:fixed z:999999):
 *   z:1  lp-video-src   — raw video, opacity:0, full size → Chrome decodes every frame
 *   z:2  lp-black-base  — solid black, hides homepage before play, removed on play()
 *   z:5  lp-canvas      — WebGL output: green→transparent, curtain→opaque
 *   z:10 lp-ui          — gold LAUNCH button
 *
 * When canvas areas are transparent (green removed):
 *   Before play → shows lp-black-base below → pure black ✓
 *   After play  → black removed → shows homepage through lp-stage ✓
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import "./LaunchPage.css";

/* ── Vertex Shader ──────────────────────────────────────────────────────── */
const VERT = `
attribute vec2 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = a_uv;
}
`;

/* ── Fragment Shader — YCbCr Chroma Key ─────────────────────────────────
   YCbCr chroma distance is the industry standard for broadcast keying.
   It separates luma (Y) from chroma (Cb,Cr), measuring colour distance
   only in chroma space — robust to lighting variation on the key colour.
   ──────────────────────────────────────────────────────────────────────── */
const FRAG = `
precision mediump float;

uniform sampler2D u_tex;
uniform vec3      u_keyColor;   // green key colour in linear RGB
uniform float     u_similarity; // chroma distance threshold (wider = more removed)
uniform float     u_smoothness; // feather softness (smoothstep range above threshold)
uniform float     u_spill;      // green spill suppression 0-1

varying vec2 v_uv;

vec3 rgb2ycbcr(vec3 c) {
  float y  =  0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
  float cb = -0.169 * c.r - 0.331 * c.g + 0.500 * c.b + 0.5;
  float cr =  0.500 * c.r - 0.419 * c.g - 0.081 * c.b + 0.5;
  return vec3(y, cb, cr);
}

void main() {
  vec4  pixel    = texture2D(u_tex, v_uv);
  vec3  ycbcr    = rgb2ycbcr(pixel.rgb);
  vec3  keyYCbCr = rgb2ycbcr(u_keyColor);

  // Distance in Cb-Cr plane only (ignores luma — lighting-invariant)
  float dist  = distance(ycbcr.yz, keyYCbCr.yz);

  // alpha: 0 = fully transparent (green), 1 = fully opaque (curtain)
  float lo    = u_similarity - u_smoothness;
  float alpha = smoothstep(lo, u_similarity, dist);

  // Spill suppression: reduce green cast on semi-transparent edge pixels
  vec3 outColor = pixel.rgb;
  float excess  = pixel.g - max(pixel.r, pixel.b);
  if (excess > 0.0) {
    outColor.g -= excess * u_spill * (1.0 - alpha);
    outColor.r += excess * u_spill * 0.05 * (1.0 - alpha); // warm edge correction
  }

  gl_FragColor = vec4(outColor, alpha);
}
`;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(`Shader error: ${gl.getShaderInfoLog(s)}`);
  }
  return s;
}

function buildProgram(gl: WebGLRenderingContext): WebGLProgram {
  const vs   = compile(gl, gl.VERTEX_SHADER,   VERT);
  const fs   = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(`Link error: ${gl.getProgramInfoLog(prog)}`);
  }
  return prog;
}

/* ── Component ───────────────────────────────────────────────────────────── */
interface LaunchPageProps { onLaunched: () => void; }

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const glRef      = useRef<WebGLRenderingContext | null>(null);
  const progRef    = useRef<WebGLProgram | null>(null);
  const texRef     = useRef<WebGLTexture | null>(null);
  const rafRef     = useRef<number>(0);
  const launchedRef = useRef(false);

  const [status,    setStatus]    = useState<"loading" | "ready" | "playing" | "done">("loading");
  const [showBlack, setShowBlack] = useState(true);

  /* ── Lock body scroll ──────────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── WebGL init ──────────────────────────────────────────────────────────
     Runs once on mount. Sets up full-screen quad + chroma key shader.       */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha:              true,
      premultipliedAlpha: false,
      antialias:          false,
      powerPreference:    "high-performance",
    });

    if (!gl) {
      console.warn("[Launch] WebGL unavailable");
      onLaunched();
      return;
    }

    glRef.current = gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /* Build shader program */
    let prog: WebGLProgram;
    try {
      prog = buildProgram(gl);
    } catch (err) {
      console.error("[Launch] Shader failed:", err);
      onLaunched();
      return;
    }
    gl.useProgram(prog);
    progRef.current = prog;

    /* Full-screen quad — two triangles covering clip space */
    const addBuf = (data: number[], attrName: string, size: number) => {
      const buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, attrName);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return buf;
    };

    addBuf([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1], "a_pos", 2);
    addBuf([0,1,  1,1,  0,0,  0,0,  1,1,  1,0],  "a_uv",  2);

    /* Video texture */
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    texRef.current = tex;

    /* Chroma key uniforms — tuned for bright green (#00b140 - #00ff00 range) */
    gl.uniform1i(gl.getUniformLocation(prog, "u_tex"),        0);
    gl.uniform3f(gl.getUniformLocation(prog, "u_keyColor"),   0.0, 0.75, 0.0);
    gl.uniform1f(gl.getUniformLocation(prog, "u_similarity"), 0.32);
    gl.uniform1f(gl.getUniformLocation(prog, "u_smoothness"), 0.15);
    gl.uniform1f(gl.getUniformLocation(prog, "u_spill"),      0.85);

    /* Canvas resize */
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width  = innerWidth  * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width  = innerWidth  + "px";
      canvas.style.height = innerHeight + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Draw one chroma-keyed frame ──────────────────────────────────────── */
  const drawFrame = useCallback(() => {
    const gl    = glRef.current;
    const tex   = texRef.current;
    const video = videoRef.current;
    if (!gl || !tex || !video || video.readyState < 2) return;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, []);

  /* ── Render loop ─────────────────────────────────────────────────────── */
  const renderLoop = useCallback(() => {
    drawFrame();
    rafRef.current = requestAnimationFrame(renderLoop);
  }, [drawFrame]);

  /* ── Video ready ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      if (video.readyState >= 3) setStatus("ready");
    };

    video.addEventListener("canplay",        onReady);
    video.addEventListener("canplaythrough", onReady);
    video.addEventListener("loadeddata",     onReady);
    if (video.readyState >= 3) onReady();

    return () => {
      video.removeEventListener("canplay",        onReady);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("loadeddata",     onReady);
    };
  }, []);

  /* ── LAUNCH click ─────────────────────────────────────────────────────── */
  const handleLaunch = useCallback(async () => {
    if (status !== "ready" || launchedRef.current) return;
    launchedRef.current = true;
    setStatus("playing");

    const video = videoRef.current;
    if (!video) { onLaunched(); return; }

    try {
      await video.play();
    } catch (err) {
      console.error("[Launch] play() failed:", err);
      onLaunched();
      return;
    }

    // Remove black base — homepage now shows through transparent (green-keyed) canvas areas
    setShowBlack(false);

    // Start GPU render loop
    rafRef.current = requestAnimationFrame(renderLoop);
  }, [status, onLaunched, renderLoop]);

  /* ── Video ended ─────────────────────────────────────────────────────── */
  const handleEnded = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setTimeout(onLaunched, 150);
  }, [onLaunched]);

  return (
    <div className="lp-stage">

      {/* ── BLACK BASE — hides homepage before curtain plays ──────────────
          Sits at z:2. Removed the instant video.play() resolves.
          Transparent canvas areas then show homepage through the stage.  */}
      {showBlack && <div className="lp-black-base" />}

      {/* ── WEBGL CANVAS — chroma-keyed output ───────────────────────────
          alpha:true + transparent clear. Green→transparent. Curtain→opaque. */}
      <canvas ref={canvasRef} className="lp-canvas" />

      {/* ── VIDEO SOURCE ─────────────────────────────────────────────────
          CRITICAL: opacity:0 NOT display:none.
          display:none → Chrome STOPS decoding frames → texImage2D = black.
          opacity:0    → Chrome keeps full decode pipeline → real frames.   */}
      <video
        ref={videoRef}
        className="lp-video-src"
        src="/videoplayback.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
      />

      {/* ── GOLD LAUNCH BUTTON ────────────────────────────────────────── */}
      {status !== "playing" && status !== "done" && (
        <div className="lp-ui">
          <p className="lp-studio">POOJA PRODUCTIONS</p>

          <button
            className={`lp-btn ${status === "ready" ? "lp-btn-active" : "lp-btn-loading"}`}
            onClick={handleLaunch}
            disabled={status !== "ready"}
          >
            {status === "ready" ? (
              <>
                <svg className="lp-play-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                  <polygon points="10,8 17,12 10,16" fill="currentColor"/>
                </svg>
                <span>LAUNCH</span>
              </>
            ) : (
              <span className="lp-spinner" />
            )}
          </button>

          <p className="lp-tagline">Experience the grand opening</p>
        </div>
      )}
    </div>
  );
};
