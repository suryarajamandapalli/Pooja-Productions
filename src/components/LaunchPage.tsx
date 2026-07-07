/**
 * LaunchPage — Premium Cinematic Launch Experience
 *
 * Architecture:
 *   - Fullscreen black stage covers entire viewport (z: 999999)
 *   - Gold LAUNCH button floats center-screen
 *   - On click: video plays fullscreen, button disappears
 *   - When video ends: stage unmounts, homepage is revealed
 *
 * The video element IS the animation. No WebGL. No canvas. No chroma key.
 * No CPU loops. Just a native HTML5 video playing as God intended.
 */

import React, { useEffect, useRef, useState } from "react";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);

  const [status,   setStatus]   = useState<"loading" | "ready" | "playing" | "done">("loading");
  const [opacity,  setOpacity]  = useState(1); // for final fade-out of stage

  /* ── Lock body scroll ──────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── Detect video ready ────────────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      if (video.readyState >= 3) setStatus("ready");
    };

    video.addEventListener("canplay",        markReady);
    video.addEventListener("canplaythrough", markReady);
    video.addEventListener("loadeddata",     markReady);

    // Immediate check for cached/already-loaded video
    if (video.readyState >= 3) setStatus("ready");

    return () => {
      video.removeEventListener("canplay",        markReady);
      video.removeEventListener("canplaythrough", markReady);
      video.removeEventListener("loadeddata",     markReady);
    };
  }, []);

  /* ── LAUNCH click ──────────────────────────────────────────────────── */
  const handleLaunch = async () => {
    if (status !== "ready") return;
    const video = videoRef.current;
    if (!video) { onLaunched(); return; }

    setStatus("playing");

    try {
      await video.play();
    } catch (err) {
      console.error("[Launch] video.play() failed:", err);
      onLaunched();
    }
  };

  /* ── Video ended — fade out then reveal ───────────────────────────── */
  const handleEnded = () => {
    setStatus("done");
    setOpacity(0);
    // After CSS transition finishes, call onLaunched
    setTimeout(onLaunched, 800);
  };

  return (
    <div
      ref={stageRef}
      className="lp-stage"
      style={{ opacity, transition: opacity === 0 ? "opacity 0.7s ease" : "none" }}
    >
      {/* ── Fullscreen video ────────────────────────────────────────── */}
      <video
        ref={videoRef}
        className="lp-video"
        src="/videoplayback.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
      />

      {/* ── Vignette on top of video for premium depth ──────────────── */}
      <div className="lp-vignette" />

      {/* ── Gold LAUNCH button (hidden once playing) ─────────────────── */}
      {status !== "playing" && status !== "done" && (
        <div className="lp-btn-wrap">
          {/* Studio label */}
          <p className="lp-studio-label">POOJA PRODUCTIONS</p>

          <button
            className={`lp-btn ${status === "ready" ? "lp-btn--ready" : "lp-btn--loading"}`}
            onClick={handleLaunch}
            disabled={status !== "ready"}
          >
            <span className="lp-btn-inner">
              {status === "ready" ? (
                <>
                  <svg className="lp-btn-icon" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <polygon points="10,8 16,12 10,16" fill="currentColor"/>
                  </svg>
                  LAUNCH
                </>
              ) : (
                <span className="lp-spinner" />
              )}
            </span>
          </button>

          <p className="lp-tagline">Experience the grand opening</p>
        </div>
      )}
    </div>
  );
};
