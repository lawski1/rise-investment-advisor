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
      {/* Logo Icon - Simplified Rising Sun Design */}
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
          
          {/* Simplified Mountain Silhouette */}
          <path
            d="M 5 75 Q 25 60, 35 70 T 50 65 T 65 70 T 85 60 Q 95 75, 95 100 L 5 100 Z"
            fill="white"
            fillOpacity="0.95"
          />
          
          {/* Rising Sun - Prominent Half Circle */}
          <ellipse
            cx="50"
            cy="70"
            rx="20"
            ry="20"
            fill="url(#sunGradient)"
          />
          
          {/* Sun Rays - More Visible */}
          <g stroke="url(#sunGradient)" strokeWidth="3" strokeLinecap="round" opacity="0.8">
            <line x1="50" y1="45" x2="50" y2="35" />
            <line x1="68" y1="55" x2="78" y2="50" />
            <line x1="32" y1="55" x2="22" y2="50" />
            <line x1="60" y1="48" x2="68" y2="40" />
            <line x1="40" y1="48" x2="32" y2="40" />
            <line x1="65" y1="62" x2="75" y2="65" />
            <line x1="35" y1="62" x2="25" y2="65" />
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
