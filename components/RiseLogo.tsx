'use client';

import { TrendingUp } from 'lucide-react';

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
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="riseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          
          {/* Main Circle */}
          <circle cx="50" cy="50" r="45" fill="url(#riseGradient)" />
          
          {/* Rising Arrow/Chart Line - Made thicker and more visible */}
          <path
            d="M 25 70 L 40 52 L 55 35 L 70 22"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Arrow Head - Larger and more prominent */}
          <path
            d="M 65 15 L 72 22 L 65 29"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="white"
          />
          
          {/* Larger dots representing data points for better visibility */}
          <circle cx="40" cy="52" r="4.5" fill="white" />
          <circle cx="55" cy="35" r="4.5" fill="white" />
          <circle cx="70" cy="22" r="4.5" fill="white" />
          
          {/* Additional glow/shadow effect for the line */}
          <path
            d="M 25 70 L 40 52 L 55 35 L 70 22"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
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

