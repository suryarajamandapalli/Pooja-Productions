import React, { useState, useEffect } from "react";
import { useCMS } from "./CMSContext";

export const Contact: React.FC = () => {
  const { data, addSubmission } = useCMS();
  const about = data?.about;

  const [formType, setFormType] = useState<"contact" | "pitch">("contact");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Contact form state
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });

  // Pitch form state
  const [pitchData, setPitchData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    phone: "",
    projectTitle: "",
    genre: "Feature Film",
    logline: "",
    synopsis: "",
    scriptLink: ""
  });

  // Modals state
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isInstallable, setIsInstallable] = useState(!!(window as any).deferredPrompt);

  // Sync hash changes (e.g. clicking #lets-pitch in menu)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#lets-pitch" || window.location.hash === "#pitch") {
        setFormType("pitch");
      } else if (window.location.hash === "#contact") {
        setFormType("contact");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Capture PWA installation trigger in the website footer globally
  useEffect(() => {
    const handleInstallPrompt = () => {
      setIsInstallable(true);
    };

    window.addEventListener("pwa-prompt-ready", handleInstallPrompt);
    
    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforePrompt);
    
    const handleAppInstalled = () => {
      setIsInstallable(false);
      (window as any).deferredPrompt = null;
    };
    window.addEventListener("appinstalled", handleAppInstalled);
    
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
          setIsInstallable(false);
        }
        (window as any).deferredPrompt = null;
      });
    } else {
      setShowInstallInstructions(true);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      setErrorMessage("Please complete all required fields (Name, Email, Message).");
      return;
    }
    setErrorMessage("");
    setSubmitting(true);
    try {
      const ok = await addSubmission("contact", contactData);
      if (ok) {
        setSubmitSuccess(true);
        setContactData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
      } else {
        setErrorMessage("Submission could not be saved. Please try again.");
      }
    } catch {
      setErrorMessage("A network error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchData.firstName.trim() || !pitchData.emailId.trim() || !pitchData.projectTitle.trim() || !pitchData.logline.trim()) {
      setErrorMessage("Please complete all required fields (Name, Email, Project Title, Logline).");
      return;
    }
    setErrorMessage("");
    setSubmitting(true);
    try {
      const ok = await addSubmission("pitch", pitchData);
      if (ok) {
        setSubmitSuccess(true);
        setPitchData({
          firstName: "",
          lastName: "",
          emailId: "",
          phone: "",
          projectTitle: "",
          genre: "Feature Film",
          logline: "",
          synopsis: "",
          scriptLink: ""
        });
      } else {
        setErrorMessage("Submission could not be saved. Please try again.");
      }
    } catch {
      setErrorMessage("A network error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!about) {
    return null;
  }

  return (
    <section
      id="contact"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "transparent",
        padding: "0",
        margin: "0",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div id="lets-pitch" style={{ position: "absolute", top: "0", left: "0", pointerEvents: "none" }} />

      {/* ── DIAMOND LEFT (small) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "-160px",
          left: "-200px",
          width: "320px",
          height: "320px",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <img
          src="/img/footer_gold_diamond_final.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            opacity: 0.32,
            mixBlendMode: "screen",
            filter: "brightness(1.5) contrast(1.2) drop-shadow(0 0 35px rgba(197, 168, 128, 0.45))",
            maskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)",
            WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)",
            animation: "ft-spin 60s linear infinite",
          }}
        />
      </div>

      {/* ── DIAMOND RIGHT (large) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "-235px",
          right: "-305px",
          width: "540px",
          height: "540px",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <img
          src="/img/footer_gold_diamond_final.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            opacity: 0.32,
            mixBlendMode: "screen",
            filter: "brightness(1.5) contrast(1.2) drop-shadow(0 0 45px rgba(197, 168, 128, 0.5))",
            maskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)",
            WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)",
            animation: "ft-spin 60s linear infinite",
          }}
        />
      </div>

      {/* ── CINEMATIC INTERACTIVE FORM SECTION ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "6rem clamp(20px, 4vw, 40px) 3rem",
          boxSizing: "border-box"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{
            display: "inline-block",
            color: "#C5A880",
            fontSize: "1.2rem",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            fontWeight: 700,
            marginBottom: "1rem"
          }}>
            Connect With The Studio
          </span>
          <h2 style={{
            color: "#FFF",
            fontSize: "clamp(2.6rem, 5vw, 4.4rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "0 0 1.2rem 0",
            fontFamily: "var(--font-heading, inherit)"
          }}>
            {formType === "contact" ? "START A CONVERSATION" : "PITCH YOUR VISION"}
          </h2>
          <p style={{
            color: "#A0A0A0",
            fontSize: "clamp(1.4rem, 2vw, 1.6rem)",
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            {formType === "contact"
              ? "From global theatrical distribution to co-production partnerships, reach our executive desk."
              : "We collaborate with visionary storytellers. Submit your film or series concept directly to our creative board."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "3rem"
        }}>
          <button
            type="button"
            onClick={() => { setFormType("contact"); setSubmitSuccess(false); setErrorMessage(""); }}
            style={{
              padding: "1.2rem 2.4rem",
              borderRadius: "40px",
              border: `1px solid ${formType === "contact" ? "#C5A880" : "rgba(255,255,255,0.15)"}`,
              backgroundColor: formType === "contact" ? "rgba(197, 168, 128, 0.15)" : "rgba(20,20,20,0.6)",
              color: formType === "contact" ? "#C5A880" : "#A0A0A0",
              fontWeight: 600,
              fontSize: "1.4rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem"
            }}
          >
            <i className="ph ph-envelope-simple"></i>
            General Inquiry
          </button>
          <button
            type="button"
            onClick={() => { setFormType("pitch"); setSubmitSuccess(false); setErrorMessage(""); }}
            style={{
              padding: "1.2rem 2.4rem",
              borderRadius: "40px",
              border: `1px solid ${formType === "pitch" ? "#C5A880" : "rgba(255,255,255,0.15)"}`,
              backgroundColor: formType === "pitch" ? "rgba(197, 168, 128, 0.15)" : "rgba(20,20,20,0.6)",
              color: formType === "pitch" ? "#C5A880" : "#A0A0A0",
              fontWeight: 600,
              fontSize: "1.4rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.8rem"
            }}
          >
            <i className="ph ph-film-strip"></i>
            Pitch a Project
          </button>
        </div>

        {/* Feedback / Error notifications */}
        {submitSuccess && (
          <div style={{
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#6EE7B7",
            padding: "2rem",
            borderRadius: "1.2rem",
            textAlign: "center",
            marginBottom: "2.5rem",
            fontSize: "1.5rem"
          }}>
            <div style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>✨</div>
            <strong>Submission Successfully Received!</strong>
            <p style={{ margin: "0.5rem 0 0 0", color: "#A7F3D0", fontSize: "1.4rem" }}>
              Our production executive team will review your details and be in touch shortly.
            </p>
          </div>
        )}

        {errorMessage && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "#FCA5A5",
            padding: "1.4rem 2rem",
            borderRadius: "1rem",
            marginBottom: "2rem",
            fontSize: "1.4rem",
            textAlign: "center"
          }}>
            {errorMessage}
          </div>
        )}

        {/* FORM CONTAINER */}
        <div style={{
          backgroundColor: "rgba(12, 12, 12, 0.85)",
          border: "1px solid rgba(197, 168, 128, 0.2)",
          backdropFilter: "blur(12px)",
          borderRadius: "1.6rem",
          padding: "clamp(2rem, 5vw, 4rem)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
        }}>
          {formType === "contact" ? (
            /* GENERAL INQUIRY FORM */
            <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christopher Nolan"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@studio.com"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Nature of Inquiry
                  </label>
                  <select
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Theatrical Distribution">Theatrical Distribution</option>
                    <option value="Co-Production Partnership">Co-Production Partnership</option>
                    <option value="Studio Facility Booking">Studio Facility Booking</option>
                    <option value="Press & Media Relations">Press &amp; Media Relations</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Share details about your collaboration inquiry..."
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "1.4rem 1.6rem",
                    backgroundColor: "#060606",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "0.8rem",
                    color: "#FFF",
                    fontSize: "1.5rem",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    lineHeight: 1.6
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  alignSelf: "flex-start",
                  padding: "1.4rem 3.5rem",
                  backgroundColor: "#C5A880",
                  color: "#000",
                  border: "none",
                  borderRadius: "0.8rem",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "all 0.3s ease",
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? "Sending..." : "Send Message"}
                <i className="ph-bold ph-arrow-right"></i>
              </button>
            </form>
          ) : (
            /* PITCH A PROJECT FORM */
            <form onSubmit={handlePitchSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={pitchData.firstName}
                    onChange={(e) => setPitchData({ ...pitchData, firstName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={pitchData.lastName}
                    onChange={(e) => setPitchData({ ...pitchData, lastName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="filmmaker@cinema.com"
                    value={pitchData.emailId}
                    onChange={(e) => setPitchData({ ...pitchData, emailId: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={pitchData.phone}
                    onChange={(e) => setPitchData({ ...pitchData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Echoes of the Horizon"
                    value={pitchData.projectTitle}
                    onChange={(e) => setPitchData({ ...pitchData, projectTitle: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                    Format &amp; Genre
                  </label>
                  <select
                    value={pitchData.genre}
                    onChange={(e) => setPitchData({ ...pitchData, genre: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "1.4rem 1.6rem",
                      backgroundColor: "#060606",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.8rem",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="Theatrical Feature">Theatrical Feature Film</option>
                    <option value="High-Concept Thriller">High-Concept Thriller</option>
                    <option value="Epic Period Drama">Epic Period Drama</option>
                    <option value="Sci-Fi / Action">Sci-Fi / Action</option>
                    <option value="Premium OTT Web Series">Premium OTT Web Series</option>
                    <option value="Documentary Feature">Documentary Feature</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                  Logline (1-2 sentences) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="When an archaeologist uncovers a forgotten relic in the desert, she must outrun an ancient shadow order..."
                  value={pitchData.logline}
                  onChange={(e) => setPitchData({ ...pitchData, logline: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "1.4rem 1.6rem",
                    backgroundColor: "#060606",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "0.8rem",
                    color: "#FFF",
                    fontSize: "1.5rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                  Creative Synopsis &amp; Commercial Vision
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide a brief synopsis of the arc, target audience, and scale..."
                  value={pitchData.synopsis}
                  onChange={(e) => setPitchData({ ...pitchData, synopsis: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "1.4rem 1.6rem",
                    backgroundColor: "#060606",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "0.8rem",
                    color: "#FFF",
                    fontSize: "1.5rem",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    lineHeight: 1.6
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#C5A880", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem", fontWeight: 600 }}>
                  Script / Lookbook Deck Link (Google Drive / Dropbox)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={pitchData.scriptLink}
                  onChange={(e) => setPitchData({ ...pitchData, scriptLink: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "1.4rem 1.6rem",
                    backgroundColor: "#060606",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "0.8rem",
                    color: "#FFF",
                    fontSize: "1.5rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  alignSelf: "flex-start",
                  padding: "1.4rem 3.5rem",
                  backgroundColor: "#C5A880",
                  color: "#000",
                  border: "none",
                  borderRadius: "0.8rem",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "all 0.3s ease",
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? "Submitting Pitch..." : "Submit Pitch to Executive Desk"}
                <i className="ph-bold ph-paper-plane-tilt"></i>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── FOOTER CONTENT ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "5rem clamp(24px, 4vw, 80px) 3rem",
        }}
      >
        {/* SECTION 1: Address / Website / Phone / Email */}
        <div className="ft-grid">
          {/* Address */}
          <div className="ft-col">
            <p className="ft-label">Address</p>
            <a
              className="ft-value"
              href={about.mapUrl || "https://maps.google.com/?q=Hyderabad"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {(() => {
                const addr = about.address || "";
                if (!addr) {
                  return (
                    <>
                      Door No. 7-66/2/216,217,229 &amp; 230/302<br />
                      Raidurgh, Navkhalsa, Serilingampally,<br />
                      Hyderabad, Telangana-500008
                    </>
                  );
                }
                const parts = addr.split(",");
                if (parts.length > 2) {
                  return (
                    <>
                      {parts.slice(0, 3).join(",").trim()}<br />
                      {parts.slice(3, 6).join(",").trim()}<br />
                      {parts.slice(6).join(",").trim()}
                    </>
                  );
                }
                return addr;
              })()}
            </a>
          </div>

          {/* Website */}
          <div className="ft-col">
            <p className="ft-label">Website</p>
            <a
              className="ft-value"
              href="https://www.poojaproductions.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.poojaproductions.com
            </a>
          </div>

          {/* Phone */}
          <div className="ft-col">
            <p className="ft-label">Phone</p>
            <a className="ft-value" href={`tel:${about.phone || "+919347474144"}`}>
              {about.phone || "+919347474144"}
            </a>
          </div>

          {/* Email */}
          <div className="ft-col">
            <p className="ft-label">Email</p>
            <a
              className="ft-value"
              href={`mailto:${about.email || "poojaproductions70mm@gmail.com"}`}
            >
              {about.email || "poojaproductions70mm@gmail.com"}
            </a>
          </div>
        </div>

        {/* SECTION 2: gold divider */}
        <div className="ft-divider" />

        {/* SECTION 3: copyright | links | socials */}
        <div className="ft-bottom-bar">
          {/* Left: Copyright & Developer Credit */}
          <div className="ft-copyright-group" style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <span className="ft-copyright">{"\u00a9"}2026 Pooja Productions</span>
            <span className="ft-credit-sep" style={{ color: "rgba(255, 255, 255, 0.15)" }}>|</span>
            <a
              href="https://araneaden.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-made-by-link"
              style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
            >
              <img
                src={about?.araneadenLogo || "/img/araneaden_logo.png"}
                alt="Aranea Den Logo"
                style={{
                  height: "16px",
                  width: "auto",
                  opacity: 0.4,
                  filter: "grayscale(1) contrast(1.5) brightness(1.2)",
                  mixBlendMode: "screen",
                  display: "block",
                  transition: "opacity 0.3s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.4"; }}
              />
              <span style={{ fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.25)" }}>
                {about?.araneadenText || "MADE BY ARANEA DEN"}
              </span>
            </a>
          </div>

          {/* Center */}
          <div className="ft-links">
            <button
              type="button"
              className="ft-link"
              onClick={() => setShowPrivacy(true)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit" }}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="ft-link"
              onClick={() => setShowTerms(true)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit" }}
            >
              Terms of Service
            </button>
            {isInstallable && (
              <button
                type="button"
                className="ft-link"
                onClick={handleInstallClick}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit" }}
              >
                Install App
              </button>
            )}
          </div>

          {/* Right */}
          <div className="ft-socials">
            <a
              href={about?.instagram || "https://www.instagram.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social"
              title="Instagram"
            >
              <i className="ph ph-instagram-logo" />
            </a>
            <a
              href={about?.youtube || "https://www.youtube.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social"
              title="YouTube"
            >
              <i className="ph ph-youtube-logo" />
            </a>
            <a
              href={about?.linkedin || "https://www.linkedin.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social"
              title="LinkedIn"
            >
              <i className="ph ph-linkedin-logo" />
            </a>
          </div>
        </div>
      </div>

      {/* PRIVACY POLICY MODAL */}
      {showPrivacy && (
        <div className="install-modal-overlay" onClick={() => setShowPrivacy(false)}>
          <div className="install-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <button className="install-modal-close" onClick={() => setShowPrivacy(false)}>✕</button>
            <h3 style={{ color: "#C5A880", fontFamily: "var(--font-heading, inherit)" }}>PRIVACY POLICY</h3>
            <div style={{ color: "#CCC", fontSize: "1.4rem", lineHeight: "1.7", textAlign: "left", display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "1.5rem" }}>
              <p>
                <strong>Pooja Productions</strong> is committed to maintaining the confidentiality and integrity of all creative submissions, personal contact details, and partnership inquiries received through our digital portal.
              </p>
              <p>
                <strong>Information Collection:</strong> We collect information you provide directly, such as your name, email, phone number, and project synopsis, solely for the purpose of communicating with you and evaluating prospective theatrical productions.
              </p>
              <p>
                <strong>Confidentiality:</strong> Intellectual property, scripts, treatments, and pitch materials submitted are treated with strict confidentiality by our development desk. We never sell or distribute your contact details or creative materials to third-party marketers.
              </p>
              <p>
                <strong>Contact:</strong> For inquiries regarding your personal data, reach out directly to <em>poojaproductions70mm@gmail.com</em>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TERMS OF SERVICE MODAL */}
      {showTerms && (
        <div className="install-modal-overlay" onClick={() => setShowTerms(false)}>
          <div className="install-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <button className="install-modal-close" onClick={() => setShowTerms(false)}>✕</button>
            <h3 style={{ color: "#C5A880", fontFamily: "var(--font-heading, inherit)" }}>TERMS OF SERVICE</h3>
            <div style={{ color: "#CCC", fontSize: "1.4rem", lineHeight: "1.7", textAlign: "left", display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "1.5rem" }}>
              <p>
                By using the Pooja Productions website and pitch submission system, you agree to these Terms of Service.
              </p>
              <p>
                <strong>Submissions &amp; IP:</strong> You warrant that any script, logline, treatment, or creative concept submitted is your original work and that you possess all legal rights to pitch and license the material.
              </p>
              <p>
                <strong>Independent Development:</strong> Pooja Productions continuously develops original cinematic properties. You acknowledge that similar concepts, themes, or story premises may be independently developed without reference to unsolicited submissions.
              </p>
              <p>
                <strong>Copyright:</strong> All cinematic trailers, visual frames, imagery, and branding on this website are the proprietary intellectual property of Pooja Productions and protected under applicable copyright laws.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PWA install instructions modal */}
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
