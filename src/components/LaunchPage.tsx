/**
 * LaunchPage — Luxury Cinema Curtain Reveal
 *
 * LAYERING (bottom → top):
 *   [0] Homepage — rendered in DOM, fully invisible before launch
 *   [1] .launch-stage (position:fixed, z:999999)
 *         ├─ .launch-black-base  — solid black, covers homepage 100%
 *         │    Removed the instant video.play() is called.
 *         │    After removal: homepage becomes visible through
 *         │    the transparent (chroma-keyed) canvas pixels.
 *         ├─ .launch-webgl-canvas — WebGL chroma-key, alpha:true
 *         └─ .launch-btn-wrap   — gold button, hidden after click
 *
 * The homepage NEVER animates. It is simply revealed through the
 * transparent gaps created by removing the green screen pixels.
 *
 * Chroma key:
 *   • HSV-space green detection (handles tonal range of green screens)
 *   • Spill suppression removes green bleed on curtain edges
 *   • Smoothstep feathering gives soft film-quality edges
 *   • All processing in GLSL — zero CPU pixel loops
 */

import React, { useEffect, useRef, useState } from "react";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

// ─── GLSL: Vertex Shader ──────────────────────────────────────────────────────
const VERT = `
  attribute vec2 a_pos;
  attribute vec2 a_uv;
  varying   vec2 v_uv;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
    v_uv = a_uv;
  }
`;

// ─── GLSL: Fragment Shader — HSV chroma key ───────────────────────────────────
const FRAG = `
  precision mediump float;
  uniform sampler2D u_tex;
  uniform vec3  u_key;         // key colour (RGB 0-1)
  uniform float u_sim;         // hue similarity  (0-1)
  uniform float u_soft;        // edge softness   (0-1)
  uniform float u_spill;       // spill removal   (0-1)
  varying vec2  v_uv;

  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w - q.y) / (6.0*d + 1e-10)), d / (q.x + 1e-10), q.x);
  }

  void main() {
    vec4  col    = texture2D(u_tex, v_uv);
    vec3  hsv    = rgb2hsv(col.rgb);
    vec3  keyHSV = rgb2hsv(u_key);

    // Circular hue distance
    float hd = abs(hsv.x - keyHSV.x);
    if (hd > 0.5) hd = 1.0 - hd;

    // Alpha: 0 = fully transparent (key colour), 1 = fully opaque (curtain)
    float alpha = smoothstep(0.0, u_soft + 0.001, hd / (u_sim + 0.001));

    // Spill suppression — pull green channel down on semi-transparent edges
    vec3 out_col = col.rgb;
    float excess = col.g - max(col.r, col.b);
    if (excess > 0.0) out_col.g -= excess * u_spill * (1.0 - alpha);

    gl_FragColor = vec4(out_col, alpha);
  }
`;

// ─── WebGL helper ─────────────────────────────────────────────────────────────
function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s)!);
  return s;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [videoReady,   setVideoReady]   = useState(false);   // canplay fired
  const [launched,     setLaunched]     = useState(false);   // button clicked
  const [videoPlaying, setVideoPlaying] = useState(false);   // play() resolved

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const glRef     = useRef<WebGLRenderingContext | null>(null);
  const texRef    = useRef<WebGLTexture | null>(null);
  const rafRef    = useRef<number>(0);

  // ── Lock scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const no = (e: Event) => e.preventDefault();
    window.addEventListener("wheel",     no, { passive: false });
    window.addEventListener("touchmove", no, { passive: false });
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel",     no);
      window.removeEventListener("touchmove", no);
    };
  }, []);

  // ── Boot WebGL once ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", {
      alpha: true,               // transparent — homepage shows through keyed pixels
      premultipliedAlpha: false,
      antialias: false,
    }) as WebGLRenderingContext | null;

    if (!gl) { console.error("WebGL unavailable"); onLaunched(); return; }
    glRef.current = gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Link program
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, mkShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen quad
    const buf = (data: Float32Array) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    };
    const posBuf = buf(new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]));
    const uvBuf  = buf(new Float32Array([ 0, 1, 1, 1,  0,0,  0,0, 1, 1, 1,0]));

    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvLoc = gl.getAttribLocation(prog, "a_uv");
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    // Video texture
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    texRef.current = tex;

    // Chroma key uniforms — standard green screen (0, 177, 64)
    gl.uniform3f(gl.getUniformLocation(prog, "u_key"),   0.0, 177/255, 64/255);
    gl.uniform1f(gl.getUniformLocation(prog, "u_sim"),   0.40);
    gl.uniform1f(gl.getUniformLocation(prog, "u_soft"),  0.20);
    gl.uniform1f(gl.getUniformLocation(prog, "u_spill"), 0.90);
    gl.uniform1i(gl.getUniformLocation(prog, "u_tex"),   0);

    // Resize handler
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []); // eslint-disable-line

  // ── Listen for video ready ───────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current!;
    const mark = () => setVideoReady(true);
    v.addEventListener("canplay",        mark);
    v.addEventListener("canplaythrough", mark);
    v.addEventListener("loadeddata",     mark);
    if (v.readyState >= 2) mark();
    return () => {
      v.removeEventListener("canplay",        mark);
      v.removeEventListener("canplaythrough", mark);
      v.removeEventListener("loadeddata",     mark);
    };
  }, []);

  // ── RAF render loop ──────────────────────────────────────────────────────────
  const renderLoop = () => {
    const gl  = glRef.current;
    const tex = texRef.current;
    const v   = videoRef.current;
    if (!gl || !tex || !v || v.readyState < 2) return;

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!v.ended) rafRef.current = requestAnimationFrame(renderLoop);
  };

  // ── Launch button click ──────────────────────────────────────────────────────
  const handleLaunch = async () => {
    if (launched || !videoReady) return;
    setLaunched(true);

    const v = videoRef.current!;
    try {
      await v.play();
    } catch (err) {
      console.error("play() failed:", err);
      onLaunched();
      return;
    }

    // Black base is removed now — homepage will show through transparent canvas pixels
    setVideoPlaying(true);
    rafRef.current = requestAnimationFrame(renderLoop);
  };

  // ── Video ends ───────────────────────────────────────────────────────────────
  const handleEnded = () => {
    cancelAnimationFrame(rafRef.current);
    setTimeout(onLaunched, 100);
  };

  return (
    <div className="launch-stage">

      {/*
        BLACK BASE — completely hides the homepage until the curtain video starts.
        Removed the moment video.play() resolves. After removal, the homepage
        becomes visible only through the transparent (chroma-keyed) canvas pixels.
      */}
      {!videoPlaying && <div className="launch-black-base" />}

      {/* WebGL chroma-key canvas — GPU rendered, alpha:true */}
      <canvas ref={canvasRef} className="launch-webgl-canvas" />

      {/* Gold LAUNCH button — only while not yet clicked */}
      {!launched && (
        <div className="launch-btn-wrap">
          <button
            className="launch-btn"
            onClick={handleLaunch}
            disabled={!videoReady}
          >
            {videoReady ? "LAUNCH" : "Loading…"}
          </button>
        </div>
      )}

      {/* Hidden source video */}
      <video
        ref={videoRef}
        src="/launch_curtain.mp4"
        onEnded={handleEnded}
        style={{ display: "none" }}
        preload="auto"
        muted
        playsInline
        crossOrigin="anonymous"
      />
    </div>
  );
};
