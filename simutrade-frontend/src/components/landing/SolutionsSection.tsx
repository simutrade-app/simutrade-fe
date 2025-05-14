import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LuMessageSquareText,
  LuMapPin,
  LuChartColumnIncreasing,
  LuFlaskConical,
  LuFile,
} from 'react-icons/lu';

gsap.registerPlugin(ScrollTrigger);


import bento1 from '../../assets/images/bento-1.png';
import bento2 from '../../assets/images/bento-2.png';
import bento3 from '../../assets/images/bento-3.png';
import bento4 from '../../assets/images/bento-4.png';
import bento5 from '../../assets/images/bento-5.png';

const SolutionsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const topCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bottomCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const addToTopCardsRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      topCardsRef.current[index] = el;
    }
  };

  const addToBottomCardsRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      bottomCardsRef.current[index] = el;
    }
  };

  const solutions = [
    {
      icon: <LuMessageSquareText className="text-[#E8FF54]" size={24} />,
      title: "Ask, Don't Search",
      description:
        'Get instant answers to export questions using AI-powered contextual reasoning.',
      image: bento1,
    },
    {
      icon: <LuMapPin className="text-[#E8FF54]" size={24} />,
      title: 'Simulate Trade Routes',
      description:
        'Visualize export paths on a world map with real-time route insights.',
      image: bento2,
    },
    {
      icon: <LuChartColumnIncreasing className="text-[#E8FF54]" size={24} />,
      title: 'Estimate Costs and Risks',
      description:
        'Calculate shipping costs, delivery time, and risk based on your input.',
      image: bento3,
    },
    {
      icon: <LuFlaskConical className="text-[#E8FF54]" size={24} />,
      title: 'Test What-If Scenarios',
      description:
        'Simulate port delays, tariff changes, and trade disruptions in one click.',
      image: bento4,
    },
    {
      icon: <LuFile className="text-[#E8FF54]" size={24} />,
      title: 'Decode Export Regulations',
      description:
        'Look up HS codes and product rules automatically using AI assistance.',
      image: bento5,
    },
  ];

  // GSAP animations setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const headingElements = headerRef.current.querySelectorAll('h2, p');
        gsap.from(headingElements, {
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

      if (topCardsRef.current.length) {
        gsap.from(topCardsRef.current, {
          opacity: 0,
          y: 60,
          scale: 0.9,
          duration: 0.8,
          stagger: 0.3,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: topCardsRef.current[0],
            start: 'top 85%',
          },
        });
      }

      if (bottomCardsRef.current.length) {
        gsap.from(bottomCardsRef.current, {
          opacity: 0,
          y: 60,
          scale: 0.9,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: bottomCardsRef.current[0],
            start: 'top 85%',
          },
          delay: 0.3, 
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardEnter = (card: HTMLDivElement) => {
    gsap.to(card, {
      scale: 1.03,
      boxShadow: '0px 12px 25px rgba(0, 0, 0, 0.12)',
      duration: 0.3,
      ease: 'power2.out',
    });

    const icon = card.querySelector('.card-icon svg');
    if (icon) {
      gsap.to(icon, {
        color: '#EEFF77', 
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    const image = card.querySelector('.card-image');
    if (image) {
      gsap.to(image, {
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  const handleCardLeave = (card: HTMLDivElement) => {
    gsap.to(card, {
      scale: 1,
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      ease: 'power2.in',
    });

    const icon = card.querySelector('.card-icon svg');
    if (icon) {
      gsap.to(icon, {
        color: '#E8FF54', 
        duration: 0.3,
        ease: 'power2.in',
      });
    }

    const image = card.querySelector('.card-image');
    if (image) {
      gsap.to(image, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  };

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="text-center mb-12">
          <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
            SOLUTIONS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Powerful features to simplify your
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold">
            trade building experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top row - 2 cards */}
          {solutions.slice(0, 2).map((solution, index) => (
            <div
              key={index}
              ref={(el) => addToTopCardsRef(el, index)}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md p-6 text-left h-full flex flex-col"
              onMouseEnter={(e) => handleCardEnter(e.currentTarget)}
              onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
            >
              <div className="card-icon mb-4">{solution.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
              <p className="text-gray-600 mb-6">{solution.description}</p>
              <div className="flex-grow" />
              <div className="mt-auto h-44 md:h-72 flex items-center justify-center">
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="max-h-full w-auto object-contain card-image transform-origin-center"
                />
              </div>
            </div>
          ))}

          {/* Bottom row - 3 cards */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.slice(2, 5).map((solution, index) => (
              <div
                key={index + 2}
                ref={(el) => addToBottomCardsRef(el, index)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md p-6 text-left h-full flex flex-col"
                onMouseEnter={(e) => handleCardEnter(e.currentTarget)}
                onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
              >
                <div className="card-icon mb-4">{solution.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                <p className="text-gray-600 mb-6">{solution.description}</p>
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="mt-auto w-full h-auto object-contain card-image transform-origin-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
