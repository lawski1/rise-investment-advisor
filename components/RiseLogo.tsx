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

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - New Design: Rising Sun with Mountains */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="riseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          
          {/* Background Circle */}
          <circle cx="50" cy="50" r="45" fill="url(#riseGradient)" />
          
          {/* Mountain Range - Bottom */}
          <path
            d="M 10 70 L 30 50 L 50 60 L 70 45 L 90 70 L 90 100 L 10 100 Z"
            fill="white"
            fillOpacity="0.9"
          />
          
          {/* Second Mountain Layer - More Depth */}
          <path
            d="M 15 75 L 35 55 L 55 65 L 75 50 L 85 75 L 85 100 L 15 100 Z"
            fill="white"
            fillOpacity="0.7"
          />
          
          {/* Rising Sun - Half Circle at Horizon */}
          <circle
            cx="50"
            cy="65"
            r="18"
            fill="url(#sunGradient)"
          />
          
          {/* Sun Rays - Subtle */}
          <g opacity="0.6">
            <line x1="50" y1="40" x2="50" y2="30" stroke="url(#sunGradient)" strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1="50" x2="75" y2="50" stroke="url(#sunGradient)" strokeWidth="2" strokeLinecap="round" />
            <line x1="35" y1="50" x2="25" y2="50" stroke="url(#sunGradient)" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="42" x2="65" y2="35" stroke="url(#sunGradient)" strokeWidth="2" strokeLinecap="round" />
            <line x1="42" y1="42" x2="35" y2="35" stroke="url(#sunGradient)" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-white ${textSizes[size]} leading-tight`}>
            Rise
          </span>
          <span className="text-xs text-blue-100 font-medium leading-tight">
            Investment Advisor
          </span>
        </div>
      )}
    </div>
  );
}
