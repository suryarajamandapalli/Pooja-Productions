import React, { useEffect, useState } from "react";

export const ColorSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("template.theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("color-scheme", theme);
    localStorage.setItem("template.theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="color loading__fade">
      <button
        id="color-switcher"
        className="color-switcher"
        type="button"
        role="switch"
        aria-label="light/dark mode"
        aria-checked={theme === "dark"}
        onClick={toggleTheme}
      />
    </div>
  );
};
