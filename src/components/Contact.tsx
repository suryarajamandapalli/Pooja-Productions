import React, { useState } from "react";
import { useCMS } from "./CMSContext";

export const Contact: React.FC = () => {
  const { data, addSubmission } = useCMS();
  const about = data?.about;

  const [activeForm, setActiveForm] = useState<"hello" | "pitch">("hello");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "submitting">("idle");
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isInstallable, setIsInstallable] = useState(!!(window as any).deferredPrompt);
  const [formVisible, setFormVisible] = useState(false);

  // Capture PWA installation trigger in the website footer globally
  React.useEffect(() => {
    const handleInstallPrompt = () => {
      console.log("PWA install trigger detected in footer via global window event");
      setIsInstallable(true);
    };

    window.addEventListener("pwa-prompt-ready", handleInstallPrompt);
    
    // Also listener check in case standard beforeinstallprompt triggers inside Contact lifecycle
    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforePrompt);
    
    // Listen for successful installation to hide the button immediately
    const handleAppInstalled = () => {
      console.log("PWA was installed successfully!");
      setIsInstallable(false);
      (window as any).deferredPrompt = null;
    };
    window.addEventListener("appinstalled", handleAppInstalled);
    
    // Double check state immediately on mount
    if ((window as any).deferredPrompt) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener("pwa-prompt-ready", handleInstallPrompt);
      window.removeEventListener("beforeinstallprompt", handleBeforePrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const promptEvent = (window as any).deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted PWA installation");
          setIsInstallable(false);
        } else {
          console.log("User dismissed PWA installation");
        }
        (window as any).deferredPrompt = null;
      });
    } else {
      console.log("No deferred PWA install prompt available. Showing instruction sheet.");
      setShowInstallInstructions(true);
    }
  };

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#lets-pitch" || hash === "#lets-connect") {
        setActiveForm("pitch");
      } else if (hash === "#contact" || hash === "#say-hello") {
        setActiveForm("hello");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const [helloData, setHelloData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: ""
  });

  const [pitchData, setPitchData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailId: "",
    previousExperience: "",
    swaTitle: "",
    swaNumber: "",
    swaDate: "",
    workingTitle: "",
    genre: "",
    typeOfFilm: "",
    logline: "",
    synopsis: "",
    agreeTerms: false,
    agreeCopyright: false
  });

  const handleHelloSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    await addSubmission("contact", { ...helloData });
    setSubmitStatus("success");
    setTimeout(() => {
      setSubmitStatus("idle");
      setHelloData({ name: "", company: "", email: "", phone: "", message: "" });
    }, 5000);
  };

  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    await addSubmission("pitch", { ...pitchData });
    setSubmitStatus("success");
    setTimeout(() => {
      setSubmitStatus("idle");
      setPitchData({
        firstName: "", lastName: "", mobileNumber: "", emailId: "",
        previousExperience: "", swaTitle: "", swaNumber: "", swaDate: "",
        workingTitle: "", genre: "", typeOfFilm: "", logline: "",
        synopsis: "", agreeTerms: false, agreeCopyright: false
      });
    }, 5000);
  };



  if (!about) {
    return null;
  }

  return (
    <section id="contact" className="inner contact inner-grid-bottom no-padding-bottom" style={{ position: "relative", overflow: "hidden" }}>
      <div className="footer-custom-container">
        
        {/* Top Section */}
        <div className="text-center py-5">
          <h2 className="reveal-type text-center mb-4" style={{ fontSize: "clamp(3.2rem, 5vw, 6.4rem)", fontWeight: 300, letterSpacing: "-0.03em" }}>
            Let's Create Something Extraordinary
          </h2>
          <button 
            onClick={() => setFormVisible(!formVisible)} 
            className="btn btn-line"
            style={{ 
              padding: "1.6rem 4.8rem", 
              fontSize: "1.6rem", 
              letterSpacing: "0.15em", 
              textTransform: "uppercase",
              borderRadius: "0px",
              border: "1px solid #C5A880",
              color: "#C5A880",
              transition: "all 0.4s ease"
            }}
          >
            <span className="btn-caption">{formVisible ? "Close Request Form" : "Submit Request"}</span>
          </button>
        </div>

        {/* Collapsible Form Section */}
        <div style={{
          maxHeight: formVisible ? "1600px" : "0px",
          opacity: formVisible ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          <div className="py-4">
            {/* Tab Switcher Start */}
            <div className="content__block animate-in-up d-flex justify-content-center" style={{ marginBottom: "3rem", paddingBottom: "2rem" }}>
              <div className="d-flex justify-content-center" style={{ gap: "1.5rem" }}>
                <button 
                  onClick={() => {
                    setActiveForm("hello");
                    setSubmitStatus("idle");
                  }}
                  className={`btn form-tab-btn ${activeForm === "hello" ? "btn-default" : "btn-line"}`}
                  style={{ padding: "10px 24px" }}
                >
                  {activeForm === "hello" && <em></em>}
                  <span className="btn-caption">Say Hello</span>
                </button>
                <button 
                  onClick={() => {
                    setActiveForm("pitch");
                    setSubmitStatus("idle");
                  }}
                  className={`btn form-tab-btn ${activeForm === "pitch" ? "btn-default" : "btn-line"}`}
                  style={{ padding: "10px 24px" }}
                >
                  {activeForm === "pitch" && <em></em>}
                  <span className="btn-caption">Let's Pitch</span>
                </button>
              </div>
            </div>
            {/* Tab Switcher End */}

            {/* Content Block - Contact Form Start */}
            <div className="content__block grid-block pre-grid-items mx-auto" style={{ maxWidth: "1000px" }}>
              <div className="form-container" style={{ width: "100%", position: "relative" }}>
                {/* Reply Messages Start */}
                <div className={`form__reply centered text-center ${submitStatus === "success" ? "is-visible" : ""}`}>
                  <i className="ph-thin ph-smiley reply__icon"></i>
                  <p className="reply__title">Done!</p>
                  {activeForm === "hello" ? (
                    <span className="reply__text">Thanks for your message. We'll get back as soon as possible.</span>
                  ) : (
                    <span className="reply__text">Thanks for your pitch. Our creative team will review it and get back as soon as possible.</span>
                  )}
                </div>
                {/* Reply Messages End */}

                {activeForm === "hello" ? (
                  <form
                    className={`form contact-form ${submitStatus === "success" ? "is-hidden" : ""}`}
                    id="contact-form"
                    onSubmit={handleHelloSubmit}
                  >
                    <div className="container-fluid p-0">
                      <div className="row gx-0">
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input 
                            type="text" 
                            name="Name" 
                            placeholder="Your name*" 
                            value={helloData.name}
                            onChange={(e) => setHelloData({ ...helloData, name: e.target.value })}
                            required 
                          />
                        </div>
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input 
                            type="text" 
                            name="Company" 
                            placeholder="Company name" 
                            value={helloData.company}
                            onChange={(e) => setHelloData({ ...helloData, company: e.target.value })}
                          />
                        </div>
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input 
                            type="email" 
                            name="E-mail" 
                            placeholder="Email*" 
                            value={helloData.email}
                            onChange={(e) => setHelloData({ ...helloData, email: e.target.value })}
                            required 
                          />
                        </div>
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input 
                            type="tel" 
                            name="Phone" 
                            placeholder="Phone" 
                            value={helloData.phone}
                            onChange={(e) => setHelloData({ ...helloData, phone: e.target.value })}
                          />
                        </div>
                        <div className="col-12 form__item animate-in-up">
                          <textarea 
                            name="Message" 
                            placeholder="A few words about your project*" 
                            value={helloData.message}
                            onChange={(e) => setHelloData({ ...helloData, message: e.target.value })}
                            required 
                          />
                        </div>
                        <div className="col-12 form__item animate-in-up" style={{ marginTop: "3rem" }}>
                          <button className="btn btn-default hover-default" type="submit" disabled={submitStatus === "submitting"}>
                            <em></em>
                            <span className="btn-caption">{submitStatus === "submitting" ? "Sending..." : "Send Message"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <form
                    className={`form contact-form ${submitStatus === "success" ? "is-hidden" : ""}`}
                    id="pitch-form"
                    onSubmit={handlePitchSubmit}
                  >
                    <div className="container-fluid p-0">
                      <div className="row gx-0">
                        {/* Writer Details */}
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input
                            type="text"
                            name="firstName"
                            placeholder="First Name*"
                            value={pitchData.firstName}
                            onChange={(e) => setPitchData({ ...pitchData, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name*"
                            value={pitchData.lastName}
                            onChange={(e) => setPitchData({ ...pitchData, lastName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input
                            type="email"
                            name="email"
                            placeholder="Email Address*"
                            value={pitchData.emailId}
                            onChange={(e) => setPitchData({ ...pitchData, emailId: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input
                            type="tel"
                            name="mobileNumber"
                            placeholder="Mobile Number*"
                            value={pitchData.mobileNumber}
                            onChange={(e) => setPitchData({ ...pitchData, mobileNumber: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-12 form__item animate-in-up">
                          <input
                            type="text"
                            name="previousExperience"
                            placeholder="Previous Experience (If any)"
                            value={pitchData.previousExperience}
                            onChange={(e) => setPitchData({ ...pitchData, previousExperience: e.target.value })}
                          />
                        </div>
                        
                        {/* SWA Details */}
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input
                            type="text"
                            name="swaTitle"
                            placeholder="SWA Registered Title"
                            value={pitchData.swaTitle}
                            onChange={(e) => setPitchData({ ...pitchData, swaTitle: e.target.value })}
                          />
                        </div>
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input
                            type="text"
                            name="swaNumber"
                            placeholder="SWA Registration Number"
                            value={pitchData.swaNumber}
                            onChange={(e) => setPitchData({ ...pitchData, swaNumber: e.target.value })}
                          />
                        </div>
                        <div className="col-12 form__item animate-in-up" style={{ padding: "1.6rem 0.4rem 0.5rem 0.4rem", borderBottom: "1px solid var(--stroke-elements)" }}>
                          <label style={{ color: "var(--t-muted)", fontSize: "1.4rem", display: "block", marginBottom: "0.2rem" }}>SWA Registration Date</label>
                          <input
                            type="date"
                            name="swaDate"
                            value={pitchData.swaDate}
                            onChange={(e) => setPitchData({ ...pitchData, swaDate: e.target.value })}
                            style={{ border: "none", padding: "0.5rem 0", fontSize: "1.8rem", color: pitchData.swaDate ? "var(--t-bright)" : "var(--t-muted)" }}
                          />
                        </div>

                        {/* Film Details */}
                        <div className="col-12 col-md-6 form__item animate-in-up">
                          <input
                            type="text"
                            name="workingTitle"
                            placeholder="Story Working Title*"
                            value={pitchData.workingTitle}
                            onChange={(e) => setPitchData({ ...pitchData, workingTitle: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-3 form__item animate-in-up">
                          <select
                            name="genre"
                            value={pitchData.genre}
                            onChange={(e) => setPitchData({ ...pitchData, genre: e.target.value })}
                            required
                          >
                            <option value="" disabled hidden>Select Genre*</option>
                            <option value="action">Action</option>
                            <option value="drama">Drama</option>
                            <option value="thriller">Thriller</option>
                            <option value="comedy">Comedy</option>
                            <option value="scifi">Sci-Fi</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="col-12 col-md-3 form__item animate-in-up">
                          <select
                            name="typeOfFilm"
                            value={pitchData.typeOfFilm}
                            onChange={(e) => setPitchData({ ...pitchData, typeOfFilm: e.target.value })}
                            required
                          >
                            <option value="" disabled hidden>Type of Film*</option>
                            <option value="feature">Feature Film</option>
                            <option value="short">Short Film</option>
                            <option value="series">Web Series</option>
                            <option value="documentary">Documentary</option>
                          </select>
                        </div>

                        <div className="col-12 form__item animate-in-up">
                          <input
                            type="text"
                            name="logline"
                            placeholder="Story Logline*"
                            value={pitchData.logline}
                            onChange={(e) => setPitchData({ ...pitchData, logline: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-12 form__item animate-in-up">
                          <textarea
                            name="synopsis"
                            placeholder="Story Synopsis / Purpose of Collaboration*"
                            value={pitchData.synopsis}
                            onChange={(e) => setPitchData({ ...pitchData, synopsis: e.target.value })}
                            required
                          />
                        </div>

                        {/* Legal Agreement */}
                        <div className="col-12 form__item animate-in-up" style={{ marginTop: "2rem" }}>
                          <label className="form-checkbox-label">
                            <input 
                              type="checkbox" 
                              name="agreeTerms"
                              checked={pitchData.agreeTerms}
                              onChange={(e) => setPitchData({ ...pitchData, agreeTerms: e.target.checked })}
                              required
                            />
                            I agree that this submission is subject to Pooja Productions' standard review terms and does not create any confidential relationship.
                          </label>
                        </div>

                        <div className="col-12 form__item animate-in-up" style={{ marginTop: "3rem" }}>
                          <button className="btn btn-default hover-default" type="submit" disabled={submitStatus === "submitting"}>
                            <em></em>
                            <span className="btn-caption">{submitStatus === "submitting" ? "Submitting..." : "Submit pitch"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
            {/* Content Block - Contact Form End */}
          </div>
        </div>

        {/* Middle Section: Perfectly Aligned 4-Column Grid */}
        <div className="content__block grid-block py-5">
          <div className="container-fluid p-0 contact-data">
            <div className="row gx-5 gy-4">
              <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                <p className="contact-data__title tagline-chapter animate-in-up">Address</p>
                <p className="contact-data__text small type-basic-160lh">
                  <a
                    className="link-small-160lh animate-in-up"
                    href={about.mapUrl || "https://maps.google.com/?q=Hyderabad"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {(() => {
                      const addr = about.address || "";
                      if (!addr) {
                        return (
                          <>
                            Door No. 7-66/2/216,217,229 & 230/302<br />
                            Raidurgh, Navkhalsa, Serilingampally,<br />
                            Hyderabad, Telangana-500008
                          </>
                        );
                      }
                      const lines = addr.includes("\n") ? addr.split("\n") : (() => {
                        const parts = addr.split(",");
                        if (parts.length > 2) {
                          const line1 = parts.slice(0, 3).join(",").trim();
                          const line2 = parts.slice(3, 6).join(",").trim();
                          const line3 = parts.slice(6).join(",").trim();
                          return [line1, line2, line3].filter(Boolean);
                        }
                        return [addr];
                      })();
                      return lines.map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          {idx < lines.length - 1 && <br />}
                        </React.Fragment>
                      ));
                    })()}
                  </a>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                <p className="contact-data__title tagline-chapter animate-in-up">Website</p>
                <p className="contact-data__text small type-basic-160lh">
                  <a
                    className="link-small-160lh animate-in-up"
                    href="https://www.poojaproductions.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.poojaproductions.com
                  </a>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                <p className="contact-data__title tagline-chapter animate-in-up">Phone</p>
                <p className="contact-data__text small type-basic-160lh">
                  <a className="link-small-160lh animate-in-up" href={`tel:${about.phone || "+919347474144"}`}>
                    {about.phone || "+919347474144"}
                  </a>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3 contact-data__item grid-item">
                <p className="contact-data__title tagline-chapter animate-in-up">Email</p>
                <p className="contact-data__text small type-basic-160lh">
                  <a
                    className="link-small-160lh animate-in-up"
                    href={`mailto:${about.email || "poojaproductions70mm@gmail.com"}`}
                  >
                    {about.email || "poojaproductions70mm@gmail.com"}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Section: Center Logo & Made by Aranea Den */}
        <div className="text-center py-4 d-flex flex-column align-items-center gap-3">
          <img 
            src="/img/logo.png" 
            alt="Pooja Productions Logo" 
            style={{ height: "4.2rem", width: "auto", objectFit: "contain", mixBlendMode: "screen" }}
          />
          <a 
            href="https://araneaden.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="araneaden-footer-link d-flex flex-column align-items-center gap-1"
          >
            <img 
              src={about?.araneadenLogo || "/img/araneaden_logo.png"} 
              alt="Aranea Den Logo" 
              className="araneaden-footer-logo"
              style={{ height: "2.2rem" }}
            />
            <span className="araneaden-footer-text" style={{ fontSize: "1.0rem", opacity: 0.6, letterSpacing: "0.15em" }}>
              {about?.araneadenText || "MADE BY ARANEA DEN"}
            </span>
          </a>
        </div>

        {/* Bottom Section */}
        <div>
          {/* Thin gold divider */}
          <div className="footer-divider" style={{ borderTop: "1px solid rgba(197, 168, 128, 0.3)", margin: "2rem 0" }}></div>

          <div className="row align-items-center gy-3 text-center" style={{ fontSize: "1.3rem", color: "rgba(255,255,255,0.65)", paddingBottom: "2.5rem" }}>
            {/* Left */}
            <div className="col-12 col-lg-4 text-lg-start">
              ©2026 Pooja Productions
            </div>
            
            {/* Center */}
            <div className="col-12 col-lg-4 d-flex justify-content-center gap-4">
              <a href="#0" className="footer-link">Privacy Policy</a>
              <a href="#0" className="footer-link">Terms</a>
              {isInstallable && (
                <a href="#0" className="footer-link install-link-pwa" onClick={handleInstallClick}>
                  Install App
                </a>
              )}
            </div>

            {/* Right */}
            <div className="col-12 col-lg-4 d-flex justify-content-center justify-content-lg-end gap-4">
              {[
                { name: "Instagram", url: about?.instagram || "https://www.instagram.com/" },
                { name: "YouTube", url: about?.youtube || "https://www.youtube.com/" },
                { name: "LinkedIn", url: about?.linkedin || "https://www.linkedin.com/" }
              ].map((soc, i) => (
                <a key={i} href={soc.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                  {soc.name}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Decorative Gold Diamonds moved outside container to snap to extreme left and right viewport edges */}
      <div className="footer-diamond-right">
        <img
          src="/img/footer_gold_diamond_final.png"
          alt="Glowing Gold Diamond Right"
          className="footer-single-diamond"
        />
      </div>

      <div className="footer-diamond-left">
        <img
          src="/img/footer_gold_diamond_final.png"
          alt="Glowing Gold Diamond Left"
          className="footer-single-diamond footer-diamond-left-img"
        />
      </div>

      {showInstallInstructions && (
        <div className="install-modal-overlay" onClick={() => setShowInstallInstructions(false)}>
          <div className="install-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="install-modal-close" onClick={() => setShowInstallInstructions(false)}>✕</button>
            <h3>INSTALL AS APPLICATION</h3>
            <p className="install-modal-desc">To run Pooja Productions as a dedicated Windows Application:</p>
            <div className="install-steps">
              <div className="install-step">
                <span className="step-num">1</span>
                <p>Look at the right end of your browser's address bar at the top of the window.</p>
              </div>
              <div className="install-step">
                <span className="step-num">2</span>
                <p>Click the <strong>Install App</strong> icon <i className="ph-bold ph-monitor-play"></i> or <strong>(+)</strong> plus icon.</p>
              </div>
              <div className="install-step">
                <span className="step-num">3</span>
                <p>Confirm the prompt, and the website will open in its own borderless window!</p>
              </div>
            </div>
            <div className="install-fallback-tip">
              Alternative: Click the browser settings menu <i className="ph-bold ph-dots-three-vertical"></i> at the top-right, go to <strong>Save and share</strong>, and select <strong>Install page as app</strong>.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
