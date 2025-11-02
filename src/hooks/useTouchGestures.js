import { useState, useCallback, useRef } from 'react';

export const useTouchGestures = (onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartTime = useRef(0);
  const minSwipeDistance = 50;
  const maxSwipeTime = 300; // Maximum time for a swipe gesture

  const onTouchStart = useCallback((e) => {
    const touch = e.targetTouches[0];
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
    touchStartTime.current = Date.now();
    setIsSwiping(false);
  }, []);

  const onTouchMove = useCallback((e) => {
    const touch = e.targetTouches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY
    });
    setIsSwiping(true);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.x || !touchEnd.x) return;

    const distance = Math.sqrt(
      Math.pow(touchEnd.x - touchStart.x, 2) +
      Math.pow(touchEnd.y - touchStart.y, 2)
    );

    const timeDiff = Date.now() - touchStartTime.current;

    // Check if it was a tap (short touch without movement)
    if (distance < 10 && timeDiff < 200 && onTap) {
      onTap();
      return;
    }

    // Check if it was a valid swipe (enough distance and fast enough)
    if (distance < minSwipeDistance || timeDiff > maxSwipeTime) return;

    const xDiff = touchEnd.x - touchStart.x;
    const yDiff = touchEnd.y - touchStart.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Horizontal swipe
      if (xDiff > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (xDiff < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (yDiff > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (yDiff < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    // Reset state
    setIsSwiping(false);
    touchStartTime.current = 0;
  }, [touchStart, touchEnd, minSwipeDistance, maxSwipeTime, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping
  };
};

// Hook for pull-to-refresh functionality
export const usePullToRefresh = (onRefresh) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const maxPullDistance = 100;
  const triggerDistance = 60;

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.targetTouches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling || window.scrollY > 0) return;

    const currentY = e.targetTouches[0].clientY;
    const distance = Math.min(currentY - startY.current, maxPullDistance);

    setPullDistance(distance);
  }, [isPulling, maxPullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    if (pullDistance >= triggerDistance && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
    startY.current = 0;
  }, [isPulling, pullDistance, triggerDistance, isRefreshing, onRefresh]);

  return {
    pullToRefreshProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    isPulling,
    pullDistance,
    isRefreshing,
    pullProgress: Math.min(pullDistance / triggerDistance, 1)
  };
};

// Hook for long press detection
export const useLongPress = (onLongPress, delay = 500) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef(null);

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsLongPressing(true);
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLongPressing(false);
  }, []);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    start();
  }, [start]);

  const onMouseUp = useCallback((e) => {
    e.preventDefault();
    clear();
  }, [clear]);

  const onMouseLeave = useCallback(() => {
    clear();
  }, [clear]);

  const onTouchStart = useCallback((e) => {
    e.preventDefault();
    start();
  }, [start]);

  const onTouchEnd = useCallback((e) => {
    e.preventDefault();
    clear();
  }, [clear]);

  return {
    isLongPressing,
    props: {
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onTouchStart,
      onTouchEnd
    }
  };
};