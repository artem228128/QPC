import React, { useCallback } from 'react';
import { formatUserId } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Share2,
  ExternalLink,
  TrendingUp,
  Users,
  Calendar,
  Eye,
  DollarSign,
} from 'lucide-react';
import { ConnectedHeader, DashboardSidebar } from '../components/layout';
import { NeuralBackground } from '../components/neural';
import { GlassCard, GlassButton } from '../components/glass';
// Removed StatsPanel import - not needed in dashboard
import { useWallet } from '../hooks/useWallet';
import { useReferral } from '../hooks/useReferral';
import { LEVEL_PRICES, formatBNB, CONTRACT_ADDRESS, getQpcContract } from '../utils/contract';
import { RecentActivationsTable } from '../components';
import { useState, useEffect } from 'react';

// Mock data for demonstration - expanded activations
const MOCK_USER_DATA = {
  id: 12345,
  referralLink: 'https://quantumprofitchain.com?ref=12345',
  activatedLevels: [1, 2, 3, 4, 5, 6, 7],
  totalEarnings: 4.856,
  activations: [
    {
      date: '2025-01-15 14:32',
      level: 7,
      playerId: 89012,
      amount: 0.4,
      partnerBonus: 0.08,
      txHash: '0xabc1...2def',
    },
    {
      date: '2025-01-15 12:18',
      level: 5,
      playerId: 67890,
      amount: 0.2,
      partnerBonus: 0.04,
      txHash: '0x1234...5678',
    },
    {
      date: '2025-01-14 16:45',
      level: 6,
      playerId: 78123,
      amount: 0.28,
      partnerBonus: 0.056,
      txHash: '0xdef4...8abc',
    },
    {
      date: '2025-01-14 09:22',
      level: 3,
      playerId: 54321,
      amount: 0.1,
      partnerBonus: 0.02,
      txHash: '0x2345...6789',
    },
    {
      date: '2025-01-13 18:15',
      level: 4,
      playerId: 45678,
      amount: 0.14,
      partnerBonus: 0.028,
      txHash: '0x5678...9abc',
    },
    {
      date: '2025-01-13 11:30',
      level: 2,
      playerId: 98765,
      amount: 0.07,
      partnerBonus: 0.014,
      txHash: '0x3456...7890',
    },
    {
      date: '2025-01-12 20:45',
      level: 5,
      playerId: 34567,
      amount: 0.2,
      partnerBonus: 0.04,
      txHash: '0x7890...bcde',
    },
    {
      date: '2025-01-12 14:12',
      level: 1,
      playerId: 23456,
      amount: 0.05,
      partnerBonus: 0.01,
      txHash: '0x9abc...def1',
    },
    {
      date: '2025-01-11 16:55',
      level: 3,
      playerId: 12345,
      amount: 0.1,
      partnerBonus: 0.02,
      txHash: '0xcdef...1234',
    },
  ],
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { /* walletState, */ contractInfo, userLevels, getTodayStats, getGlobalStats } =
    useWallet();
  const { generateReferralLink } = useReferral();
  const [todayStats, setTodayStats] = useState({
    todayEarnings: 0,
    todayReferrals: 0,
    todayActivations: 0,
  });
  const [globalStats, setGlobalStats] = useState({
    totalParticipants: 0,
    totalContractBalance: 0,
    activeLevelsCount: 0,
    gameStartDate: 'Unknown',
    dailyNewPlayers: 0,
    dailyVolumeChange: 0,
  });
  const [isLoadingTodayStats, setIsLoadingTodayStats] = useState(false);
  const [isLoadingGlobalStats, setIsLoadingGlobalStats] = useState(false);

  // Load today's statistics
  useEffect(() => {
    const loadTodayStats = async () => {
      if (contractInfo) {
        setIsLoadingTodayStats(true);
        try {
          const stats = await getTodayStats();
          setTodayStats(stats);
        } catch (error) {
          console.log('Error loading today stats:', error);
        } finally {
          setIsLoadingTodayStats(false);
        }
      }
    };

    loadTodayStats();
  }, [contractInfo, getTodayStats]);

  // Load global statistics
  useEffect(() => {
    const loadGlobalStats = async () => {
      setIsLoadingGlobalStats(true);
      try {
        const stats = await getGlobalStats();
        setGlobalStats(stats);
      } catch (error) {
        console.log('Error loading global stats:', error);
      } finally {
        setIsLoadingGlobalStats(false);
      }
    };

    loadGlobalStats();
  }, [getGlobalStats]);

  // Activated levels count (bind to on-chain data)
  const activatedCount = React.useMemo(() => {
    const arr = userLevels?.active;
    if (!arr || !arr.length) return 0;
    if (arr.length >= 17) {
      let c = 0;
      for (let i = 1; i <= 16 && i < arr.length; i += 1) {
        if (Boolean(arr[i])) c++;
      }
      return c;
    }
    return arr.filter(Boolean).length;
  }, [userLevels?.active]);

  const [referralCopied, setReferralCopied] = React.useState(false);
  const [contractCopied, setContractCopied] = React.useState(false);

  const copyReferralLink = useCallback(async () => {
    const userId = formatUserId(contractInfo?.id);
    const referralLink = generateReferralLink(userId);
    await navigator.clipboard.writeText(referralLink);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  }, [contractInfo?.id, generateReferralLink]);

  const copyContractAddress = useCallback(async () => {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setContractCopied(true);
    setTimeout(() => setContractCopied(false), 2000);
  }, []);

  const shareReferralLink = useCallback(() => {
    const userId = formatUserId(contractInfo?.id);
    const referralLink = generateReferralLink(userId);
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Quantum Profit Chain',
        text: 'Join me on Quantum Profit Chain!',
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  }, [contractInfo?.id, generateReferralLink, copyReferralLink]);

  const renderLevelVisualization = () => {
    const levels = Array.from({ length: 16 }, (_, i) => i + 1);
    const activeSet = new Set<number>();
    if (userLevels?.active && userLevels.active.length) {
      const arr = userLevels.active;
      if (arr.length >= 17) {
        // Contracts often return index 0 as unused; map 1..16 -> levels 1..16
        for (let i = 1; i <= 16 && i < arr.length; i += 1) {
          if (arr[i]) activeSet.add(i);
        }
      } else {
        // 16-length array maps 0..15 -> levels 1..16
        arr.forEach((isActive: boolean, idx: number) => {
          if (isActive) activeSet.add(idx + 1);
        });
      }
    }

    return (
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {levels.map((level) => {
          const isActivated = activeSet.has(level);
          const maxActive = activeSet.size ? Math.max(...Array.from(activeSet)) : 0;
          // Временное правило: если активен хотя бы 1 уровень, доступными считаем первые 5 уровней
          const isAvailable = level <= Math.max(5, maxActive + 1);

          return (
            <motion.div
              key={level}
              className={`
                relative p-4 rounded-xl text-center transition-all duration-300 cursor-pointer
                ${
                  isActivated
                    ? 'bg-gradient-to-br from-green-400/30 to-cyan-400/30 border-2 border-green-400/60 shadow-lg shadow-green-400/20'
                    : isAvailable
                      ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20 border-2 border-blue-400/40 hover:border-blue-400/60'
                      : 'bg-gray-600/20 border border-gray-600/30'
                }
              `}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`
                text-sm font-bold mb-1
                ${isActivated ? 'text-green-400' : isAvailable ? 'text-blue-400' : 'text-gray-500'}
              `}
              >
                {level}
              </div>
              <div
                className={`
                text-xs
                ${isActivated ? 'text-green-300' : isAvailable ? 'text-blue-300' : 'text-gray-400'}
              `}
              >
                {formatBNB(LEVEL_PRICES[level])}
              </div>
              {isActivated && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Recent Activations from-chain (BuyLevel events)
  const [, /* recentActs */ setRecentActs] = React.useState<
    Array<{ datetime: string; level: number; userId: number; amount: number; tx: string }>
  >([]);
  React.useEffect(() => {
    (async () => {
      try {
        const c: any = await getQpcContract(false);
        const now = await (c.runner?.getBlock ? c.runner.getBlock('latest') : null);
        const latest = now?.number ?? undefined;
        const from = latest ? Math.max(0, latest - 5000) : 0;
        const iface = new (require('ethers').Interface)([
          'event BuyLevel(uint256 indexed userId, uint8 indexed level, uint256 value)',
        ]);
        const topic = iface.getEvent('BuyLevel').topicHash;
        const logs = await c.runner.getLogs({
          address: c.target,
          fromBlock: from,
          toBlock: latest ?? 'latest',
          topics: [topic],
        });
        const parsed = await Promise.all(
          logs
            .slice(-20)
            .reverse()
            .map(async (l: any) => {
              const p = iface.decodeEventLog('BuyLevel', l.data, l.topics);
              const userId = Number(p.userId);
              const level = Number(p.level);
              const amount = Number(p.value) / 1e18;
              const block = await c.runner.getBlock(l.blockHash);
              const dt = new Date(Number(block.timestamp) * 1000)
                .toISOString()
                .replace('T', ' ')
                .slice(0, 16);
              return { datetime: dt, level, userId, amount, tx: l.transactionHash };
            })
        );
        setRecentActs(parsed);
      } catch (e) {
        // ignore silently in UI
      }
    })();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground intensity={0.6} particleCount={30} />
      <ConnectedHeader />

      {/* Sidebar */}
      <DashboardSidebar />

      <main className="relative z-10 pt-16 pb-16 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Dashboard Header */}
          <motion.div
            className="mt-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-cyberpunk mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    DASHBOARD
                  </span>
                </h1>
                <p className="text-gray-300">Your personal command center</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-3 space-y-8">
              {/* User Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* User Stats */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <GlassCard className="p-6 border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">User Stats</h3>
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <Users className="text-cyan-400" size={20} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-white border border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">User ID:</span>
                          <span className="text-cyan-400 font-bold">
                            #{formatUserId(contractInfo?.id)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-white border border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Earnings:</span>
                          <span className="text-green-400 font-bold">
                            {formatBNB(contractInfo?.levelsRewardSum ?? 0)} BNB
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Referral Link */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <GlassCard className="p-6 border border-yellow-400/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Referral Link</h3>
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Share2 className="text-yellow-400" size={20} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-white truncate border border-white/10">
                        {generateReferralLink(formatUserId(contractInfo?.id))}
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={copyReferralLink}
                          className={`flex-1 p-3 rounded-lg transition-all duration-300 border text-sm font-medium overflow-hidden relative ${
                            referralCopied
                              ? 'bg-green-500/20 border-green-400/30 text-green-400'
                              : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/30 text-cyan-400'
                          }`}
                          title={referralCopied ? "Copied!" : "Copy"}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Success ripple effect */}
                          <motion.div
                            className="absolute inset-0 bg-green-400/20 rounded-lg"
                            initial={{ scale: 0, opacity: 1 }}
                            animate={referralCopied ? {
                              scale: [0, 1.5],
                              opacity: [1, 0],
                              transition: { duration: 0.6, ease: "easeOut" }
                            } : { scale: 0, opacity: 0 }}
                          />
                          
                          <motion.div 
                            className="inline-flex items-center relative z-10"
                            initial={false}
                            animate={referralCopied ? {
                              y: [-20, 0],
                              opacity: [0, 1],
                              transition: { duration: 0.4, ease: "easeOut" }
                            } : {
                              y: 0,
                              opacity: 1
                            }}
                          >
                            <motion.div
                              initial={false}
                              animate={referralCopied ? {
                                rotate: [0, -10, 10, 0],
                                scale: [1, 1.2, 1],
                                transition: { duration: 0.5, ease: "easeInOut" }
                              } : {}}
                              className="mr-2"
                            >
                              {referralCopied ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </motion.div>
                            
                            <motion.span
                              initial={false}
                              animate={referralCopied ? {
                                scale: [1, 1.1, 1],
                                transition: { duration: 0.3, delay: 0.1 }
                              } : {}}
                            >
                              {referralCopied ? 'Copied!' : 'Copy'}
                            </motion.span>
                          </motion.div>
                        </motion.button>
                        <button
                          onClick={shareReferralLink}
                          className="flex-1 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-400/30 text-blue-400 text-sm font-medium"
                          title="Share"
                        >
                          <Share2 size={16} className="inline mr-2" />
                          Share
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* How Game Works - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">How Game Works</h3>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Matrix */}
                    <div
                      className="relative p-3 rounded-lg transition-all duration-300 border bg-black/40 border-cyan-400/30 hover:border-cyan-400/50"
                      style={{
                        boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">1</span>
                        </div>
                        <div className="text-cyan-400 font-medium text-xs">Matrix</div>
                        <div className="text-gray-300 text-xs text-center">Levels 1-16</div>
                      </div>
                    </div>

                    {/* Partner */}
                    <div
                      className="relative p-3 rounded-lg transition-all duration-300 border bg-black/40 border-purple-400/30 hover:border-purple-400/50"
                      style={{
                        boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">2</span>
                        </div>
                        <div className="text-purple-400 font-medium text-xs">Partner</div>
                        <div className="text-green-400 text-xs font-bold">26% Bonus</div>
                      </div>
                    </div>

                    {/* Profit */}
                    <div
                      className="relative p-3 rounded-lg transition-all duration-300 border bg-black/40 border-green-400/30 hover:border-green-400/50"
                      style={{
                        boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">3</span>
                        </div>
                        <div className="text-green-400 font-medium text-xs">Split</div>
                        <div className="text-gray-300 text-xs">74% / 26%</div>
                      </div>
                    </div>

                    {/* Auto */}
                    <div
                      className="relative p-3 rounded-lg transition-all duration-300 border bg-black/40 border-orange-400/30 hover:border-orange-400/50"
                      style={{
                        boxShadow: '0 0 15px rgba(251, 146, 60, 0.1)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">4</span>
                        </div>
                        <div className="text-orange-400 font-medium text-xs">Auto</div>
                        <div className="text-gray-300 text-xs">BSC Smart</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Level Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Level Matrix</h3>
                    <GlassButton
                      variant="primary"
                      size="md"
                      onClick={() => navigate('/program-view')}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/30 transition-all duration-300 rounded-lg relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <Eye size={18} className="mr-1" />
                      <span className="font-semibold">Program View</span>
                    </GlassButton>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-400 rounded border-2 border-green-400/60"></div>
                        <span className="text-gray-300">Activated ({activatedCount})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-400 rounded border-2 border-blue-400/40"></div>
                        <span className="text-gray-300">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-600 rounded border border-gray-600/30"></div>
                        <span className="text-gray-300">Locked</span>
                      </div>
                    </div>
                  </div>

                  {renderLevelVisualization()}
                </GlassCard>
              </motion.div>

              {/* Recent Activations - Reusable Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <RecentActivationsTable />
              </motion.div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Global Game Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <GlassCard className="p-4 border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-white">Game Stats</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="text-blue-400" size={14} />
                        <span className="text-gray-400 text-xs">Players</span>
                      </div>
                      <div className="text-blue-400 text-lg font-bold font-mono">
                        {isLoadingGlobalStats ? (
                          <div className="animate-pulse">...</div>
                        ) : (
                          <>
                            {globalStats.totalParticipants.toLocaleString()}
                            <span className="text-green-400 text-sm font-medium ml-2">
                              {isLoadingGlobalStats ? (
                                <span className="animate-pulse">...</span>
                              ) : globalStats.dailyNewPlayers > 0 ? (
                                `+${globalStats.dailyNewPlayers}`
                              ) : (
                                '+0'
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="text-green-400" size={14} />
                        <span className="text-gray-400 text-xs">Total Volume</span>
                      </div>
                      <div className="text-green-400 text-lg font-bold font-mono">
                        {isLoadingGlobalStats ? (
                          <div className="animate-pulse">...</div>
                        ) : (
                          <>
                            {formatBNB(globalStats.totalContractBalance)} BNB
                            <span className="text-green-400 text-sm font-medium ml-2">
                              {isLoadingGlobalStats ? (
                                <span className="animate-pulse">...</span>
                              ) : globalStats.dailyVolumeChange > 0 ? (
                                `+${formatBNB(globalStats.dailyVolumeChange)}`
                              ) : (
                                '+0'
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/20 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="text-purple-400" size={12} />
                          <span className="text-gray-400 text-xs">Levels</span>
                        </div>
                        <div className="text-purple-400 text-sm font-bold">
                          {isLoadingGlobalStats ? '...' : `${globalStats.activeLevelsCount}/16`}
                        </div>
                      </div>

                      <div className="bg-black/20 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="text-yellow-400" size={12} />
                          <span className="text-gray-400 text-xs">Days</span>
                        </div>
                        <div className="text-yellow-400 text-sm font-bold">
                          {isLoadingGlobalStats
                            ? '...'
                            : (() => {
                                if (contractInfo?.registrationTimestamp) {
                                  const daysPassed = Math.floor(
                                    (Date.now() - contractInfo.registrationTimestamp) /
                                      (1000 * 60 * 60 * 24)
                                  );
                                  return daysPassed;
                                }
                                return '0';
                              })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Today's Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <GlassCard className="p-6 border border-green-400/20 bg-gradient-to-br from-green-500/5 to-cyan-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Today's Summary</h3>
                    <button
                      onClick={async () => {
                        setIsLoadingTodayStats(true);
                        try {
                          const stats = await getTodayStats();
                          setTodayStats(stats);
                        } catch (error) {
                          console.log('Error refreshing today stats:', error);
                        } finally {
                          setIsLoadingTodayStats(false);
                        }
                      }}
                      className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 text-xs border border-blue-400/30"
                      disabled={isLoadingTodayStats}
                    >
                      {isLoadingTodayStats ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-green-400 text-lg font-bold">
                        {isLoadingTodayStats ? (
                          <div className="animate-pulse">Loading...</div>
                        ) : (
                          formatBNB(todayStats.todayEarnings)
                        )}
                      </div>
                      <div className="text-gray-400 text-xs">Today's Earnings</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-cyan-400 text-lg font-bold">
                        {isLoadingTodayStats ? (
                          <div className="animate-pulse">Loading...</div>
                        ) : (
                          todayStats.todayActivations
                        )}
                      </div>
                      <div className="text-gray-400 text-xs">Today's Activations</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-purple-400 text-lg font-bold">
                        {isLoadingTodayStats ? (
                          <div className="animate-pulse">Loading...</div>
                        ) : (
                          todayStats.todayReferrals
                        )}
                      </div>
                      <div className="text-gray-400 text-xs">Today's Referrals</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Smart Contract */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <GlassCard className="p-6 border border-orange-400/20 bg-gradient-to-br from-orange-500/5 to-red-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Smart Contract</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Verified</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-orange-400 text-xs mb-2 font-medium">
                        BSC Contract Address
                      </div>
                      <div className="font-mono text-xs text-gray-300 break-all leading-relaxed">
                        {CONTRACT_ADDRESS}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        onClick={copyContractAddress}
                        className={`flex-1 p-2 rounded-lg transition-all duration-300 border text-xs font-medium overflow-hidden relative ${
                          contractCopied
                            ? 'bg-green-500/20 border-green-400/30 text-green-400'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/30 text-cyan-400'
                        }`}
                        title={contractCopied ? "Copied!" : "Copy Contract Address"}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Success ripple effect */}
                        <motion.div
                          className="absolute inset-0 bg-green-400/20 rounded-lg"
                          initial={{ scale: 0, opacity: 1 }}
                          animate={contractCopied ? {
                            scale: [0, 1.5],
                            opacity: [1, 0],
                            transition: { duration: 0.6, ease: "easeOut" }
                          } : { scale: 0, opacity: 0 }}
                        />
                        
                        <motion.div 
                          className="inline-flex items-center relative z-10"
                          initial={false}
                          animate={contractCopied ? {
                            y: [-15, 0],
                            opacity: [0, 1],
                            transition: { duration: 0.4, ease: "easeOut" }
                          } : {
                            y: 0,
                            opacity: 1
                          }}
                        >
                          <motion.div
                            initial={false}
                            animate={contractCopied ? {
                              rotate: [0, -10, 10, 0],
                              scale: [1, 1.2, 1],
                              transition: { duration: 0.5, ease: "easeInOut" }
                            } : {}}
                            className="mr-1"
                          >
                            {contractCopied ? (
                              <Check size={12} />
                            ) : (
                              <Copy size={12} />
                            )}
                          </motion.div>
                          
                          <motion.span
                            initial={false}
                            animate={contractCopied ? {
                              scale: [1, 1.1, 1],
                              transition: { duration: 0.3, delay: 0.1 }
                            } : {}}
                          >
                            {contractCopied ? 'Copied!' : 'Copy'}
                          </motion.span>
                        </motion.div>
                      </motion.button>
                      <button
                        onClick={() =>
                          window.open(`https://bscscan.com/address/${CONTRACT_ADDRESS}`, '_blank')
                        }
                        className="flex-1 p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-400/30 text-blue-400 text-xs font-medium"
                        title="View on BscScan"
                      >
                        <ExternalLink size={12} className="inline mr-1" />
                        BscScan
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>

          {/* Statistics removed from dashboard - not needed here */}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
