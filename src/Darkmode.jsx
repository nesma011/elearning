import React, { useContext } from "react";
import { ThemeContext } from "./Context/ThemeContext";

export default function Darkmode() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="flex items-center justify-center">
      <button
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md transition-all duration-300 shadow-md hover:scale-105"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? " ☀️" : "🌙"}
      </button>
    </div>
  );
}
