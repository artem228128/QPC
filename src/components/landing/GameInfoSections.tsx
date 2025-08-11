import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Clock, Lock, Unlock, ChevronRight, RefreshCw } from 'lucide-react';
import { GlassPanel } from '../glass';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface GameInfoSectionsProps {
  className?: string;
}

interface Level {
  id: number;
  price: number;
  priceUSD: number;
  maxPositions: number;
  isUnlocked: boolean;
  unlockTime?: Date;
  participants: number;
}

// interface MatrixPosition {
//   id: string;
//   userId: string;
//   level: number;
//   position: { x: number; y: number };
//   isActive: boolean;
//   earnings: number;
// }

// ===========================================
// 🎯 HOW IT WORKS SECTION
// ===========================================

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculator State
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [, setCycles] = useState(2);
  const [cyclesInput, setCyclesInput] = useState('2');
  const [showResults, setShowResults] = useState(false);

  // Calculator Data - All Levels (real prices)
  const levels = [
    { level: 1, investment: 0.05 },
    { level: 2, investment: 0.07 },
    { level: 3, investment: 0.1 },
    { level: 4, investment: 0.14 },
    { level: 5, investment: 0.2 },
    { level: 6, investment: 0.28 },
    { level: 7, investment: 0.4 },
    { level: 8, investment: 0.55 },
    { level: 9, investment: 0.8 },
    { level: 10, investment: 1.1 },
    { level: 11, investment: 1.6 },
    { level: 12, investment: 2.2 },
    { level: 13, investment: 3.2 },
    { level: 14, investment: 4.4 },
    { level: 15, investment: 6.5 },
    { level: 16, investment: 8.0 },
  ];

  // Handle cycles input to remove leading zeros
  const handleCyclesChange = (value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    if (digitsOnly === '') {
      setCyclesInput('');
      setShowResults(false);
      return;
    }
    const normalized = digitsOnly.replace(/^0+/, '') || '0';
    setCyclesInput(normalized);
    setShowResults(false);
  };

  // Calculate button handler
  const handleCalculate = () => {
    const num = Math.max(1, Math.min(10, parseInt(cyclesInput === '' ? '1' : cyclesInput, 10)));
    setCycles(num);
    setShowResults(true);
  };

  // Calculate results - add 74% for each cycle
  const currentLevelData = levels.find((l) => l.level === selectedLevel) || levels[0];
  const actualCycles = parseInt(cyclesInput || '1'); // Always use current input
  const roiPercent = 74 * actualCycles; // 74% per cycle
  const totalProfit = currentLevelData.investment * (roiPercent / 100); // investment × (ROI/100)
  const roi = roiPercent.toFixed(0);

  const steps = [
    {
      title: 'CONNECT_WALLET',
      subtitle: 'Initialize Neural Link',
      description:
        'Connect your crypto wallet and establish connection to the quantum matrix network',
      icon: Users,
      status: 'READY',
      progress: 100,
      color: 'neon-cyan',
    },
    {
      title: 'ACTIVATE_MATRIX',
      subtitle: 'Deploy Smart Contract',
      description:
        'Purchase your first matrix position starting at 0.1 BNB to enter the gaming protocol',
      icon: Unlock,
      status: 'IN_PROGRESS',
      progress: 75,
      color: 'neon-magenta',
    },
    {
      title: 'EARN_CRYPTO',
      subtitle: 'Generate Rewards',
      description:
        'Receive 74% instant payouts from referrals plus spillover bonuses from network growth',
      icon: DollarSign,
      status: 'ACTIVE',
      progress: 90,
      color: 'neon-green',
    },
    {
      title: 'AUTO_RECYCLE',
      subtitle: 'Infinite Loop Protocol',
      description:
        'Matrix automatically recycles when full, creating continuous passive income streams',
      icon: RefreshCw,
      status: 'COMPLETED',
      progress: 100,
      color: 'neon-yellow',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setActiveStep((prev) => (prev + 1) % steps.length);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAnimating, steps.length]);

  const currentStep = steps[activeStep];

  return (
    <div className="space-y-8">
      {/* Gaming Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="border border-neon-cyan/20 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Section Header */}
      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl md:text-4xl font-bold font-cyberpunk text-white mb-2">
          HOW.IT.WORKS
        </h3>
        <div className="h-1 w-32 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-green mx-auto mb-4 rounded-full"></div>
        <p className="text-white/80 max-w-3xl mx-auto text-lg font-terminal">
          {`> INITIATE.PROTOCOL.SEQUENCE_`}
          <br />
          Experience next-gen GameFi matrix protocol with infinite earning loops
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 lg:gap-8 items-center">
        {/* ROI Calculator */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="hud-panel hud-panel-primary p-3 xs:p-4 sm:p-6 relative overflow-hidden rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {/* Calculator Header */}
            <div className="flex items-center justify-between mb-4 xs:mb-6">
              <div className="flex items-center space-x-1 xs:space-x-2">
                <div className="w-2 h-2 xs:w-3 xs:h-3 rounded-full bg-neon-green animate-pulse"></div>
                <span className="text-neon-green font-terminal text-xs xs:text-sm">
                  <span className="hidden xs:inline">ROI.CALCULATOR</span>
                  <span className="xs:hidden">ROI.CALC</span>
                </span>
              </div>
              <div className="text-white/60 font-mono text-xs hidden xs:block">MATRIX LEVELS</div>
            </div>

            {/* Calculator Form */}
            <div className="space-y-4 xs:space-y-6">
              {/* Level Selector */}
              <div className="space-y-2 xs:space-y-3">
                <label className="text-xs text-white/60 font-terminal">
                  <span className="hidden xs:inline">SELECT LEVEL:</span>
                  <span className="xs:hidden">LEVEL:</span>
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full bg-black/60 border border-neon-cyan/30 rounded-lg p-2 xs:p-3 text-white font-cyberpunk focus:border-neon-cyan focus:outline-none text-sm"
                >
                  {levels.map((level) => (
                    <option key={level.level} value={level.level} className="bg-black text-white">
                      LEVEL_{level.level} - {level.investment} BNB
                    </option>
                  ))}
                </select>
              </div>

              {/* Cycles Input */}
              <div className="space-y-2 xs:space-y-3">
                <label className="text-xs text-white/60 font-terminal">
                  <span className="hidden xs:inline">NUMBER OF CYCLES:</span>
                  <span className="xs:hidden">CYCLES:</span>
                </label>
                <div className="flex space-x-2 xs:space-x-3">
                  <input
                    type="text"
                    value={cyclesInput}
                    onChange={(e) => handleCyclesChange(e.target.value)}
                    className="flex-1 bg-black/60 border border-neon-cyan/30 rounded-lg p-2 xs:p-3 text-white font-cyberpunk focus:border-neon-cyan focus:outline-none text-center text-sm"
                    placeholder="1"
                  />
                  <button
                    onClick={handleCalculate}
                    className="px-3 xs:px-4 lg:px-6 py-2 xs:py-3 bg-neon-green/20 border border-neon-green/30 rounded-lg text-neon-green font-cyberpunk hover:bg-neon-green/30 transition-colors text-xs xs:text-sm"
                  >
                    CALC
                  </button>
                </div>
              </div>

              {/* Results Display */}
              {showResults && (
                <div className="bg-black/40 rounded-lg p-4 border border-neon-green/30">
                  <div className="text-center space-y-3">
                    <div className="text-xs text-white/60 font-terminal">CALCULATION RESULTS:</div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* ROI Display */}
                      <div className="bg-neon-green/10 rounded-lg p-3 border border-neon-green/30 text-center">
                        <div className="text-white/70 text-xs font-terminal mb-1">ROI</div>
                        <div className="text-neon-green font-cyberpunk text-2xl">{roi}%</div>
                      </div>

                      {/* BNB Profit Display */}
                      <div className="bg-neon-cyan/10 rounded-lg p-3 border border-neon-cyan/30 text-center">
                        <div className="text-white/70 text-xs font-terminal mb-1">PROFIT</div>
                        <div className="text-neon-cyan font-cyberpunk text-2xl">
                          {totalProfit.toFixed(3)}
                        </div>
                        <div className="text-neon-cyan/60 text-xs">BNB</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Animated Scanlines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-magenta to-transparent opacity-60 animate-pulse"></div>
            </div>
          </div>
        </motion.div>

        {/* Gaming Steps Navigation */}
        <motion.div
          className="space-y-6 relative z-10"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {/* Main Step Card */}
          <div
            className="hud-panel hud-panel-primary p-6 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Step Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-lg bg-${currentStep.color}/20 border border-${currentStep.color}/30`}
                    >
                      <currentStep.icon size={24} className={`text-${currentStep.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xl font-bold font-cyberpunk text-white">
                          {currentStep.title}
                        </h4>
                        <div
                          className={`px-2 py-1 rounded text-xs font-terminal bg-${currentStep.color}/20 text-${currentStep.color}`}
                        >
                          {currentStep.status}
                        </div>
                      </div>
                      <p className="text-white/60 font-terminal text-sm">
                        {currentStep.subtitle} • Step {activeStep + 1}/{steps.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <p className="text-white/80 text-base leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>

                {/* Progress Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 font-terminal text-sm">COMPLETION</span>
                    <span className={`font-mono text-${currentStep.color}`}>
                      {currentStep.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className={`h-full bg-${currentStep.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${currentStep.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`relative p-3 rounded-lg transition-all duration-300 border ${
                  index === activeStep
                    ? `bg-${step.color}/20 border-${step.color} shadow-lg`
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <step.icon
                    size={16}
                    className={index === activeStep ? `text-${step.color}` : 'text-white/60'}
                  />
                  <div
                    className={`text-xs font-terminal ${index === activeStep ? `text-${step.color}` : 'text-white/60'}`}
                  >
                    0{index + 1}
                  </div>
                </div>

                {index === activeStep && (
                  <motion.div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-${step.color} animate-pulse`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ===========================================
// 📊 LEVELS OVERVIEW SECTION
// ===========================================

const LevelsOverviewSection: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  // Real levels data (16 to 1)
  const levels: Level[] = [
    { id: 16, price: 8.0, priceUSD: 3200, maxPositions: 3, isUnlocked: true, participants: 120 },
    { id: 15, price: 6.5, priceUSD: 2600, maxPositions: 3, isUnlocked: true, participants: 156 },
    { id: 14, price: 4.4, priceUSD: 1760, maxPositions: 3, isUnlocked: true, participants: 234 },
    { id: 13, price: 3.2, priceUSD: 1280, maxPositions: 3, isUnlocked: true, participants: 298 },
    { id: 12, price: 2.2, priceUSD: 880, maxPositions: 3, isUnlocked: true, participants: 367 },
    { id: 11, price: 1.6, priceUSD: 640, maxPositions: 3, isUnlocked: true, participants: 445 },
    { id: 10, price: 1.1, priceUSD: 440, maxPositions: 3, isUnlocked: true, participants: 523 },
    { id: 9, price: 0.8, priceUSD: 320, maxPositions: 3, isUnlocked: true, participants: 612 },
    { id: 8, price: 0.55, priceUSD: 220, maxPositions: 3, isUnlocked: true, participants: 702 },
    { id: 7, price: 0.4, priceUSD: 160, maxPositions: 3, isUnlocked: true, participants: 789 },
    { id: 6, price: 0.28, priceUSD: 112, maxPositions: 3, isUnlocked: true, participants: 834 },
    { id: 5, price: 0.2, priceUSD: 80, maxPositions: 3, isUnlocked: true, participants: 901 },
    { id: 4, price: 0.14, priceUSD: 56, maxPositions: 3, isUnlocked: true, participants: 967 },
    { id: 3, price: 0.1, priceUSD: 40, maxPositions: 3, isUnlocked: true, participants: 1043 },
    { id: 2, price: 0.07, priceUSD: 28, maxPositions: 3, isUnlocked: true, participants: 1134 },
    { id: 1, price: 0.05, priceUSD: 20, maxPositions: 3, isUnlocked: true, participants: 1245 },
  ];

  const formatPrice = (price: number) => {
    if (price >= 1) return price.toFixed(1);
    return price.toFixed(3);
  };

  const formatUSD = (usd: number) => {
    if (usd >= 1000) return `$${(usd / 1000).toFixed(1)}K`;
    return `$${usd.toFixed(0)}`;
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl md:text-3xl font-bold font-heading text:white text-white mb-4">
          Levels Overview
        </h3>
        <p className="text-white/70 max-w-2xl mx-auto">
          16 progressive levels with exponential rewards. Each level doubles the earning potential.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {levels.map((level, index) => (
          <motion.div
            key={level.id}
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onHoverStart={() => setHoveredLevel(level.id)}
            onHoverEnd={() => setHoveredLevel(null)}
            onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
          >
            <GlassPanel
              variant={level.isUnlocked ? 'neural' : 'secondary'}
              padding="md"
              className={`cursor-pointer transition-all duration-300 min-h-[140px] flex flex-col justify-between ${level.isUnlocked ? 'neural-glow hover:scale-105' : 'opacity-60 hover:opacity-80'} ${selectedLevel === level.id ? 'ring-2 ring-neural-cyan' : ''}`}
              animate
            >
              {/* Top Section */}
              <div className="flex-1">
                {/* Level Number */}
                <div className="text-center mb-3">
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${level.isUnlocked ? 'bg-neural-cyan text-white' : 'bg:white/20 text-white/60 bg-white/20'}`}
                  >
                    {level.id}
                  </div>
                </div>

                {/* Lock/Unlock Icon */}
                <div className="text-center mb-2">
                  {level.isUnlocked ? (
                    <Unlock size={16} className="text-neural-mint mx-auto" />
                  ) : (
                    <Lock size={16} className="text-white/40 mx-auto" />
                  )}
                </div>

                {/* Price */}
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-white truncate">
                    {formatPrice(level.price)} BNB
                  </p>
                  <p className="text-xs text-white/60 truncate">{formatUSD(level.priceUSD)}</p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="mt-auto">
                {/* Participants */}
                {level.isUnlocked && (
                  <div className="text-center">
                    <p className="text-xs text-neural-cyan truncate">
                      {level.participants.toLocaleString()} users
                    </p>
                  </div>
                )}

                {/* Unlock Timer */}
                {!level.isUnlocked && level.unlockTime && (
                  <div className="text-center">
                    <CountdownTimer targetDate={level.unlockTime} />
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <AnimatePresence>
                {hoveredLevel === level.id && level.isUnlocked && (
                  <motion.div
                    className="absolute inset-0 bg-neural-cyan/10 rounded-lg flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ChevronRight size={20} className="text-neural-cyan" />
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>

      {/* Level Details */}
      <AnimatePresence>
        {selectedLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <GlassPanel variant="primary" padding="lg">
              <LevelDetails level={levels.find((l) => l.id === selectedLevel)!} />
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// ⏰ COUNTDOWN TIMER
// ===========================================

const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="text-xs text-white/60">
      <Clock size={10} className="inline mr-1" />
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
    </div>
  );
};

// ===========================================
// 📋 LEVEL DETAILS
// ===========================================

const LevelDetails: React.FC<{ level: Level }> = ({ level }) => {
  const expectedEarnings = level.price * 0.74 * 3; // 74% of 3 positions

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-bold text-white mb-4">Level {level.id} Details</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <p className="text-sm text-white/60">Entry Price</p>
          <p className="text-lg font-bold text:white text-white">{level.price} BNB</p>
          <p className="text-sm text-neural-cyan">${level.priceUSD.toFixed(0)} USD</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-white/60">Max Positions</p>
          <p className="text-lg font-bold text-white">{level.maxPositions}</p>
          <p className="text-sm text-neural-mint">Per matrix cycle</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-white/60">Expected Earnings</p>
          <p className="text-lg font-bold text-white">{expectedEarnings.toFixed(3)} BNB</p>
          <p className="text-sm text-neural-mint">
            +{((expectedEarnings / level.price - 1) * 100).toFixed(0)}% profit
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <p className="text-white/70">
          <strong>How it works:</strong> When you activate Level {level.id}, you enter a 2x1 matrix.
          You earn 74% from each direct referral and benefit from spillover. Once your matrix fills
          up with 3 positions, it automatically recycles for continuous earnings.
        </p>
      </div>
    </div>
  );
};

// ===========================================
// 🎯 MAIN GAME INFO SECTIONS
// ===========================================

export const GameInfoSections: React.FC<GameInfoSectionsProps> = ({ className = '' }) => {
  return (
    <section className={`py-16 space-y-24 ${className}`}>
      <div className="container mx-auto px-4">
        {/* How It Works */}
        <HowItWorksSection />

        {/* Levels Overview */}
        <div className="mt-12">
          <LevelsOverviewSection />
        </div>

        {/* (Timeline removed) */}
      </div>
    </section>
  );
};

export default GameInfoSections;
