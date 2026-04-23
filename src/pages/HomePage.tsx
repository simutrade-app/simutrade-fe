// src/pages/HomePage.tsx
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import AdvantagesSection from '@/components/landing/AdvantagesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import SolutionsSection from '@/components/landing/SolutionsSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FaqSection from '@/components/landing/FaqSection';
import DomainChangeNotice from '@/components/landing/DomainChangeNotice';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <DomainChangeNotice />
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
