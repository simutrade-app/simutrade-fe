import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaCheckCircle } from 'react-icons/fa';
import { MdLocalOffer } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { MarqueeAlt } from '@/components/ui/marquee-alt';
import logo1 from '@/assets/images/logo/mock-1.svg';
import logo2 from '@/assets/images/logo/mock-2.svg';
import logo3 from '@/assets/images/logo/mock-3.svg';
import logo4 from '@/assets/images/logo/mock-4.svg';
import logo5 from '@/assets/images/logo/mock-5.svg';
import logo6 from '@/assets/images/logo/mock-6.svg';
import logo7 from '@/assets/images/logo/mock-7.svg';

gsap.registerPlugin(ScrollTrigger);

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  icon?: string;
  title: string;
  subtitle: string;
  features: PlanFeature[];
  price: string;
  priceSubtitle?: string;
  highlighted?: boolean;
  buttonText: string;
  buttonVariant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  themeColor?: string;
  badgeText?: string;
}

const plansData: PricingPlan[] = [
  {
    icon: '🟢',
    title: 'Starter',
    subtitle: 'Perfect for new exporters & students',
    features: [
      { text: 'Simulate up to 3 export routes/month', included: true },
      { text: 'Ask Gemini AI up to 100 questions/day', included: true },
      { text: 'HS code lookup for 2 products', included: true },
      { text: 'Access basic regulation database', included: true },
      { text: 'PDF report (limited export)', included: true },
      { text: 'Community support', included: true },
    ],
    price: '$0',
    priceSubtitle: '/mo',
    buttonText: 'Get Started',
    themeColor: 'green',
    badgeText: '🟩 Free during beta',
  },
  {
    icon: '🟠',
    title: 'Pro',
    subtitle: 'For growing businesses',
    features: [
      { text: 'Everything in Starter, plus:', included: true },
      { text: 'Unlimited route simulations', included: true },
      { text: 'Ask Gemini AI up to 500 questions/day', included: true },
      { text: 'Full HS code decoding', included: true },
      { text: 'Scenario comparison & save slots', included: true },
      { text: 'Export dashboard analytics', included: true },
      { text: 'Email support', included: true },
    ],
    price: '$19',
    priceSubtitle: '/mo',
    highlighted: true,
    buttonText: 'Get Started',
    themeColor: 'amber',
    badgeText: '🟧 Free during beta',
  },
  {
    icon: '🔵',
    title: 'Enterprise',
    subtitle: 'For teams and export consultants',
    features: [
      { text: 'Everything in Pro, plus:', included: true },
      { text: 'Unlimited Gemini AI usage', included: true },
      { text: 'Custom country/regulation packs', included: true },
      { text: 'Team workspaces (up to 5 users)', included: true },
      { text: 'Shared scenario library', included: true },
      { text: 'Priority support & onboarding', included: true },
      { text: 'API access (coming soon)', included: true },
    ],
    price: '$59',
    priceSubtitle: '/mo',
    buttonText: 'Get Started',
    themeColor: 'blue',
    badgeText: '🔵 Free during beta',
  },
];

const PricingSection: React.FC = () => {
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const addCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      cardsRef.current[index] = el;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const headerElements = headerRef.current.querySelectorAll(
          '.pricing-header-element'
        );
        gsap.fromTo(
          headerElements,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      if (cardsRef.current.length) {
        gsap.fromTo(
          cardsRef.current,
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: cardsRef.current[0],
              start: 'top 85%',
            },
          }
        );
      }

      cardsRef.current.forEach((card) => {
        if (!card) return;

        card.addEventListener('mouseenter', () => handleCardHover(card, true));
        card.addEventListener('mouseleave', () => handleCardHover(card, false));
      });
    });

    return () => {
      ctx.revert();
      cardsRef.current.forEach((card) => {
        if (!card) return;
        card.removeEventListener('mouseenter', () =>
          handleCardHover(card, true)
        );
        card.removeEventListener('mouseleave', () =>
          handleCardHover(card, false)
        );
      });
    };
  }, []);

  const handleCardHover = (card: HTMLDivElement, isEnter: boolean) => {
    const isHighlighted = card.classList.contains('highlighted-card');
    const features = card.querySelectorAll('.feature-item');
    const button = card.querySelector('button');
    const icon = card.querySelector('.card-icon');
    const badge = card.querySelector('.card-badge');

    if (isEnter) {
      gsap.to(card, {
        y: -10,
        scale: isHighlighted ? 1.05 : 1.03,
        boxShadow: isHighlighted
          ? '0px 20px 30px rgba(0, 0, 0, 0.12)'
          : '0px 15px 25px rgba(0, 0, 0, 0.08)',
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(features, {
        x: 3,
        duration: 0.4,
        stagger: 0.03,
        ease: 'power1.out',
      });

      if (button) {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      if (icon) {
        gsap.to(icon, {
          scale: 1.1,
          rotate: 5,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      if (badge) {
        gsap.to(badge, {
          scale: 1.05,
          y: -2,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    } else {
      gsap.to(card, {
        y: 0,
        scale: isHighlighted ? 1.05 : 1,
        boxShadow: isHighlighted
          ? '0px 10px 15px rgba(0, 0, 0, 0.1)'
          : '0px 2px 5px rgba(0, 0, 0, 0.05)',
        duration: 0.3,
        ease: 'power2.in',
      });

      gsap.to(features, {
        x: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: 'power1.in',
      });

      if (button) {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.in',
        });
      }

      if (icon) {
        gsap.to(icon, {
          scale: 1,
          rotate: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }

      if (badge) {
        gsap.to(badge, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 md:pt-20 md:pb-10 bg-background dark:bg-slate-900"
    >
      <div className="container mx-auto px-4">
        <div ref={headerRef} className="text-center mb-12">
          <div
            className="pricing-header-element inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm mb-4 hover:bg-white/30 transition-all duration-300"
            style={{
              boxShadow:
                '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <MdLocalOffer className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-semibold text-primary">
              Simutrade Pricing
            </span>
          </div>

          <h2 className="pricing-header-element text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Plans that works best for your business
          </h2>
          <p className="pricing-header-element mt-4 text-lg text-slate-600 dark:text-slate-400">
            Free during beta for all plans – no credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plansData.map((plan, index) => (
            <Card
              key={index}
              ref={(el) => addCardRef(el as HTMLDivElement, index)}
              className={cn(
                'flex flex-col transition-all',
                plan.highlighted
                  ? 'highlighted-card border-2 border-secondary shadow-xl transform scale-105'
                  : 'border-slate-200 dark:border-slate-700',
                'bg-white dark:bg-slate-800 rounded-xl overflow-hidden'
              )}
            >
              <CardHeader
                className={cn(
                  'p-6',
                  plan.highlighted ? 'bg-secondary/20 dark:bg-secondary/10' : ''
                )}
              >
                <div className="flex items-center mb-2">
                  {plan.icon && (
                    <span className="card-icon text-2xl mr-2 transition-transform inline-block">
                      {plan.icon}
                    </span>
                  )}
                  <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {plan.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-slate-600 dark:text-slate-400 min-h-[40px] text-left">
                  {plan.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.priceSubtitle && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {plan.priceSubtitle}
                    </span>
                  )}
                  {plan.badgeText && (
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'card-badge text-xs py-1 px-2 inline-block transition-all',
                          plan.themeColor === 'green' &&
                            'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
                          plan.themeColor === 'amber' &&
                            'bg-secondary/20 text-primary border-secondary/30 dark:bg-secondary/10 dark:text-secondary dark:border-secondary/20',
                          plan.themeColor === 'blue' &&
                            'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                        )}
                      >
                        {plan.badgeText}
                      </Badge>
                    </div>
                  )}
                </div>

                <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-300 text-left">
                  What's included:
                </h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="feature-item flex items-start transition-transform"
                    >
                      <FaCheckCircle
                        className={cn(
                          'w-5 h-5 mr-2 mt-0.5 shrink-0',
                          feature.included
                            ? 'text-secondary'
                            : 'text-slate-400 dark:text-slate-600'
                        )}
                      />
                      <span
                        className={cn(
                          'text-slate-700 dark:text-slate-300',
                          !feature.included &&
                            'line-through text-slate-400 dark:text-slate-500'
                        )}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 mt-auto bg-slate-50 dark:bg-slate-800/50">
                <Button
                  size="lg"
                  className={cn(
                    'w-full font-semibold transition-transform',
                    plan.themeColor === 'green' &&
                      'bg-emerald-600 [&:hover]:!bg-emerald-700 text-white',
                    plan.themeColor === 'amber' &&
                      'bg-secondary [&:hover]:!bg-secondary/90 text-primary',
                    plan.themeColor === 'blue' &&
                      'bg-blue-500 [&:hover]:!bg-blue-600 text-white',
                    !plan.themeColor &&
                      'bg-slate-800 [&:hover]:!bg-slate-950 dark:bg-slate-700 dark:[&:hover]:!bg-slate-600 dark:text-white'
                  )}
                  variant={plan.buttonVariant || 'default'}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-[60px] mb-8 text-center">
          <p className="text-xl font-semibold text-slate-400 dark:text-slate-300">
            Helping first-time exporters every step of the way
          </p>
        </div>
      </div>

      <div className="w-full mb-8 overflow-hidden">
        <MarqueeAlt
          direction="left"
          speed={30}
          pauseOnHover={true}
          className="py-4"
        >
          {logos.map((logo, idx) => (
            <div key={idx} className="mx-8">
              <img
                src={logo}
                alt={`logo-${idx + 1}`}
                className="h-10 w-auto object-contain grayscale opacity-60 hover:opacity-80 transition-opacity"
              />
            </div>
          ))}
        </MarqueeAlt>
      </div>
    </section>
  );
};

export default PricingSection;
