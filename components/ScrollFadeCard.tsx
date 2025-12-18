'use client';

import { useRef } from 'react';
import { useScrollFade } from '@/hooks/useScrollFade';
import { Investment } from '@/lib/types';
import InvestmentCard from './InvestmentCard';

interface ScrollFadeCardProps {
  investment: Investment;
  index: number;
  onAddToComparison?: (investment: Investment) => void;
}

export default function ScrollFadeCard({ investment, index, onAddToComparison }: ScrollFadeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollFade(cardRef, 0.1);

  return (
    <div
      ref={cardRef}
      className={`fade-on-scroll transition-all duration-700 ease-out ${
        isVisible 
          ? 'fade-in opacity-100 translate-y-0 scale-100' 
          : 'fade-out opacity-0 translate-y-12 scale-95'
      }`}
      style={{ transitionDelay: `${Math.min(index * 0.05, 0.5)}s` }}
    >
      <InvestmentCard
        investment={investment}
        onAddToComparison={onAddToComparison}
      />
    </div>
  );
}

