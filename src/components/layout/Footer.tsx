import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

const Footer = React.forwardRef<HTMLElement, Record<string, unknown>>(
  (_props, ref) => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
      { name: 'Home', path: '/' },
      { name: 'Features', path: '/features' },
      { name: 'Use Cases', path: '/use-cases' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'FAQ', path: '/faq' },
    ];

    const legalInfoLinks = [
      { name: 'Terms & Conditions', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Settings', path: '/cookies' },
    ];

    const socialLinks = [
      { name: 'GitHub', icon: faGithub, path: '#' },
      { name: 'X / Twitter', icon: faXTwitter, path: '#' },
      { name: 'Instagram', icon: faInstagram, path: '#' },
      { name: 'LinkedIn', icon: faLinkedin, path: '#' },
    ];

    return (
      <footer
        ref={ref}
        className="fixed bottom-0 left-0 w-full bg-primary text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
      >
        <div className="container mx-auto max-w-screen-xl relative">
          {/* Top Section: Info and Links */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-20">
            {/* Left Column: Intro and Social */}
            <div className="md:col-span-12 lg:col-span-5 text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
                Plan Smarter. Simulate Faster. <br /> Export Better.
              </h2>
              <div className="flex space-x-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-secondary transition-colors group"
                    aria-label={link.name}
                  >
                    <span className="w-10 h-10 rounded-full bg-neutral-500 flex items-center justify-center transition-colors group-hover:bg-neutral-500">
                      <FontAwesomeIcon icon={link.icon} className="text-xl" />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer for layout adjustment on large screens */}
            <div className="hidden lg:block lg:col-span-1"></div>

            {/* Link Columns Wrapper - For better responsive stacking */}
            <div className="md:col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
              {/* Quick Links Column */}
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-white">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.path}
                        className="text-white hover:text-secondary transition-opacity text-sm sm:text-base font-normal"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal/Info Column */}
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-white">
                  Legal
                </h3>
                <ul className="space-y-2">
                  {legalInfoLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.path}
                        className="text-white hover:text-secondary transition-opacity text-sm sm:text-base font-normal"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Column */}
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-white">
                  CONTACT
                </h3>
                <address className="not-italic text-sm sm:text-base space-y-1.5 font-normal">
                  <p>
                    <a
                      href="mailto:info@simutrade.app"
                      className="text-white hover:text-secondary transition-opacity font-normal"
                    >
                      info@simutrade.app
                    </a>
                  </p>
                  <p>
                    <a
                      href="tel:+1234567890"
                      className="text-white hover:text-secondary transition-opacity font-normal"
                    >
                      +1 (234) 567-890
                    </a>
                  </p>
                  <p className="text-white leading-relaxed font-normal">
                    Jl. Ganesa No. 10, Coblong
                    <br />
                    Bandung, 40132
                  </p>
                </address>
              </div>
            </div>
          </div>

          {/* Middle Section: Large Logo Text */}
          <div className="text-left my-20 md:my-28 lg:my-36">
            <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-semibold tracking-tight select-none text-white">
              Simutrade
            </span>
          </div>

          {/* Bottom Section: Copyright and Legal Links */}
          <div className="border-t border-gray-600 pt-8 mt-16 text-center md:flex md:justify-between md:items-center text-xs sm:text-sm font-normal">
            <p className="mb-4 md:mb-0 text-white">
              &copy; {currentYear} Simutrade. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-6">
              <a
                href="/terms"
                className="text-white hover:text-secondary transition-opacity font-normal"
              >
                Terms and Conditions
              </a>
              <a
                href="/privacy"
                className="text-white hover:text-secondary transition-opacity font-normal"
              >
                Privacy Policy
              </a>
              <a
                href="/sitemap"
                className="text-white hover:text-secondary transition-opacity font-normal"
              >
                Site Map
              </a>
            </nav>
          </div>
        </div>
        {/* Oversized SVG Icon */}
        <img
          src="/icon-only.svg"
          alt="Simutrade Icon"
          className="absolute bottom-[16rem] right-10 w-80 h-80 sm:w-96 sm:h-96 md:w-[26rem] md:h-[26rem] lg:w-[36rem] lg:h-[36rem] text-white pointer-events-none z-0 transform translate-x-1/4 translate-y-1/4 sm:translate-x-1/3 sm:translate-y-1/3"
        />
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
export default Footer;
