import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FaRocket,
  FaSearch,
  FaMapMarkedAlt,
  FaCheck,
  FaDollarSign,
} from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const cta1Ref = useRef<HTMLButtonElement>(null);
  const cta2Ref = useRef<HTMLButtonElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const geminiLogoRef = useRef<HTMLDivElement>(null);
  const userAvatarsRef = useRef<HTMLDivElement>(null);
  const rotatingWordRef = useRef<HTMLSpanElement>(null);

  const analysisCardRef = useRef<HTMLDivElement>(null);
  const scenarioCardRef = useRef<HTMLDivElement>(null);
  const metricsCardRef = useRef<HTMLDivElement>(null);
  const portImageRef = useRef<HTMLDivElement>(null);

  const [rotatingWords] = useState([
    'Smarter.',
    'Faster.',
    'Easier.',
    'Simpler.',
  ]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const [avatars] = useState([
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://randomuser.me/api/portraits/women/90.jpg',
  ]);

  useEffect(() => {
    if (rotatingWordRef.current) {
      const wordRotationInterval = setInterval(() => {
        gsap.to(rotatingWordRef.current, {
          y: -40,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            setCurrentWordIndex(
              (prevIndex) => (prevIndex + 1) % rotatingWords.length
            );
            gsap.fromTo(
              rotatingWordRef.current,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
          },
        });
      }, 3000);

      return () => clearInterval(wordRotationInterval);
    }
  }, [rotatingWords]);

  useEffect(() => {
    const initialVisibleElements = [
      analysisCardRef.current,
      scenarioCardRef.current,
      metricsCardRef.current,
      portImageRef.current,
    ].filter(Boolean);

    initialVisibleElements.forEach((element) => {
      if (element) {
        gsap.set(element, { autoAlpha: 1 });
      }
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (leftColRef.current) {
      tl.fromTo(
        [badgeRef.current, headlineRef.current, subheadlineRef.current],
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.2 }
      ).fromTo(
        [cta1Ref.current, cta2Ref.current],
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.2 },
        '-=0.4'
      );

      const checklistItems =
        checklistRef.current?.querySelectorAll('.checklist-item');
      if (checklistItems && checklistItems.length > 0) {
        tl.fromTo(
          checklistItems,
          { autoAlpha: 0, x: -20 },
          { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.1 },
          '-=0.3'
        );
      }

      if (geminiLogoRef.current) {
        tl.fromTo(
          geminiLogoRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5 },
          '-=0.2'
        );
      }

      if (userAvatarsRef.current) {
        tl.fromTo(
          userAvatarsRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          '-=0.1'
        );
      }
    }

    if (portImageRef.current) {
      tl.fromTo(
        portImageRef.current,
        { scale: 1.05, autoAlpha: 0.8 },
        { scale: 1, autoAlpha: 1, duration: 1.5, ease: 'power2.out' },
        0.3
      );

      gsap.to(portImageRef.current, {
        y: '-8',
        x: '3',
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5,
      });
    }

    const cards = [
      analysisCardRef.current,
      scenarioCardRef.current,
      metricsCardRef.current,
    ].filter(Boolean);

    cards.forEach((card) => {
      if (card) {
        gsap.killTweensOf(card);
      }
    });

    const cardsTl = gsap.timeline({ defaults: { ease: 'back.out(1.2)' } });

    if (analysisCardRef.current) {
      cardsTl.fromTo(
        analysisCardRef.current,
        {
          autoAlpha: 0,
          scale: 0.9,
          y: 25,
          rotation: -1,
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          rotation: 0,
          duration: 0.9,
          ease: 'back.out(1.7)',
        },
        0.5
      );

      gsap.to(analysisCardRef.current, {
        y: '-6',
        x: '4',
        rotation: 1.2,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.4,
      });
    }

    if (scenarioCardRef.current) {
      cardsTl.fromTo(
        scenarioCardRef.current,
        {
          autoAlpha: 0,
          scale: 0.9,
          y: 25,
          rotation: 1,
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
        },
        0.7
      );

      gsap.to(scenarioCardRef.current, {
        y: '-7',
        x: '-3',
        rotation: -1.5,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8,
      });
    }

    if (metricsCardRef.current) {
      cardsTl.fromTo(
        metricsCardRef.current,
        {
          autoAlpha: 0,
          scale: 0.9,
          y: 25,
          rotation: -0.5,
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          rotation: 0,
          duration: 0.7,
        },
        0.9
      );

      gsap.to(metricsCardRef.current, {
        y: '-5',
        x: '2',
        rotation: 1,
        duration: 5.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.2,
      });
    }

    cards.forEach((card, idx) => {
      if (card) {
        const elements = card.querySelectorAll('.card-internal-animate');
        if (elements.length) {
          cardsTl.fromTo(
            elements,
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power2.out',
            },
            1.1 + idx * 0.15
          );
        }
      }
    });
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero-section py-12 min-h-screen flex overflow-hidden mt-10 relative"
    >
      {/* Radial gradient background with bottom color transition */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-hero-gradient" />
        {/* Bottom gradient to create smooth transition to #D9FF00 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#D9FF00]/25" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center justify-between">
          <div
            ref={leftColRef}
            className="text-center md:text-left md:w-1/2 lg:pr-8"
          >
            <div className="mb-8">
              <div
                ref={badgeRef}
                className="inline-flex items-center bg-secondary/40 text-primary dark:bg-secondary/20 dark:text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow-sm"
              >
                <span className="mr-1.5">🏆</span> #1 Export Simulation Platform
              </div>
              <h1
                ref={headlineRef}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary dark:text-white mb-6 leading-tight tracking-tight"
              >
                <span>Plan Your Trade</span>
                <span className="block mt-1">
                  Journey{' '}
                  <span className="inline-block bg-secondary/25 dark:bg-secondary/15 px-4 py-1 rounded-lg">
                    <span ref={rotatingWordRef} className="inline-block">
                      {rotatingWords[currentWordIndex]}
                    </span>
                  </span>
                </span>
              </h1>

              <p
                ref={subheadlineRef}
                className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl"
              >
                Visualize export routes, simulate logistics risks, and get
                instant answers with the power of Google Gemini.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                <Button
                  ref={cta1Ref}
                  size="lg"
                  className="bg-primary text-white [&:hover]:!bg-primary/90 shadow-lg transition-all duration-300 py-3 px-6"
                >
                  Simulate Now <FaRocket className="ml-2" />
                </Button>
                <Button
                  ref={cta2Ref}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary [&:hover]:!bg-primary/10 shadow-lg [&:hover]:shadow-xl focus:ring-primary/50 focus:ring-2 transition-all duration-300 py-3 px-6"
                >
                  Explore Features <FaSearch className="ml-2" />
                </Button>
              </div>
            </div>

            <div
              ref={checklistRef}
              className="flex flex-col sm:flex-row flex-wrap gap-y-2 gap-x-6 text-sm mb-5"
            >
              <div className="inline-flex items-center checklist-item">
                <FaCheck className="text-green-500 mr-2 h-3.5 w-3.5" />
                <span className="text-slate-700 dark:text-slate-300">
                  NO SETUP FEE
                </span>
              </div>
              <div className="inline-flex items-center checklist-item">
                <FaCheck className="text-green-500 mr-2 h-3.5 w-3.5" />
                <span className="text-slate-700 dark:text-slate-300">
                  FREE SIMULATIONS
                </span>
              </div>
            </div>

            <div
              ref={geminiLogoRef}
              className="flex flex-col items-center md:items-start mt-3 mb-6"
            >
              <span className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Powered by
              </span>
              <div className="flex items-center gap-4">
                <img
                  src="/images/google-logo.svg"
                  alt="Google Gemini"
                  className="h-9 filter grayscale opacity-80"
                />
                <img
                  src="/images/gemini-logo.svg"
                  alt="Google"
                  className="h-9 filter grayscale opacity-80"
                />
              </div>
            </div>

            <div
              ref={userAvatarsRef}
              className="flex items-center justify-center md:justify-start mt-12"
            >
              <div className="flex -space-x-3 mr-3">
                {avatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    className="border-2 border-white dark:border-gray-800 w-9 h-9 shadow-sm"
                  >
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {`U${index + 1}`}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-left max-w-[240px]">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  <span className="font-bold text-primary dark:text-secondary">
                    100+ products
                  </span>{' '}
                  shipped
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  with smarter planning using Simutrade
                </p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex items-start justify-center min-h-[600px]">
            <div className="relative w-[440px] h-[600px]">
              <div
                ref={portImageRef}
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src="/images/port2.jpg"
                  alt="Port"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
              </div>
              <div className="absolute bottom-12 -right-10 sm:-right-20 flex flex-col items-end gap-4 z-30">
                <Card
                  ref={analysisCardRef}
                  className="hero-card relative overflow-hidden shadow-xl rounded-2xl w-[220px] border-0 bg-secondary dark:bg-secondary group hover:shadow-2xl transition-all duration-300 p-0 pointer-events-auto opacity-100"
                  style={{ marginBottom: '8px' }}
                >
                  <div className="relative z-10 p-4">
                    <div className="flex justify-between items-center mb-3 card-internal-animate">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-secondary">
                          <FaDollarSign className="h-4 w-4" />
                        </div>
                        <span className="ml-2 font-semibold text-primary">
                          Your Profit
                        </span>
                      </div>
                      <span className="text-sm text-primary/80">/week</span>
                    </div>

                    <div className="card-internal-animate">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-primary">
                          $44.55K
                        </span>
                      </div>
                      <p className="text-sm text-primary/80 my-2">
                        Trading this month
                      </p>
                      <p className="text-sm text-primary/80 my-2">
                        Simutrade helps you simulate trade routes accurately
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 card-internal-animate">
                      <div className="flex items-baseline">
                        <span className="text-lg font-semibold text-primary">
                          $22.43K
                        </span>
                        <span className="ml-1 text-xs text-primary/80">
                          /week
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-primary text-white hover:bg-primary/90 text-xs px-3 py-1"
                      >
                        Trade
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card
                  ref={scenarioCardRef}
                  className="hero-card relative overflow-hidden shadow-xl rounded-2xl w-[220px] bg-[#005955] border-0 text-white group hover:shadow-2xl transition-all duration-300 p-0 flex flex-col justify-center pointer-events-auto opacity-100"
                  style={{ marginBottom: '8px' }}
                >
                  <div className="relative z-10 p-3">
                    <div className="flex justify-between items-center mb-2 card-internal-animate">
                      <span className="text-xs uppercase font-bold text-secondary">
                        SCENARIO SUMMARY
                      </span>
                      <FaMapMarkedAlt className="h-3 w-3 text-secondary" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between card-internal-animate">
                        <span className="text-xs text-white/80">
                          Popular Route:
                        </span>
                        <span className="text-xs font-medium text-white">
                          SBY → SIN
                        </span>
                      </div>

                      <div className="flex items-center justify-between card-internal-animate">
                        <span className="text-xs text-white/80">
                          Est. Time:
                        </span>
                        <span className="text-xs font-medium text-white flex items-center">
                          <FiClock className="mr-1 h-3 w-3" /> 5 Days
                        </span>
                      </div>

                      <div className="flex items-center justify-between card-internal-animate">
                        <span className="text-xs text-white/80">Price:</span>
                        <span className="text-xs font-medium text-white">
                          10,569.50 USD
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  ref={metricsCardRef}
                  className="hero-card relative overflow-hidden shadow-xl rounded-2xl w-[220px] bg-primary text-white border-0 group hover:shadow-2xl transition-all duration-300 p-0 flex flex-col justify-center pointer-events-auto opacity-100"
                >
                  <div className="relative z-10 p-3">
                    <div className="space-y-1 card-internal-animate">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/90">
                          Total Routes
                        </span>
                        <span className="text-xs font-medium">128</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/90">
                          Risk Alerts
                        </span>
                        <span className="text-xs font-medium text-secondary">
                          Low
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
