import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { FiMenu, FiX, FiLogIn, FiUserPlus, FiGrid } from 'react-icons/fi';
import { FaPaperPlane } from 'react-icons/fa6';
import gsap from 'gsap';

const HERO_SECTION_SCROLL_THRESHOLD = 400; 

type HeaderProps = Record<string, unknown>;

const Header: React.FC<HeaderProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollYRef = useRef(0); 

  useEffect(() => {
    if (headerRef.current) {
      gsap.set(headerRef.current, {
        y: -100, // Initial position off-screen
        opacity: 0,
      });

      gsap.to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power1.in',
      });
    }
  }, []);

  // Effect for scroll-based hide/show behavior
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = headerElement.offsetHeight;

      if (currentScrollY > HERO_SECTION_SCROLL_THRESHOLD) {
        // User has scrolled past the hero section threshold
        if (
          currentScrollY > lastScrollYRef.current &&
          currentScrollY > headerHeight
        ) {
          // Scrolling down
          gsap.to(headerElement, {
            y: -headerHeight,
            duration: 0,
            overwrite: 'auto',
          });
        } else if (currentScrollY < lastScrollYRef.current) {
          // Scrolling up
          gsap.to(headerElement, { y: 0, duration: 0, overwrite: 'auto' });
        }
      } else {
        // User is within the hero section or scrolled to the top
        // Ensure header is visible
        gsap.to(headerElement, { y: 0, duration: 0, overwrite: 'auto' });
      }
      // Update last scroll position, ensuring it's not negative
      lastScrollYRef.current = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Optional: If animations are still running when component unmounts,
      // you might want to kill them to prevent issues.
      // gsap.killTweensOf(headerElement);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  return (
    <header
      ref={headerRef}
      className="app-header w-full fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out py-2 md:py-0 md:pt-4"
    >
      <div className="header-container container mx-auto px-4 bg-white md:rounded-2xl md:shadow-lg md:max-w-4xl flex items-center justify-between h-16 md:h-16">
        <div className="logo-container">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="Simutrade Logo"
              className="header-logo h-8 md:h-6 w-auto ml-3"
            />
          </Link>
        </div>

        <nav className="hidden md:flex flex-grow items-center justify-center ml-12 space-x-6 lg:space-x-6">
          <Link
            to="/#home"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/#milestones"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            Milestones
          </Link>
          <Link
            to="/#about"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          {!isLoggedIn ? (
            <>
              <Button
                variant="outline"
                className="text-primary border-primary [&:hover]:!bg-primary [&:hover]:!text-white rounded-[8px]"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button className="[&:hover]:!bg-primary/90">
                Export Now
                <FaPaperPlane className="ml-1 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild className="rounded-[8px] [&:hover]:!bg-primary/90">
              <Link to="/dashboard">
                <FiGrid className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <FiMenu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[300px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    <img
                      src="/logo.svg"
                      alt="Simutrade Logo"
                      className="header-logo h-8 w-auto mb-4"
                    />
                  </Link>
                </SheetTitle>
                <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                  <FiX className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/#home"
                  className="text-gray-700 hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/#milestones"
                  className="text-gray-700 hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Milestones
                </Link>
                <Link
                  to="/#about"
                  className="text-gray-700 hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <hr className="my-2" />

                {isLoggedIn ? (
                  <Button
                    className="w-full justify-start rounded-[8px] [&:hover]:!bg-primary/90"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/dashboard">
                      <FiGrid className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-primary border-primary [&:hover]:!bg-primary [&:hover]:!text-white rounded-[8px]"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/login">
                        <FiLogIn className="mr-2 h-4 w-4" /> Login
                      </Link>
                    </Button>
                    <Button
                      className="w-full justify-start rounded-[8px] [&:hover]:!bg-primary/90"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/register">
                        <FiUserPlus className="mr-2 h-4 w-4" /> Sign Up
                      </Link>
                    </Button>
                    <Button
                      className="w-full rounded-[8px] justify-start [&:hover]:!bg-primary/90"
                      onClick={() => {
                        console.log('Export Now clicked');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Export Now <FaPaperPlane className="ml-1 h-4 w-4" />
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
