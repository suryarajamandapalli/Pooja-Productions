import React, { useEffect, useState } from "react";

export const WelcomePopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("pp_welcome_seen");
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("pp_welcome_seen", "1");
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: closing ? "ppFadeOut 0.5s ease forwards" : "ppFadeIn 0.6s ease forwards",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "620px",
          width: "90%",
          background: "linear-gradient(135deg, #0e0e0e 0%, #141414 60%, #1a1308 100%)",
          border: "1px solid rgba(197,168,128,0.35)",
          borderRadius: "2rem",
          padding: "5rem 4.5rem 4rem",
          textAlign: "center",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(197,168,128,0.15)",
          animation: closing ? "ppSlideOut 0.5s ease forwards" : "ppSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          fontFamily: '"Urbanist", sans-serif',
        }}
      >
        {/* Gold top line */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60px", height: "2px", background: "linear-gradient(90deg, transparent, #C5A880, transparent)", borderRadius: "2px" }} />

        {/* Logo */}
        <img
          src="/logo.png"
          alt="Pooja Productions"
          style={{ height: "5.5rem", width: "auto", objectFit: "contain", marginBottom: "2.5rem", display: "block", margin: "0 auto 2.5rem" }}
        />

        {/* Ornament */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.2rem", marginBottom: "2rem" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(197,168,128,0.4))" }} />
          <i className="ph ph-film-slate" style={{ color: "#C5A880", fontSize: "2rem" }}></i>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(197,168,128,0.4), transparent)" }} />
        </div>

        <h2 style={{ color: "#FFFFFF", fontSize: "2.8rem", fontWeight: 700, margin: "0 0 1.2rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Welcome to<br />
          <span style={{ background: "linear-gradient(135deg, #C5A880, #e8d5b0, #C5A880)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Pooja Productions
          </span>
        </h2>

        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.6rem", lineHeight: 1.7, margin: "0 0 3.5rem" }}>
          Stories that stir the soul. Visuals that capture the imagination. Cinema that stands the test of time.
        </p>

        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#portfolio"
            onClick={close}
            style={{
              padding: "1.3rem 3rem",
              background: "linear-gradient(135deg, #C5A880, #a8895e)",
              color: "#000",
              borderRadius: "100px",
              fontWeight: 700,
              fontSize: "1.5rem",
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "opacity 0.3s",
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            Explore Our Films
          </a>
          <button
            onClick={close}
            style={{
              padding: "1.3rem 3rem",
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "100px",
              fontWeight: 500,
              fontSize: "1.5rem",
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "#C5A880"; e.currentTarget.style.color = "#C5A880"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            Enter Site
          </button>
        </div>

        {/* Close X */}
        <button
          onClick={close}
          style={{
            position: "absolute",
            top: "1.8rem",
            right: "1.8rem",
            width: "3.2rem",
            height: "3.2rem",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)",
            fontSize: "1.6rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(197,168,128,0.2)"; e.currentTarget.style.color = "#C5A880"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
        >
          <i className="ph ph-x"></i>
        </button>

        {/* Keyframe injection */}
        <style>{`
          @keyframes ppFadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes ppFadeOut { from { opacity: 1 } to { opacity: 0 } }
          @keyframes ppSlideIn { from { opacity: 0; transform: translateY(30px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
          @keyframes ppSlideOut { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(-20px) scale(0.97) } }
        `}</style>
      </div>
    </div>
  );
};
