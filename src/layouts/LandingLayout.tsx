import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LandingLayoutProps {
  children?: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  const mainRef = useRef<HTMLElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null); 
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (footerRef.current) {
      const currentFooterHeight = footerRef.current.offsetHeight;
      setFooterHeight(currentFooterHeight);
     
    }
  }, []);

  useEffect(() => {
    if (!mainRef.current || !contentWrapperRef.current || footerHeight === 0)
      return;

    mainRef.current.style.paddingBottom = `${footerHeight}px`;
    
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: contentWrapperRef.current, 
        start: 'bottom bottom', 
        end: `bottom bottom-=1px`, 
        onUpdate: (self) => {
          let clipAmount = self.progress * footerHeight;
          if (self.progress > 0.99) {
            clipAmount = footerHeight;
          }
          gsap.set(mainRef.current, {
            clipPath: `inset(0 0 ${clipAmount}px 0)`,
          });
          
        },
       
      });
    }, mainRef); 

    return () => {
      if (mainRef.current) {
        mainRef.current.style.paddingBottom = '0px';
      }
      ctx.revert();
    };
  }, [footerHeight]);

  return (
    <div className="landing-layout bg-slate-50 w-screen min-h-screen flex flex-col">
      <Header />
      <main
        ref={mainRef}
        className="landing-content flex-1 pt-20 relative z-20 bg-slate-50"
        style={{ clipPath: 'inset(0 0 0px 0)' }}
      >
        <div ref={contentWrapperRef}>
          {' '}
          {children || <Outlet />}
        </div>
      </main>
      <Footer ref={footerRef} />
    </div>
  );
};

export default LandingLayout;
