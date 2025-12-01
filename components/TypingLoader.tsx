"use client";

import React, { useEffect, useState } from "react";

type TypingLoaderProps = {
  text?: string;
  typingSpeed?: number;   // ms per letter
  pauseAfterDone?: number; // ms before hiding loader
  onDone?: () => void;
};

const TypingLoader: React.FC<TypingLoaderProps> = ({
  text = "CodeConnect",
  typingSpeed = 120,
  pauseAfterDone = 500,
  onDone,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    let typingTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const type = () => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
        typingTimeout = setTimeout(type, typingSpeed);
      } else {
        // done typing → wait a bit → fade out
        hideTimeout = setTimeout(() => {
          setIsVisible(false);
          if (onDone) onDone();
        }, pauseAfterDone);
      }
    };

    type();

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(hideTimeout);
    };
  }, [text, typingSpeed, pauseAfterDone, onDone]);

  return (
    <div
      id="loader"
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.7s ease",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: 600,
          color: "#ffffff",
          letterSpacing: "0.2em",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          textTransform: "uppercase",
        }}
      >
        {displayedText}
      </h1>
    </div>
  );
};

export default TypingLoader;
