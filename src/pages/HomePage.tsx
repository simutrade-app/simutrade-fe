// src/pages/HomePage.tsx
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import AdvantagesSection from '@/components/landing/AdvantagesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import SolutionsSection from '@/components/landing/SolutionsSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FaqSection from '@/components/landing/FaqSection';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <AdvantagesSection />
      <HowItWorksSection />
      <SolutionsSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
    </div>
  );
};

export default HomePage;
