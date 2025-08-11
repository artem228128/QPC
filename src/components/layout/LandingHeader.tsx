import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

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
    className={`flex items-center space-x-4 ${className}`}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div className="relative">
      <motion.svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        animate={{
          filter: [
            'drop-shadow(0 0 15px #00FFFF80) drop-shadow(0 0 30px #FF00FF40)',
            'drop-shadow(0 0 25px #00FFFF60) drop-shadow(0 0 40px #FF00FF60)',
            'drop-shadow(0 0 15px #00FFFF80) drop-shadow(0 0 30px #FF00FF40)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Main Hexagon */}
        <path
          d="M24 2L36 10V26L24 34L12 26V10L24 2Z"
          fill="none"
          stroke="url(#hexGradient)"
          strokeWidth="2"
        />

        {/* Inner Matrix */}
        <path d="M24 8L32 12V24L24 28L16 24V12L24 8Z" fill="url(#matrixGradient)" opacity="0.6" />

        {/* Center Core */}
        <circle cx="24" cy="18" r="6" fill="url(#coreGradient)" />

        {/* Gaming UI Elements */}
        <rect x="10" y="6" width="4" height="1" fill="#00FFFF" opacity="0.8" />
        <rect x="34" y="6" width="4" height="1" fill="#FF00FF" opacity="0.8" />
        <rect x="10" y="40" width="4" height="1" fill="#00FF00" opacity="0.8" />
        <rect x="34" y="40" width="4" height="1" fill="#FFFF00" opacity="0.8" />

        {/* Scanlines */}
        <line x1="2" y1="12" x2="46" y2="12" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3" />
        <line x1="2" y1="24" x2="46" y2="24" stroke="#FF00FF" strokeWidth="0.5" opacity="0.3" />
        <line x1="2" y1="36" x2="46" y2="36" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3" />

        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="50%" stopColor="#FF00FF" />
            <stop offset="100%" stopColor="#00FFFF" />
          </linearGradient>
          <radialGradient id="matrixGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF00FF" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#00FFFF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </radialGradient>
        </defs>
      </motion.svg>
    </motion.div>

    <div className="flex flex-col">
      <motion.span
        className="text-2xl font-bold font-cyberpunk bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent"
        animate={{
          textShadow: ['0 0 10px #00FFFF60', '0 0 20px #00FFFF80', '0 0 10px #00FFFF60'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        QUANTUM
      </motion.span>
      <span className="text-sm font-terminal text-neon-green opacity-90 tracking-wider">
        PROFIT.CHAIN
      </span>
    </div>
  </motion.div>
);

// ===========================================
// 🌍 LANGUAGE SELECTOR
// ===========================================

const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const languages = [
    { code: 'EN', label: 'English', flag: '🇺🇸' },
    { code: 'RU', label: 'Русский', flag: '🇷🇺' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'ZH', label: '中文', flag: '🇨🇳' },
  ];

  return (
    <div className="relative">
      <motion.button
        className="glass-panel-secondary px-3 py-2 rounded-lg flex items-center space-x-2 text-sm hover:glass-panel-neural transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe size={16} className="text-neural-cyan" />
        <span className="text-white font-medium">{selectedLang}</span>
        <ChevronDown
          size={14}
          className={`text-neural-cyan transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-40 glass-panel-primary rounded-lg border border-white/20 shadow-2xl z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                onClick={() => {
                  setSelectedLang(lang.code);
                  setIsOpen(false);
                }}
                whileHover={{ x: 4 }}
              >
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="text-white font-medium text-sm">{lang.code}</div>
                  <div className="text-neural-cyan text-xs opacity-80">{lang.label}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Compact for mobile */}
          <div className="flex-shrink-0">
            <QuantumLogo className="scale-75 sm:scale-100" />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Language Selector - Hidden on very small screens */}
            <div className="hidden xs:block">
              <LanguageSelector />
            </div>

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
