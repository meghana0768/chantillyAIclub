import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import ExploreSection from '@/components/landing/ExploreSection';
import PageShell from '@/components/PageShell';

export default function Home() {
  return (
    <PageShell>
      <HeroSection />
      <ExploreSection />
    </PageShell>
  );
}
