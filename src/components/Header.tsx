import React, { useEffect, useState } from "react";
import { useCMS } from "./CMSContext";

export const Header: React.FC = () => {
  const { data } = useCMS();
  const showTeam = data?.showTeam !== false;
  const [activeSection, setActiveSection] = useState("home");
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleHash = () => {
      setActiveHash(window.location.hash);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "portfolio", "studio", "services", "resume", "team", "contact"];
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

  const nav = data?.navigation || {
    home: "Home",
    about: "About",
    film: "film",
    studio: "Studio",
    divisions: "Divisions",
    legacy: "legacy",
    team: "Team",
    letsConnect: "Let's Connect",
    contact: "Contact",
  };

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
                <span className="menu__caption">{nav.home}</span>
                <i className="ph ph-house-simple"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "about" ? "active" : ""}`}
                href="#about"
              >
                <span className="menu__caption">{nav.about}</span>
                <i className="ph ph-user"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "portfolio" ? "active" : ""}`}
                href="#portfolio"
              >
                <span className="menu__caption">{nav.film}</span>
                <i className="ph ph-clapperboard"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "studio" ? "active" : ""}`}
                href="#studio"
              >
                <span className="menu__caption">{nav.studio}</span>
                <i className="ph ph-buildings"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "services" ? "active" : ""}`}
                href="#services"
              >
                <span className="menu__caption">{nav.divisions}</span>
                <i className="ph ph-film-strip"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "resume" ? "active" : ""}`}
                href="#resume"
              >
                <span className="menu__caption">{nav.legacy}</span>
                <i className="ph ph-trophy"></i>
              </a>
            </li>
            {showTeam && (
              <li className="menu__item">
                <a
                  className={`menu__link btn ${activeSection === "team" ? "active" : ""}`}
                  href="#team"
                >
                  <span className="menu__caption">{nav.team}</span>
                  <i className="ph ph-users"></i>
                </a>
              </li>
            )}
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "contact" && (activeHash === "#lets-pitch" || activeHash === "#lets-connect") ? "active" : ""}`}
                href="#lets-pitch"
              >
                <span className="menu__caption">{nav.letsConnect}</span>
                <i className="ph ph-handshake"></i>
              </a>
            </li>
            <li className="menu__item">
              <a
                className={`menu__link btn ${activeSection === "contact" && activeHash !== "#lets-pitch" && activeHash !== "#lets-connect" ? "active" : ""}`}
                href="#contact"
              >
                <span className="menu__caption">{nav.contact}</span>
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
