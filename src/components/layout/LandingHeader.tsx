import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface LandingHeaderProps {
  className?: string;
}

// ===========================================
// 🎮 GAMEFI NEON LOGO COMPONENT
// ===========================================

const QuantumLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`flex items-center select-none ${className}`}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex flex-col items-start select-none">
      <motion.span
        className="text-2xl lg:text-3xl font-bold font-cyberpunk bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent select-none"
        animate={{
          textShadow: ['0 0 10px #00FFFF60', '0 0 20px #00FFFF80', '0 0 10px #00FFFF60'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        QUANTUM
      </motion.span>
      <span className="text-sm lg:text-base font-terminal text-neon-green opacity-90 tracking-wider select-none">
        PROFIT.CHAIN
      </span>
    </div>
  </motion.div>
);

// ===========================================
// 🏠 MAIN LANDING HEADER COMPONENT
// ===========================================

export const LandingHeader: React.FC<LandingHeaderProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-30 ${className}`}
      style={{
        background: isScrolled
          ? 'linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(20, 0, 40, 0.95))'
          : 'linear-gradient(135deg, rgba(0, 20, 40, 0.8), rgba(20, 0, 40, 0.8))',
        backdropFilter: 'blur(15px)',
        borderBottom: isScrolled
          ? '1px solid rgba(0, 255, 255, 0.4)'
          : '1px solid rgba(0, 255, 255, 0.2)',
        boxShadow: isScrolled
          ? '0 4px 32px rgba(0, 255, 255, 0.2)'
          : '0 2px 20px rgba(0, 0, 0, 0.3)',
      }}
      animate={{
        y: isScrolled ? 0 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <QuantumLogo />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Connect Wallet Button - Responsive */}
            <motion.button
              onClick={() => (window.location.href = '/wallet')}
              className="relative px-3 py-2 sm:px-6 sm:py-3 lg:px-8 bg-black/40 border border-neon-cyan/50 rounded-lg font-cyberpunk text-neon-cyan font-bold overflow-hidden group transition-all duration-300 hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/30 text-xs sm:text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Corner decorations - smaller on mobile */}
              <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-l-2 border-t-2 border-neon-cyan" />
              <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-t-2 border-neon-cyan" />
              <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-l-2 border-b-2 border-neon-cyan" />
              <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-b-2 border-neon-cyan" />

              {/* Button text - Responsive */}
              <span className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                <span className="hidden sm:inline">CONNECT</span>
                <span className="sm:hidden">WALLET</span>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neon-cyan rounded-full animate-pulse" />
                <span className="hidden sm:inline">WALLET</span>
              </span>

              {/* Scan line effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-0 group-hover:opacity-100"
                animate={{
                  y: [0, 36, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Scanline Effect */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60"
          animate={{
            scaleX: [0, 1, 0],
            x: ['-100%', '0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.header>
  );
};

export default LandingHeader;
