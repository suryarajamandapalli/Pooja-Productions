import React from "react";
import { Marquee } from "./Marquee";
import { SplitText } from "./SplitText";
import { useCMS } from "./CMSContext";
import { CinematicSequence } from "./CinematicSequence";

export const Hero: React.FC = () => {
  const { data } = useCMS();
  const hero = data?.hero;

  const primaryBtnText = hero?.primaryBtnText || "Scroll for more";

  return (
    <section id="home" className="main home">

      {/* Main Section Intro Start */}
      <div className="main__intro">

        {/* Intro Background Start */}
        <div className="intro__background intro-bg-01" style={{ zIndex: "auto", position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}>
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
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
            <source src="/img/backgrounds/introl_video_1.mp4" type="video/mp4" />
          </video>
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
                <p className="headline__subtitle space-bottom loading__item">HELLO !<br />Mr. MK Presents</p>
                <h1 className="headline__title loading__item">Pooja<br />Productions</h1>
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
                        <SplitText text="Stories that stir the soul, visuals that capture the imagination, and cinema that stands the test of time." />
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="col-12 col-xl-2" />

            {/* Marquee strip */}
            <div className="media__fullwidth">
              <Marquee speed={80}>

                {(data?.marqueeItems || []).map((item, idx) => (
                  <div key={item.id} className={`item image image-${(idx % 6) + 1}`} style={{ position: "relative", overflow: "hidden", borderRadius: "16px" }}>
                    <img src={item.src.startsWith("http") || item.src.startsWith("/") ? item.src : `/${item.src}`} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
                ))}

              </Marquee>
            </div>

          </div>
        </div>
      </div>
      {/* ══ END MAIN MEDIA ══ */}

    </section>
  );
};
