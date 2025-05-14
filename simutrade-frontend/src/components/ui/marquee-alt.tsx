import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeAltProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export const MarqueeAlt = ({
  children,
  direction = 'left',
  speed = 30,
  pauseOnHover = false,
  className,
}: MarqueeAltProps) => {
  // This class will be added to the root element if pauseOnHover is true
  const containerClassName = pauseOnHover ? 'marquee-container-for-hover' : '';

  return (
    <div
      className={cn('w-full overflow-hidden', className, containerClassName)}
    >
      <div className="flex">
        {/* First copy of elements */}
        <div
          className={cn(
            'flex shrink-0 items-center justify-around gap-4',
            direction === 'left'
              ? 'animate-marquee-left'
              : 'animate-marquee-right'
          )}
          style={{
            animationDuration: `${speed}s`,
            // animationPlayState removed from here
          }}
        >
          {React.Children.map(children, (child) => child)}
        </div>

        {/* Duplicate to create the seamless loop */}
        <div
          className={cn(
            'flex shrink-0 items-center justify-around gap-4',
            direction === 'left'
              ? 'animate-marquee-left'
              : 'animate-marquee-right'
          )}
          style={{
            animationDuration: `${speed}s`,
            // animationPlayState removed from here
          }}
        >
          {React.Children.map(children, (child) => child)}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%); /* Use percentages for robustness */
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }

        /* Apply pause on hover if the container class is present */
        .marquee-container-for-hover:hover .animate-marquee-left,
        .marquee-container-for-hover:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
