import React from 'react';
import Hero from '../components/Hero';
import RecentReports from '../components/RecentReports';
import HowItWorks from '../components/HowItWorks';
import AiFeature from '../components/AiFeature';
import AboutSection from '../components/AboutSection';

const Landing: React.FC = () => {
  return (
    <main>
      <Hero />
      <RecentReports />
      <HowItWorks />
      <AiFeature />
      <AboutSection />
    </main>
  );
};

export default Landing;