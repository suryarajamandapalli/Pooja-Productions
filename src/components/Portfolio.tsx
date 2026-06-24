import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "./SplitText";
import { useCMS } from "./CMSContext";

export const Portfolio: React.FC = () => {
  const { data } = useCMS();
  const films = data?.films || [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Refresh ScrollTrigger to recalculate trigger positions once films are rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, [films]);

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

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, films]);

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
                  <span className="section-name icon-right animate-in-up" style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem" }}>
                    <img src="/Daimonds/2.png" alt="Diamond indicator" className="slow-rotate-right" style={{ width: "20px", height: "20px", objectFit: "contain", filter: "drop-shadow(0 0 5px rgba(255,255,255,0.4))" }} />
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
                    <h2 className="reveal-type">
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

                {/* Content Block - Portfolio Gallery Grid Start */}
                <div className="content__block grid-block animate-in-up" style={{ marginTop: "3rem" }}>
                  <div className="container-fluid px-0 inner__gallery">
                    {/* Portfolio Gallery Masonry using CSS Columns */}
                    <div className="masonry-gallery-grid">
                      {films.map((item, index) => {
                        const imageSrc = item.src.startsWith("http") || item.src.startsWith("/") ? item.src : `/${item.src}`;
                        return (
                          <figure
                            key={item.id || index}
                            className="masonry-gallery-item"
                          >
                            <a
                              href={imageSrc}
                              className="gallery__link"
                              onClick={(e) => openLightbox(index, e)}
                              style={{ display: "block", borderRadius: "16px", overflow: "hidden", position: "relative" }}
                            >
                              <img 
                                src={imageSrc} 
                                className="gallery-image-natural" 
                                alt={item.title} 
                              />
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
                            <figcaption className="sr-only" style={{ display: "none" }}>
                              <h5>
                                {item.title}
                                <small>{item.category}</small>
                              </h5>
                              <p>{item.description}</p>
                            </figcaption>
                          </figure>
                        );
                      })}
                    </div>
                    {/* Portfolio Gallery End */}

                    {/* Contact Link Start */}
                    <div className="gallery__btn animate-in-up" style={{ marginTop: "4rem" }}>
                      <a href="#contact" className="btn btn-line-circle-icon">
                        <span className="btn-caption">Get In Touch</span>
                        <span className="circle hover-circle">
                          <em></em>
                          <i className="ph ph-envelope-simple"></i>
                        </span>
                      </a>
                    </div>
                    {/* Contact Link End */}
                  </div>
                </div>
                {/* Content Block - Portfolio Gallery Grid End */}
              </div>
            </div>
            {/* Inner Section Content End */}

            {/* Inner Section Aside Start */}
            <div className="col-12 col-xl-2"></div>
            {/* Inner Section Aside End */}
          </div>
        </div>
      </div>

      {/* Lightbox / Custom Premium Lightbox Modal via Portal */}
      {lightboxIndex !== null && films.length > lightboxIndex && createPortal(
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(10, 10, 10, 0.98)",
          backdropFilter: "blur(10px)",
          zIndex: 999999, // Render on top of everything including header menu
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.3s ease",
          userSelect: "none"
        }} role="dialog">
          
          {/* Close button in top-right */}
          <button
            onClick={closeLightbox}
            style={{
              position: "fixed",
              top: "30px",
              right: "30px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "2rem",
              cursor: "pointer",
              zIndex: 1000000,
              transition: "background 0.3s, border-color 0.3s",
              outline: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
            title="Close"
          >
            <i className="ph ph-x" style={{ color: "#ffffff", display: "inline-block" }}></i>
          </button>

          {/* Navigation - Left Arrow */}
          <button
            onClick={showPrev}
            style={{
              position: "fixed",
              left: "30px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "2.4rem",
              cursor: "pointer",
              zIndex: 1000000,
              transition: "background 0.3s, border-color 0.3s",
              outline: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
            title="Previous"
          >
            <i className="ph ph-caret-left" style={{ color: "#ffffff", display: "inline-block" }}></i>
          </button>

          {/* Center Image and Title info */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "80vw",
            maxHeight: "80vh"
          }}>
            <img
              src={films[lightboxIndex].src.startsWith("http") || films[lightboxIndex].src.startsWith("/") ? films[lightboxIndex].src : `/${films[lightboxIndex].src}`}
              alt={films[lightboxIndex].title}
              style={{
                maxHeight: "60vh",
                maxWidth: "100%",
                objectFit: "contain",
                boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />
            {/* Title / Info overlay at the bottom of the image */}
            <div style={{ marginTop: "25px", textAlign: "center" }}>
              <h4 style={{ color: "#ffffff", fontSize: "2.2rem", fontWeight: 600, margin: "0 0 5px 0" }}>{films[lightboxIndex].title}</h4>
              <p style={{ color: "var(--neutral-bright)", fontSize: "1.3rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500, margin: 0 }}>{films[lightboxIndex].category}</p>
              <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "1.5rem", maxWidth: "600px", marginTop: "12px", lineHeight: "1.6" }}>{films[lightboxIndex].description}</p>
            </div>
          </div>

          {/* Navigation - Right Arrow */}
          <button
            onClick={showNext}
            style={{
              position: "fixed",
              right: "30px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "2.4rem",
              cursor: "pointer",
              zIndex: 1000000,
              transition: "background 0.3s, border-color 0.3s",
              outline: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
            title="Next"
          >
            <i className="ph ph-caret-right" style={{ color: "#ffffff", display: "inline-block" }}></i>
          </button>

          {/* Counter info at the bottom */}
          <div style={{
            position: "fixed",
            bottom: "30px",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "1.4rem",
            fontWeight: 500
          }}>
            {lightboxIndex + 1} / {films.length}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
