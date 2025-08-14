import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Copy,
  Share2,
  ExternalLink,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { ConnectedHeader, DashboardSidebar } from '../components/layout';
import { NeuralBackground } from '../components/neural';
import { GlassCard, GlassButton } from '../components/glass';
// Removed StatsPanel import - not needed in dashboard
import { useWallet } from '../hooks/useWallet';
import { LEVEL_PRICES, formatBNB, CONTRACT_ADDRESS, getQpcContract } from '../utils/contract';
import { RecentActivationsTable } from '../components';

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
  const { walletState, contractInfo, userLevels } = useWallet();

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

  const copyReferralLink = useCallback(async () => {
    await navigator.clipboard.writeText(MOCK_USER_DATA.referralLink);
    // Add toast notification here
  }, []);

  const shareReferralLink = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Quantum Profit Chain',
        text: 'Join me on Quantum Profit Chain!',
        url: MOCK_USER_DATA.referralLink,
      });
    } else {
      copyReferralLink();
    }
  }, [copyReferralLink]);

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
  const [recentActs, setRecentActs] = React.useState<Array<{datetime: string; level: number; userId: number; amount: number; tx: string}>>([]);
  React.useEffect(() => {
    (async () => {
      try {
        const c: any = await getQpcContract(false);
        const now = await (c.runner?.getBlock ? c.runner.getBlock('latest') : null);
        const latest = now?.number ?? undefined;
        const from = latest ? Math.max(0, latest - 5000) : 0;
        const iface = new (require('ethers').Interface)(["event BuyLevel(uint256 indexed userId, uint8 indexed level, uint256 value)"]);
        const topic = iface.getEvent("BuyLevel").topicHash;
        const logs = await c.runner.getLogs({ address: c.target, fromBlock: from, toBlock: latest ?? 'latest', topics: [topic] });
        const parsed = await Promise.all(logs.slice(-20).reverse().map(async (l: any) => {
          const p = iface.decodeEventLog("BuyLevel", l.data, l.topics);
          const userId = Number(p.userId);
          const level = Number(p.level);
          const amount = Number(p.value) / 1e18;
          const block = await c.runner.getBlock(l.blockHash);
          const dt = new Date(Number(block.timestamp) * 1000).toISOString().replace('T',' ').slice(0,16);
          return { datetime: dt, level, userId, amount, tx: l.transactionHash };
        }));
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

      <main className="relative z-10 pt-24 pb-16 ml-64">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Dashboard Header */}
          <motion.div
            className="mb-8"
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-3 space-y-8">
              {/* User Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            #{contractInfo?.id ?? '—'}
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
                        {MOCK_USER_DATA.referralLink}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={copyReferralLink}
                          className="flex-1 p-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors border border-cyan-400/30 text-cyan-400 text-sm font-medium"
                          title="Copy"
                        >
                          <Copy size={16} className="inline mr-2" />
                          Copy
                        </button>
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                <RecentActivationsTable />
              </motion.div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Performance Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-green-400" size={18} />
                        <span className="text-gray-300 text-sm">Active Levels</span>
                      </div>
                      <span className="text-white font-bold">
                        {activatedCount}/16
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="text-blue-400" size={18} />
                        <span className="text-gray-300 text-sm">Referrals</span>
                      </div>
                      <span className="text-white font-bold">{contractInfo?.referrals ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="text-purple-400" size={18} />
                        <span className="text-gray-300 text-sm">Total Volume</span>
                      </div>
                      <span className="text-white font-bold">{formatBNB(contractInfo?.levelsRewardSum ?? 0)} BNB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-yellow-400" size={18} />
                        <span className="text-gray-300 text-sm">Days Active</span>
                      </div>
                      <span className="text-white font-bold">
                        {contractInfo?.registrationTimestamp 
                          ? Math.floor((Date.now() - contractInfo.registrationTimestamp) / (1000 * 60 * 60 * 24))
                          : 0}
                      </span>
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
                  <h3 className="text-lg font-semibold text-white mb-4">Today's Summary</h3>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-green-400 text-lg font-bold">
                        {formatBNB(contractInfo?.levelsRewardSum ?? 0)}
                      </div>
                      <div className="text-gray-400 text-xs">Total Earnings</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-cyan-400 text-lg font-bold">
                        {activatedCount}
                      </div>
                      <div className="text-gray-400 text-xs">Active Levels</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="text-purple-400 text-lg font-bold">
                        {contractInfo?.referrals ?? 0}
                      </div>
                      <div className="text-gray-400 text-xs">Total Referrals</div>
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
                      <button
                        onClick={() => navigator.clipboard.writeText(CONTRACT_ADDRESS)}
                        className="flex-1 p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors border border-cyan-400/30 text-cyan-400 text-xs font-medium"
                        title="Copy Contract Address"
                      >
                        <Copy size={12} className="inline mr-1" />
                        Copy
                      </button>
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
