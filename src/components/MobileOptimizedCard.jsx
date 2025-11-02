import React from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';

const MobileOptimizedCard = ({
  children,
  title,
  subtitle,
  icon,
  onClick,
  className = '',
  mobileFullWidth = true,
  compact = false,
  elevation = 'medium',
  backgroundColor = 'white',
  disabled = false
}) => {
  const { isMobile, isTablet, isSmallMobile } = useMobileDetection();

  // Base responsive classes
  const responsiveClasses = `
    ${mobileFullWidth && isMobile ? 'w-full' : ''}
    ${compact ? (isMobile ? 'p-3' : 'p-4') : (isMobile ? 'p-4' : 'p-6')}
    ${isSmallMobile && !compact ? 'p-3' : ''}
  `;

  // Elevation classes
  const elevationClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-lg',
    large: 'shadow-xl',
    xl: 'shadow-2xl'
  }[elevation];

  // Background color classes
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-gray-800',
    primary: 'bg-blue-50',
    secondary: 'bg-purple-50'
  }[backgroundColor];

  // Base classes
  const baseClasses = `
    ${backgroundClasses} rounded-xl ${elevationClasses}
    transform transition-all duration-200
    ${!disabled ? 'hover:shadow-xl hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}
    ${onClick && !disabled ? 'cursor-pointer' : ''}
    ${responsiveClasses}
    ${className}
  `;

  // Touch feedback handlers
  const handleTouchStart = (e) => {
    if (!disabled && onClick) {
      e.currentTarget.style.transform = 'scale(0.98)';
    }
  };

  const handleTouchEnd = (e) => {
    if (!disabled && onClick) {
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  return (
    <div
      className={baseClasses}
      onClick={!disabled ? onClick : undefined}
      role={onClick && !disabled ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Header with title and icon */}
      {title && (
        <div className={`flex items-center gap-3 ${children ? 'mb-4' : ''}`}>
          {icon && (
            <div className={`
              flex items-center justify-center
              ${isSmallMobile ? 'w-8 h-8' : isMobile ? 'w-10 h-10' : 'w-12 h-12'}
              ${compact ? 'w-8 h-8' : ''}
            `}>
              <div className={`
                w-full h-full rounded-lg
                ${compact ? 'text-sm' : isMobile ? 'text-base' : 'text-lg'}
                flex items-center justify-center
              `}>
                {icon}
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-bold text-gray-900 truncate
              ${compact ? 'text-sm' : isMobile ? 'text-lg' : 'text-xl'}
            `}>
              {title}
            </h3>
            {subtitle && (
              <p className={`
                text-gray-600 truncate
                ${compact ? 'text-xs' : 'text-sm'}
              `}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {children && (
        <div className={compact ? '' : ''}>
          {children}
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedCard;