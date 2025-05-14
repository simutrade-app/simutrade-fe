import React, { useEffect, useRef } from 'react';
import { IoChatbubble } from 'react-icons/io5';
import { FaQuoteRight } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection: React.FC = () => {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  const testimonials = [
    {
      name: 'Kenji Tanaka',
      username: '@ktanaka_jp',
      avatarUrl: 'https://i.pravatar.cc/40?u=@ktanaka_jp',
      content: `Simutrade helped me understand export logistics in a way no course ever could. It's like having a trade mentor in your pocket. The simulations are <strong class="text-primary font-bold">incredibly detailed</strong> and the AI assistance is top-notch for beginners like me trying to navigate complex international trade procedures. I highly recommend it!`,
    },
    {
      name: 'Siti Aminah',
      username: '@siti_id',
      avatarUrl: 'https://i.pravatar.cc/40?u=@siti_id',
      content: `As a small coffee exporter, I finally get clear cost estimates. <strong class="text-primary font-bold">Game-changer!</strong>`,
    },
    {
      name: 'Min-jun Kim',
      username: '@minjun_kr',
      avatarUrl: 'https://i.pravatar.cc/40?u=@minjun_kr',
      content: `Honestly, I never thought AI could help me plan my first shipment. Simutrade made it <strong class="text-primary font-bold">simple, fast</strong>, and actually kind of fun. The user interface is very intuitive, and I was able to generate a comprehensive plan in minutes.`,
    },
    {
      name: 'Priya Sharma',
      username: '@priya_ind',
      avatarUrl: 'https://i.pravatar.cc/40?u=@priya_ind',
      content: `No more guessing about trade rules. Simutrade's AI gave me <strong class="text-primary font-bold">quick answers</strong> about my product's HS code requirements. This saved me hours of research.`,
    },
    {
      name: 'Mei Lin',
      username: '@meilin_th',
      avatarUrl: 'https://i.pravatar.cc/40?u=@meilin_th',
      content: `The ability to simulate complex trade scenarios with Simutrade is <strong class="text-primary font-bold">transformative</strong> for our logistics planning. We can test different routes, carriers, and even anticipate potential regulatory hurdles before committing resources. It has given us unprecedented clarity and control over our international shipments across Southeast Asia.`,
    },
    {
      name: 'Liam Nguyen',
      username: '@liam_vn',
      avatarUrl: 'https://i.pravatar.cc/40?u=@liam_vn',
      content: `It's not just a tool — it's like having a logistics consultant 24/7. I use it for every new market I explore. The platform is robust and the support team is very responsive. Simutrade has become an <strong class="text-primary font-bold">indispensable</strong> part of our export operations, helping us to optimize routes and reduce costs significantly.`,
    },
    {
      name: 'Isabelle Santos',
      username: '@isa_ph',
      avatarUrl: 'https://i.pravatar.cc/40?u=@isa_ph',
      content: `The simulation map is super intuitive. I can literally 'see' how my shipments move, delays and all. <strong class="text-primary font-bold">Brilliant!</strong> It provides a visual understanding that is hard to get otherwise.`,
    },
    {
      name: 'Arjun Singh',
      username: '@arjun_sg',
      avatarUrl: 'https://i.pravatar.cc/40?u=@arjun_sg',
      content: `We used to rely on expensive consultants. Now, Simutrade helps my team simulate and compare routes <strong class="text-primary font-bold">instantly</strong>, saving us a significant amount of money and time. The AI-powered suggestions for optimization are particularly impressive.`,
    },
    {
      name: 'Chloe Chen',
      username: '@chloe_au',
      avatarUrl: 'https://i.pravatar.cc/40?u=@chloe_au',
      content: `As a student in international trade, this is exactly the tool I wish we had in class. It makes learning real and <strong class="text-primary font-bold">practical</strong>.`,
    },
    {
      name: 'Ravi Kumar',
      username: '@ravi_my',
      avatarUrl: 'https://i.pravatar.cc/40?u=@ravi_my',
      content: `What-If simulation is <strong class="text-primary font-bold">pure genius</strong>. I tested 3 scenarios in one go — no spreadsheets, no stress. This feature alone is worth the subscription. It has allowed us to make more informed decisions and mitigate risks effectively.`,
    },
    {
      name: 'Jia Li',
      username: '@jia_nz',
      avatarUrl: 'https://i.pravatar.cc/40?u=@jia_nz',
      content: `Simutrade is <strong class="text-primary font-bold">fantastic</strong> for visualizing the entire supply chain. Being able to simulate different scenarios helps us anticipate challenges in the APAC region effectively.`,
    },
    {
      name: 'Anya Petrova',
      username: '@anya_global',
      avatarUrl: 'https://i.pravatar.cc/40?u=@anya_global',
      content: `The cost breakdown feature is <strong class="text-primary font-bold">incredibly accurate</strong> for shipments globally. It simplifies our budgeting process immensely, regardless of the destination.`,
    },
  ];

  useEffect(() => {
    testimonialCardsRef.current = testimonialCardsRef.current.slice(
      0,
      testimonials.length
    );

    const cards = testimonialCardsRef.current.filter((card) => card !== null);
    const headingElement = headingRef.current;
    const badgeElement = badgeRef.current;
    const subtextElement = subtextRef.current;

    const animatedElements = [
      badgeElement,
      headingElement,
      subtextElement,
    ].filter(Boolean) as HTMLElement[];

    const listeners: Array<{
      card: HTMLDivElement;
      type: string;
      listener: () => void;
    }> = [];

    if (animatedElements.length > 0) {
      gsap.fromTo(
        animatedElements,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: animatedElements[0],
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    cards.forEach((card) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );

      const onMouseEnter = () =>
        gsap.to(card, { scale: 1.03, duration: 0.2, ease: 'power1.out' });
      const onMouseLeave = () =>
        gsap.to(card, { scale: 1, duration: 0.2, ease: 'power1.out' });

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mouseleave', onMouseLeave);
      listeners.push({ card, type: 'mouseenter', listener: onMouseEnter });
      listeners.push({ card, type: 'mouseleave', listener: onMouseLeave });
    });

    return () => {
      listeners.forEach(({ card, type, listener }) => {
        card.removeEventListener(type, listener);
      });
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          cards.some((card) => card === trigger.trigger) ||
          animatedElements.some((el) => el === trigger.trigger)
        ) {
          trigger.kill();
        }
      });
      cards.forEach((card) => {
        if (card) gsap.killTweensOf(card);
      });
      animatedElements.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [testimonials.length]);

  return (
    <section className="testimonials-section relative py-16 bg-accent text-white">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent backdrop-blur-sm z-0"></div>
      <div className="container mx-auto text-center px-4 relative z-10">
        <div
          ref={badgeRef}
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm mb-4"
        >
          <IoChatbubble className="w-4 h-4 text-white mr-2" />
          <span className="text-sm font-semibold text-white">Testimonials</span>
        </div>

        <h2
          ref={headingRef}
          className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-md"
        >
          Public Cheers for Us!
        </h2>

        <div className="max-w-2xl mx-auto">
          <p
            ref={subtextRef}
            className="text-lg text-white/90 mb-12 backdrop-blur-sm bg-black/10 py-2 px-4 rounded-lg inline-block shadow-inner"
          >
            Find out how our users are spreading the word!
          </p>
        </div>

        <div
          ref={testimonialsRef}
          className="columns-1 md:columns-2 lg:columns-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.username}
              ref={(el) => {
                testimonialCardsRef.current[index] = el;
              }}
              className="testimonial-card bg-white/90 backdrop-blur-sm text-gray-800 p-6 rounded-xl shadow-lg break-inside-avoid mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.username}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaQuoteRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              <p
                className="text-left text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: testimonial.content }}
              ></p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent backdrop-blur-sm z-0"></div>
    </section>
  );
};

export default TestimonialsSection;
