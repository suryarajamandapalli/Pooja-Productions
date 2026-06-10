import React from "react";

interface SplitTextProps {
  text: string;
}

export const SplitText: React.FC<SplitTextProps> = ({ text }) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="word" style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, cIdx) => (
          <span key={cIdx} className="char" style={{ display: "inline-block", willChange: "transform, opacity" }}>
              {char}
            </span>
          ))}
          {wIdx < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </>
  );
};
