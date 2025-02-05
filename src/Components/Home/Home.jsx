import React from 'react';
import { motion } from "framer-motion";
import { useState } from "react";
/* import ScrollToTopButton from '../ScrollToTopButton/ScrollToTopButton';
 */

export default function Home() {
  
  const [isOpen, setIsOpen] = useState(true);

  const rectangles = Array.from({ length: 10 }, (_, i) => ({
    initial: {
      clipPath: `polygon(${i * 10}% 0%, ${(i + 1) * 10}% 0%, ${(i + 1) * 10}% 100%, ${i * 10}% 100%)`,
    },
    animate: {
      clipPath: `polygon(${i * 10}% 100%, ${(i + 1) * 10}% 100%, ${(i + 1) * 10}% 100%, ${i * 10}% 100%)`,
    }
  }));

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-gray-900" style={{ overflowX: 'hidden' }}>
        {isOpen && rectangles.map((rect, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-white z-10"
            style={{ width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }}
            initial={rect.initial}
            animate={rect.animate}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              delay: index * 0.1
            }}
            onAnimationComplete={index === rectangles.length - 1 ? () => setIsOpen(false) : undefined}
          />
        ))}
      </div>

      {/* <ScrollToTopButton/> */}
    </>
  );
}
