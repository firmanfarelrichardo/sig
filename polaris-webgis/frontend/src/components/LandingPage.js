import React from 'react';

// Modular Components
import HeroSection from './landing/HeroSection';
import FeatureSection from './landing/FeatureSection';
import HazardMapSection from './landing/HazardMapSection';
import HistoricalDataSection from './landing/HistoricalDataSection';
import AboutSection from './landing/AboutSection';
import Footer from './landing/Footer';

const LandingPage = ({ onExplore, stats }) => {
  
  // Smooth scroll handler passed down to components
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-slate-900 font-sans h-screen overflow-y-auto scroll-smooth selection:bg-orange-500 selection:text-white">
      <HeroSection onExplore={onExplore} scrollToSection={scrollToSection} />
      <FeatureSection />
      <HazardMapSection />
      <HistoricalDataSection stats={stats} />
      <AboutSection onExplore={onExplore} />
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default LandingPage;
