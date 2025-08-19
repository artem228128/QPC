import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader, HomeHeader } from '../components/layout';
import {
  HeroSection,
  StatsPanel,
  LiveActivationsTable,
  GameInfoSections,
  FAQSection,
} from '../components/landing';
import { AccountLookup } from '../components/landing/AccountLookup';
import { useWallet } from '../hooks/useWallet';
import { NeuralBackground } from '../components/neural';
// Removed unused toast import

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { walletState, isUserRegistered } = useWallet();

  // Wallet connection handler - currently unused but kept for future use
  // const _handleConnectWallet = useCallback(() => {
  //   navigate('/wallet');
  // }, [navigate]);

  const handleStartGame = useCallback(async () => {
    // If wallet not connected, send to connect page
    if (!walletState.isConnected) {
      navigate('/wallet');
      return;
    }

    // Check on-chain registration and route accordingly
    const registered = await isUserRegistered();
    if (registered) {
      navigate('/dashboard');
    } else {
      navigate('/activate');
    }
  }, [navigate, walletState.isConnected, isUserRegistered]);

  const handleHelpMe = useCallback(() => {
    const faqEl = document.getElementById('faq');
    if (faqEl) {
      faqEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Dynamic Header based on wallet connection */}
      {walletState.isConnected ? <HomeHeader /> : <LandingHeader />}

      {/* Neural Background */}
      <NeuralBackground intensity={0.8} particleCount={30} />

      {/* Hero Section */}
      <HeroSection
        onStartGame={handleStartGame}
        onEnterWithReferral={handleHelpMe}
        isWalletConnected={walletState.isConnected}
      />

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
