import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader, ConnectedHeader } from '../components/layout';
import {
  HeroSection,
  StatsPanel,
  LiveActivationsTable,
  GameInfoSections,
  FAQSection,
} from '../components/landing';
import { AccountLookup } from '../components/landing/AccountLookup';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../components/common';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { walletState, isUserRegistered, registerUser } = useWallet();
  const toast = useToast();

  const handleConnectWallet = useCallback(() => {
    navigate('/wallet');
  }, [navigate]);

  const handleStartGame = useCallback(async () => {
    // Check if user is registered in contract
    const registered = await isUserRegistered();

    if (!registered) {
      // If not registered, register user first (could open a modal for referrer)
      try {
        await registerUser(); // or registerUser(referrerAddress)
        toast.success('Registration Successful!', 'Welcome to Quantum Profit Chain');
        // After registration, redirect to game
        navigate('/game');
      } catch (error: any) {
        console.error('Registration failed:', error);
        toast.error(
          'Registration Failed',
          error.message || 'An error occurred during registration'
        );
      }
    } else {
      // If already registered, go directly to game
      navigate('/game');
    }
  }, [isUserRegistered, registerUser, navigate, toast]);

  const handleHelpMe = useCallback(() => {
    const faqEl = document.getElementById('faq');
    if (faqEl) {
      faqEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Dynamic Header based on wallet connection */}
      {walletState.isConnected ? <ConnectedHeader /> : <LandingHeader />}

      {/* Hero Section */}
      <HeroSection
        onStartGame={walletState.isConnected ? handleStartGame : handleConnectWallet}
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
