import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, HelpCircle } from 'lucide-react';
import { NeuralButton } from '../neural';
import { GlassButton } from '../glass';

// ===========================================
// 🎮 TYPE DEFINITIONS
// ===========================================

interface HeroSectionProps {
  className?: string;
  onStartGame?: () => void;
  onEnterWithReferral?: () => void;
}

// ===========================================
// 🎮 MAIN HERO SECTION - GAMEFI NEON 2025
// ===========================================

export const HeroSection: React.FC<HeroSectionProps> = ({
  className = '',
  onStartGame,
  onEnterWithReferral,
}) => {
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Gaming HUD Layout - Fixed Desktop, Stack Mobile */}
      <div className="relative z-20 w-full px-2 xs:px-4 py-8 xs:py-12 sm:py-16">
        {/* Desktop HUD Layout */}
        <div className="hidden lg:block">
          <div className="relative w-full max-w-7xl mx-auto h-[600px] flex items-start justify-center pt-19">
            {/* Center HUD Panel - Main Hero */}
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div
                className="hud-panel hud-panel-primary p-8 text-center rounded-lg"
                style={{
                  minHeight: '400px',
                  minWidth: '400px',
                  position: 'relative',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  boxShadow:
                    '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {/* Hero Title */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h1 className="text-5xl md:text-6xl font-bold font-cyberpunk leading-none text-center">
                    <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                      QUANTUM
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                      PROFIT CHAIN
                    </div>
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto mt-4 rounded-full"></div>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  className="text-sm text-neon-green mb-8 font-gaming leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  &gt; MATRIX.GAMING.PROTOCOL <br />
                  &gt; EARN.CRYPTO.REWARDS <br />
                  &gt; SMART.CONTRACT.POWERED
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  className="space-y-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <NeuralButton
                    size="lg"
                    onClick={onStartGame}
                    className="w-full font-gaming text-sm tracking-widest flex items-center justify-center"
                  >
                    <Wallet size={18} className="mr-2" />
                    CONNECT WALLET
                  </NeuralButton>

                  <GlassButton
                    variant="secondary"
                    size="lg"
                    onClick={onEnterWithReferral}
                    className="w-full font-gaming text-sm tracking-widest flex items-center justify-center"
                  >
                    <HelpCircle size={18} className="mr-2" />
                    HELP ME
                  </GlassButton>
                </motion.div>

                {/* Network Status */}
                <motion.div
                  className="bg-black/40 border border-neon-orange/30 p-3 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-neon-yellow rounded-full animate-neon-pulse" />
                    <span className="text-neon-orange font-mono text-sm">BSC.NETWORK.ACTIVE</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Layout - Only Center Block */}
        <div className="lg:hidden max-w-sm xs:max-w-md mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="hud-panel hud-panel-primary p-3 xs:p-4 sm:p-6 text-center rounded-lg"
              style={{
                minHeight: '280px',
                position: 'relative',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                boxShadow:
                  '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {/* Mobile Hero Title - More compact */}
              <div className="mb-4 xs:mb-6">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold font-cyberpunk leading-tight text-center">
                  <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-1 xs:mb-2">
                    QUANTUM
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                    PROFIT CHAIN
                  </div>
                </h1>
                <div className="w-16 xs:w-20 sm:w-24 h-0.5 xs:h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto mt-2 xs:mt-3 rounded-full"></div>
              </div>

              <p className="text-xs xs:text-sm text-neon-green mb-4 xs:mb-6 font-gaming leading-relaxed">
                <span className="hidden xs:inline">&gt; MATRIX.GAMING.PROTOCOL</span>
                <span className="xs:hidden">&gt; MATRIX.PROTOCOL</span>
                <br />
                &gt; EARN.CRYPTO.REWARDS
                <br />
                <span className="hidden xs:inline">&gt; SMART.CONTRACT.POWERED</span>
                <span className="xs:hidden">&gt; BSC.POWERED</span>
              </p>

              <div className="space-y-2 xs:space-y-3 mb-3 xs:mb-4">
                <NeuralButton
                  size="md"
                  onClick={onStartGame}
                  className="w-full font-gaming text-xs xs:text-sm tracking-widest flex items-center justify-center py-2 xs:py-3"
                >
                  <Wallet size={14} className="mr-1 xs:mr-2" />
                  <span className="hidden xs:inline">CONNECT WALLET</span>
                  <span className="xs:hidden">CONNECT</span>
                </NeuralButton>
                <GlassButton
                  variant="secondary"
                  size="md"
                  onClick={onEnterWithReferral}
                  className="w-full font-gaming text-xs xs:text-sm tracking-widest flex items-center justify-center py-2 xs:py-3"
                >
                  <HelpCircle size={14} className="mr-1 xs:mr-2" />
                  <span className="hidden xs:inline">HELP ME</span>
                  <span className="xs:hidden">HELP</span>
                </GlassButton>
              </div>

              <div className="bg-black/40 border border-neon-orange/30 p-1.5 xs:p-2 rounded">
                <div className="flex items-center justify-center space-x-1 xs:space-x-2">
                  <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-neon-yellow rounded-full animate-neon-pulse" />
                  <span className="text-neon-orange font-mono text-xs">
                    <span className="hidden xs:inline">BSC.NETWORK.ACTIVE</span>
                    <span className="xs:hidden">BSC.ACTIVE</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Glitch Effect Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.05, 0],
          filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)', 'hue-rotate(0deg)'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Terminal Cursor */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-neon-green font-mono text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="flex items-center space-x-1">
          <span>&gt; READY_FOR_MATRIX_ENTRY</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            █
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
