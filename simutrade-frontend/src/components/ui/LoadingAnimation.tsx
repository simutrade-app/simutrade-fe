import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const LoadingAnimation: React.FC = () => {
  const iconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        y: -25,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: 'sine.inOut',
      });
    }
  }, []);

  return (
    <div className="flex justify-center">
      <img
        ref={iconRef}
        src="/icon-nograd.svg"
        alt="Loading..."
        className="h-20 w-20"
      />
    </div>
  );
};

export default LoadingAnimation;
