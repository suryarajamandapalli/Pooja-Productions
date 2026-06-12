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
import { ScrollToTop } from "./components/ScrollToTop";
import { BottomBackground } from "./components/BottomBackground";
import { Hero } from "./components/Hero";
import { Portfolio } from "./components/Portfolio";
import { About, Studio } from "./components/About";
import { Services } from "./components/Services";
import { Resume } from "./components/Resume";
import { Contact } from "./components/Contact";
import { WelcomePopup } from "./components/WelcomePopup";
import { Team } from "./components/Team";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const MainAppContent: React.FC = () => {
  const { isAdmin, loading, logout } = useCMS();
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
        logout();
        setView("site");
      }
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, [logout]);

  const navigateToSite = () => {
    logout();
    window.history.pushState(null, "", "/");
    setView("site");
  };

  useEffect(() => {
    if (view === "admin") return;
    if (loading) return; // Wait until CMS data is ready & full site is in DOM

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 3 & 4. Deferred ScrollTriggers for elements below Hero
    // We delay this to ensure CinematicSequence pin spacer is fully resolved in the DOM
    const initScrollTriggers = () => {
      // 2. Parallax effects ([data-speed])
      const parallaxElements = document.querySelectorAll("[data-speed]");
      parallaxElements.forEach((el) => {
        const speedAttr = el.getAttribute("data-speed") || "1";
        const speed = parseFloat(speedAttr);
        if (speed === 1) return;

        const parentSection = el.closest("section") || el.closest(".inner") || document.body;
        
        const range = 240;
        const startY = (1 - speed) * -range;
        const endY = (1 - speed) * range;

        gsap.fromTo(
          el,
          { y: startY },
          {
            y: endY,
            ease: "none",
            scrollTrigger: {
              trigger: parentSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 0,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // 3. Scroll Reveal type animations (.reveal-type)
      // Using opacity + y only (no blur) for smooth GPU-composited performance
      const revealTypes = document.querySelectorAll(".reveal-type");
      revealTypes.forEach((el) => {
        const chars = el.querySelectorAll(".char");
        if (chars.length > 0) {
          gsap.fromTo(
            chars,
            { opacity: 0.1, y: 12 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                end: "top 30%",
                scrub: 0.6,
              },
            }
          );
        }
      });
  
      // 4. Scroll Animations (animate-in-up) — opacity + slide-up only (no blur for performance)
      const animateInUp = document.querySelectorAll(".animate-in-up");
      animateInUp.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 50 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              end: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Force GSAP to recalculate everything one final time
      ScrollTrigger.refresh();
    };

    // Run after 300ms to guarantee all images and pins are in place
    const triggerTimeout = setTimeout(initScrollTriggers, 300);


    // 5. Grid Card Batch Animations
    // Grid 2x
    if (document.querySelector(".animate-card-2")) {
      gsap.set(".animate-card-2", { y: 60, opacity: 0 });
      ScrollTrigger.batch(".animate-card-2", {
        interval: 0.1,
        batchMax: 2,
        duration: 6,
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            stagger: { each: 0.15, grid: [1, 2] },
            overwrite: true,
          }),
        onLeave: (batch: any) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
        onEnterBack: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 60, overwrite: true }),
      } as any);
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-2", { y: 0, opacity: 1 }));
    }

    // Grid 3x
    if (document.querySelector(".animate-card-3")) {
      gsap.set(".animate-card-3", { y: 50, opacity: 0 });
      ScrollTrigger.batch(".animate-card-3", {
        interval: 0.1,
        batchMax: 3,
        duration: 3,
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            stagger: { each: 0.15, grid: [1, 3] },
            overwrite: true,
          }),
        onLeave: (batch: any) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
        onEnterBack: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
      } as any);
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-3", { y: 0, opacity: 1 }));
    }

    // Grid 4x
    if (document.querySelector(".animate-card-4")) {
      gsap.set(".animate-card-4", { y: 50, opacity: 0 });
      ScrollTrigger.batch(".animate-card-4", {
        interval: 0.1,
        batchMax: 4,
        delay: 1000,
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            stagger: { each: 0.15, grid: [1, 4] },
            overwrite: true,
          }),
        onLeave: (batch: any) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
        onEnterBack: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
      } as any);
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-4", { y: 0, opacity: 1 }));
    }

    // Grid 5x
    if (document.querySelector(".animate-card-5")) {
      gsap.set(".animate-card-5", { y: 50, opacity: 0 });
      ScrollTrigger.batch(".animate-card-5", {
        interval: 0.1,
        batchMax: 5,
        delay: 1000,
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            stagger: { each: 0.15, grid: [1, 5] },
            overwrite: true,
          }),
        onLeave: (batch: any) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
        onEnterBack: (batch: any) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch: any) => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
      } as any);
      ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".animate-card-5", { y: 0, opacity: 1 }));
    }

    // 6. Smooth navigation for menu anchor link clicks (using global event delegation)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href !== "#" && href !== "#0") {
        const scrollTarget = (href === "#lets-pitch" || href === "#lets-connect") ? "#contact" : href;
        const targetEl = document.querySelector(scrollTarget);
        if (targetEl) {
          e.preventDefault();
          const isMobileDevice = window.innerWidth < 1200;
          const scrollOffset = isMobileDevice ? 0 : -90;
          lenis.scrollTo(targetEl as HTMLElement, {
            duration: 1.2,
            offset: scrollOffset,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => {
              window.history.pushState(null, "", href);
            }
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
      clearTimeout(triggerTimeout);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.removeEventListener("click", handleGlobalClick);
      document.querySelectorAll("img, a").forEach((el) => {
        el.removeEventListener("dragstart", handleDragStart);
      });
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMagnetHover as EventListener);
        el.removeEventListener("mouseout", handleMagnetHover as EventListener);
      });
    };
  }, [view, loading]); // Re-run when CMS loading completes so GSAP finds all elements

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

      {/* Welcome Popup */}
      <WelcomePopup />

      {/* 2. Brand Identity / Logo */}
      <Logo />

      {/* 3. Global Navigation Menu */}
      <Header />

      {/* 5. Main Scrollable Container */}
      <main id="page-content" className="page-content" style={{ position: "relative" }}>
        <Hero />
        <About />
        <Portfolio />
        <Studio />
        <Services />
        <Resume />
        <Team />
        <Contact />
        {/* 6. Page-bottom decorative backdrops */}
        <BottomBackground />
      </main>

      {/* Mobile Menu Bottom Placeholder */}
      <div className="header-offset"></div>

      {/* 7. Scroll-to-top trigger button */}
      <ScrollToTop />
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
