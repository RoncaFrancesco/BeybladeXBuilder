# 📱 FASE 2: Mobile Optimization - Esecuzione Guidata

## 📋 **Panoramica Fase 2**
Ottimizzare l'applicazione per dispositivi mobili con design responsive-first, performance migliorate e esperienza PWA fluida.

---

## 📱 **Step 1: Installazione Dipendenze PWA**

```bash
# Installa Vite PWA plugin per mobile features
npm install vite-plugin-pwa workbox-window
```

---

## 🎨 **Step 2: Configurazione Vite PWA**

**Modifica file:** `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Beyblade X Builder',
        short_name: 'Beyblade Builder',
        description: 'Crea e gestisci team Beyblade X personalizzati',
        theme_color: '#1e3a8a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  }
})
```

---

## 📐 **Step 3: Creazione Hook Mobile Detection**

**Crea file:** `src/hooks/useMobileDetection.js`

```javascript
import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenSize
  };
};
```

---

## 🎯 **Step 4: Touch Gestures Hook**

**Crea file:** `src/hooks/useTouchGestures.js`

```javascript
import { useState, useRef, useCallback } from 'react';

export const useTouchGestures = (onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e) => {
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = Math.sqrt(
      Math.pow(touchEnd.x - touchStart.x, 2) +
      Math.pow(touchEnd.y - touchStart.y, 2)
    );

    if (distance < minSwipeDistance) return;

    const xDiff = touchEnd.x - touchStart.x;
    const yDiff = touchEnd.y - touchStart.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0 && onSwipeRight) onSwipeRight();
      if (xDiff < 0 && onSwipeLeft) onSwipeLeft();
    } else {
      if (yDiff > 0 && onSwipeDown) onSwipeDown();
      if (yDiff < 0 && onSwipeUp) onSwipeUp();
    }
  }, [touchStart, touchEnd, minSwipeDistance, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};
```

---

## 📱 **Step 5: Mobile-First Components**

**Crea file:** `src/components/MobileOptimizedCard.jsx`

```jsx
import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';

const MobileOptimizedCard = ({
  children,
  title,
  subtitle,
  icon,
  onClick,
  className = '',
  mobileFullWidth = true
}) => {
  const { isMobile, isTablet } = useMobileDetection();

  const baseClasses = `
    bg-white rounded-xl shadow-lg
    transform transition-all duration-200
    hover:shadow-xl hover:scale-105
    ${mobileFullWidth && isMobile ? 'w-full' : ''}
    ${isMobile ? 'p-4' : 'p-6'}
    ${isTablet ? 'p-5' : ''}
    ${className}
  `;

  return (
    <div
      className={baseClasses}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center`}>
              {icon}
            </div>
          )}
          <div>
            <h3 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-gray-600 text-sm">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default MobileOptimizedCard;
```

---

## 🎨 **Step 6: Mobile Menu Component**

**Crea file:** `src/components/MobileMenu.jsx`

```jsx
import React, { useState } from 'react';
import { X, Menu, Home, BookOpen, Archive, BarChart3, Package, Star } from 'lucide-react';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { useTouchGestures } from '../hooks/useTouchGestures';
import MobileOptimizedCard from './MobileOptimizedCard';

const MobileMenu = ({
  isOpen,
  onClose,
  currentView,
  setCurrentView,
  savedBuildsCount
}) => {
  const { isMobile } = useMobileDetection();
  const [activeItem, setActiveItem] = useState(null);

  // Touch gestures per swipe-to-close
  const swipeHandlers = useTouchGestures(
    null, // left
    onClose, // right - swipe to close
    null, // up
    null  // down
  );

  const menuItems = [
    {
      id: 'home',
      label: 'Menu Principale',
      icon: <Home className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'builds',
      label: 'I Miei Build',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      badge: savedBuildsCount
    },
    {
      id: 'collection',
      label: 'La Mia Collezione',
      icon: <Archive className="w-6 h-6" />,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'statistics',
      label: 'Statistiche',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-rose-500 to-pink-500'
    },
    {
      id: 'database',
      label: 'Gestione Database',
      icon: <Package className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'rating',
      label: 'Rating Database',
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const handleMenuItemClick = (item) => {
    setActiveItem(item.id);
    setTimeout(() => {
      setCurrentView(item.id);
      onClose();
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50
          transform transition-transform duration-300 ease-out
          shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        {...swipeHandlers}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 text-sm">
            Beyblade X Builder
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {menuItems.map((item) => (
            <MobileOptimizedCard
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              className={`
                cursor-pointer transition-all duration-200
                ${activeItem === item.id ? 'ring-2 ring-blue-500' : ''}
                ${currentView === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-12 h-12 rounded-xl bg-gradient-to-r ${item.color}
                    flex items-center justify-center text-white
                  `}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.label}
                    </h3>
                  </div>
                </div>
                {item.badge && (
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {item.badge}
                  </div>
                )}
              </div>
            </MobileOptimizedCard>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500">
            <p>v3.0.0 • PWA Optimized</p>
            <p className="mt-1">Swipe right to close →</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
```

---

## 🔄 **Step 7: Ottimizzazione Performance Mobile**

**Crea file:** `src/hooks/usePerformanceOptimization.js`

```javascript
import { useState, useEffect, useCallback, useMemo } from 'react';

export const usePerformanceOptimization = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Detect low performance devices
    const checkPerformance = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlowNetwork = connection ? connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' : false;
      const isLowMemory = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;

      setIsLowPerformance(isSlowNetwork || isLowMemory);
    };

    checkPerformance();

    // Handle visibility change for performance optimization
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
      });

      observer.observe(element);
    } else {
      // Fallback for older browsers
      element.classList.add('loaded');
    }
  }, []);

  return {
    isVisible,
    isLowPerformance,
    debounce,
    lazyLoad
  };
};
```

---

## 📱 **Step 8: Integrazione in App.jsx**

**Modifica file:** `src/App.jsx`

1. **Aggiungi import:**
```jsx
import { useMobileDetection } from './hooks/useMobileDetection';
import { usePerformanceOptimization } from './hooks/usePerformanceOptimization';
import MobileMenu from './components/MobileMenu';
```

2. **Aggiungi stati:**
```jsx
const [showMobileMenu, setShowMobileMenu] = useState(false);
const { isMobile, isTablet, screenSize } = useMobileDetection();
const { isLowPerformance, debounce } = usePerformanceOptimization();
```

3. **Sostituisci il menu principale con versione responsive:**
```jsx
{/* Mobile Menu Button */}
{isMobile && (
  <button
    onClick={() => setShowMobileMenu(true)}
    className="fixed top-4 right-4 z-30 p-3 bg-blue-500 text-white rounded-full shadow-lg lg:hidden"
  >
    <Menu className="w-6 h-6" />
  </button>
)}

{/* Mobile Menu */}
<MobileMenu
  isOpen={showMobileMenu}
  onClose={() => setShowMobileMenu(false)}
  currentView={currentView}
  setCurrentView={setCurrentView}
  savedBuildsCount={savedBuilds.length}
/>

{/* Desktop Menu - Solo per schermi grandi */}
{!isMobile && (
  <div className="mt-8 max-w-6xl mx-auto">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* ... existing menu items ... */}
    </div>
  </div>
)}
```

---

## 🎨 **Step 9: Mobile CSS Optimizations**

**Crea file:** `src/styles/mobile.css`

```css
/* Mobile-specific optimizations */
@media (max-width: 768px) {
  /* Reduce animations for performance */
  * {
    animation-duration: 0.2s !important;
    transition-duration: 0.2s !important;
  }

  /* Touch-friendly tap targets */
  button, .clickable {
    min-height: 44px;
    min-width: 44px;
  }

  /* Prevent horizontal scroll */
  body {
    overflow-x: hidden;
  }

  /* Better text readability */
  .text-content {
    font-size: 16px;
    line-height: 1.5;
  }

  /* Optimize images for mobile */
  img {
    max-width: 100%;
    height: auto;
    content-visibility: auto;
  }

  /* Smooth scrolling for mobile */
  html {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  /* Disable hover effects on touch devices */
  @media (hover: none) {
    .hover-effect:hover {
      transform: none;
    }
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .icon {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Dark mode support for mobile */
@media (prefers-color-scheme: dark) {
  .mobile-card {
    background-color: #1f2937;
    color: white;
  }
}
```

---

## 📊 **Step 10: Mobile Analytics Hook**

**Crea file:** `src/hooks/useMobileAnalytics.js`

```javascript
import { useEffect, useCallback } from 'react';
import { useMobileDetection } from './useMobileDetection';

export const useMobileAnalytics = () => {
  const { isMobile, screenSize } = useMobileDetection();

  const trackMobileEvent = useCallback((eventName, properties = {}) => {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      device: {
        isMobile,
        screenSize: `${screenSize.width}x${screenSize.height}`,
        userAgent: navigator.userAgent,
        connection: navigator.connection?.effectiveType || 'unknown'
      },
      ...properties
    };

    // Store in localStorage for basic analytics
    const events = JSON.parse(localStorage.getItem('mobileAnalytics') || '[]');
    events.push(event);

    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }

    localStorage.setItem('mobileAnalytics', JSON.stringify(events));
    console.log('Mobile Analytics:', event);
  }, [isMobile, screenSize]);

  const trackScreenView = useCallback((screenName) => {
    trackMobileEvent('screen_view', { screen_name: screenName });
  }, [trackMobileEvent]);

  const trackUserInteraction = useCallback((action, target) => {
    trackMobileEvent('user_interaction', { action, target });
  }, [trackMobileEvent]);

  const trackPerformance = useCallback((metric, value) => {
    trackMobileEvent('performance', { metric, value });
  }, [trackMobileEvent]);

  return {
    trackScreenView,
    trackUserInteraction,
    trackPerformance,
    trackMobileEvent
  };
};
```

---

## ✅ **Step 11: Testing Mobile Checklist**

**Test checklist da eseguire:**

```bash
# 1. Test responsive design
- Apri su device mobile reale
- Testa diverse orientazioni (portrait/landscape)
- Verifica zoom e pinch-to-zoom

# 2. Test performance
- Chrome DevTools → Lighthouse (Mobile)
- Network throttling (Slow 3G)
- CPU throttling (4x slowdown)

# 3. Test PWA features
- Installazione su homescreen
- Modalità offline
- Push notifications (se implementate)

# 4. Test touch interactions
- Swipe gestures
- Tap targets size
- Double-tap zoom
- Long press

# 5. Test cross-browser
- Safari iOS
- Chrome Android
- Samsung Internet
```

**Comandi di test:**
```bash
# Build con PWA
npm run build

# Test PWA
npm run preview

# Performance audit
npx lighthouse http://localhost:4173 --view --chrome-flags="--headless"
```

---

## 📈 **Metriche di Successo Fase 2**

- **Lighthouse Mobile Score**: > 90
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Touch Target Size**: > 44px
- **Tap Responsiveness**: < 100ms
- **Offline Functionality**: Critical features available
- **PWA Installability**: 100%

---

## 🔄 **Step 12: Aggiornamento Documentazione**

**Aggiorna ROADMAP.md:**
```markdown
## ✅ FASE 2 COMPLETATA - Mobile Optimization
**Data completamento:** [INSERISCI DATA]
**Tempo impiegato:** [INSERISCI ORE]

### Implementato:
- [x] Vite PWA plugin configurato
- [x] Mobile menu con swipe gestures
- [x] Responsive design mobile-first
- [x] Performance optimization
- [x] Touch interactions
- [x] Mobile analytics tracking
- [x] PWA manifest e service worker
```

---

**Prossima Fase:** Esegui `PHASE3_TEAM_NOTES.md` quando FASE 2 è completata.