import { useState, useEffect } from 'react';

/**
 * Custom hook to detect viewport breakpoints for mobile/tablet/desktop
 * Provides reactive boolean flags: isMobile (<= 768px), isTablet (769px - 1024px), isDesktop (> 1024px)
 */
export const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  return {
    windowWidth,
    isMobile,
    isSmallMobile,
    isTablet,
    isDesktop,
  };
};

export default useResponsive;
