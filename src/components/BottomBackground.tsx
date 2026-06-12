import React from "react";

export const BottomBackground: React.FC = () => {
  return (
    <div className="bottom__background bottom-bg-01" style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }}>
      {/* Only one rotating gold diamond on the right forming a rotating semicircle */}
      <div className="bottom-bg-01__01 animate-card-2">
        <img src="/img/backgrounds/gold_diamond1.png" alt="Template background image" className="slow-rotate-right" />
      </div>
    </div>
  );
};
