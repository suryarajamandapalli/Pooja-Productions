import React from "react";
import { Marquee } from "./Marquee";
import { useCMS } from "./CMSContext";

export const Hero: React.FC = () => {
  const { data } = useCMS();
  const hero = data?.hero;

  const headline = hero?.headline || "Pooja\nProductions";
  const subheadline = hero?.subheadline || "Crafting cinematic masterpieces\nfor the world stage.";
  const primaryBtnText = hero?.primaryBtnText || "Explore our Slate";

  return (
    <section id="home" className="main home">
      {/* ── HERO SPLIT LAYOUT ── */}
      <div
        className="hero-split-wrapper"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP: Text LEFT + Image RIGHT */}
        <div
          className="hero-top"
          style={{
            flex: "1",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "100vh",
            position: "relative",
          }}
        >
          {/* LEFT – Headline text */}
          <div
            className="hero-text-col"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "80px 60px 60px 80px",
              zIndex: 2,
            }}
          >
            <p
              className="headline__subtitle"
              style={{
                fontSize: "clamp(14px, 1.2vw, 18px)",
                letterSpacing: "0.08em",
                opacity: 0.7,
                marginBottom: "24px",
                lineHeight: 1.6,
                textTransform: "none",
              }}
              dangerouslySetInnerHTML={{
                __html: subheadline.replace(/\n/g, "<br />"),
              }}
            />
            <h1
              className="headline__title"
              style={{
                fontSize: "clamp(52px, 7vw, 110px)",
                fontWeight: 700,
                lineHeight: 1.0,
                marginBottom: "40px",
                letterSpacing: "-0.02em",
              }}
              dangerouslySetInnerHTML={{
                __html: headline.replace(/\n/g, "<br />"),
              }}
            />
            <div>
              <a
                className="btn btn-line-small icon-right slide-right-down"
                href="#portfolio"
              >
                <span className="btn-caption">{primaryBtnText}</span>
                <i className="ph ph-arrow-down-right"></i>
              </a>
            </div>
          </div>

          {/* RIGHT – Film reel / hero image */}
          <div
            className="hero-image-col"
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={hero?.heroImageUrl || "img/backgrounds/1200x1200_bg01.png"}
              alt="Pooja Productions"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* MARQUEE STRIP */}
        <div className="media__fullwidth" style={{ overflow: "hidden" }}>
          <Marquee speed={20}>
            {/* single item */}
            <div className="item icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.3 93.1" fill="currentColor">
                <g>
                  <rect x="45.7" width="1" height="93.1" />
                  <rect x="45.7" y="0" transform="matrix(0.8412 -0.5407 0.5407 0.8412 -17.8476 32.3497)" width="1" height="93.1" />
                  <rect x="45.7" y="0" transform="matrix(0.4155 -0.9096 0.9096 0.4155 -15.3764 69.2119)" width="1" height="93.1" />
                  <rect x="-0.4" y="46.1" transform="matrix(0.9898 -0.1425 0.1425 0.9898 -6.1646 7.0506)" width="93.1" height="1" />
                  <rect x="-0.4" y="46.1" transform="matrix(0.7556 -0.655 0.655 0.7556 -19.2157 41.618)" width="93.1" height="1" />
                  <rect x="-0.4" y="46.1" transform="matrix(0.2812 -0.9597 0.9597 0.2812 -11.5032 77.7858)" width="93.1" height="1" />
                  <rect x="45.7" y="0" transform="matrix(0.9595 -0.2817 0.2817 0.9595 -11.2479 14.8866)" width="1" height="93.1" />
                  <rect x="45.7" y="0" transform="matrix(0.6549 -0.7557 0.7557 0.6549 -19.2631 50.9572)" width="1" height="93.1" />
                  <rect x="45.7" y="0" transform="matrix(0.1423 -0.9898 0.9898 0.1423 -6.4999 85.629)" width="1" height="93.1" />
                  <rect x="-0.4" y="46.1" transform="matrix(0.9097 -0.4153 0.4153 0.9097 -15.1716 23.381)" width="93.1" height="1" />
                  <rect x="-0.4" y="46.1" transform="matrix(0.5411 -0.8409 0.8409 0.5411 -17.9774 60.1901)" width="93.1" height="1" />
                </g>
              </svg>
            </div>

            {/* single item */}
            <div className="item image image-1">
              <img src="img/marquee/01.webp" alt="Image" />
            </div>

            {/* single item */}
            <div className="item icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 89.2 82.8" fill="currentColor">
                <g>
                  <g>
                    <rect width="89.2" height="1" />
                    <rect y="20.5" width="89.2" height="1" />
                    <rect y="40.9" width="89.2" height="1" />
                    <rect y="61.4" width="89.2" height="1" />
                    <rect y="81.8" width="89.2" height="1" />
                  </g>
                  <rect x="2.5" y="10.2" transform="matrix(0.9712 -0.2384 0.2384 0.9712 -1.2518 11.1229)" width="85.7" height="1" />
                  <rect x="2.5" y="30.7" transform="matrix(0.9712 -0.2384 0.2384 0.9712 -6.1265 11.7116)" width="85.7" height="1" />
                  <rect x="2.5" y="51.2" transform="matrix(0.9712 -0.2384 0.2384 0.9712 -11.0059 12.3009)" width="85.7" height="1" />
                  <rect x="2.5" y="71.6" transform="matrix(0.9712 -0.2384 0.2384 0.9712 -15.8827 12.8923)" width="85.7" height="1" />
                </g>
              </svg>
            </div>

            {/* single item */}
            <div className="item image image-2">
              <img src="img/marquee/02.webp" alt="Image" />
            </div>

            {/* single item */}
            <div className="item icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84" fill="currentColor">
                <g>
                  <path d="M42,84C18.8,84,0,65.1,0,42S18.8,0,42,0s42,18.8,42,42S65.1,84,42,84z M42,1C19.4,1,1,19.4,1,42
                    s18.4,41,41,41s41-18.4,41-41S64.6,1,42,1z" />
                  <path d="M42,69.8c-15.8,0-28.6-12.8-28.6-28.6h1c0,15.2,12.4,27.6,27.6,27.6s27.6-12.4,27.6-27.6h1
                    C70.6,57,57.7,69.8,42,69.8z" />
                  <g>
                    <path d="M31.7,31.1H17.8v-0.5c0-3.8,3.1-7,7-7s7,3.1,7,7L31.7,31.1L31.7,31.1z M18.8,30.1h11.9
                      c-0.2-3-2.8-5.5-5.9-5.5S19.1,27.1,18.8,30.1L18.8,30.1z" />
                    <path d="M66.2,31.1H52.2v-0.5c0-3.8,3.1-7,7-7s7,3.1,7,7L66.2,31.1L66.2,31.1z M53.3,30.1h11.9
                      c-0.2-3-2.8-5.5-5.9-5.5S53.5,27.1,53.3,30.1L53.3,30.1z" />
                  </g>
                </g>
              </svg>
            </div>

            {/* single item */}
            <div className="item image image-3">
              <img src="img/marquee/03.webp" alt="Image" />
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  );
};
