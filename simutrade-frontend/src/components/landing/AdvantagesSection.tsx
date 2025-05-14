import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MdOutlineInsights } from 'react-icons/md';
import { FaRegLightbulb } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import { HiArrowNarrowRight } from 'react-icons/hi';
import decideImage from '@/assets/images/decide.jpg';
import assistantImage from '@/assets/images/assistant.jpg';
import globeImage from '@/assets/images/globe.jpg';

gsap.registerPlugin(ScrollTrigger);

const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      title: 'Decide with Confidence',
      description:
        "Don't guess your next move — simulate it. Plan your export route, estimate cost and risk, and make informed decisions like a pro.",
      icon: <MdOutlineInsights size={78} className="text-primary" />,
      image: decideImage,
    },
    {
      title: 'Ask, Learn, Export',
      description:
        'Your virtual trade assistant is always ready. Get instant answers to export questions with AI trained on real trade data.',
      icon: <FaRegLightbulb size={68} className="text-primary" />,
      image: assistantImage,
    },
    {
      title: 'Go Global, Visually',
      description:
        'Explore real-world trade routes in an interactive map. Simulate logistics scenarios and understand what could go wrong — before it does.',
      icon: <BiWorld size={68} className="text-primary" />,
      highlight: true,
      image: globeImage,
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardImageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const cardOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outerCardRef = useRef<HTMLDivElement>(null);

  cardsRef.current = [];
  cardImageRefs.current = [];
  cardOverlayRefs.current = [];
  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current[index] = el;
    }
  };
  const addImageToRefs = (el: HTMLImageElement | null, index: number) => {
    if (el && !cardImageRefs.current.includes(el)) {
      cardImageRefs.current[index] = el;
    }
  };
  const addOverlayToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && !cardOverlayRefs.current.includes(el)) {
      cardOverlayRefs.current[index] = el;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ScrollTrigger Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      if (outerCardRef.current) {
        tl.from(outerCardRef.current, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      if (headerRef.current) {
        tl.from(
          headerRef.current.querySelectorAll('h2, p'),
          {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out',
          },
          '-=0.5'
        );
      }
      
      tl.from(
        cardsRef.current,
        {
          opacity: 0,
          y: 50,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);


  const handleMouseEnter = (index: number) => {
    const image = cardImageRefs.current[index];
    const overlay = cardOverlayRefs.current[index];
    const cardText = cardsRef.current[index]?.querySelectorAll('.card-text');
    const cardIcon =
      cardsRef.current[index]?.querySelector('.card-content svg'); 

    if (image && overlay) {
      gsap.to(image, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
      gsap.to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
    }
    if (cardText) {
      gsap.to(cardText, {
        color: '#ffffff',
        textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
    if (cardIcon) {
      gsap.to(cardIcon, {
        color: '#ffffff',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const image = cardImageRefs.current[index];
    const overlay = cardOverlayRefs.current[index];
    const cardText = cardsRef.current[index]?.querySelectorAll('.card-text');
    const cardIcon =
      cardsRef.current[index]?.querySelector('.card-content svg'); 

    if (image && overlay) {
      gsap.to(image, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
      gsap.to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
    }
    if (cardText) {
      gsap.to(cardText, {
        color: '',
        textShadow: 'none',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
    if (cardIcon) {
      gsap.to(cardIcon, {
        color: '', 
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <section
      id="advantages"
      ref={sectionRef}
      className="relative py-12 px-5 bg-secondary/70 overflow-hidden"
    >
      <div className="container mx-auto max-w-none">
        <div
          ref={outerCardRef}
          className="bg-white rounded-3xl p-6 md:p-12 shadow-xl min-h-[850px]"
        >
          <div className="mb-20" ref={headerRef}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-4">
              <div className="md:w-5/12">
                <p className="text-green-700 font-medium mb-3 text-left">
                  VALUES
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-left">
                  Built to
                  <br />
                  Empower Exporters
                </h2>
              </div>
              <div className="md:w-[600px]">
                <p className="text-gray-600 text-lg text-left">
                  Simutrade provides exporters with powerful tools to simulate,
                  plan, and execute international trade with confidence and
                  clarity.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div
                ref={(el) => addToRefs(el, index)}
                key={advantage.title}
                className={`relative border border-gray-200 rounded-lg ${advantage.highlight ? 'rounded-tr-[200px]' : ''} p-8 flex flex-col min-h-[580px] overflow-hidden ${
                  advantage.highlight ? 'bg-amber-50' : 'bg-white'
                }`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <img
                  ref={(el) => addImageToRefs(el, index)}
                  src={advantage.image}
                  alt={`${advantage.title} background`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none z-0"
                />
                <div
                  ref={(el) => addOverlayToRefs(el, index)}
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 pointer-events-none z-10"
                />
                <div className="relative z-20 flex flex-col flex-grow">
                  <div className="mb-24 card-content">{advantage.icon}</div>
                  <h3 className="text-2xl font-bold mb-5 text-gray-800 text-left card-content card-text">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-16 flex-grow text-left mr-32 card-content card-text">
                    {advantage.description}
                  </p>
                  <div className="mt-auto self-start card-content">
                    <button
                      className={`p-5 rounded-full ${advantage.highlight ? 'bg-green-800 text-white' : 'bg-gray-100'}`}
                      aria-label={`Learn more about ${advantage.title}`}
                    >
                      <HiArrowNarrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
