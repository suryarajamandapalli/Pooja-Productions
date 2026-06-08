import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { CMSProvider, useCMS } from "./components/CMSContext";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";

// Component Imports
import { Loader } from "./components/Loader";
import { Header } from "./components/Header";
import { Logo } from "./components/Logo";
import { ColorSwitcher } from "./components/ColorSwitcher";
import { ScrollToTop } from "./components/ScrollToTop";
import { BottomBackground } from "./components/BottomBackground";
import { Hero } from "./components/Hero";
import { Portfolio } from "./components/Portfolio";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Resume } from "./components/Resume";
import { Contact } from "./components/Contact";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const MainAppContent: React.FC = () => {
  const { isAdmin, loading } = useCMS();
  const [view, setView] = useState<"site" | "admin">(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/admin" || window.location.hash === "#admin") {
        return "admin";
      }
    }
    return "site";
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === "/admin" || window.location.hash === "#admin") {
        setView("admin");
      } else {
        setView("site");
      }
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  const navigateToSite = () => {
    window.history.pushState(null, "", "/");
    setView("site");
  };

  useEffect(() => {
    if (view === "admin") return;

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. Parallax effects ([data-speed])
    gsap.to("[data-speed]", {
      y: (_, el) => (1 - parseFloat(el.getAttribute("data-speed") || "1")) * ScrollTrigger.maxScroll(window),
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        invalidateOnRefresh: true,
        scrub: 0,
      },
    });

    // 3. Scroll Reveal type animations (.reveal-type)
    const revealTypes = document.querySelectorAll(".reveal-type");
    revealTypes.forEach((el) => {
      const chars = el.querySelectorAll(".char");
      if (chars.length > 0) {
        gsap.fromTo(
          chars,
          { opacity: 0.15, filter: "blur(5px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 25%",
              scrub: true,
            },
          }
        );
      }
    });

    // 4. Scroll Animations (animate-in-up)
    const animateInUp = document.querySelectorAll(".animate-in-up");
    animateInUp.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // 5. Grid Card Batch Animations
    // Grid 2x
    if (document.querySelector(".animate-card-2")) {
      gsap.set(".animate-card-2", { y: 100, opacity: 0, filter: "blur(12px)" });
      ScrollTrigger.batch(".animate-card-2", {
        interval: 0.1,
        batchMax: 2,
        duration: 6,
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "sine.out",
            stagger: { each: 0.15, grid: [1, 2] },
            overwrite: true,
          }),
        onLeave: (batch: any) => gsap.set(batch, { opacity: 1, y: 0, filter: "blur(0px)", overwrite: true }),
        onEnterBack: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 100, filter: "blur(12px)", overwrite: true }),
      } as any);
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-2", { y: 0, opacity: 1, filter: "blur(0px)" }));
    }

    // Grid 3x
    if (document.querySelector(".animate-card-3")) {
      gsap.set(".animate-card-3", { y: 50, opacity: 0, filter: "blur(12px)" });
      ScrollTrigger.batch(".animate-card-3", {
        interval: 0.1,
        batchMax: 3,
        duration: 3,
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "sine.out",
            stagger: { each: 0.15, grid: [1, 3] },
            overwrite: true,
          }),
        onLeave: (batch: any) => gsap.set(batch, { opacity: 1, y: 0, filter: "blur(0px)", overwrite: true }),
        onEnterBack: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 50, filter: "blur(12px)", overwrite: true }),
      } as any);
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-3", { y: 0, opacity: 1, filter: "blur(0px)" }));
    }

    // Grid 4x
    if (document.querySelector(".animate-card-4")) {
      gsap.set(".animate-card-4", { y: 50, opacity: 0, filter: "blur(12px)" });
      ScrollTrigger.batch(".animate-card-4", {
        interval: 0.1,
        batchMax: 4,
        delay: 1000,
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "sine.out",
            stagger: { each: 0.15, grid: [1, 4] },
            overwrite: true,
          }),
        onLeave: (batch: any) => gsap.set(batch, { opacity: 1, y: 0, filter: "blur(0px)", overwrite: true }),
        onEnterBack: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 50, filter: "blur(12px)", overwrite: true }),
      } as any);
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-4", { y: 0, opacity: 1, filter: "blur(0px)" }));
    }

    // Grid 5x
    if (document.querySelector(".animate-card-5")) {
      gsap.set(".animate-card-5", { y: 50, opacity: 0, filter: "blur(12px)" });
      ScrollTrigger.batch(".animate-card-5", {
        interval: 0.1,
        batchMax: 5,
        delay: 1000,
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "sine.out",
            stagger: { each: 0.15, grid: [1, 5] },
            overwrite: true,
          }),
        onLeave: (batch: any) => gsap.set(batch, { opacity: 1, y: 0, filter: "blur(0px)", overwrite: true }),
        onEnterBack: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 50, filter: "blur(12px)", overwrite: true }),
      } as any);
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-5", { y: 0, opacity: 1, filter: "blur(0px)" }));
    }

    // 6. Smooth navigation for menu anchor link clicks (using global event delegation)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href !== "#" && href !== "#0") {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl as HTMLElement, {
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);

    // 7. Prevent image dragging
    const handleDragStart = (e: Event) => e.preventDefault();
    document.querySelectorAll("img, a").forEach((el) => {
      el.addEventListener("dragstart", handleDragStart);
    });

    // 8. Detect Touch/No-Touch devices
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      document.documentElement.classList.add("touch");
      document.documentElement.classList.remove("no-touch");
    } else {
      document.documentElement.classList.add("no-touch");
      document.documentElement.classList.remove("touch");
    }

    // 9. Magnet Hover Effect Coordinates Tracking
    const handleMagnetHover = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const em = el.querySelector("em");
      if (em) {
        gsap.set(em, { top: relY, left: relX });
      }
    };

    const hoverSelectors = ".hover-default, .hover-circle, .circle, .inner-video-trigger, .socials-cards__link";
    const hoverElements = document.querySelectorAll(hoverSelectors);
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMagnetHover as EventListener);
      el.addEventListener("mouseout", handleMagnetHover as EventListener);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      document.removeEventListener("click", handleGlobalClick);
      document.querySelectorAll("img, a").forEach((el) => {
        el.removeEventListener("dragstart", handleDragStart);
      });
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMagnetHover as EventListener);
        el.removeEventListener("mouseout", handleMagnetHover as EventListener);
      });
    };
  }, [view]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#000000", color: "#C5A880", fontFamily: '"Urbanist", sans-serif' }}>
        Loading Pooja Productions CMS...
      </div>
    );
  }

  if (view === "admin") {
    if (!isAdmin) {
      return <AdminLogin onBackToSite={navigateToSite} />;
    }
    return <AdminDashboard onBackToSite={navigateToSite} />;
  }

  return (
    <>
      {/* 1. Loader screen */}
      <Loader />

      {/* 2. Brand Identity / Logo */}
      <Logo />

      {/* 3. Global Navigation Menu */}
      <Header />

      {/* 4. Color theme selector */}
      <ColorSwitcher />

      {/* 5. Main Scrollable Container */}
      <main id="page-content" className="page-content">
        <Hero />
        <Portfolio />
        <About />
        <Services />
        <Resume />
        <Contact />
      </main>

      {/* Mobile Menu Bottom Placeholder */}
      <div className="header-offset"></div>

      {/* 6. Page-bottom decorative backdrops */}
      <BottomBackground />

      {/* 7. Scroll-to-top trigger button */}
      <ScrollToTop />

      {/* 8. Floating Admin Back-to-Dashboard badge */}
      {isAdmin && (
        <button
          onClick={() => {
            window.history.pushState(null, "", "/admin");
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          style={{
            position: "fixed",
            bottom: "3rem",
            left: "3rem",
            backgroundColor: "#0A0A0A",
            border: "1px solid #C5A880",
            borderRadius: "50px",
            padding: "1.2rem 2rem",
            color: "#C5A880",
            fontFamily: '"Urbanist", sans-serif',
            fontSize: "1.3rem",
            fontWeight: 700,
            cursor: "pointer",
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            boxShadow: "0 10px 30px rgba(197, 168, 128, 0.25)"
          }}
          className="admin-dashboard-btn"
        >
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "currentColor" }}></span>
          Studio Dashboard
        </button>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <CMSProvider>
      <MainAppContent />
    </CMSProvider>
  );
};

export default App;
