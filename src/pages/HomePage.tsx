import React, { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { useReferral } from '../hooks/useReferral';
import { NeuralBackground } from '../components/neural';
import { GlassCard } from '../components/glass';
import { Users, User, CheckCircle } from 'lucide-react';
// Removed unused toast import

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { walletState, isUserRegistered } = useWallet();
  const { referrerInfo, hasReferrer } = useReferral();

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

    // Preserve referral parameter when navigating
    const refParam = searchParams.get('ref');
    const queryString = refParam ? `?ref=${refParam}` : '';

    // Check on-chain registration and route accordingly
    const registered = await isUserRegistered();
    if (registered) {
      navigate(`/dashboard${queryString}`);
    } else {
      navigate(`/activate${queryString}`);
    }
  }, [navigate, searchParams, walletState.isConnected, isUserRegistered]);

  const handleHelpMe = useCallback(() => {
    const faqEl = document.getElementById('faq');
    if (faqEl) {
      // Scroll to FAQ section with offset to account for fixed header
      const offset = 120; // Increased offset for fixed header (h-16 sm:h-20 = ~80px + padding)
      const elementPosition = faqEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Referral info is now integrated into HeroSection - old component removed

  return (
    <div className="min-h-screen">
      {/* Dynamic Header based on wallet connection */}
      {walletState.isConnected ? <HomeHeader /> : <LandingHeader />}

      {/* Neural Background */}
      <NeuralBackground intensity={0.8} particleCount={30} />

      {/* Referral Information moved to Hero section */}

      {/* Hero Section */}
      <HeroSection
        onStartGame={handleStartGame}
        onEnterWithReferral={handleHelpMe}
        isWalletConnected={walletState.isConnected}
        referrerInfo={hasReferrer ? referrerInfo : null}
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
