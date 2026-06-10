import React from "react";

export const BottomBackground: React.FC = () => {
  return (
    <div className="bottom__background bottom-bg-01">
      <div className="bottom-bg-01__02 animate-card-2">
        <img src="img/backgrounds/1200x1200_bg01.webp" alt="Template background image" />
      </div>
      <div className="bottom-bg-01__01 animate-card-2">
        <img src="img/backgrounds/1200x1200_bg01.webp" alt="Template background image" />
      </div>

      {/* Pure CSS floating diamonds (No GSAP ScrollTrigger to prevent crashes) */}
      <img src="img/backgrounds/gold_diamond1.png" className="css-floating-diamond diamond-1" alt="" />
      <img src="img/backgrounds/gold_diamond2.png" className="css-floating-diamond diamond-2" alt="" />
      <img src="img/backgrounds/gold_diamond2.png" className="css-floating-diamond diamond-3" alt="" />
      <img src="img/backgrounds/gold_diamond1.png" className="css-floating-diamond diamond-4" alt="" />
    </div>
  );
};
