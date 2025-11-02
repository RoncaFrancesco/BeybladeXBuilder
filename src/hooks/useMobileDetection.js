import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  const [orientation, setOrientation] = useState(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
      setOrientation(height > width ? 'portrait' : 'landscape');
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        handleResize();
      }, 100); // Small delay to get accurate dimensions
    };

    // Initial check
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleOrientationChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    // Helper methods
    isSmallMobile: screenSize.width < 480,
    isLargeMobile: screenSize.width >= 480 && screenSize.width < 768,
    isSmallTablet: screenSize.width >= 768 && screenSize.width < 896,
    isLargeTablet: screenSize.width >= 896 && screenSize.width < 1024
  };
};