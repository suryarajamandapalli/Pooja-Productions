import React, { useEffect, useRef, useState } from "react";
import "./LaunchPage.css";

// ═══════════════════════════════════════════════════════
// CINEMATIC SOUNDS SYNTHESIZER (Web Audio API)
// ═══════════════════════════════════════════════════════
class CinematicAudioSynth {
  private ctx: AudioContext | null = null;
  private ambienceOsc: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;

  private init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx();
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public startAmbience() {
    this.resume();
    if (!this.ctx) return;

    // Create a very low-frequency theatre rumble/hum
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(32, this.ctx.currentTime); // 32 Hz sub-bass hum

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 3.0); // smooth fade in

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(70, this.ctx.currentTime); // filter out higher frequencies

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    this.ambienceOsc = osc;
    this.ambienceGain = gain;
  }

  public stopAmbience() {
    if (this.ambienceGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, now);
        this.ambienceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3); // fast close
        setTimeout(() => {
          this.ambienceOsc?.stop();
          this.ctx?.close();
        }, 400);
      } catch (e) {
        console.warn("Error stopping ambience", e);
      }
    }
  }

  public playBoom() {
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 1.0); // sweeping sub-bass drop

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(90, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 1.5);
  }

  public playClick() {
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Part 1: Metallic chime
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.1);

    // Part 2: White noise transient click
    const bufferSize = this.ctx.sampleRate * 0.02; // 20ms click transients
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      channelData[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(2000, now);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start();
    noise.stop(now + 0.025);
  }

  public playWhoosh() {
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 1.6;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      channelData[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(2.5, now);
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(750, now + 1.1); // sweeping filter whoosh

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(now + duration);
  }
}

// Particle interface
interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  angle: number;
  angleSpeed: number;
}

interface LaunchPageProps {
  onLaunched: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [started, setStarted] = useState(false);
  const [buttonRevealed, setButtonRevealed] = useState(true); // LAUNCH button is visible immediately on load
  const [clicked, setClicked] = useState(false);
  const [pageFadeToBlack, setPageFadeToBlack] = useState(false); // Quick fade to black on ended

  // Hidden dev green screen debugging panel controls
  const [showDebug, setShowDebug] = useState(false);
  const [threshold1, setThreshold1] = useState(25);
  const [threshold2, setThreshold2] = useState(48);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioSynth = useRef<CinematicAudioSynth>(new CinematicAudioSynth());
  const animationFrameId = useRef<number | null>(null);
  const backgroundFrameId = useRef<number | null>(null);

  const pageFadeOutRef = useRef(false);

  // Handle click of the centered LAUNCH button
  const handleLaunch = () => {
    if (clicked) return;
    setClicked(true);
    setButtonRevealed(false); // Fades button away over 600ms (ease-in-out cubic)
    audioSynth.current.playClick();

    // Unblock the video element synchronously inside the gestural thread.
    // This satisfies Chrome/Safari policy and locks media playback permission.
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        video.pause();
        video.currentTime = 0;
      }).catch((err) => {
        console.warn("Synchronous media pre-activation bypass notice:", err);
      });
    }

    // After 600ms cubic transition completely finishes:
    setTimeout(() => {
      setStarted(true); // set transparent wrapper and show canvas
      audioSynth.current.playWhoosh(); // play whoosh sound on curtain slide start
      
      if (video) {
        video.play().catch((err) => {
          console.warn("Curtain video play error:", err);
        });
      }
    }, 600);
  };

  // Resume Web Audio on first user interaction anywhere on the document
  useEffect(() => {
    const unlockAudio = () => {
      audioSynth.current.resume();
    };
    window.addEventListener("click", unlockAudio);
    window.addEventListener("mousemove", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("mousemove", unlockAudio);
    };
  }, []);

  // background Canvas Particle System (Drifting cinematic dust)
  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.45 + 0.15,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: Math.random() * 0.02 - 0.01,
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Render drifting dust particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.25;
        p.angle += p.angleSpeed;

        // Reset particle on top exit
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 168, 128, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(197, 168, 128, 0.3)";
        ctx.fill();
      });

      backgroundFrameId.current = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (backgroundFrameId.current) cancelAnimationFrame(backgroundFrameId.current);
    };
  }, []);

  // Keyboard shortcut listener to toggle chroma debug sliders (Press 'D')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") {
        setShowDebug((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Start ambience rumble sound on mount
  useEffect(() => {
    audioSynth.current.startAmbience();
  }, []);

  // Media API end event listener. Drives route navigation when video ends playback.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Ensure the video has actually played through (preventing instantaneous false events)
      if (video.currentTime > 1.0 && !pageFadeOutRef.current) {
        pageFadeOutRef.current = true;
        setPageFadeToBlack(true); // Fade entire launch page to solid black
        audioSynth.current.stopAmbience();
        
        setTimeout(() => {
          onLaunched(); // Navigate to homepage ("/") after 800ms (600ms transition + 200ms pause)
        }, 800);
      }
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onLaunched]);

  // Video Frame Chroma-Key drawing loop
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use a lightweight offscreen buffer canvas for green screen pixel operations
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    const targetWidth = 960;
    const targetHeight = 540;
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const processChromaKey = () => {
      // If we haven't clicked Launch yet, do not process frames
      if (video.paused && video.currentTime === 0) {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        animationFrameId.current = requestAnimationFrame(processChromaKey);
        return;
      }

      // Draw solid black frame if video is in active state but not fully ready
      if (video.readyState < 2) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        animationFrameId.current = requestAnimationFrame(processChromaKey);
        return;
      }

      // Draw video frame to buffer
      tempCtx.drawImage(video, 0, 0, targetWidth, targetHeight);

      // Read pixel values
      const frame = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
      const data = frame.data;
      const len = data.length;

      // Key out green background completely using anti-aliasing edge formula
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Green dominance calculation
        const maxColor = Math.max(r, b);
        const diff = g - maxColor;

        if (g > 60 && diff > threshold2) {
          data[i + 3] = 0; // fully transparent
        } else if (g > 60 && diff > threshold1) {
          const factor = (diff - threshold1) / (threshold2 - threshold1);
          data[i + 3] = Math.round((1 - factor) * 255); // smooth alpha blend
        }
      }

      // Output back to display canvas
      ctx.putImageData(frame, 0, 0);

      animationFrameId.current = requestAnimationFrame(processChromaKey);
    };

    // Run frame-loop immediately
    processChromaKey();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [threshold1, threshold2]);

  return (
    <div className={`launch-container ${started ? "started" : ""} ${pageFadeToBlack ? "fade-to-black" : ""}`}>
      {/* Cinematic Overlays */}
      <div className="launch-grain"></div>
      
      {/* Volumetric spotlight and rays visible immediately on page open */}
      <div className="launch-background" style={{ opacity: 1 }} />
      <div className="launch-rays" style={{ opacity: 1 }} />

      {/* Floating branding blue diamonds near corners */}
      <div className="launch-blue-diamond" style={{ top: "10%", left: "10%", width: "24px" }}>
        <img src="/Daimonds/3.png" alt="Branding element" />
      </div>
      <div className="launch-blue-diamond" style={{ top: "15%", right: "12%", width: "32px" }}>
        <img src="/Daimonds/5.png" alt="Branding element" />
      </div>
      <div className="launch-blue-diamond" style={{ bottom: "20%", left: "8%", width: "28px" }}>
        <img src="/Daimonds/5.png" alt="Branding element" />
      </div>
      <div className="launch-blue-diamond" style={{ bottom: "12%", right: "10%", width: "20px" }}>
        <img src="/Daimonds/3.png" alt="Branding element" />
      </div>

      {/* Background Canvas Layer (Rays/Dust behind key space) */}
      <canvas ref={backgroundCanvasRef} className="launch-canvas" style={{ zIndex: 2 }} />

      {/* Keyed Curtain Video Canvas Layer */}
      <canvas ref={canvasRef} className="launch-canvas" style={{ zIndex: 5 }} />

      {/* Main UI Layer (Exactly ONE button) */}
      <div className="launch-ui">
        <button
          className={`launch-gold-btn ${buttonRevealed ? "visible" : "fade-out"}`}
          onClick={handleLaunch}
          disabled={clicked}
        >
          <div className="launch-btn-sweep"></div>
          <span className="launch-btn-text">Launch</span>
        </button>
      </div>

      {/* Energy Expansion Ring on Click */}
      <div className={`launch-energy-ring ${clicked ? "active" : ""}`} />

      {/* Lens Flare bloom on Click */}
      <div className={`launch-lens-flare ${clicked ? "active" : ""}`} />

      {/* Light Bloom fade to homepage */}
      <div className={`launch-light-bloom ${clicked ? "active" : ""}`} />

      {/* Curtain video source - starts loaded but paused, autoplays after click transition */}
      <video
        ref={videoRef}
        src="/curtains.mp4"
        className="launch-video-hidden"
        preload="auto"
        muted
        playsInline
      />

      {/* Real-time Chroma Key developer debug panel (Toggle with 'D') */}
      {showDebug && (
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          backgroundColor: "rgba(0,0,0,0.85)",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.2)",
          zIndex: 99999999,
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#fff",
          width: "280px",
          pointerEvents: "auto"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#ffd700" }}>Chroma Key Debugger</div>
          <div style={{ marginBottom: "8px" }}>
            Min Diff (T1): {threshold1}
            <input
              type="range"
              min="0"
              max="100"
              value={threshold1}
              onChange={(e) => setThreshold1(parseInt(e.target.value))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </div>
          <div style={{ marginBottom: "8px" }}>
            Max Diff (T2): {threshold2}
            <input
              type="range"
              min="0"
              max="100"
              value={threshold2}
              onChange={(e) => setThreshold2(parseInt(e.target.value))}
              style={{ width: "100%", marginTop: "4px" }}
            />
          </div>
          <div style={{ color: "#888", fontSize: "10px", marginTop: "10px" }}>Press 'D' key to close debugger panel</div>
        </div>
      )}
    </div>
  );
};
