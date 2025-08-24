import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../auth/themeSlice";
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
 const dispatch = useDispatch();
 const { isDarkMode } = useSelector((state) => state.theme);

 const handleToggle = () => {
  dispatch(toggleTheme());
 };

 return (
  <div className="fixed top-2 right-2 md:top-10 md:right-10 z-50">
   <button
    onClick={handleToggle}
    className="relative flex flex-col items-center"
    aria-label="Toggle theme"
    title="Toggle theme"
   >
    {/* Rope */}
    <div className="w-[2px] h-8 bg-gray-500 dark:bg-gray-400" />

    {/* Lampshade */}
    <div
     className="relative w-16 h-10 
          bg-gradient-to-b from-slate-700 to-slate-900
          dark:from-slate-500 dark:to-slate-700
          [clip-path:polygon(25%_0%,75%_0%,100%_100%,0%_100%)]
          shadow-lg flex justify-center items-center"
    >
     {/* Sun and Moon Icons inside the lampshade */}
     {isDarkMode ? (
      <FaMoon className="w-5 h-5 text-gray-300 transition-colors duration-500" />
     ) : (
      <FaSun className="w-5 h-5 text-yellow-400 transition-colors duration-500" />
     )}
    </div>

    {/* Bulb OUTSIDE */}
    <div
     className={`-mt-2 w-8 h-8 rounded-full transition-all duration-500 ease-in-out
          ${isDarkMode
            ? "bg-yellow-300 shadow-[0_0_50px_15px_rgba(253,224,71,0.8)]"
            : "bg-gray-300 shadow-none"}`}
    />
   </button>
  </div>
 );
};

export default ThemeToggle;