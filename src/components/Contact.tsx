import React, { useState } from "react";
import { useCMS } from "./CMSContext";

export const Contact: React.FC = () => {
  const { data } = useCMS();
  const about = data?.about;

  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isInstallable, setIsInstallable] = useState(!!(window as any).deferredPrompt);

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
      }}
    >
      {/* â”€â”€ DIAMOND LEFT (small) â”€â”€ */}
      <div
        style={{
          position: "absolute",
          bottom: "-160px",
          left: "-200px",
          width: "320px",
          height: "320px",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "visible",
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
            opacity: 0.22,
            mixBlendMode: "screen",
            filter: "brightness(1.4) contrast(1.2)",
            maskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)",
            WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)",
            animation: "ft-spin 60s linear infinite",
          }}
        />
      </div>

      {/* â”€â”€ DIAMOND RIGHT (large) â”€â”€ */}
      <div
        style={{
          position: "absolute",
          bottom: "-235px",
          right: "-305px",
          width: "540px",
          height: "540px",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "visible",
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
            opacity: 0.22,
            mixBlendMode: "screen",
            filter: "brightness(1.4) contrast(1.2)",
            maskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)",
            WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 75%)",
            animation: "ft-spin 60s linear infinite",
          }}
        />
      </div>

      {/* â”€â”€ FOOTER CONTENT â”€â”€ */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "6rem clamp(24px, 4vw, 80px) 0",
        }}
      >

        {/* â”€â”€ SECTION 1: Address / Website / Phone / Email â”€â”€ */}
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

        {/* â”€â”€ SECTION 2: empty â”€â”€ */}
        <div style={{ height: "4rem" }} />

        {/* â”€â”€ SECTION 3: gold divider â”€â”€ */}
        <div className="ft-divider" />

        {/* â”€â”€ SECTION 4: copyright | links | socials â”€â”€ */}
        <div className="ft-bottom-bar">
          {/* Left */}
          <span className="ft-copyright">{"\u00a9"}2026 Pooja Productions</span>

          {/* Center */}
          <div className="ft-links">
            <a href="#0" className="ft-link">Privacy Policy</a>
            <a href="#0" className="ft-link">Terms</a>
            {isInstallable && (
              <a href="#0" className="ft-link" onClick={handleInstallClick}>
                Install App
              </a>
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

        {/* ── SECTION 5: Made by Aranea Den — bottom center ── */}
        <div className="ft-made-by" style={{ display: "flex", justifyContent: "center", marginTop: "4rem", paddingBottom: "2rem" }}>
          <a
            href="https://araneaden.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ft-made-by-link"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textDecoration: "none" }}
          >
            <img
              src={about?.araneadenLogo || "/img/araneaden_logo.png"}
              alt="Aranea Den Logo"
              style={{
                maxWidth: "120px",
                height: "auto",
                opacity: 0.4,
                filter: "grayscale(1) contrast(1.5) brightness(1.2)",
                mixBlendMode: "screen",
                display: "block",
                transition: "opacity 0.3s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.4"; }}
            />
            <span style={{ fontSize: "1.0rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.25)" }}>
              {about?.araneadenText || "MADE BY ARANEA DEN"}
            </span>
          </a>
        </div>

      </div>

      {/* PWA install instructions modal */}
      {showInstallInstructions && (
        <div className="install-modal-overlay" onClick={() => setShowInstallInstructions(false)}>
          <div className="install-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="install-modal-close" onClick={() => setShowInstallInstructions(false)}>âœ•</button>
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
