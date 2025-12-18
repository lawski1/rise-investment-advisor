'use client';

import { useEffect, useState, RefObject } from 'react';

export function useScrollFade<T extends HTMLElement>(
  ref: RefObject<T>,
  threshold: number = 0.1
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if element is already in view on mount
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInView) {
        setIsVisible(true);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Optional: fade out when scrolling past
          // setIsVisible(false);
        }
      },
      { 
        threshold,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold]);

  return isVisible;
}


