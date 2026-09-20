import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Marquee } from "./Marquee";
import { SplitText } from "./SplitText";
import { useCMS } from "./CMSContext";
import { CinematicSequence } from "./CinematicSequence";

export const Hero: React.FC = () => {
  const { data } = useCMS();
  const hero = data?.hero;
  const marqueeItems = data?.marqueeItems || [];
  const [youtubeFailed, setYoutubeFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Marquee gallery lightbox state
  const [marqueeLight, setMarqueeLight] = useState<number | null>(null);

  const openMarqueeLight = (idx: number) => setMarqueeLight(idx);
  const closeMarqueeLight = () => setMarqueeLight(null);
  const prevMarqueeLight = () =>
    setMarqueeLight((p) => (p !== null && p > 0 ? p - 1 : marqueeItems.length - 1));
  const nextMarqueeLight = () =>
    setMarqueeLight((p) => (p !== null && p < marqueeItems.length - 1 ? p + 1 : 0));

  useEffect(() => {
    if (marqueeLight === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMarqueeLight();
      if (e.key === "ArrowLeft") prevMarqueeLight();
      if (e.key === "ArrowRight") nextMarqueeLight();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handler);
    };
  }, [marqueeLight, marqueeItems.length]);

  const primaryBtnText = hero?.primaryBtnText || "Scroll for more";
  const videoMode = hero?.videoMode || "default";
  const youtubeVideoId = hero?.youtubeVideoId;
  const useYouTube = videoMode === "youtube" && Boolean(youtubeVideoId) && !youtubeFailed;

  const disableCaptions = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    const target = iframeRef.current.contentWindow;
    const commands = [
      { event: "command", func: "unloadModule", args: ["captions"] },
      { event: "command", func: "unloadModule", args: ["cc"] },
      { event: "command", func: "setOption", args: ["captions", "track", {}] },
      { event: "command", func: "setOption", args: ["cc", "track", {}] },
      { event: "command", func: "setOption", args: ["captions", "fontSize", 0] },
      { event: "command", func: "setOption", args: ["captions", "track", { languageCode: "" }] }
    ];
    commands.forEach((cmd) => {
      try {
        target.postMessage(JSON.stringify(cmd), "*");
      } catch {
        // ignore cross-origin error
      }
    });
  }, []);

  useEffect(() => {
    if (!useYouTube || !youtubeVideoId) return;

    // Send immediately and at staggered intervals as YouTube player boots up
    const delays = [300, 600, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
    const timers = delays.map((d) => setTimeout(disableCaptions, d));

    // Listen to messages from YouTube player to react whenever it delivers events or state changes
    const onMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === "string") {
          const parsed = JSON.parse(e.data);
          if (
            parsed.event === "onReady" ||
            parsed.event === "onApiChange" ||
            parsed.event === "infoDelivery" ||
            parsed.event === "initialDelivery"
          ) {
            disableCaptions();
          }
        }
      } catch {
        // Non-JSON message from other sources
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("message", onMessage);
    };
  }, [useYouTube, youtubeVideoId, disableCaptions]);

  return (
    <section id="home" className="main home">

      {/* Main Section Intro Start */}
      <div className="main__intro">

        {/* Intro Background Start */}
        <div className="intro__background intro-bg-01" style={{ zIndex: "auto", position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}>
          {useYouTube ? (
            <div
              key={youtubeVideoId}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.35,
              }}
            >
              <iframe
                ref={iframeRef}
                src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${youtubeVideoId}&playsinline=1&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&cc_lang_pref=none&enablejsapi=1`}
                title="Hero Background Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onError={() => setYoutubeFailed(true)}
                onLoad={disableCaptions}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "100vw",
                  height: "56.25vw",
                  minHeight: "100%",
                  minWidth: "177.77vh",
                  transform: "translate(-50%, -50%) scale(1.1)",
                  pointerEvents: "none",
                  border: "none"
                }}
              />
            </div>
          ) : (
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              key={hero?.bgVideoUrl || "/img/backgrounds/introl_video_1.mp4"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
                opacity: 0.35,
              }}
            >
              <source src={hero?.bgVideoUrl || "/img/backgrounds/introl_video_1.mp4"} type="video/mp4" />
            </video>
          )}
          <div className="intro-bg-01__01" data-speed="0.6" style={{ zIndex: 2 }}>
            <img src="img/backgrounds/cinematic_reel.png" alt="Background Objects" />
          </div>
          <div className="intro-bg-01__02" data-speed="0.8" style={{ zIndex: 3 }}>
            <img src="img/backgrounds/cinematic_camera.png" alt="Background Objects" />
          </div>
        </div>
        {/* Intro Background End */}
 
        <div className="container-fluid p-0 fullheight-desktop" style={{ position: "relative", zIndex: 2 }}>
          <div className="row g-0 fullheight-desktop align-items-xl-stretch">
 
            {/* Intro Data Line #1 (if needed) Start */}
            <div className="col-12 col-xl-2"></div>
            {/* Intro Data Line #1 (if needed) End */}
 
            {/* Intro Content Start */}
            <div className="col-12 col-xl-8 fullheight-desktop">
 
              {/* Headline Start */}
              <div id="headline" className="headline d-flex align-items-start flex-column loading-wrap">
                <p className="headline__subtitle space-bottom loading__item">
                  {(hero?.heroSubtitle || "HELLO !\nMr. MK Presents").split("\n").map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
                <h1 className="headline__title loading__item">
                  {(hero?.headline || "Pooja\nProductions").split("\n").map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
                <div className="headline__btn loading__item">
                  <a className="btn btn-line-small icon-right slide-right-down" href="#portfolio">
                    <span className="btn-caption">{primaryBtnText}</span>
                    <i className="ph ph-arrow-down-right"></i>
                  </a>
                </div>
              </div>
              {/* Headline End */}

            </div>
            {/* Intro Content End */}

            {/* Intro Data Line #2 (if needed) Start */}
            <div className="col-12 col-xl-2"></div>
            {/* Intro Data Line #2 (if needed) End */}

          </div>
        </div>
      </div>
      {/* Main Section Intro End */}


      {/* ══════════════════════════════════════════════════════
          CINEMATIC SEQUENCE (Fullscreen Scroll)
          ══════════════════════════════════════════════════════ */}
      <CinematicSequence />

      {/* ══════════════════════════════════════════════════════
          MAIN MEDIA  — blockquote + marquee
          All scroll animations preserved:
            • animate-in-up  → blur fade-up on scroll
            • reveal-type    → character-by-character reveal
            • SplitText      → splits blockquote into .char spans
          ══════════════════════════════════════════════════════ */}
      <div className="main__media media-grid-bottom" style={{ position: "relative" }}>
        {/* Subtle top-gradient to blend seamlessly from the section above */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, #141414 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1
        }} />
        <div className="container-fluid p-0">
          <div className="row g-0">

            <div className="col-12 col-xl-2" />

            <div className="col-12 col-xl-8">

              {/* Blockquote — reveal-type scroll animation via SplitText */}
              <div className="content__block large-text-block">
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    <div className="col-12">
                      <blockquote className="reveal-type">
                        <SplitText text={hero?.blockquote || "Stories that stir the soul, visuals that capture the imagination, and cinema that stands the test of time."} />
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="col-12 col-xl-2" />

            {/* Marquee strip — click any card to open gallery lightbox */}
            <div className="media__fullwidth">
              <Marquee speed={80}>

                {marqueeItems.map((item, idx) => {
                  const imgSrc = item.src.startsWith("http") || item.src.startsWith("/") ? item.src : `/${item.src}`;
                  return (
                    <div
                      key={item.id}
                      className={`item image image-${(idx % 6) + 1} marquee-gallery-item`}
                      style={{ position: "relative", overflow: "hidden", borderRadius: "16px", cursor: "pointer" }}
                      onClick={() => openMarqueeLight(idx)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${item.title}`}
                      onKeyDown={(e) => e.key === "Enter" && openMarqueeLight(idx)}
                    >
                      <img
                        src={imgSrc}
                        alt={item.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                      <div style={{
                        position: "absolute",
                        bottom: 0, left: 0, right: 0,
                        padding: "24px 20px 20px 20px",
                        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                        color: "#fff",
                        fontFamily: '"Urbanist", sans-serif',
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                      }}>
                        <div style={{
                          fontSize: "calc(1.8rem + 0.5vw)",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          letterSpacing: "0.03em",
                          textTransform: "uppercase"
                        }}>
                          {item.title}
                        </div>
                        {item.description && (
                          <div style={{
                            fontSize: "calc(1.1rem + 0.2vw)",
                            fontWeight: 400,
                            lineHeight: 1.4,
                            color: "#C5A880",
                            letterSpacing: "0.02em"
                          }}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              </Marquee>
            </div>

          </div>
        </div>
      </div>
      {/* ══ END MAIN MEDIA ══ */}

      {/* Marquee Gallery Lightbox */}
      {marqueeLight !== null && marqueeItems.length > marqueeLight && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery Preview"
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            backgroundColor: "rgba(8, 8, 8, 0.97)",
            backdropFilter: "blur(12px)",
            zIndex: 999999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.25s ease",
            userSelect: "none"
          }}
          onClick={closeMarqueeLight}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); closeMarqueeLight(); }}
            aria-label="Close Gallery"
            style={{
              position: "fixed", top: "30px", right: "30px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%", width: "50px", height: "50px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "2rem", cursor: "pointer",
              zIndex: 1000001, transition: "background 0.3s", outline: "none"
            }}
          >
            <i className="ph ph-x" style={{ color: "#fff" }}></i>
          </button>

          {/* Prev arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); prevMarqueeLight(); }}
            aria-label="Previous"
            style={{
              position: "fixed", left: "24px", top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%", width: "56px", height: "56px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "2.4rem", cursor: "pointer",
              zIndex: 1000001, transition: "background 0.3s", outline: "none"
            }}
          >
            <i className="ph ph-caret-left" style={{ color: "#fff" }}></i>
          </button>

          {/* Center image */}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "80vw", maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={marqueeItems[marqueeLight].src.startsWith("http") || marqueeItems[marqueeLight].src.startsWith("/") ? marqueeItems[marqueeLight].src : `/${marqueeItems[marqueeLight].src}`}
              alt={marqueeItems[marqueeLight].title}
              style={{
                maxHeight: "62vh", maxWidth: "100%",
                objectFit: "contain",
                boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            />
            <div style={{ marginTop: "22px", textAlign: "center" }}>
              <h4 style={{ color: "#fff", fontSize: "2rem", fontWeight: 600, margin: "0 0 6px 0" }}>
                {marqueeItems[marqueeLight].title}
              </h4>
              {marqueeItems[marqueeLight].description && (
                <p style={{ color: "#C5A880", fontSize: "1.4rem", maxWidth: "500px", margin: 0, lineHeight: 1.6 }}>
                  {marqueeItems[marqueeLight].description}
                </p>
              )}
            </div>
          </div>

          {/* Next arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); nextMarqueeLight(); }}
            aria-label="Next"
            style={{
              position: "fixed", right: "24px", top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%", width: "56px", height: "56px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "2.4rem", cursor: "pointer",
              zIndex: 1000001, transition: "background 0.3s", outline: "none"
            }}
          >
            <i className="ph ph-caret-right" style={{ color: "#fff" }}></i>
          </button>

          {/* Counter */}
          <div style={{
            position: "fixed", bottom: "28px",
            color: "rgba(255,255,255,0.45)", fontSize: "1.3rem", fontWeight: 500
          }}>
            {marqueeLight + 1} / {marqueeItems.length}
          </div>
        </div>,
        document.body
      )}

    </section>
  );
};
