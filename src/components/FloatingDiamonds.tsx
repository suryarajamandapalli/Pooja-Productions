import React from "react";

export const FloatingDiamonds: React.FC = () => {
  const diamonds = [
    // 1. Silver Diamond - Hero Section
    {
      src: "/Daimonds/1.png",
      className: "diamond-1",
      style: {
        top: "4%",
        left: "3%",
        width: "60px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 15px rgba(180, 180, 190, 0.45))",
      },
    },
    // 2. Dark Diamond - Hero Section
    {
      src: "/Daimonds/2.png",
      className: "diamond-2",
      style: {
        top: "10%",
        right: "4%",
        width: "80px",
        opacity: 0.6,
        filter: "drop-shadow(0 0 15px rgba(80, 80, 100, 0.4))",
      },
    },
    // 3. Blue Diamond - About Section
    {
      src: "/Daimonds/3.png",
      className: "diamond-3",
      style: {
        top: "19%",
        left: "2%",
        width: "90px",
        opacity: 0.65,
        filter: "drop-shadow(0 0 20px rgba(71, 113, 160, 0.5))",
      },
    },
    // 4. Light Silver/Blue Diamond - Portfolio Section
    {
      src: "/Daimonds/4.png",
      className: "diamond-4",
      style: {
        top: "28%",
        right: "3%",
        width: "110px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 15px rgba(126, 132, 148, 0.45))",
      },
    },
    // 5. Ice Blue Diamond - Studio Section
    {
      src: "/Daimonds/5.png",
      className: "diamond-5",
      style: {
        top: "38%",
        left: "4%",
        width: "75px",
        opacity: 0.6,
        filter: "drop-shadow(0 0 15px rgba(157, 184, 206, 0.5))",
      },
    },
    // 6. Classic Blue Diamond - Services Section
    {
      src: "/Daimonds/6.png",
      className: "diamond-6",
      style: {
        top: "46%",
        right: "5%",
        width: "120px",
        opacity: 0.65,
        filter: "drop-shadow(0 0 20px rgba(97, 115, 157, 0.5))",
      },
    },
    // 7. Teal/Slate Diamond - Resume Section
    {
      src: "/Daimonds/7.png",
      className: "diamond-7",
      style: {
        top: "54%",
        left: "3%",
        width: "85px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 25px rgba(95, 122, 130, 0.45))",
      },
    },
    // 8. Silver Diamond - Team Section
    {
      src: "/Daimonds/1.png",
      className: "diamond-8",
      style: {
        top: "62%",
        right: "2%",
        width: "70px",
        opacity: 0.65,
        filter: "drop-shadow(0 0 15px rgba(180, 180, 190, 0.45))",
      },
    },
    // 9. Dark Diamond - Contact Section
    {
      src: "/Daimonds/2.png",
      className: "diamond-9",
      style: {
        top: "70%",
        left: "5%",
        width: "80px",
        opacity: 0.6,
        filter: "drop-shadow(0 0 15px rgba(80, 80, 100, 0.4))",
      },
    },
    // 10. Blue Diamond - Contact Section
    {
      src: "/Daimonds/3.png",
      className: "diamond-10",
      style: {
        top: "78%",
        right: "4%",
        width: "100px",
        opacity: 0.65,
        filter: "drop-shadow(0 0 20px rgba(71, 113, 160, 0.5))",
      },
    },
    // 11. Light Silver/Blue Diamond - Bottom Area
    {
      src: "/Daimonds/4.png",
      className: "diamond-11",
      style: {
        top: "84%",
        left: "2%",
        width: "95px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 15px rgba(126, 132, 148, 0.45))",
      },
    },
    // 12. Ice Blue Diamond - Bottom Area
    {
      src: "/Daimonds/5.png",
      className: "diamond-12",
      style: {
        top: "90%",
        right: "3%",
        width: "80px",
        opacity: 0.6,
        filter: "drop-shadow(0 0 15px rgba(157, 184, 206, 0.5))",
      },
    },
    // 13. Classic Blue Diamond - Bottom Area
    {
      src: "/Daimonds/6.png",
      className: "diamond-13",
      style: {
        top: "95%",
        left: "4%",
        width: "110px",
        opacity: 0.65,
        filter: "drop-shadow(0 0 20px rgba(97, 115, 157, 0.5))",
      },
    },
    // 14. Teal/Slate Diamond - Bottom Area
    {
      src: "/Daimonds/7.png",
      className: "diamond-14",
      style: {
        top: "98%",
        right: "5%",
        width: "90px",
        opacity: 0.7,
        filter: "drop-shadow(0 0 25px rgba(95, 122, 130, 0.45))",
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

