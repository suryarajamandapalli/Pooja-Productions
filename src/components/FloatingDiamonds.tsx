import React from "react";

export const FloatingDiamonds: React.FC = () => {
  const diamonds = [
    // 1. Silver Diamond - Hero Section
    {
      src: "/Daimonds/1.png",
      className: "diamond-1",
      style: {
        top: "3%",
        left: "3%",
        width: "120px",
        opacity: 0.85,
        filter: "drop-shadow(0 0 25px rgba(180, 180, 190, 0.55))",
      },
    },
    // 2. Dark Diamond - Hero Section
    {
      src: "/Daimonds/2.png",
      className: "diamond-2",
      style: {
        top: "8%",
        right: "5%",
        width: "160px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 25px rgba(80, 80, 100, 0.5))",
      },
    },
    // 3. Blue Diamond - About Section
    {
      src: "/Daimonds/3.png",
      className: "diamond-3",
      style: {
        top: "13%",
        left: "6%",
        width: "180px",
        opacity: 0.75,
        filter: "drop-shadow(0 0 30px rgba(71, 113, 160, 0.6))",
      },
    },
    // 4. Light Silver/Blue Diamond - About Section
    {
      src: "/Daimonds/4.png",
      className: "diamond-4",
      style: {
        top: "18%",
        right: "2%",
        width: "210px",
        opacity: 0.8,
        filter: "drop-shadow(0 0 25px rgba(126, 132, 148, 0.55))",
      },
    },
    // 5. Ice Blue Diamond - Portfolio Section
    {
      src: "/Daimonds/5.png",
      className: "diamond-5",
      style: {
        top: "23%",
        left: "4%",
        width: "140px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 25px rgba(157, 184, 206, 0.6))",
      },
    },
    // 6. Classic Blue Diamond - Portfolio Section
    {
      src: "/Daimonds/6.png",
      className: "diamond-6",
      style: {
        top: "28%",
        right: "8%",
        width: "240px",
        opacity: 0.75,
        filter: "drop-shadow(0 0 30px rgba(97, 115, 157, 0.6))",
      },
    },
    // 7. Teal/Slate Diamond - Studio Section
    {
      src: "/Daimonds/7.png",
      className: "diamond-7",
      style: {
        top: "33%",
        left: "2%",
        width: "190px",
        opacity: 0.8,
        filter: "drop-shadow(0 0 35px rgba(95, 122, 130, 0.55))",
      },
    },
    // 8. Silver Diamond - Studio Section
    {
      src: "/Daimonds/1.png",
      className: "diamond-8",
      style: {
        top: "38%",
        right: "4%",
        width: "130px",
        opacity: 0.8,
        filter: "drop-shadow(0 0 25px rgba(180, 180, 190, 0.55))",
      },
    },
    // 9. Dark Diamond - Services Section
    {
      src: "/Daimonds/2.png",
      className: "diamond-9",
      style: {
        top: "43%",
        left: "8%",
        width: "150px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 25px rgba(80, 80, 100, 0.5))",
      },
    },
    // 10. Blue Diamond - Services Section
    {
      src: "/Daimonds/3.png",
      className: "diamond-10",
      style: {
        top: "48%",
        right: "3%",
        width: "200px",
        opacity: 0.75,
        filter: "drop-shadow(0 0 30px rgba(71, 113, 160, 0.6))",
      },
    },
    // 11. Light Silver/Blue Diamond - Resume Section
    {
      src: "/Daimonds/4.png",
      className: "diamond-11",
      style: {
        top: "53%",
        left: "3%",
        width: "220px",
        opacity: 0.8,
        filter: "drop-shadow(0 0 25px rgba(126, 132, 148, 0.55))",
      },
    },
    // 12. Ice Blue Diamond - Resume Section
    {
      src: "/Daimonds/5.png",
      className: "diamond-12",
      style: {
        top: "58%",
        right: "6%",
        width: "160px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 25px rgba(157, 184, 206, 0.6))",
      },
    },
    // 13. Classic Blue Diamond - Team Section
    {
      src: "/Daimonds/6.png",
      className: "diamond-13",
      style: {
        top: "63%",
        left: "5%",
        width: "240px",
        opacity: 0.75,
        filter: "drop-shadow(0 0 30px rgba(97, 115, 157, 0.6))",
      },
    },
    // 14. Teal/Slate Diamond - Team Section
    {
      src: "/Daimonds/7.png",
      className: "diamond-14",
      style: {
        top: "68%",
        right: "2%",
        width: "180px",
        opacity: 0.8,
        filter: "drop-shadow(0 0 35px rgba(95, 122, 130, 0.55))",
      },
    },
    // 15. Silver Diamond - Contact Section
    {
      src: "/Daimonds/1.png",
      className: "diamond-15",
      style: {
        top: "73%",
        left: "4%",
        width: "140px",
        opacity: 0.85,
        filter: "drop-shadow(0 0 25px rgba(180, 180, 190, 0.55))",
      },
    },
    // 16. Dark Diamond - Contact Section
    {
      src: "/Daimonds/2.png",
      className: "diamond-16",
      style: {
        top: "78%",
        right: "5%",
        width: "180px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 25px rgba(80, 80, 100, 0.5))",
      },
    },
    // 17. Blue Diamond - Contact Section
    {
      src: "/Daimonds/3.png",
      className: "diamond-17",
      style: {
        top: "82%",
        left: "2%",
        width: "200px",
        opacity: 0.75,
        filter: "drop-shadow(0 0 30px rgba(71, 113, 160, 0.6))",
      },
    },
    // 18. Light Silver/Blue Diamond - Bottom Area
    {
      src: "/Daimonds/4.png",
      className: "diamond-18",
      style: {
        top: "85%",
        right: "3%",
        width: "210px",
        opacity: 0.8,
        filter: "drop-shadow(0 0 25px rgba(126, 132, 148, 0.55))",
      },
    },
    // 19. Ice Blue Diamond - Bottom Area
    {
      src: "/Daimonds/5.png",
      className: "diamond-19",
      style: {
        top: "88%",
        left: "5%",
        width: "150px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 25px rgba(157, 184, 206, 0.6))",
      },
    },
  ];


  return (
    <div
      className="floating-diamonds-global-container"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {diamonds.map((d, i) => (
        <img
          key={i}
          src={d.src}
          alt="Floating Diamond Background decoration"
          className={`floating-bg-diamond ${d.className}`}
          style={{
            position: "absolute",
            ...d.style,
          }}
        />
      ))}
    </div>
  );
};

