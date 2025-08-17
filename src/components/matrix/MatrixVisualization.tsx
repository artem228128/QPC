/* eslint-disable prettier/prettier */
import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Lock, Timer, Wallet, Award, Target, Snowflake } from 'lucide-react';
import { GlassCard, GlassButton } from '../glass';
import { formatBNB, LEVEL_PRICES, getQpcContract } from '../../utils/contract';
import { ContractUserLevelsData } from '../../types';
import { useWallet } from '../../hooks';

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
  isFrozen?: boolean; // Level completed max cycles and is frozen
  unlockTime?: string;
  rewardPosition?: number; // Position on progress bar where reward will be received (0-100)
  currentCycle?: number; // Current cycle number
  maxCycles?: number; // Maximum cycles for this level
  nextLevelActive?: boolean; // Whether the next level is active
}

interface MatrixVisualizationProps {
  matrixLevel: MatrixLevel;
  onActivate?: (level: number, priceBNB: number) => void;
  isBusy?: boolean;
}

// (removed mock generator)

// const MOCK_MATRIX_DATA: MatrixLevel[] = generateMockMatrixData(); // No longer used - using real contract data

export const MatrixVisualization: React.FC<MatrixVisualizationProps> = ({
  matrixLevel,
  onActivate,
  isBusy,
}) => {
  // FROZEN LEVEL (completed max cycles)
  if (matrixLevel.isFrozen) {
    return (
      <GlassCard className="p-4 border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-white">Level {matrixLevel.level}</div>
            <div className="text-cyan-400 font-mono text-sm">
              {formatBNB(matrixLevel.priceBNB)} BNB
            </div>
          </div>
          <div className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs font-medium">
            Frozen
          </div>
        </div>

        <div className="text-center py-4">
          <div className="w-12 h-12 bg-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Snowflake className="text-cyan-400" size={20} />
          </div>
          <div className="text-cyan-300 text-sm font-medium mb-1">Level Frozen</div>
          <div className="text-gray-400 text-xs">
            Received {matrixLevel.maxCycles} payouts. Level is temporarily frozen.
          </div>
          <div className="text-yellow-400 text-xs mt-1">
            💡 Activate Level {matrixLevel.level + 1} to unfreeze and continue earning!
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Matrix</span>
            <span className="text-cyan-400 font-mono">{formatBNB(matrixLevel.levelProfit)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Bonus</span>
            <span className="text-cyan-400 font-mono">{formatBNB(matrixLevel.partnerBonus)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Status</span>
            <span className="text-cyan-300">Frozen</span>
          </div>
        </div>
      </GlassCard>
    );
  }

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
        <span className="text-gray-400">
          {matrixLevel.nextLevelActive
            ? `Cycle: ${matrixLevel.currentCycle || 1}`
            : `Cycle: ${matrixLevel.currentCycle || 1}/${matrixLevel.maxCycles || 2}`}
        </span>
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

// Extract common logic into a custom hook
const useProgramViewData = (userLevels: ContractUserLevelsData | null | undefined) => {
  const [freezeUntil, setFreezeUntil] = React.useState<Record<number, number>>({});
  const lastPayoutsRef = React.useRef<Record<number, number>>({});

  React.useEffect(() => {
    const pArr = userLevels?.payouts;
    const now = Date.now();
    if (!pArr) return;
    const next: Record<number, number> = { ...freezeUntil };
    for (let level = 1; level <= 16; level++) {
      const idx = userLevels?.active && userLevels.active.length >= 17 ? level : level - 1;
      const pVal = Number((pArr as any)?.[idx] ?? 0);
      const prev = lastPayoutsRef.current[level] ?? 0;
      if (pVal > prev) {
        next[level] = now + 5000; // freeze dot for 5s after a payout
      }
      lastPayoutsRef.current[level] = pVal;
    }
    setFreezeUntil(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLevels?.payouts]);
  // Calculate total earnings and activated levels from real data
  let totalLevelProfit = 0;
  let totalPartnerBonus = 0;
  let activatedLevelsCount = 0;

  if (userLevels?.active) {
    const arr = userLevels.active;
    for (let i = 1; i <= 16; i++) {
      const isActive = arr.length >= 17 ? Boolean(arr[i]) : Boolean(arr[i - 1]);
      if (isActive) {
        activatedLevelsCount++;
        const priceBNB = (LEVEL_PRICES as any)[i] ?? 0;
        
        // Get payout data for this level
        const idx = arr.length >= 17 ? i : i - 1;
        const pArr = userLevels.payouts;
        
        if (pArr && pArr[idx] !== undefined && pArr[idx] > 0) {
          const payouts = Number(pArr[idx]);
          totalLevelProfit += priceBNB * 0.74 * payouts; // 74% base reward per cycle
          totalPartnerBonus += priceBNB * 0.26 * payouts; // 26% potential referral bonuses
        }
      }
    }
  }

  const totalEarnings = totalLevelProfit + totalPartnerBonus;

  return {
    totalEarnings,
    totalLevelProfit,
    totalPartnerBonus,
    activatedLevelsCount,
    freezeUntil,
  };
};

// Compact Earnings Overview component
export const EarningsOverview: React.FC<{
  userLevels?: ContractUserLevelsData | null;
}> = ({ userLevels }) => {
  const { totalEarnings, totalPartnerBonus, activatedLevelsCount } = useProgramViewData(userLevels);

  return (
    <div className="flex gap-4">
      {/* Total Earnings */}
      <motion.div
        className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3 border border-cyan-400/30 min-w-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
        <div className="p-2 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-lg border border-cyan-400/40 flex-shrink-0">
          <Wallet className="text-cyan-400" size={16} />
                    </div>
        <div className="flex-1 min-w-0">
          <div className="text-cyan-400 text-lg font-bold font-mono leading-tight">
                      {formatBNB(totalEarnings)}
                    </div>
          <div className="text-gray-300 text-xs">Total Earnings</div>
                </div>
              </motion.div>

              {/* Partner Bonuses */}
              <motion.div
        className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3 border border-purple-400/30 min-w-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
        <div className="p-2 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg border border-purple-400/40 flex-shrink-0">
          <Award className="text-purple-400" size={16} />
                    </div>
        <div className="flex-1 min-w-0">
          <div className="text-purple-400 text-lg font-bold font-mono leading-tight">
                      {formatBNB(totalPartnerBonus)}
                    </div>
          <div className="text-gray-300 text-xs">Partner Bonuses</div>
                </div>
              </motion.div>

              {/* Active Levels */}
              <motion.div
        className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3 border border-blue-400/30 min-w-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
        <div className="p-2 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg border border-blue-400/40 flex-shrink-0">
          <Target className="text-blue-400" size={16} />
                    </div>
        <div className="flex-1 min-w-0">
          <div className="text-blue-400 text-lg font-bold leading-tight">
                      <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                        {activatedLevelsCount}
                      </span>
            <span className="text-gray-500 text-sm">/16</span>
          </div>
          <div className="text-gray-300 text-xs">Active Levels</div>
        </div>
      </motion.div>
    </div>
  );
};

// Main Program View Grid component
export const ProgramViewGrid: React.FC<{
  onActivate?: (level: number, priceBNB: number) => Promise<void> | void;
  userLevels?: ContractUserLevelsData | null;
}> = ({ onActivate, userLevels }) => {
  const { freezeUntil } = useProgramViewData(userLevels);
  const { walletState } = useWallet();
  const [queuePositions, setQueuePositions] = React.useState<
    Record<number, { place: number; total: number }>
  >({});

  // Fetch queue positions for active levels
  React.useEffect(() => {
    const fetchPositions = async () => {
      try {
        if (!walletState?.address) return;
        const contract: any = await getQpcContract(false);
        const result: Record<number, { place: number; total: number }> = {};
        const arr = userLevels?.active;
        if (!arr || !arr.length) return;
        for (let level = 1; level <= 16; level++) {
          const isActive = arr.length >= 17 ? Boolean(arr[level]) : Boolean(arr[level - 1]);
          if (!isActive) continue;
          try {
            const [placeBn, totalBn] = await contract.getPlaceInQueue(walletState.address, level);
            result[level] = { place: Number(placeBn ?? 0), total: Number(totalBn ?? 0) };
          } catch {}
        }
        setQueuePositions(result);
      } catch {}
    };

    // initial load
    fetchPositions();

    // subscribe to on-chain events to refresh immediately when queue moves
    let contractInstance: any;
    let intervalId: NodeJS.Timeout;
    
    const setupEventListeners = async () => {
      try {
        contractInstance = await getQpcContract(false);
        const handler = () => {
          console.log('Contract event detected, refreshing queue positions...');
          fetchPositions();
        };
        
        if (contractInstance?.filters) {
          // Listen for BuyLevel and LevelPayout events
          contractInstance.on(contractInstance.filters.BuyLevel(), handler);
          contractInstance.on(contractInstance.filters.LevelPayout(), handler);
        }
      } catch (error) {
        console.log('Error setting up event listeners:', error);
      }
    };
    
    setupEventListeners();
    
    // Also poll every 10 seconds as fallback
    intervalId = setInterval(fetchPositions, 10000);

    return () => {
      try {
        if (contractInstance?.removeAllListeners) {
          contractInstance.removeAllListeners('BuyLevel');
          contractInstance.removeAllListeners('LevelPayout');
        }
        if (intervalId) {
          clearInterval(intervalId);
        }
      } catch {}
    };
  }, [walletState?.address, userLevels?.active]);

  // Poll periodically to reflect new registrations/purchases
  React.useEffect(() => {
    const id = setInterval(async () => {
      try {
        if (!walletState?.address) return;
        const contract: any = await getQpcContract(false);
        const result: Record<number, { place: number; total: number }> = {};
        const arr = userLevels?.active;
        if (!arr || !arr.length) return;
        for (let level = 1; level <= 16; level++) {
          const isActive = arr.length >= 17 ? Boolean(arr[level]) : Boolean(arr[level - 1]);
          if (!isActive) continue;
          try {
            const [placeBn, totalBn] = await contract.getPlaceInQueue(walletState.address, level);
            result[level] = { place: Number(placeBn ?? 0), total: Number(totalBn ?? 0) };
          } catch {}
        }
        setQueuePositions(result);
      } catch {}
    }, 5000);
    return () => clearInterval(id);
  }, [walletState?.address, userLevels?.active]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 16 }, (_, index) => {
          const level = 16 - index; // Start from level 16 down to 1
          const priceBNB = (LEVEL_PRICES as any)[level] ?? 0;
          const arr = userLevels?.active;
          let isActive = false;
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
          const getIdx = (lvl: number) =>
            userLevels?.active && userLevels.active.length >= 17 ? lvl : lvl - 1;
          const pArr = userLevels?.payouts;
          const mArr = userLevels?.maxPayouts;
          const idx = getIdx(level);
          let progress = 0;
          let nextCycleCount = 2; // Default 2 cycles
          let rewardPosition: number | undefined = undefined;
          if (pArr && mArr && pArr[idx] !== undefined && mArr[idx] !== undefined && mArr[idx] > 0) {
            const p = Number(pArr[idx]);
            const m = Number(mArr[idx]);
            // Reward position is the exact point of payout trigger
            // We align the bar to show current-cycle completion based on queue position
            // If user is at place k of total T, payout occurs when place == 1 (front)
            // Without on-chain queue here, approximate using payouts modulo maxPayouts
            const cycleSize = m;
            const peopleInCurrentCycle = p % cycleSize;
            const now = Date.now();
            const frozenPulse = freezeUntil[level] && now < (freezeUntil[level] as number);
            // progress up to current state
            progress = Math.max(
              0,
              Math.min(100, Math.round((peopleInCurrentCycle / cycleSize) * 100))
            );
            nextCycleCount = Math.max(0, cycleSize - peopleInCurrentCycle);
            // The payout (reward) happens on next join if not at boundary; place marker at that trigger
            const nextJoinProgress = Math.min(
              100,
              Math.round(((peopleInCurrentCycle + 1) / cycleSize) * 100)
            );
            rewardPosition = frozenPulse ? progress : nextJoinProgress;
          }

          // Check if level is frozen first
          const payouts = pArr && pArr[idx] !== undefined ? Number(pArr[idx]) : 0;
          const maxPayouts = mArr && mArr[idx] !== undefined ? Number(mArr[idx]) : 2;
          const isFrozen =
            isActive &&
            payouts >= maxPayouts &&
            (level >= 16 || !arr || !Boolean(arr[level + (arr.length >= 17 ? 1 : 0)]));

          // If we have precise queue data and level is NOT frozen, show progress until reward
          const qp = queuePositions[level];
          if (qp && qp.total > 0 && !isFrozen) {
            const total = Math.max(1, qp.total);
            const place = Math.max(1, qp.place || 1);
            
            // Debug: log queue position for level 1
            if (level === 1 && walletState?.address) {
              console.log(`Level ${level} queue: place=${place}, total=${total}, frozen=${isFrozen}`);
            }
            
            // Progress показывает, насколько близко к получению награды
            // place=1 -> 100% (получит сразу), place=2 -> 75%, place=3 -> 50%, etc.
            progress = Math.round(((total - place + 1) / total) * 100);
            
            nextCycleCount = Math.max(0, place - 1);
            
            // Убираем точку награды - теперь прогресс сам показывает близость к награде
            rewardPosition = undefined;
          } else if (isFrozen) {
            // For frozen levels, show 100% progress to indicate completion
            progress = 100;
            nextCycleCount = 0;
            rewardPosition = undefined;
          }

          // isFrozen уже рассчитан выше

          const matrixLevel = {
            level,
            priceBNB,
            isActivated: isActive,
            isLocked,
            isFrozen,
            progress,
            matrixFillPercent: progress,
            nextCycleCount,
            rewardPosition,
            levelProfit:
              isActive && userLevels?.rewardSum && userLevels.rewardSum[idx] !== undefined
                ? userLevels.rewardSum[idx]
                : 0,
            partnerBonus:
              isActive &&
              userLevels?.referralPayoutSum &&
              userLevels.referralPayoutSum[idx] !== undefined
                ? userLevels.referralPayoutSum[idx]
                : 0,
            currentCycle:
              pArr && mArr && pArr[idx] !== undefined && mArr[idx] !== undefined
                ? Math.min(Number(pArr[idx]) + 1, Number(mArr[idx]))
                : 1,
            maxCycles: mArr && mArr[idx] !== undefined ? Number(mArr[idx]) : 2,
            nextLevelActive: Boolean(arr && (arr.length >= 17 ? arr[level + 1] : arr[level])),
          };
          return (
          <motion.div
            key={matrixLevel.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (16 - matrixLevel.level) * 0.05 }}
          >
            <MatrixVisualization
              matrixLevel={matrixLevel}
              onActivate={(lvl) => onActivate?.(lvl, priceBNB)}
            />
          </motion.div>
        );})}
    </div>
  );
};

export default ProgramViewGrid;
