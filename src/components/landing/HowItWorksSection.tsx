import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaPlay, FaTimes } from 'react-icons/fa';
import { MdFullscreen } from 'react-icons/md';
import placeholderImage from '../../assets/images/placeholder-temp.jpg';

gsap.registerPlugin(ScrollTrigger);

const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statItemsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [statValues, setStatValues] = useState([0, 0, 0, 0]);
  const finalStats = [120, 300, 80, 18];

  const addStatItemRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      statItemsRefs.current[index] = el;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('h2, p');
        gsap.from(elements, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });
      }

      if (videoContainerRef.current) {
        gsap.from(videoContainerRef.current, {
          opacity: 0,
          y: 60,
          scale: 0.95,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.5,
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: 'top 80%',
          },
        });
      }

      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll('.stat-item');
        gsap.from(statItems, {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            onEnter: () => {
              gsap.to(statValues, {
                duration: 2.5,
                ease: 'power2.out',
                0: finalStats[0],
                1: finalStats[1],
                2: finalStats[2],
                3: finalStats[3],
                onUpdate: () => {
                  setStatValues([
                    Math.round(statValues[0]),
                    Math.round(statValues[1]),
                    Math.round(statValues[2]),
                    Math.round(statValues[3]),
                  ]);
                },
              });
            },
          },
        });
      }

      statItemsRefs.current.forEach((card, index) => {
        if (card) {
          // Create hover animations
          card.addEventListener('mouseenter', () =>
            handleStatCardHover(index, true)
          );
          card.addEventListener('mouseleave', () =>
            handleStatCardHover(index, false)
          );
        }
      });
    }, sectionRef);

    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 1000);

    return () => {
      ctx.revert();
      clearTimeout(timer);

      statItemsRefs.current.forEach((card, index) => {
        if (card) {
          card.removeEventListener('mouseenter', () =>
            handleStatCardHover(index, true)
          );
          card.removeEventListener('mouseleave', () =>
            handleStatCardHover(index, false)
          );
        }
      });
    };
  }, []);

  const handleStatCardHover = (index: number, isEnter: boolean) => {
    const card = statItemsRefs.current[index];
    if (!card) return;

    if (isEnter) {
      gsap.to(card, {
        scale: 1.05,
        y: -10,
        rotation: 0,
        boxShadow: '0px 20px 25px rgba(0, 0, 0, 0.15)',
        zIndex: 10,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      const rotations = [-3, 3, -2, 2];
      gsap.to(card, {
        scale: 1,
        y: 0,
        rotation: rotations[index],
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 4 - index,  
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsExpanded(true);


    if (modalRef.current && videoContainerRef.current) {
      const rect = videoContainerRef.current.getBoundingClientRect();

      gsap.set(modalRef.current, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        opacity: 0,
        display: 'flex',
      });

      gsap.to(modalRef.current, {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 1,
        duration: 0.3,
        ease: 'power3.inOut',
      });
    }
  };

  const handleCloseExpand = () => {
    if (modalRef.current && videoContainerRef.current) {
      const rect = videoContainerRef.current.getBoundingClientRect();

      gsap.to(modalRef.current, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(modalRef.current, { display: 'none' });
          setIsExpanded(false);
        },
      });
    }
  };

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="pt-24 pb-12 overflow-hidden bg-background"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Content section with title on left, description on right */}
          <div ref={contentRef} className="mb-16">
            <div className="flex flex-col md:flex-row md:items-start md:gap-12">
              {/* Title on the left */}
              <div className="md:w-5/12 mb-6 md:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold text-[#004d40] text-left">
                  What You Can Do with Simutrade
                </h2>
              </div>

              {/* Description on the right - button removed */}
              <div className="md:w-7/12">
                <p className="text-lg text-gray-600 text-left">
                  Simutrade turns your export ideas into data-driven plans.
                  Simulate routes, estimate costs, and understand the real-world
                  risks before you ship — all from one simple dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Video container with larger corners */}
          <div
            ref={videoContainerRef}
            className="relative overflow-hidden cursor-pointer rounded-[40px] shadow-xl"
            onClick={handleVideoClick}
          >
            <div className="aspect-video relative overflow-hidden">
              {/* Lazy loading placeholder */}
              {!isVideoLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-10"></div>
              )}

              {/* Video element with poster */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-2xl"
                poster={placeholderImage}
                preload="metadata"
                onLoadedData={handleVideoLoaded}
              >
                <source
                  src="https://cdn.simutrade.app/sample.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Play button overlay - show only when not playing */}
              {!isPlaying && (
                <div className="absolute inset-0 flex justify-center items-center z-20 bg-black/10">
                  <div className="rounded-full bg-white p-5 shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <FaPlay className="text-[#004d40] text-xl" />
                  </div>
                </div>
              )}

              {/* Expand button - show when playing but not expanded */}
              {isPlaying && !isExpanded && (
                <button
                  onClick={handleExpandClick}
                  className="absolute bottom-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition duration-300"
                  aria-label="Expand video"
                >
                  <MdFullscreen size={24} />
                </button>
              )}
            </div>
          </div>

          {/* Stats section with overlapping card style - improved */}
          <div className="mt-24 mb-16 relative overflow-visible">
            <div
              ref={statsRef}
              className="flex flex-nowrap justify-center px-4 max-w-6xl mx-auto"
              style={{ marginLeft: '40px' }} // Offset to allow proper overlap
            >
              {/* First stat - overlapping card */}
              <div
                ref={(el) => addStatItemRef(el, 0)}
                className="stat-item bg-white p-8 rounded-3xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                style={{
                  width: '280px',
                  zIndex: 4,
                  marginRight: '-30px',
                }}
              >
                <div className="relative text-center">
                  <p className="text-lg font-medium mb-1">up to</p>
                  <div className="relative inline-block">
                    <h3 className="text-7xl font-bold inline-flex items-start">
                      120
                      <span className="text-3xl mt-2">+</span>
                    </h3>
                    {/* Secondary highlight marker - positioned relative to the number */}
                    <div
                      className="absolute h-[10px] bg-secondary/30 w-full left-0 -z-10"
                      style={{ bottom: '8px', transform: 'rotate(-1deg)' }}
                    ></div>
                  </div>
                  <p className="text-lg font-semibold mt-2">
                    Export Simulations Completed
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Early users are testing real trade routes before they ship.
                  </p>

                  {/* Secondary text annotation - Simutrade relevant */}
                  <p className="text-lime-400 font-handwritten text- mt-4">
                    ROUTE OPTIMIZATION RESULTS
                  </p>
                </div>
              </div>

              {/* Second stat - overlapping card */}
              <div
                ref={(el) => addStatItemRef(el, 1)}
                className="stat-item bg-white p-8 rounded-3xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                style={{
                  width: '280px',
                  zIndex: 3,
                  marginRight: '-30px',
                }}
              >
                <div className="relative text-center">
                  <div className="relative inline-block">
                    <h3 className="text-7xl font-bold inline-flex items-start">
                      +300
                      <span className="text-3xl mt-2">+</span>
                    </h3>
                    {/* Secondary highlight marker */}
                    <div
                      className="absolute h-[10px] bg-secondary/30 w-[80%] left-[10%] -z-10"
                      style={{ bottom: '8px', transform: 'rotate(-1deg)' }}
                    ></div>
                  </div>
                  <p className="text-lg font-semibold mt-2">
                    Trade Questions Answered by AI
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Helping users learn and act faster — no consultant needed.
                  </p>

                  {/* Secondary text annotation - Simutrade relevant */}
                  <p className="text-lime-400 font-handwritten text-base mt-4">
                    AI ADVICE EFFICIENCY
                  </p>
                </div>
              </div>

              {/* Third stat - overlapping card */}
              <div
                ref={(el) => addStatItemRef(el, 2)}
                className="stat-item bg-white p-8 rounded-3xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                style={{
                  width: '280px',
                  zIndex: 2,
                  marginRight: '-30px',
                }}
              >
                <div className="relative text-center">
                  <div className="relative inline-block">
                    <h3 className="text-7xl font-bold inline-flex items-start">
                      +80
                      <span className="text-3xl mt-2">+</span>
                    </h3>
                    {/* Secondary highlight marker */}
                    <div
                      className="absolute h-[10px] bg-secondary/30 w-[70%] left-[15%] -z-10"
                      style={{ bottom: '8px', transform: 'rotate(-1deg)' }}
                    ></div>
                  </div>
                  <p className="text-lg font-semibold mt-2">Users Onboarded</p>
                  <p className="text-sm text-gray-600 mt-1">
                    SMEs and students already planning smarter with Simutrade.
                  </p>

                  {/* Secondary text annotation - Simutrade relevant */}
                  <p className="text-lime-400 font-handwritten text- mt-4">
                    GROWING COMMUNITY
                  </p>
                </div>
              </div>

              {/* Fourth stat - overlapping card */}
              <div
                ref={(el) => addStatItemRef(el, 3)}
                className="stat-item bg-white p-8 rounded-3xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300"
                style={{
                  width: '280px',
                  zIndex: 1,
                }}
              >
                <div className="relative text-center">
                  <div className="relative inline-block">
                    <h3 className="text-7xl font-bold">18 </h3>
                    {/* Original lines on the right side */}
                    <div
                      className="absolute w-8 h-1 bg-secondary transform rotate-[70deg]"
                      style={{ top: '-20%', right: '55px' }}
                    ></div>
                    <div
                      className="absolute w-8 h-1 bg-secondary transform rotate-[30deg]"
                      style={{ top: '10%', right: '85px' }}
                    ></div>
                    <div
                      className="absolute w-8 h-1 bg-secondary transform rotate-[15deg]"
                      style={{ top: '60%', right: '85px' }}
                    ></div>

                    {/* Mirrored lines on the left side */}
                    <div
                      className="absolute w-8 h-1 bg-secondary transform rotate-[-70deg]"
                      style={{ top: '-20%', left: '55px' }}
                    ></div>
                    <div
                      className="absolute w-8 h-1 bg-secondary transform rotate-[-30deg]"
                      style={{ top: '10%', left: '85px' }}
                    ></div>
                    <div
                      className="absolute w-8 h-1 bg-secondary transform rotate-[-15deg]"
                      style={{ top: '60%', left: '85px' }}
                    ></div>
                  </div>
                  <p className="text-lg font-semibold mt-2">
                    Countries Simulated
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    From Southeast Asia to Europe, trade knows no borders.
                  </p>

                  {/* Added secondary text annotation for countries simulated */}
                  <p className="text-lime-400 font-handwritten text- mt-4">
                    GLOBAL TRADE NETWORK
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded video modal */}
          <div
            ref={modalRef}
            className="fixed z-50 bg-black/90 justify-center items-center hidden"
            style={{ top: 0, left: 0, width: '100%', height: '100%' }}
            onClick={handleCloseExpand}
          >
            <button
              onClick={handleCloseExpand}
              className="absolute top-4 right-4 z-20 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition duration-300"
              aria-label="Close expanded video"
            >
              <FaTimes size={24} />
            </button>

            <div
              className="w-[90vw] max-w-5xl mx-auto p-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {isExpanded && videoRef.current && (
                <div className="shadow-2xl rounded-2xl overflow-hidden">
                  <video
                    className="w-full h-full object-contain rounded-2xl"
                    style={{ aspectRatio: '16/9' }}
                    autoPlay
                    controls
                    src="https://cdn.simutrade.app/sample.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
