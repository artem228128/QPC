import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Lock, Timer, Wallet, Award, Target } from 'lucide-react';
import { GlassCard, GlassButton } from '../glass';
import { formatBNB, LEVEL_PRICES } from '../../utils/contract';
import { ContractUserLevelsData } from '../../types';

interface MatrixLevel {
  level: number;
  isActivated: boolean;
  priceBNB: number;
  progress: number; // 0-100
  matrixFillPercent: number; // 0-100
  levelProfit: number;
  partnerBonus: number;
  nextCycleCount: number;
  isLocked?: boolean;
  unlockTime?: string;
  rewardPosition?: number; // Position on progress bar where reward will be received (0-100)
}

interface MatrixVisualizationProps {
  matrixLevel: MatrixLevel;
  onActivate?: (level: number, priceBNB: number) => void;
  isBusy?: boolean;
}

// Generate all 16 levels with mock data
const generateMockMatrixData = (): MatrixLevel[] => {
  const levels = [
    8, 6.5, 4.4, 3.2, 2.2, 1.6, 1.1, 0.8, 0.55, 0.4, 0.28, 0.2, 0.14, 0.1, 0.07, 0.05,
  ];

  return Array.from({ length: 16 }, (_, index) => {
    const level = 16 - index;
    const isActivated = level >= 15; // Only levels 16, 15 are activated
    const isLocked = level <= 12; // Levels 1-12 are locked
    // Levels 13, 14 are available but not activated

    return {
      level,
      isActivated,
      priceBNB: levels[index],
      progress: isActivated ? Math.floor(Math.random() * 80) + 10 : 0,
      matrixFillPercent: isActivated ? Math.floor(Math.random() * 100) : 0,
      levelProfit: isActivated ? Math.random() * levels[index] * 2 : 0,
      partnerBonus: isActivated ? Math.random() * levels[index] * 0.5 : 0,
      nextCycleCount: isActivated ? Math.floor(Math.random() * 5) + 1 : 0,
      isLocked,
      unlockTime: isLocked
        ? `${Math.floor(Math.random() * 24)
            .toString()
            .padStart(2, '0')}:${Math.floor(Math.random() * 60)
            .toString()
            .padStart(2, '0')}:${Math.floor(Math.random() * 60)
            .toString()
            .padStart(2, '0')}`
        : undefined,
      rewardPosition: isActivated ? Math.floor(Math.random() * 70) + 15 : undefined, // Reward point between 15% and 85%
    };
  });
};

const MOCK_MATRIX_DATA: MatrixLevel[] = generateMockMatrixData();

export const MatrixVisualization: React.FC<MatrixVisualizationProps> = ({ matrixLevel, onActivate, isBusy }) => {
  // LOCKED LEVEL
  if (matrixLevel.isLocked) {
    return (
      <GlassCard className="p-4 border border-red-400/20 bg-gradient-to-br from-red-500/5 to-orange-500/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-white">Level {matrixLevel.level}</div>
            <div className="text-orange-400 font-mono text-sm">
              {formatBNB(matrixLevel.priceBNB)} BNB
            </div>
          </div>
          <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
            Locked
          </div>
        </div>

        <div className="text-center py-4">
          <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="text-red-400" size={20} />
          </div>
          <div className="text-red-400 text-sm mb-2 font-medium">Level Locked</div>
          <div className="flex items-center justify-center gap-2 text-orange-400">
            <Timer size={14} />
            <span className="text-xs font-mono">{matrixLevel.unlockTime}</span>
          </div>
        </div>
      </GlassCard>
    );
  }

  // AVAILABLE BUT NOT ACTIVATED LEVEL
  if (!matrixLevel.isActivated) {
    return (
      <GlassCard className="p-4 border border-blue-400/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-white">Level {matrixLevel.level}</div>
            <div className="text-blue-400 font-mono text-sm">
              {formatBNB(matrixLevel.priceBNB)} BNB
            </div>
          </div>
          <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
            Available
          </div>
        </div>

          <div className="text-center py-6">
          <div className="text-blue-400 text-sm mb-4 font-medium">Not Activated</div>
          <GlassButton
            variant="primary"
            className="w-full py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-blue-400/50 hover:border-blue-300 text-blue-300 hover:text-white shadow-lg shadow-blue-400/20 hover:shadow-blue-400/30 transition-all duration-300"
              onClick={() => onActivate?.(matrixLevel.level, matrixLevel.priceBNB)}
              disabled={isBusy}
          >
            <span className="font-semibold">{isBusy ? 'Processing…' : 'Activate Level'}</span>
          </GlassButton>
        </div>
      </GlassCard>
    );
  }

  // ACTIVATED LEVEL
  return (
    <GlassCard className="p-4 border border-green-400/20 bg-gradient-to-br from-green-500/5 to-cyan-500/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-white">Level {matrixLevel.level}</div>
          <div className="text-green-400 font-mono text-sm">
            {formatBNB(matrixLevel.priceBNB)} BNB
          </div>
        </div>
        <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
          Active
        </div>
      </div>

      <div className="flex justify-between text-xs mb-3">
        <span className="text-gray-400">To cycle: {matrixLevel.nextCycleCount}</span>
        <span className="text-gray-400">Matrix: {matrixLevel.matrixFillPercent}%</span>
      </div>

      {/* Compact Progress Bar with Reward Point */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-cyan-400">{matrixLevel.progress}%</span>
        </div>
        <div className="relative w-full bg-black/30 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${matrixLevel.progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Reward Point Indicator */}
          {matrixLevel.rewardPosition && (
            <motion.div
              className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 z-10"
              style={{
                left: `${Math.max(5, Math.min(95, matrixLevel.rewardPosition))}%`,
                top: '50%',
                marginLeft: '-6px',
                marginTop: '-6px',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <motion.div
                className="w-full h-full bg-yellow-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 8px rgba(251, 191, 36, 0.5)',
                    '0 0 16px rgba(251, 191, 36, 0.8)',
                    '0 0 8px rgba(251, 191, 36, 0.5)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Compact Earnings */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/20 rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="text-green-400" size={12} />
            <span className="text-gray-400 text-xs">Matrix</span>
          </div>
          <div className="text-green-400 font-bold text-sm font-mono">
            {formatBNB(matrixLevel.levelProfit)}
          </div>
        </div>
        <div className="bg-black/20 rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <Users className="text-purple-400" size={12} />
            <span className="text-gray-400 text-xs">Bonus</span>
          </div>
          <div className="text-purple-400 font-bold text-sm font-mono">
            {formatBNB(matrixLevel.partnerBonus)}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export const ProgramViewGrid: React.FC<{
  onActivate?: (level: number, priceBNB: number) => Promise<void> | void;
  userLevels?: ContractUserLevelsData | null;
}> = ({ onActivate, userLevels }) => {
  // Calculate total earnings from all activated levels
  const totalLevelProfit = MOCK_MATRIX_DATA.filter((level) => level.isActivated).reduce(
    (sum, level) => sum + level.levelProfit,
    0
  );

  const totalPartnerBonus = MOCK_MATRIX_DATA.filter((level) => level.isActivated).reduce(
    (sum, level) => sum + level.partnerBonus,
    0
  );

  const totalEarnings = totalLevelProfit + totalPartnerBonus;
  const activatedLevelsCount = MOCK_MATRIX_DATA.filter((level) => level.isActivated).length;

  return (
    <div className="space-y-6">
      {/* Total Earnings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-blue-500/10 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-400/5 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400"></div>

          <div className="relative z-10">
            <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
              Earnings Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Total Earnings */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative bg-black/30 rounded-xl p-6 border border-cyan-400/30 group-hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full border border-cyan-400/40">
                      <Wallet className="text-cyan-400" size={24} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-cyan-400 text-3xl font-bold font-mono mb-2 bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                      {formatBNB(totalEarnings)}
                    </div>
                    <div className="text-gray-300 text-sm font-medium">Total Earnings</div>
                    <div className="text-cyan-400/60 text-xs mt-1">BNB</div>
                  </div>
                </div>
              </motion.div>

              {/* Partner Bonuses */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative bg-black/30 rounded-xl p-6 border border-purple-400/30 group-hover:border-purple-400/50 transition-all duration-300">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full border border-purple-400/40">
                      <Award className="text-purple-400" size={24} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 text-3xl font-bold font-mono mb-2 bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
                      {formatBNB(totalPartnerBonus)}
                    </div>
                    <div className="text-gray-300 text-sm font-medium">Partner Bonuses</div>
                    <div className="text-purple-400/60 text-xs mt-1">26% Commission</div>
                  </div>
                </div>
              </motion.div>

              {/* Active Levels */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative bg-black/30 rounded-xl p-6 border border-blue-400/30 group-hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full border border-blue-400/40">
                      <Target className="text-blue-400" size={24} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 text-3xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                        {activatedLevelsCount}
                      </span>
                      <span className="text-gray-500 text-xl">/16</span>
                    </div>
                    <div className="text-gray-300 text-sm font-medium">Active Levels</div>
                    <div className="text-blue-400/60 text-xs mt-1">
                      {Math.round((activatedLevelsCount / 16) * 100)}% Complete
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_MATRIX_DATA.map((ml) => {
          const level = ml.level;
          const priceBNB = (LEVEL_PRICES as any)[level] ?? ml.priceBNB;
          const arr = userLevels?.active;
          let isActive = ml.isActivated;
          if (arr && arr.length) {
            if (arr.length >= 17) {
              isActive = Boolean(arr[level]);
            } else {
              isActive = Boolean(arr[level - 1]);
            }
          }
          // compute availability based on max active
          let maxActive = 0;
          if (arr && arr.length) {
            const flags = arr.length >= 17 ? arr.slice(1, 17) : arr.slice(0, 16);
            flags.forEach((v: any, idx: number) => {
              if (v) maxActive = Math.max(maxActive, idx + 1);
            });
          }
          const isAvailable = !isActive && (maxActive > 0 ? level <= maxActive + 1 : level === 1);
          const isLocked = !(isActive || isAvailable);

          // derive progress from on-chain payouts/maxPayouts
          const getIdx = (lvl: number) => (userLevels?.active && userLevels.active.length >= 17 ? lvl : lvl - 1);
          const pArr = userLevels?.payouts;
          const mArr = userLevels?.maxPayouts;
          const idx = getIdx(level);
          let progress = ml.progress;
          let nextCycleCount = ml.nextCycleCount;
          if (pArr && mArr && pArr[idx] !== undefined && mArr[idx] !== undefined && mArr[idx] > 0) {
            const p = Number(pArr[idx]);
            const m = Number(mArr[idx]);
            progress = Math.max(0, Math.min(100, Math.round((p / m) * 100)));
            nextCycleCount = Math.max(0, m - p);
          }

          const matrixLevel = {
            ...ml,
            level,
            priceBNB,
            isActivated: isActive,
            isLocked,
            progress,
            matrixFillPercent: progress,
            nextCycleCount,
          };
          return (
          <motion.div
            key={matrixLevel.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (16 - matrixLevel.level) * 0.05 }}
          >
            <MatrixVisualization matrixLevel={matrixLevel} onActivate={(lvl) => onActivate?.(lvl, priceBNB)} />
          </motion.div>
        );})}
      </div>
    </div>
  );
};

export default ProgramViewGrid;
