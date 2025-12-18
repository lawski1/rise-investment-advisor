'use client';

interface RiseLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function RiseLogo({ size = 'md', showText = true, className = '' }: RiseLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  // Generate unique IDs for gradients to avoid conflicts
  const logoId = `rise-logo-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Photographic Sunrise Design */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sky Gradient - Realistic Sunrise Colors */}
            <radialGradient id={`${logoId}-skyGradient`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity="1" />
              <stop offset="20%" stopColor="#f7931e" stopOpacity="1" />
              <stop offset="40%" stopColor="#ffd23f" stopOpacity="1" />
              <stop offset="60%" stopColor="#ffed4e" stopOpacity="1" />
              <stop offset="80%" stopColor="#4a90e2" stopOpacity="1" />
              <stop offset="100%" stopColor="#2c5aa0" stopOpacity="1" />
            </radialGradient>
            
            {/* Sun Gradient - Realistic Sun Colors */}
            <radialGradient id={`${logoId}-sunGradient`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff9e6" stopOpacity="1" />
              <stop offset="30%" stopColor="#ffd700" stopOpacity="1" />
              <stop offset="60%" stopColor="#ff8c00" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff6347" stopOpacity="0.9" />
            </radialGradient>
            
            {/* Sun Glow */}
            <radialGradient id={`${logoId}-sunGlow`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffd700" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
            </radialGradient>
            
            {/* Mountain Gradient */}
            <linearGradient id={`${logoId}-mountainGradient`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c3e50" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#34495e" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1a252f" stopOpacity="1" />
            </linearGradient>
            
            {/* Sun Reflection on Water */}
            <linearGradient id={`${logoId}-waterReflection`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ff8c00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2c5aa0" stopOpacity="0.1" />
            </linearGradient>
            
            {/* Cloud Gradient */}
            <radialGradient id={`${logoId}-cloudGradient`} cx="50%" cy="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e8e8e8" stopOpacity="0.7" />
            </radialGradient>
          </defs>
          
          {/* Sky Background */}
          <rect width="100" height="100" fill={`url(#${logoId}-skyGradient)`} />
          
          {/* Sun Glow Effect */}
          <ellipse
            cx="50"
            cy="65"
            rx="28"
            ry="28"
            fill={`url(#${logoId}-sunGlow)`}
            opacity="0.6"
          />
          
          {/* Main Sun */}
          <ellipse
            cx="50"
            cy="65"
            rx="18"
            ry="18"
            fill={`url(#${logoId}-sunGradient)`}
          />
          
          {/* Sun Core - Bright Center */}
          <ellipse
            cx="50"
            cy="65"
            rx="10"
            ry="10"
            fill="#fff9e6"
            opacity="0.9"
          />
          
          {/* Sun Rays - Photographic Style */}
          <g opacity="0.7">
            {/* Long Rays */}
            <line x1="50" y1="30" x2="50" y2="20" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="75" y1="50" x2="85" y2="45" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="25" y1="50" x2="15" y2="45" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="65" y1="35" x2="75" y2="25" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="35" y1="35" x2="25" y2="25" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="70" y1="60" x2="80" y2="70" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="30" y1="60" x2="20" y2="70" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Medium Rays */}
            <line x1="58" y1="42" x2="65" y2="35" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2" strokeLinecap="round" />
            <line x1="42" y1="42" x2="35" y2="35" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2" strokeLinecap="round" />
            <line x1="62" y1="52" x2="70" y2="50" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2" strokeLinecap="round" />
            <line x1="38" y1="52" x2="30" y2="50" stroke={`url(#${logoId}-sunGradient)`} strokeWidth="2" strokeLinecap="round" />
          </g>
          
          {/* Distant Mountains - Silhouette */}
          <path
            d="M 0 75 Q 15 65, 30 70 T 50 68 T 70 70 T 85 65 Q 100 75, 100 100 L 0 100 Z"
            fill={`url(#${logoId}-mountainGradient)`}
            opacity="0.95"
          />
          
          {/* Foreground Mountains */}
          <path
            d="M 5 80 Q 20 70, 35 75 T 50 72 T 65 75 T 80 70 Q 95 80, 95 100 L 5 100 Z"
            fill={`url(#${logoId}-mountainGradient)`}
            opacity="0.98"
          />
          
          {/* Water Reflection */}
          <ellipse
            cx="50"
            cy="85"
            rx="18"
            ry="8"
            fill={`url(#${logoId}-waterReflection)`}
            opacity="0.5"
          />
          
          {/* Subtle Clouds */}
          <ellipse cx="20" cy="25" rx="8" ry="5" fill={`url(#${logoId}-cloudGradient)`} opacity="0.6" />
          <ellipse cx="25" cy="25" rx="6" ry="4" fill={`url(#${logoId}-cloudGradient)`} opacity="0.6" />
          <ellipse cx="75" cy="30" rx="7" ry="4" fill={`url(#${logoId}-cloudGradient)`} opacity="0.5" />
          <ellipse cx="80" cy="30" rx="5" ry="3" fill={`url(#${logoId}-cloudGradient)`} opacity="0.5" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-white ${textSizes[size]} leading-tight drop-shadow-md`}>
            Rise
          </span>
          <span className="text-xs text-blue-100 font-medium leading-tight drop-shadow-sm">
            Investment Advisor
          </span>
        </div>
      )}
    </div>
  );
}
