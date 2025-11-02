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
  const { isMobile, isSmallMobile } = useMobileDetection();
  const [activeItem, setActiveItem] = useState(null);

  // Touch gestures per swipe-to-close
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures(
    null, // left
    onClose, // right - swipe to close
    null, // up
    null  // down
  );

  // Solo le props DOM-safe
  const swipeHandlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };

  const menuItems = [
    {
      id: 'menu',
      label: 'Menu Principale',
      icon: <Home className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-500',
      description: 'Torna al menu principale'
    },
    {
      id: 'library',
      label: 'I Miei Build',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Team salvati e creati',
      badge: savedBuildsCount
    },
    {
      id: 'collection',
      label: 'La Mia Collezione',
      icon: <Archive className="w-6 h-6" />,
      color: 'from-teal-500 to-cyan-500',
      description: 'Prodotti posseduti'
    },
    {
      id: 'statistics',
      label: 'Statistiche',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-rose-500 to-pink-500',
      description: 'Dashboard analytics'
    },
    {
      id: 'database',
      label: 'Gestione Database',
      icon: <Package className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Import/Export database'
    },
    {
      id: 'rating',
      label: 'Rating Database',
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      description: 'Valuta componenti'
    }
  ];

  const handleMenuItemClick = (item) => {
    setActiveItem(item.id);

    // Haptic feedback (if available)
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setTimeout(() => {
      // Map menu items to actual view states
      const viewMapping = {
        'menu': null,
        'library': 'library',
        'collection': 'collection',
        'statistics': 'statistics',
        'database': 'database',
        'rating': 'rating'
      };

      setCurrentView(viewMapping[item.id]);
      onClose();
      setActiveItem(null);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white z-50
          transform transition-transform duration-300 ease-out
          shadow-2xl
          ${isSmallMobile ? 'w-72' : 'w-80'}
          max-w-[90vw]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        {...swipeHandlers}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-white rounded-full"></div>
            <div className="absolute top-8 left-8 w-4 h-4 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
                aria-label="Chiudi menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-white text-lg font-medium">Beyblade X Builder</p>
              <p className="text-white/80 text-sm">Crea e gestisci team personalizzati</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {menuItems.map((item) => (
            <MobileOptimizedCard
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              className={`
                cursor-pointer transition-all duration-200
                ${activeItem === item.id ? 'ring-2 ring-blue-500 scale-105' : ''}
                ${currentView === item.id ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50 border-2 border-transparent'}
              `}
              compact={isSmallMobile}
              elevation="small"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`
                    w-12 h-12 rounded-xl bg-gradient-to-r ${item.color}
                    flex items-center justify-center text-white
                    shadow-md
                    ${isSmallMobile ? 'w-10 h-10' : ''}
                  `}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.label}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {item.badge && (
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold min-w-[20px] text-center">
                    {item.badge}
                  </div>
                )}
              </div>
            </MobileOptimizedCard>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-500 font-medium">v3.0.0 • PWA Optimized</p>
            <p className="text-xs text-gray-400">
              {isMobile ? '← Swipe to close' : 'Click outside to close'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;