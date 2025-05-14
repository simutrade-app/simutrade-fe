import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  {
    id: 'item-1',
    question: 'What exactly does Simutrade do?',
    answer:
      'Simutrade lets you simulate export scenarios — including cost, route, and regulation impact — using AI. Think of it as your virtual advisor for trade planning, without the complexity.',
  },
  {
    id: 'item-2',
    question: 'Is Simutrade really free to use?',
    answer:
      'Yes! All plans are 100% free during our beta period. No credit card needed. We want your feedback, not your wallet — yet.',
  },
  {
    id: 'item-3',
    question: 'Do I need prior export experience to use it?',
    answer:
      'Not at all. Simutrade is designed for everyone, from students to first-time exporters. Just enter your product, destination, and questions — the AI handles the rest.',
  },
  {
    id: 'item-4',
    question: 'Can I ask the AI anything about trade?',
    answer:
      'You sure can. Our AI assistant is built on Google Gemini and trained to answer trade-related queries, especially export rules, HS codes, and logistics planning.',
  },
  {
    id: 'item-5',
    question: 'Will my data be private and secure?',
    answer:
      "Absolutely. We don't store your queries or product info beyond your session unless you explicitly save a scenario. Your data stays yours.",
  },
  {
    id: 'item-6',
    question: 'What happens after the beta ends?',
    answer:
      "We'll offer tiered pricing with a generous free plan. All beta users get early access perks and discounts when we launch officially.",
  },
];

interface CustomAccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}


const CustomAccordionItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: CustomAccordionItemProps) => {
  return (
    <div className="mb-4 border border-gray-100 shadow-sm rounded-md overflow-hidden">
      <button
        className={`flex w-full items-center justify-between text-left md:text-lg font-medium py-4 px-6 bg-white hover:text-secondary-dark ${isOpen ? 'text-secondary-dark' : 'text-gray-800'}`}
        onClick={onClick}
        style={{
          WebkitTapHighlightColor: 'transparent',
          outline: 'none',
          border: 'none',
          boxShadow: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
        }}
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-600'}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out px-6 text-gray-600 bg-white ${
          isOpen ? 'max-h-96 opacity-100 pb-4 pt-2' : 'max-h-0 opacity-0'
        }`}
        style={{ textAlign: 'left' }}
      >
        {answer}
      </div>
    </div>
  );
};

const FaqSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleSectionRef = useRef<HTMLDivElement>(null);
  const accordionColumnRef = useRef<HTMLDivElement>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Toggle accordion item
  const toggleItem = (id: string) => {
    setOpenItems((prevOpenItems) => {
      const newOpenItems = new Set(prevOpenItems);
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id);
      } else {
        newOpenItems.add(id);
      }
      return newOpenItems;
    });
  };

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    });

    if (titleSectionRef.current) {
      tl.fromTo(
        titleSectionRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
        }
      );
    }

    if (accordionColumnRef.current) {
      const accordionItems = Array.from(
        accordionColumnRef.current.querySelectorAll('.faq-item')
      );
      tl.fromTo(
        accordionItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
        },
        '-=0.4'
      );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-10 lg:py-14">
      <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
        <style jsx global>{`
          /* Global styles to override browser defaults */
          button {
            -webkit-tap-highlight-color: transparent !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            outline: none !important;
            box-shadow: none !important;
          }

          button:focus,
          button:active,
          button:hover {
            outline: none !important;
            box-shadow: none !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
            background-color: transparent !important;
          }

          /* Specific selector to override system highlighting */
          .faq-button {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
          }

          /* Target WebKit browsers specifically */
          @media not all and (min-resolution: 0.001dpcm) {
            @supports (-webkit-appearance: none) {
              .faq-item button {
                outline: none !important;
                box-shadow: none !important;
                -webkit-tap-highlight-color: transparent !important;
                background-color: transparent !important;
              }
            }
          }
        `}</style>
        <div className="grid md:grid-cols-5 gap-16">
          <div className="md:col-span-2" ref={titleSectionRef}>
            <div>
              <h2 className="text-2xl font-bold md:text-4xl md:leading-tight text-gray-900 text-left">
                Still Curious?
                <br />
                We've Got <span className="text-[#005955]">Answers</span>.
              </h2>
              <p className="mt-3 text-gray-600 text-left md:pr-8">
                We gathered the most common questions from exporters, students,
                and curious first-timers to help you get the most out of
                Simutrade.
              </p>
              <a
                href="#"
                className="mt-8 flex items-center text-lg text-[#005955] hover:text-emerald-600 group"
              >
                Still need help? Chat to us.
                <ArrowRight className="ml-2 h-5 w-5 text-[#005955] group-hover:text-emerald-600 transition-colors duration-150 ease-in-out" />
              </a>
            </div>
          </div>
          <div className="md:col-span-3" ref={accordionColumnRef}>
            <div className="w-full space-y-4">
              {faqData.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <CustomAccordionItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openItems.has(faq.id)}
                    onClick={() => toggleItem(faq.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
