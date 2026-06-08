import React from "react";

export const Logo: React.FC = () => {
  return (
    <div className="logo loading__fade">
      <a href="#home" className="logo__link" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* logo icon */}
        <img
          src="/logo.png"
          className="logo__img"
          alt="Pooja Productions Logo"
        />
      </a>
    </div>
  );
};
