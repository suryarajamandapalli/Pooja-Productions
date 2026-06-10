import React from "react";
import { Marquee } from "./Marquee";
import { SplitText } from "./SplitText";
import { useCMS } from "./CMSContext";
import { CanvasSequenceCard } from "./CanvasSequenceCard";

export const Hero: React.FC = () => {
  const { data } = useCMS();
  const hero = data?.hero;

  const primaryBtnText = hero?.primaryBtnText || "Scroll for more";

  return (
    <section id="home" className="main home">

      {/* ══════════════════════════════════════════════════════
          MAIN INTRO  — exact Blayden class structure
          Images positioned by CSS (.intro-bg-01__01 / __02)
          Text in Bootstrap col-8, loading-wrap animations
          ══════════════════════════════════════════════════════ */}
      <div className="main__intro">

        {/* Background images — CSS classes handle positioning & z-index */}
        <div className="intro__background intro-bg-01">
          {/* Left image */}
          <div className="intro-bg-01__01" data-speed="0.6">
            <img src="img/backgrounds/gold_diamond1.png" alt="Golden Diamond" style={{ mixBlendMode: "screen", opacity: 0.8 }} />
            <div className="intro-bg__shadow" />
          </div>
          {/* Right image */}
          <div className="intro-bg-01__02" data-speed="0.8">
            <img src="img/backgrounds/gold_diamond2.png" alt="Golden Diamond" style={{ mixBlendMode: "screen", opacity: 0.8 }} />
            <div className="intro-bg__shadow" />
          </div>
        </div>

        {/* Content grid — exact Blayden column structure */}
        <div className="container-fluid p-0 fullheight-desktop">
          <div className="row g-0 fullheight-desktop align-items-xl-stretch">

            <div className="col-12 col-xl-2" />

            <div className="col-12 col-xl-8 fullheight-desktop">
              {/* Headline — loading-wrap triggers Loader.tsx GSAP stagger */}
              <div id="headline" className="headline d-flex align-items-start flex-column loading-wrap">

                {/* Subtitle — loading__item #1 (blurs+slides up first) */}
                <p className="headline__subtitle space-bottom loading__item" style={{ fontSize: "1.6rem", fontWeight: 300, opacity: 0.8, letterSpacing: "0.4em", textTransform: "uppercase" }}>
                  HELLO !<br />MR. MK PRESENTS
                </p>

                {/* Headline — loading__item #2 */}
                <h1 className="headline__title loading__item" style={{ fontSize: "clamp(6rem, 8vw, 12rem)", lineHeight: "1", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "2rem" }}>
                  POOJA
                  <br />
                  PRODUCTIONS
                </h1>
                
                {/* Subtext — loading__item */}
                <p className="headline__subtitle space-bottom loading__item" style={{ fontSize: "1.8rem", fontWeight: 300, opacity: 0.6, fontStyle: "italic", letterSpacing: "0.1em" }}>
                  Crafting Stories That Live Forever
                </p>

                {/* CTA button — loading__item #3 */}
                <div className="headline__btn loading__item">
                  <a className="btn btn-line-small icon-right slide-right-down" href="#portfolio">
                    <span className="btn-caption">{primaryBtnText}</span>
                    <i className="ph ph-arrow-down-right" />
                  </a>
                </div>

              </div>
            </div>

            <div className="col-12 col-xl-2" />

          </div>
        </div>
      </div>
      {/* ══ END MAIN INTRO ══ */}


      {/* ══════════════════════════════════════════════════════
          MAIN MEDIA  — divider image + blockquote + marquee
          All scroll animations preserved:
            • animate-in-up  → blur fade-up on scroll
            • reveal-type    → character-by-character reveal
            • SplitText      → splits blockquote into .char spans
          ══════════════════════════════════════════════════════ */}
      <div className="main__media media-grid-bottom">
        <div className="container-fluid p-0">
          <div className="row g-0">

            <div className="col-12 col-xl-2" />

            <div className="col-12 col-xl-8">

              {/* Divider image — animate-in-up scroll animation */}
              <div className="content__block">
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    <div className="col-12">
                      <CanvasSequenceCard />
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockquote — reveal-type scroll animation via SplitText */}
              <div className="content__block large-text-block">
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    <div className="col-12">
                      <blockquote className="reveal-type animate-in-up">
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
              <Marquee speed={45}>

                {hero?.marqueeItems?.map((item, idx) => (
                  <div key={item.id} className={`item image image-${idx + 1}`} style={{ position: "relative", overflow: "hidden", borderRadius: "16px" }}>
                    <img src={item.src} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{
                      position: "absolute",
                      bottom: 0, left: 0, right: 0,
                      padding: "20px",
                      background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                      color: "#fff",
                      fontFamily: '"Urbanist", sans-serif',
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase"
                    }}>
                      {item.title}
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
