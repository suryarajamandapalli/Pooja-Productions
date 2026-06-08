import React, { useEffect, useState } from "react";

export const Header: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "portfolio", "about", "services", "resume", "contact"];
    const observers: { observer: IntersectionObserver; el: HTMLElement }[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          // Adjust threshold/rootMargin to trigger active states exactly as desired
          rootMargin: "0px 0px -40% 0px",
          threshold: 0.1,
        }
      );

      observer.observe(el);
      observers.push({ observer, el });
    });

    return () => {
      observers.forEach(({ observer, el }) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <header id="header" className="header d-flex justify-content-center loading__fade">
      {/* Navigation Menu Start */}
      <div className="header__navigation d-flex justify-content-start">
        <nav id="menu" className="menu">
          <ul className="menu__list d-flex justify-content-start">
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "home" ? "active" : ""}`}
                href="#home"
              >
                <span className="menu__caption">Home</span>
                <i className="ph ph-house-simple"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "portfolio" ? "active" : ""}`}
                href="#portfolio"
              >
                <span className="menu__caption">Films</span>
                <i className="ph ph-clapperboard"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "about" ? "active" : ""}`}
                href="#about"
              >
                <span className="menu__caption">Studio</span>
                <i className="ph ph-buildings"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "services" ? "active" : ""}`}
                href="#services"
              >
                <span className="menu__caption">Divisions</span>
                <i className="ph ph-film-strip"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "resume" ? "active" : ""}`}
                href="#resume"
              >
                <span className="menu__caption">Legacy</span>
                <i className="ph ph-trophy"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "contact" ? "active" : ""}`}
                href="#contact"
              >
                <span className="menu__caption">Co-Produce</span>
                <i className="ph ph-envelope"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      {/* Navigation Menu End */}
    </header>
  );
};
