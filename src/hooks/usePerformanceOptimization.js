import { useState, useEffect, useCallback, useMemo } from 'react';

export const usePerformanceOptimization = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    // Detect low performance devices
    const checkPerformance = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlowNetwork = connection ?
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === '3g'
        : false;
      const isLowMemory = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      const isLowCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;

      setIsLowPerformance(isSlowNetwork || isLowMemory || isLowCores);

      if (connection) {
        setConnectionType(connection.effectiveType);
      }
    };

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    checkPerformance();
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection changes
    if (navigator.connection) {
      navigator.connection.addEventListener('change', checkPerformance);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', checkPerformance);
      }
    };
  }, []);

  // Handle visibility change for performance optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Debounced function for mobile
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Throttled function for scroll events
  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Lazy load images and components
  const lazyLoad = useCallback((element) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Load content when visible
            entry.target.classList.add('loaded');
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      observer.observe(element);
    } else {
      // Fallback for older browsers
      element.classList.add('loaded');
    }
  }, []);

  // Memoized version for expensive calculations
  const memoize = useCallback((fn) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }, []);

  // Performance monitoring
  const measurePerformance = useCallback((name, fn) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      const startMark = `${name}-start`;
      const endMark = `${name}-end`;
      const measureName = `${name}-measure`;

      performance.mark(startMark);

      const result = fn();

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);

      const measure = performance.getEntriesByName(measureName)[0];
      console.log(`${name}: ${measure.duration}ms`);

      // Cleanup
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);

      return result;
    }

    return fn();
  }, []);

  // Optimized scroll handler
  const useOptimizedScroll = useCallback((callback, options = {}) => {
    const { throttleMs = 16, debounceMs = 100 } = options;

    const throttledCallback = throttle(callback, throttleMs);
    const debouncedCallback = debounce(callback, debounceMs);

    useEffect(() => {
      const handleScroll = () => {
        throttledCallback();
        debouncedCallback();
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [throttledCallback, debouncedCallback]);
  }, [throttle, debounce]);

  return {
    isVisible,
    isLowPerformance,
    isOnline,
    connectionType,
    debounce,
    throttle,
    lazyLoad,
    memoize,
    measurePerformance,
    useOptimizedScroll
  };
};