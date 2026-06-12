import React from "react";

export const BottomBackground: React.FC = () => {
  return (
    <div className="bottom__background bottom-bg-01" style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }}>
      {/* Original template bottom backgrounds using transparent PNG versions */}
      <div className="bottom-bg-01__02 animate-card-2">
        <img src="/img/backgrounds/gold_diamond1.png" alt="Template background image" className="slow-rotate-left" />
      </div>
      <div className="bottom-bg-01__01 animate-card-2">
        <img src="/img/backgrounds/gold_diamond2.png" alt="Template background image" className="slow-rotate-right" />
      </div>
    </div>
  );
};
