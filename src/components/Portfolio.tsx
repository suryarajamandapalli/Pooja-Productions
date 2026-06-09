import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "./SplitText";
import { useCMS } from "./CMSContext";

export const Portfolio: React.FC = () => {
  const { data } = useCMS();
  const films = data?.films || [];
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Dynamic absolute positioning to simulate the original Isotope/Masonry layout
  useEffect(() => {
    const handleLayout = () => {
      const container = containerRef.current;
      if (!container) return;
      const items = container.querySelectorAll<HTMLElement>(".grid-item");
      const width = container.offsetWidth;
      const isDesktop = window.innerWidth >= 768;
      const cols = isDesktop ? 2 : 1;
      const gap = isDesktop ? 30 : 25; // 30px gap on desktop, 25px on mobile
      const colWidth = (width - gap * (cols - 1)) / cols;
      const colHeights = Array(cols).fill(0);

      items.forEach((item) => {
        let minCol = 0;
        for (let i = 1; i < cols; i++) {
          if (colHeights[i] < colHeights[minCol]) {
            minCol = i;
          }
        }
        item.style.position = "absolute";
        item.style.left = `${minCol * (colWidth + gap)}px`;
        item.style.top = `${colHeights[minCol]}px`;
        item.style.width = `${colWidth}px`;
        colHeights[minCol] += item.offsetHeight + gap;
      });

      container.style.height = `${colHeights.length > 0 ? Math.max(...colHeights) - gap : 0}px`;
      ScrollTrigger.refresh();
    };

    // Trigger layout after image load
    const images = containerRef.current?.querySelectorAll("img");
    images?.forEach((img) => {
      if (img.complete) {
        handleLayout();
      } else {
        img.addEventListener("load", handleLayout);
      }
    });

    window.addEventListener("resize", handleLayout);
    // Timeout for fallback layout calculation
    const timer = setTimeout(handleLayout, 600);

    return () => {
      window.removeEventListener("resize", handleLayout);
      clearTimeout(timer);
    };
  }, [films]); // Recalculate if film elements are added/edited/removed

  const openLightbox = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrev = () => {
    if (lightboxIndex !== null && films.length > 0) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : films.length - 1));
    }
  };

  const showNext = () => {
    if (lightboxIndex !== null && films.length > 0) {
      setLightboxIndex((prev) => (prev !== null && prev < films.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <section id="portfolio" className="inner inner-grid-bottom portfolio" style={{ position: "relative" }}>
      {/* Circular Gradient Glow (Left Bottom) */}
      <div style={{
        position: "absolute",
        bottom: "-5%",
        left: "-10%",
        width: "800px",
        height: "800px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(0,0,0,0) 70%)",
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(40px)"
      }} />

      <div className="inner__wrapper" style={{ position: "relative", zIndex: 1 }}>
        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Inner Section Name Start */}
            <div className="col-12 col-xl-2">
              <div className="inner__name">
                <div className="content__block name-block">
                  <span className="section-name icon-right animate-in-up">
                    <span className="section-name-caption">Films</span>
                    <i className="ph ph-arrow-down-right"></i>
                  </span>
                </div>
              </div>
            </div>
            {/* Inner Section Name End */}

            {/* Inner Section Content Start */}
            <div className="col-12 col-xl-8">
              <div className="inner__content">
                {/* Content Block - H2 Section Title Start */}
                <div className="content__block section-grid-text-title">
                  <div className="block__descr">
                    <h2 className="reveal-type animate-in-up">
                      <SplitText text="A Legacy of" />
                      <br />
                      <SplitText text="Feature Films" />
                    </h2>
                    <p className="h2__text type-basic-160lh animate-in-up">
                      From gripping drama to monumental science fiction, our films explore the depth of the human condition, pushing the boundaries of theatrical storytelling.
                    </p>
                  </div>
                </div>
                {/* Content Block - H2 Section Title End */}

                {/* Content Block - Portfolio Gallery Masonry Grid Start */}
                <div className="content__block grid-block">
                  <div className="container-fluid px-0 inner__gallery">
                    {/* Portfolio Gallery Start */}
                    <div
                      ref={containerRef}
                      className="row gx-0 my-gallery"
                      style={{ position: "relative", width: "100%" }}
                    >
                      {films.map((item, index) => {
                        const imageSrc = item.src.startsWith("http") || item.src.startsWith("/") ? item.src : `/${item.src}`;
                        return (
                          <figure
                            key={item.id}
                            className="col-12 col-md-6 gallery__item grid-item animate-card-2"
                            style={{ boxSizing: "border-box", margin: 0 }}
                          >
                            <a
                              href={imageSrc}
                              className="gallery__link"
                              onClick={(e) => openLightbox(index, e)}
                            >
                              <img src={imageSrc} className="gallery__image" alt={item.title} />
                              <div
                                className="picture"
                                style={{ backgroundImage: `url(${imageSrc})` }}
                              ></div>
                              {/* Visible Card Title Overlay */}
                              <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                padding: "40px 20px 20px 20px",
                                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
                                zIndex: 5,
                                pointerEvents: "none"
                              }}>
                                <h3 style={{ margin: 0, color: "#fff", fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.02em" }}>{item.title}</h3>
                              </div>
                            </a>
                            <figcaption className={`gallery__descr ${index % 2 === 1 ? "opposite" : ""}`}>
                              <h5 className={index % 2 === 1 ? "opposite" : ""}>
                                {item.title}
                                <small>{item.category}</small>
                              </h5>
                              <p className="small">{item.description}</p>
                            </figcaption>
                          </figure>
                        );
                      })}
                    </div>
                    {/* Portfolio Gallery End */}

                    {/* External Portfolio Link Start */}
                    <div className="gallery__btn animate-in-up">
                      <a href="https://www.imdb.com" target="_blank" rel="noopener noreferrer" className="btn btn-line-circle-icon">
                        <span className="btn-caption">IMDb Profile</span>
                        <span className="circle hover-circle">
                          <em></em>
                          <i className="ph ph-arrow-right"></i>
                        </span>
                      </a>
                    </div>
                    {/* External Portfolio Link End */}
                  </div>
                </div>
                {/* Content Block - Portfolio Gallery Masonry Grid End */}
              </div>
            </div>
            {/* Inner Section Content End */}

            {/* Inner Section Aside Start */}
            <div className="col-12 col-xl-2"></div>
            {/* Inner Section Aside End */}
          </div>
        </div>
      </div>

      {/* Lightbox / PhotoSwipe Recreation Modal */}
      {lightboxIndex !== null && films.length > lightboxIndex && (
        <div className="pswp pswp--open" style={{ display: "block", opacity: 1, zIndex: 9999 }} role="dialog">
          <div className="pswp__bg" onClick={closeLightbox}></div>
          <div className="pswp__scroll-wrap">
            <div className="pswp__container">
              <div
                className="pswp__item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  padding: "40px"
                }}
              >
                <img
                  src={films[lightboxIndex].src.startsWith("http") || films[lightboxIndex].src.startsWith("/") ? films[lightboxIndex].src : `/${films[lightboxIndex].src}`}
                  alt={films[lightboxIndex].title}
                  style={{
                    maxHeight: "80vh",
                    maxWidth: "90vw",
                    objectFit: "contain",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    borderRadius: "8px",
                    border: "1px solid var(--stroke-elements)"
                  }}
                />
              </div>
            </div>
            <div className="pswp__ui">
              <div className="pswp__top-bar">
                <div className="pswp__counter">
                  {lightboxIndex + 1} / {films.length}
                </div>
                <button
                  className="pswp__button pswp__button--close link-s"
                  title="Close (Esc)"
                  onClick={closeLightbox}
                ></button>
              </div>
              <button
                className="pswp__button pswp__button--arrow--left link-s"
                title="Previous"
                onClick={showPrev}
              ></button>
              <button
                className="pswp__button pswp__button--arrow--right link-s"
                title="Next"
                onClick={showNext}
              ></button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
