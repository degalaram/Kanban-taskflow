// Custom hook to detect if the screen is mobile size
// Uses window.matchMedia to listen for screen size changes

import { useState, useEffect } from "react";

// Breakpoint for mobile devices (768px is common for tablets)
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // State to track if current screen is mobile
  // undefined initially because we don't know until the component mounts
  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    // Create a media query for screens smaller than mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Handler function that updates state when screen size changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Listen for changes to the media query
    mql.addEventListener("change", onChange);
    
    // Set initial value based on current window width
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Cleanup: remove event listener when component unmounts
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return boolean (convert undefined to false with !!)
  return !!isMobile;
}
