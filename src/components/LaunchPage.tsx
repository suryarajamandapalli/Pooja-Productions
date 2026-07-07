/**
 * LaunchPage.tsx — Luxury Cinema Curtain Reveal
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * GPU Chroma Key Pipeline:
 *
 *   MP4 video frame  →  gl.texImage2D  →  Fragment Shader  →  WebGL Canvas
 *                                                ↓
 *                                  green pixels → alpha = 0 (transparent)
 *                                  curtain pixels → alpha = 1 (opaque)
 *                                                ↓
 *                                  Homepage visible through transparent pixels
 *
 * The fragment shader operates in YCbCr-approximate colour space for chroma
 * detection (same approach used by OBS Studio and DaVinci Resolve).
 * Additionally uses HSV hue distance for robust coverage.
 *
 * LAYERING:
 *   .launch-stage (position:fixed, z:999999)
 *     ├─ .launch-black-base  → solid black, removed after first chroma frame drawn
 *     ├─ <canvas>            → WebGL, alpha:true, chroma-keyed output
 *     └─ <button>            → gold LAUNCH button
 *
 * The homepage is rendered beneath. It NEVER moves, fades, blurs, or animates.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   GLSL VERTEX SHADER
   ═══════════════════════════════════════════════════════════════════════════ */
const VERT = `
attribute vec2 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = a_uv;
}
`;

/* ═══════════════════════════════════════════════════════════════════════════════
   GLSL FRAGMENT SHADER — Professional Chroma Key
   ─────────────────────────────────────────────────────────────────────────────
   Dual-space detection:
     1) HSV hue distance — catches all greens regardless of brightness
     2) Chroma dominance ratio — catches edge cases HSV misses
   Spill suppression: removes green tint bleeding onto curtain edges
   Edge feathering: smoothstep produces soft, film-quality transitions
   ═══════════════════════════════════════════════════════════════════════════ */
const FRAG = `
precision highp float;

uniform sampler2D u_tex;
uniform float u_sim;     // hue similarity tolerance (wider = more green removed)
uniform float u_soft;    // edge feather width (smoothstep range)
uniform float u_spill;   // spill suppression strength (0-1)
varying vec2 v_uv;

// ── RGB to HSV ──────────────────────────────────────────────────────────────
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(
    abs(q.z + (q.w - q.y) / (6.0 * d + e)),
    d / (q.x + e),
    q.x
  );
}

void main() {
  vec4 pixel = texture2D(u_tex, v_uv);
  vec3 rgb   = pixel.rgb;
  vec3 hsv   = rgb2hsv(rgb);

  // ── METHOD 1: HSV hue distance from green (hue ≈ 0.333) ──────────────
  // Green hue in 0-1 space is ~0.333
  float greenHue = 0.333;
  float hueDist  = abs(hsv.x - greenHue);
  if (hueDist > 0.5) hueDist = 1.0 - hueDist;  // circular wrap

  // Normalise by similarity; values < 1.0 are "green-like"
  float hsvMask = hueDist / (u_sim + 0.0001);

  // ── METHOD 2: Chroma dominance — green channel vs max(r,b) ───────────
  // Catches yellowish-greens and bright greens that HSV might miss
  float greenDom = 0.0;
  float maxRB = max(rgb.r, rgb.b);
  if (rgb.g > 0.15 && rgb.g > maxRB * 1.15) {
    greenDom = (rgb.g - maxRB) / (rgb.g + 0.0001);
  }

  // ── Combine both methods ──────────────────────────────────────────────
  // Use the stronger green signal from either method
  float combinedGreen = max(1.0 - hsvMask, greenDom);

  // Weight by saturation: desaturated pixels (greys/blacks) should not be keyed
  float satWeight = smoothstep(0.08, 0.35, hsv.y);

  // Final green strength (0 = not green, 1 = definitely green)
  float greenStrength = combinedGreen * satWeight;

  // ── Alpha: smoothstep for soft edges ──────────────────────────────────
  // greenStrength near 1 → alpha near 0 (transparent)
  // greenStrength near 0 → alpha near 1 (opaque)
  float alpha = 1.0 - smoothstep(0.15, 0.15 + u_soft, greenStrength);

  // ── Spill suppression ─────────────────────────────────────────────────
  // Remove residual green cast on semi-transparent edge pixels
  vec3 outRGB = rgb;
  float excess = rgb.g - mix(rgb.r, rgb.b, 0.5);
  if (excess > 0.0) {
    outRGB.g -= excess * u_spill * (1.0 - alpha * alpha);
    // Gentle colour correction toward warm tone on edges
    outRGB.r += excess * u_spill * 0.08 * (1.0 - alpha);
  }

  gl_FragColor = vec4(outRGB, alpha);
}
`;

/* ═══════════════════════════════════════════════════════════════════════════════
   WEBGL HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`Shader compile error: ${log}`);
  }
  return s;
}

function linkProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(`Program link error: ${log}`);
  }
  return p;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [videoReady,    setVideoReady]    = useState(false);
  const [launched,      setLaunched]      = useState(false);
  const [showBlackBase, setShowBlackBase] = useState(true);

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const glRef       = useRef<WebGLRenderingContext | null>(null);
  const programRef  = useRef<WebGLProgram | null>(null);
  const textureRef  = useRef<WebGLTexture | null>(null);
  const rafRef      = useRef<number>(0);
  const firstDrawn  = useRef(false);

  // ── Lock scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    const block = (e: Event) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (["Space","ArrowUp","ArrowDown","PageUp","PageDown"].includes(e.code)) e.preventDefault();
    };
    window.addEventListener("wheel",     block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown",   blockKeys, { passive: false });
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      window.removeEventListener("wheel",     block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown",   blockKeys);
    };
  }, []);

  // ── Initialise WebGL ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // WebGL context with transparency
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
      desynchronized: true,        // hint: reduce latency
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.error("WebGL not available — skipping launch");
      onLaunched();
      return;
    }

    glRef.current = gl;
    console.log("[LaunchPage] WebGL context created:", gl.getParameter(gl.VERSION));

    // Transparent clear
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Compile shaders
    let vs: WebGLShader, fs: WebGLShader, program: WebGLProgram;
    try {
      vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
      fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
      program = linkProgram(gl, vs, fs);
    } catch (err) {
      console.error("[LaunchPage] Shader error:", err);
      onLaunched();
      return;
    }

    gl.useProgram(program);
    programRef.current = program;
    console.log("[LaunchPage] Shader program linked OK");

    // ── Full-screen quad geometry ────────────────────────────────────────
    //   Two triangles covering clip space (-1,-1) to (1,1)
    //   UV mapped so (0,0) is bottom-left, (1,1) is top-right
    const posBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,   1, -1,   -1,  1,
      -1,  1,   1, -1,    1,  1,
    ]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 1,   1, 1,   0, 0,
      0, 0,   1, 1,   1, 0,
    ]), gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(program, "a_uv");
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    // ── Video texture ────────────────────────────────────────────────────
    const tex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    textureRef.current = tex;
    console.log("[LaunchPage] Texture created");

    // ── Uniforms ─────────────────────────────────────────────────────────
    // These are the chroma key tuning knobs
    gl.uniform1i(gl.getUniformLocation(program, "u_tex"),   0);
    gl.uniform1f(gl.getUniformLocation(program, "u_sim"),   0.16);  // hue similarity (0.16 = tight)
    gl.uniform1f(gl.getUniformLocation(program, "u_soft"),  0.28);  // edge feather
    gl.uniform1f(gl.getUniformLocation(program, "u_spill"), 0.95);  // spill removal
    console.log("[LaunchPage] Uniforms set: sim=0.16 soft=0.28 spill=0.95");

    // ── Resize handler ───────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      gl.deleteTexture(tex);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(uvBuf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Draw one chroma-keyed frame ────────────────────────────────────────
  const drawFrame = useCallback(() => {
    const gl      = glRef.current;
    const tex     = textureRef.current;
    const video   = videoRef.current;
    if (!gl || !tex || !video || video.readyState < 2) return false;

    try {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    } catch (err) {
      console.error("[LaunchPage] texImage2D failed:", err);
      return false;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return true;
  }, []);

  // ── Video ready detection ──────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      if (videoReady) return;
      console.log("[LaunchPage] Video ready, readyState:", video.readyState,
                  "size:", video.videoWidth, "x", video.videoHeight);

      // Draw the FIRST chroma-keyed frame onto the canvas NOW
      // This verifies the entire pipeline works before we show it
      const ok = drawFrame();
      console.log("[LaunchPage] First frame draw:", ok ? "SUCCESS" : "FAILED");

      if (ok) {
        firstDrawn.current = true;
      }
      setVideoReady(true);
    };

    video.addEventListener("canplay",        onReady);
    video.addEventListener("canplaythrough", onReady);
    video.addEventListener("loadeddata",     onReady);

    // Polling fallback for cached videos
    const poll = setInterval(() => {
      if (video.readyState >= 2 && !videoReady) onReady();
    }, 150);

    if (video.readyState >= 2) onReady();

    return () => {
      video.removeEventListener("canplay",        onReady);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("loadeddata",     onReady);
      clearInterval(poll);
    };
  }, [videoReady, drawFrame]);

  // ── Render loop (runs only while video is playing) ─────────────────────
  const renderLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.ended) return;

    drawFrame();
    rafRef.current = requestAnimationFrame(renderLoop);
  }, [drawFrame]);

  // ── LAUNCH button click ────────────────────────────────────────────────
  const handleLaunch = useCallback(async () => {
    if (launched || !videoReady) return;
    setLaunched(true);
    console.log("[LaunchPage] LAUNCH clicked");

    const video = videoRef.current;
    if (!video) { onLaunched(); return; }

    try {
      await video.play();
      console.log("[LaunchPage] video.play() resolved, paused:", video.paused);
    } catch (err) {
      console.error("[LaunchPage] video.play() FAILED:", err);
      onLaunched();
      return;
    }

    // Remove black base AFTER play starts — homepage now shows through keyed pixels
    setShowBlackBase(false);

    // Start continuous GPU rendering
    rafRef.current = requestAnimationFrame(renderLoop);
  }, [launched, videoReady, onLaunched, renderLoop]);

  // ── Video ended ────────────────────────────────────────────────────────
  const handleEnded = useCallback(() => {
    console.log("[LaunchPage] Video ended");
    cancelAnimationFrame(rafRef.current);
    // Brief freeze then destroy
    setTimeout(onLaunched, 100);
  }, [onLaunched]);

  return (
    <div className="launch-stage">
      {/* ── SOLID BLACK BASE ──────────────────────────────────────────────
          Completely hides the homepage. Removed only after video.play()
          resolves and the chroma-key render loop is actively drawing.
          The visitor sees: black screen → curtain → homepage reveal.   */}
      {showBlackBase && <div className="launch-black-base" />}

      {/* ── WEBGL CANVAS ──────────────────────────────────────────────────
          GPU chroma-keyed output. alpha:true means transparent pixels
          let the homepage show through.                                */}
      <canvas ref={canvasRef} className="launch-webgl-canvas" />

      {/* ── GOLD LAUNCH BUTTON ────────────────────────────────────────── */}
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

      {/* ── HIDDEN VIDEO SOURCE ───────────────────────────────────────────
          display:none — never rendered on screen.
          NO crossOrigin — same-origin video, avoids CORS taint.
          Frames are uploaded to GPU via texImage2D each RAF tick.      */}
      <video
        ref={videoRef}
        src="/launch_video.mp4"
        onEnded={handleEnded}
        className="launch-hidden-video-element"
        preload="auto"
        muted
        playsInline
      />
    </div>
  );
};
