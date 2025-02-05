import React, { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility based on scroll position
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <a
      href="#"
      id="scroll-top"
      onClick={(e) => {
        e.preventDefault();
        scrollToTop();
      }}
      className={`fixed right-8 z-[99] text-white bg-orange-500 rounded-full w-[50px] h-[50px] flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 visible bottom-[20px] rotate-0" : "opacity-0 invisible bottom-[-20px] rotate-[-40deg]"
      }`}
    >
      <i className="fas fa-arrow-up"></i>
    </a>
  );
}
