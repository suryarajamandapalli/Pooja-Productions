import React from "react";

export const BottomBackground: React.FC = () => {
  return (
    <div className="bottom__background bottom-bg-01" style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }}>
      {/* Pure CSS floating rotating diamonds behind the footer */}
      <img src="img/backgrounds/gold_diamond1.png" className="css-floating-diamond diamond-1" alt="" />
      <img src="img/backgrounds/gold_diamond2.png" className="css-floating-diamond diamond-2" alt="" />
      <img src="img/backgrounds/gold_diamond2.png" className="css-floating-diamond diamond-3" alt="" />
      <img src="img/backgrounds/gold_diamond1.png" className="css-floating-diamond diamond-4" alt="" />
    </div>
  );
};
