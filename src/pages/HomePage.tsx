import React, { useCallback } from 'react';
import { LandingHeader } from '../components/layout';
import {
  HeroSection,
  StatsPanel,
  LiveActivationsTable,
  GameInfoSections,
  FAQSection,
} from '../components/landing';
import { AccountLookup } from '../components/landing/AccountLookup';
import { useWallet } from '../hooks/useWallet';

const HomePage: React.FC = () => {
  const { connectWallet } = useWallet();

  const handleConnectWallet = useCallback(async () => {
    await connectWallet();
  }, [connectWallet]);

  const handleHelpMe = useCallback(() => {
    const faqEl = document.getElementById('faq');
    if (faqEl) {
      faqEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Landing Header */}
      <LandingHeader />

      {/* Hero Section */}
      <HeroSection onStartGame={handleConnectWallet} onEnterWithReferral={handleHelpMe} />

      {/* Stats Panel */}
      <StatsPanel />

      {/* Game Information Sections */}
      <GameInfoSections />

      {/* Account Lookup */}
      <AccountLookup />

      {/* Live Activations Table */}
      <LiveActivationsTable />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default HomePage;
