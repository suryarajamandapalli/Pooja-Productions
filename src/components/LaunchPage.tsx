/**
 * LaunchPage — Premium Theatre Curtain Reveal
 *
 * Architecture:
 *  - Layer 1 (below): Homepage — rendered, interactive, never animated
 *  - Layer 2 (above): WebGL canvas performing real-time green-screen chroma key
 *    on the curtain video. GPU-accelerated fragment shader removes green,
 *    reveals the homepage through the transparent gaps.
 *
 * Chroma key technique:
 *  - HSV colour space green detection (handles tonal variation in green screens)
 *  - Spill suppression (removes green cast on curtain edges)
 *  - Soft edge feathering via smoothstep alpha blending
 *  - No CPU pixel loops — all processing in GLSL fragment shader on GPU
 */

import React, { useEffect, useRef, useState } from "react";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// GLSL Vertex Shader
// ─────────────────────────────────────────────────────────────────────────────
const VERT_SRC = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord  = a_texCoord;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// GLSL Fragment Shader — Professional chroma key in HSV space
// ─────────────────────────────────────────────────────────────────────────────
const FRAG_SRC = `
  precision mediump float;
  uniform sampler2D u_video;
  uniform float u_similarity;   // hue-similarity tolerance  (0–1)
  uniform float u_smoothness;   // edge-feathering width     (0–1)
  uniform float u_spill;        // spill-suppression strength(0–1)
  uniform vec3  u_keyColor;     // the key colour in RGB (0–1)
  varying vec2  v_texCoord;

  // RGB → HSV conversion
  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  void main() {
    vec4  src = texture2D(u_video, v_texCoord);
    vec3  hsv = rgb2hsv(src.rgb);
    vec3  keyHSV = rgb2hsv(u_keyColor);

    // Hue distance in HSV (circular, 0–0.5 range)
    float hueDist   = abs(hsv.x - keyHSV.x);
    if (hueDist > 0.5) hueDist = 1.0 - hueDist;

    // Saturation-weighted mask: don't key very dark / grey pixels
    float satWeight = hsv.y;
    float mask      = hueDist / (u_similarity + 0.0001);
    mask            = clamp(mask, 0.0, 1.0);
    mask            = smoothstep(0.0, u_smoothness + 0.0001, mask);

    // Spill suppression: reduce residual green tint on keyed edges
    float greenExcess = src.g - max(src.r, src.b);
    vec3  deSpill = src.rgb;
    if (greenExcess > 0.0) {
      deSpill.g -= greenExcess * u_spill * (1.0 - mask);
    }

    gl_FragColor = vec4(deSpill, mask * satWeight + (1.0 - satWeight));
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// WebGL helper — compile a shader
// ─────────────────────────────────────────────────────────────────────────────
function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error("Shader compile error: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [launched, setLaunched] = useState(false);
  const [ready, setReady]       = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  const rafRef    = useRef<number>(0);
  const glRef     = useRef<WebGLRenderingContext | null>(null);
  const texRef    = useRef<WebGLTexture | null>(null);
  const progRef   = useRef<WebGLProgram | null>(null);

  // ── Lock scroll while overlay is active ───────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const block = (e: Event) => e.preventDefault();
    window.addEventListener("wheel",     block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel",     block);
      window.removeEventListener("touchmove", block);
    };
  }, []);

  // ── Initialise WebGL once canvas is mounted ───────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha:             true,   // transparent background — homepage shows through
      premultipliedAlpha: false,
      antialias:         false,
      preserveDrawingBuffer: false,
    }) as WebGLRenderingContext | null;

    if (!gl) {
      console.error("WebGL not supported — falling back immediately");
      onLaunched();
      return;
    }

    glRef.current = gl;

    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Compile shaders & link program
    const vert = compileShader(gl, gl.VERTEX_SHADER,   VERT_SRC);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error("Program link error: " + gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);
    progRef.current = prog;

    // Full-screen quad (two triangles)
    const positions = new Float32Array([
      -1, -1,  1, -1,  -1,  1,
      -1,  1,  1, -1,   1,  1,
    ]);
    const texCoords = new Float32Array([
      0, 1,  1, 1,  0, 0,
      0, 0,  1, 1,  1, 0,
    ]);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    const texLoc = gl.getAttribLocation(prog, "a_texCoord");
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    // Bind position buffer to use in draw
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Create video texture
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    texRef.current = tex;

    // Set uniform chroma key parameters
    // Tuned for a standard green screen (Chroma Key Green / 0,177,64)
    const keyR = 0.0  / 255;
    const keyG = 177.0 / 255;
    const keyB = 64.0  / 255;
    gl.uniform3f(gl.getUniformLocation(prog, "u_keyColor"),    keyR, keyG, keyB);
    gl.uniform1f(gl.getUniformLocation(prog, "u_similarity"),  0.38);  // hue tolerance
    gl.uniform1f(gl.getUniformLocation(prog, "u_smoothness"),  0.18);  // feathering
    gl.uniform1f(gl.getUniformLocation(prog, "u_spill"),       0.85);  // spill suppression
    gl.uniform1i(gl.getUniformLocation(prog, "u_video"),       0);

    // Resize canvas to match window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []); // eslint-disable-line

  // ── Video ready event ─────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => setReady(true);
    video.addEventListener("canplay",        onReady);
    video.addEventListener("canplaythrough", onReady);
    video.addEventListener("loadeddata",     onReady);

    // If already ready (browser cache)
    if (video.readyState >= 3) onReady();

    return () => {
      video.removeEventListener("canplay",        onReady);
      video.removeEventListener("canplaythrough", onReady);
      video.removeEventListener("loadeddata",     onReady);
    };
  }, []);

  // ── Render loop — uploads each video frame to GPU texture ─────────────────
  const renderLoop = () => {
    const gl     = glRef.current;
    const tex    = texRef.current;
    const prog   = progRef.current;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!gl || !tex || !prog || !video || !canvas) return;

    if (video.readyState >= 2) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      // Upload current video frame into the GPU texture
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    if (!video.ended) {
      rafRef.current = requestAnimationFrame(renderLoop);
    }
  };

  // ── Handle Launch button click ─────────────────────────────────────────────
  const handleLaunch = async () => {
    if (launched || !ready) return;
    setLaunched(true);

    const video = videoRef.current;
    if (!video) { onLaunched(); return; }

    try {
      await video.play();
    } catch (err) {
      console.error("video.play() failed:", err);
      onLaunched();
      return;
    }

    rafRef.current = requestAnimationFrame(renderLoop);
  };

  // ── Video ended — freeze 100ms then destroy overlay ───────────────────────
  const handleVideoEnded = () => {
    cancelAnimationFrame(rafRef.current);
    setTimeout(() => {
      onLaunched();
    }, 100);
  };

  return (
    <div className="launch-stage">
      {/* WebGL canvas — GPU chroma-keyed curtain */}
      <canvas ref={canvasRef} className="launch-webgl-canvas" />

      {/* Launch button — only visible before clicked */}
      {!launched && (
        <div className="launch-btn-wrap">
          <button
            className="launch-btn"
            onClick={handleLaunch}
            disabled={!ready}
          >
            {ready ? "LAUNCH" : "Loading…"}
          </button>
        </div>
      )}

      {/* Hidden video element — source for GPU texture */}
      <video
        ref={videoRef}
        src="/launch_curtain.mp4"
        onEnded={handleVideoEnded}
        style={{ display: "none" }}
        preload="auto"
        muted
        playsInline
        crossOrigin="anonymous"
      />
    </div>
  );
};
