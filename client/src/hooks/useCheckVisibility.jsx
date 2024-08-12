import { useState, useEffect, useMemo } from 'react';

const useCheckVisibility = (ref, initialMessage) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // viewport
        rootMargin: '0px', // no margin
        threshold: 0.5, // 50% of target visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Clean up the observer
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [initialMessage]);

  return isVisible;
};

export default useCheckVisibility;
