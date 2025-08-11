import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Users, DollarSign, Activity } from 'lucide-react';
import { GlassPanel } from '../glass';
import { NeuralButton } from '../neural';
import { GlassButton } from '../glass';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface HeroSectionProps {
  className?: string;
  onStartGame?: () => void;
  onEnterWithReferral?: () => void;
}

interface QuickStat {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
  color: string;
}

// ===========================================
// ⌨️ TYPEWRITER EFFECT
// ===========================================

const TypewriterText: React.FC<{
  text: string;
  delay?: number;
  speed?: number;
}> = ({ text, delay = 0, speed = 100 }) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isStarted, setIsStarted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  React.useEffect(() => {
    if (!isStarted || currentIndex >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, isStarted]);

  return (
    <span>
      {displayedText}
      {isStarted && currentIndex < text.length && (
        <span className="animate-pulse text-neural-cyan">|</span>
      )}
    </span>
  );
};

// ===========================================
// 🎯 MAIN HERO SECTION
// ===========================================

export const HeroSection: React.FC<HeroSectionProps> = ({
  className = '',
  onStartGame,
  onEnterWithReferral,
}) => {
  // Quick stats for hero
  const quickStats: QuickStat[] = [
    {
      icon: Users,
      label: 'Players',
      value: '12.8K+',
      color: 'text-neural-cyan',
    },
    {
      icon: DollarSign,
      label: 'BNB Pool',
      value: '2.3K',
      color: 'text-neural-mint',
    },
    {
      icon: Activity,
      label: 'Transactions',
      value: '2.3M+',
      color: 'text-neural-purple',
    },
  ];

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-neural-cyan/10 via-transparent to-neural-purple/10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-neural-mint/5 via-transparent to-neural-coral/5" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="gradient-text bg-gradient-to-r from-neural-cyan via-neural-purple to-neural-mint bg-clip-text text-transparent">
                  Quantum
                </span>
                <br />
                <span className="text-white">Profit Chain</span>
              </motion.h1>

              {/* Subtitle with Typewriter */}
              <motion.p
                className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <TypewriterText
                  text="Enter the future of decentralized gaming. Earn cryptocurrency through smart contract-powered matrix levels."
                  delay={1200}
                  speed={50}
                />
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <NeuralButton size="lg" className="neural-pulse" onClick={onStartGame}>
                <Play size={20} className="mr-2" />
                Start Game
              </NeuralButton>

              <GlassButton variant="secondary" size="lg" onClick={onEnterWithReferral}>
                <ArrowRight size={20} className="mr-2" />
                Enter with Referral
              </GlassButton>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center space-x-2 text-white/60"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.4 + index * 0.1 }}
                >
                  <stat.icon size={18} className={stat.color} />
                  <span className="text-sm">
                    <span className="font-semibold text-white">{stat.value}</span> {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Glass Panel */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <GlassPanel variant="neural" className="max-w-md w-full p-8 space-y-6">
              {/* Panel Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-neural-cyan/20 flex items-center justify-center">
                  <Play size={24} className="text-neural-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-white">Ready to Start?</h3>
                <p className="text-white/60 text-sm">
                  Join thousands of players earning BNB through our revolutionary matrix system
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {[
                  '🔐 Smart Contract Security',
                  '💎 Matrix Level System',
                  '⚡ Instant BNB Payouts',
                  '🌐 Decentralized Platform',
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-center space-x-3 text-white/70"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.6 + index * 0.1 }}
                  >
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Panel CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                <GlassButton variant="primary" className="w-full" onClick={onStartGame}>
                  Connect Wallet & Play
                  <ArrowRight size={16} className="ml-2" />
                </GlassButton>
              </motion.div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
