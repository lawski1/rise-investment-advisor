'use client';

import { useRef, ReactNode } from 'react';
import { useScrollFade } from '@/hooks/useScrollFade';

interface FadeWrapperProps {
  children: ReactNode;
  delay?: number;
}

export default function FadeWrapper({ children, delay = 0 }: FadeWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useScrollFade(ref, 0.1);

  return (
    <div
      ref={ref}
      className={`fade-on-scroll transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ 
        transitionDelay: `${delay}s`,
        // Ensure content is still in document flow even when invisible
        visibility: isVisible ? 'visible' : 'hidden',
        // Prevent layout shift
        minHeight: isVisible ? 'auto' : '1px'
      }}
    >
      {children}
    </div>
  );
}


