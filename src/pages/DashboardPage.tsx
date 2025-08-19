import React, { useCallback } from 'react';
import { formatUserId } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
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
  QrCode,
  BookOpen,
  Lock,
  Snowflake,
  Play,
  Info,
  X,
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
import { toast } from 'react-hot-toast';

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
  const { walletState, contractInfo, userLevels, getTodayStats, getGlobalStats, buyLevel } =
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
  const [isQrOpen, setIsQrOpen] = React.useState(false);
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('');
  const [isGameWorksExpanded, setIsGameWorksExpanded] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = React.useState<number | null>(null);
  const [levelModalOpen, setLevelModalOpen] = React.useState(false);
  const [isActivatingLevel, setIsActivatingLevel] = React.useState(false);
  const [levelQueue, setLevelQueue] = React.useState<{ place: number; total: number } | null>(null);
  const [isQueueLoading, setIsQueueLoading] = React.useState(false);

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

  const openQrModal = useCallback(async () => {
    const userId = formatUserId(contractInfo?.id);
    const referralLink = generateReferralLink(userId);
    try {
      const url = await QRCode.toDataURL(referralLink, { width: 320, margin: 2 });
      setQrDataUrl(url);
      setIsQrOpen(true);
    } catch (e) {
      console.error('QR generation failed', e);
    }
  }, [contractInfo?.id, generateReferralLink]);

  // Функция для определения статуса уровня
  const getLevelStatus = (level: number, activeSet: Set<number>): 'active' | 'available' | 'locked' | 'frozen' => {
    const isActivated = activeSet.has(level);
    if (isActivated) return 'active';
    
    const maxActive = activeSet.size ? Math.max(...Array.from(activeSet)) : 0;
    
    // Если это первый уровень и нет активных - доступен
    if (level === 1 && maxActive === 0) return 'available';
    
    // Следующий уровень после максимального активного - доступен
    if (level === maxActive + 1) return 'available';
    
    // Пример замороженных уровней (если нужно)
    // if (level > 16) return 'frozen';
    
    // Все остальные уровни заблокированы
    return 'locked';
  };

  // Функция для открытия модального окна уровня
  const openLevelModal = (level: number) => {
    setSelectedLevel(level);
    setLevelModalOpen(true);
    // Load queue position to compute progress like Program View
    (async () => {
      try {
        setIsQueueLoading(true);
        setLevelQueue(null);
        const c: any = await getQpcContract(false);
        if (!walletState.address) return;
        if (typeof c.getPlaceInQueue === 'function') {
          const [placeBn, totalBn] = await c.getPlaceInQueue(walletState.address, level);
          setLevelQueue({ place: Number(placeBn ?? 0), total: Number(totalBn ?? 0) });
        }
      } catch {}
      finally { setIsQueueLoading(false); }
    })();
  };

  // Функция активации уровня
  const handleActivateLevel = useCallback(async (level: number) => {
    if (!buyLevel || !walletState.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsActivatingLevel(true);
    try {
      const levelPrice = LEVEL_PRICES[level];
      await buyLevel(level, levelPrice);
      
      // Показываем успешное сообщение
      toast.success(`Level ${level} activated successfully!`);
      
      // Закрываем модальное окно
      setLevelModalOpen(false);
      
      // Небольшая задержка для обновления данных
      setTimeout(() => {
        window.location.reload(); // Или можно обновить только нужные данные
      }, 1000);
      
    } catch (error: any) {
      console.error('Activation error:', error);
      
      // Обработка различных типов ошибок
      if (error.code === 'INSUFFICIENT_FUNDS') {
        toast.error(`Insufficient funds. You need ${formatBNB(LEVEL_PRICES[level])} BNB to activate Level ${level}`);
      } else if (error.message?.includes('user rejected')) {
        toast.error('Transaction was cancelled');
      } else {
        toast.error(error.message || `Failed to activate Level ${level}`);
      }
    } finally {
      setIsActivatingLevel(false);
    }
  }, [buyLevel, walletState.isConnected]);

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
          const status = getLevelStatus(level, activeSet);

          const statusStyles = {
            active: 'bg-gradient-to-br from-green-400/30 to-cyan-400/30 border-2 border-green-400/60 shadow-lg shadow-green-400/20',
            available: 'bg-gradient-to-br from-blue-400/20 to-purple-400/20 border-2 border-blue-400/40 hover:border-blue-400/60',
            locked: 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-2 border-gray-500/40',
            frozen: 'bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 border-2 border-cyan-400/40'
          };

          const textStyles = {
            active: { level: 'text-green-400', price: 'text-green-300' },
            available: { level: 'text-blue-400', price: 'text-blue-300' },
            locked: { level: 'text-gray-400', price: 'text-gray-300' },
            frozen: { level: 'text-cyan-400', price: 'text-cyan-300' }
          };

          return (
            <motion.div
              key={level}
              onClick={() => openLevelModal(level)}
              className={`
                relative p-4 rounded-xl text-center transition-all duration-300 cursor-pointer
                ${statusStyles[status]}
              `}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`text-sm font-bold mb-1 ${textStyles[status].level}`}>
                {level}
              </div>
              <div className={`text-xs ${textStyles[status].price}`}>
                {formatBNB(LEVEL_PRICES[level])}
              </div>
              
              {/* Иконки статуса */}
              <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center">
                {status === 'active' && (
                  <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
                {status === 'locked' && (
                  <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-black flex items-center justify-center">
                    <Lock size={8} className="text-white" />
                  </div>
                )}
                {status === 'frozen' && (
                  <div className="w-4 h-4 bg-cyan-500 rounded-full border-2 border-black flex items-center justify-center">
                    <Snowflake size={8} className="text-white" />
                  </div>
                )}
                {status === 'available' && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                    <Play size={8} className="text-white" />
                  </div>
                )}
              </div>
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

      {/* QR Modal */}
      <AnimatePresence>
        {isQrOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[92%] max-w-sm p-6 bg-gradient-to-br from-black/60 to-gray-900/70 backdrop-blur-xl border border-purple-400/20 rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Your Referral QR</h4>
                <button
                  onClick={() => setIsQrOpen(false)}
                  className="px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-gray-200"
                >
                  Close
                </button>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/10 flex items-center justify-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Referral QR" className="w-full h-auto rounded" />
                ) : (
                  <div className="text-gray-400 text-sm">Generating...</div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <motion.button
                  onClick={copyReferralLink}
                  className={`flex-1 p-2 rounded-md transition-all duration-300 border text-sm font-medium overflow-hidden relative ${
                    referralCopied
                      ? 'bg-green-500/20 border-green-400/30 text-green-400'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/30 text-cyan-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-green-400/20 rounded-md"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={referralCopied ? {
                      scale: [0, 1.5],
                      opacity: [1, 0],
                      transition: { duration: 0.6, ease: 'easeOut' }
                    } : { scale: 0, opacity: 0 }}
                  />
                  <motion.div 
                    className="inline-flex items-center relative z-10"
                    initial={false}
                    animate={referralCopied ? {
                      y: [-15, 0],
                      opacity: [0, 1],
                      transition: { duration: 0.4, ease: 'easeOut' }
                    } : { y: 0, opacity: 1 }}
                  >
                    <motion.div
                      initial={false}
                      animate={referralCopied ? {
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.2, 1],
                        transition: { duration: 0.5, ease: 'easeInOut' }
                      } : {}}
                      className="mr-2"
                    >
                      {referralCopied ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </motion.div>
                    <motion.span
                      initial={false}
                      animate={referralCopied ? {
                        scale: [1, 1.1, 1],
                        transition: { duration: 0.3, delay: 0.1 }
                      } : {}}
                    >
                      {referralCopied ? 'Copied!' : 'Copy Link'}
                    </motion.span>
                  </motion.div>
                </motion.button>
                <button
                  onClick={() => setIsQrOpen(false)}
                  className="flex-1 p-2 rounded-md bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-300 text-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Modal */}
      <AnimatePresence>
        {levelModalOpen && selectedLevel && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLevelModalOpen(false)}
          >
            <motion.div
              className="relative w-[95%] max-w-md p-6 bg-gradient-to-br from-black/80 to-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const activeSet = new Set<number>();
                if (userLevels?.active && userLevels.active.length) {
                  const arr = userLevels.active;
                  if (arr.length >= 17) {
                    for (let i = 1; i <= 16 && i < arr.length; i += 1) {
                      if (arr[i]) activeSet.add(i);
                    }
                  } else {
                    arr.forEach((isActive: boolean, idx: number) => {
                      if (isActive) activeSet.add(idx + 1);
                    });
                  }
                }
                
                const status = getLevelStatus(selectedLevel, activeSet);
                // Правильное получение данных уровня
                let levelData = null;
                if (userLevels && activeSet.has(selectedLevel)) {
                  // Пробуем разные индексы для поиска правильных данных
                  const indexes = [selectedLevel, selectedLevel - 1];
                  let foundData = null;
                  
                  for (const index of indexes) {
                    if (index >= 0 && userLevels.payouts?.[index] !== undefined) {
                      const testData = {
                        payouts: userLevels.payouts[index] || 0,
                        maxPayouts: userLevels.maxPayouts?.[index] || 2,
                        rewardSum: userLevels.rewardSum?.[index] || 0,
                        referralPayoutSum: userLevels.referralPayoutSum?.[index] || 0,
                      };
                      
                      // Если нашли данные с payouts > 0, используем их
                      if (testData.payouts > 0 || testData.rewardSum > 0) {
                        foundData = { ...testData, index };
                        break;
                      }
                    }
                  }
                  
                  levelData = foundData || {
                    payouts: userLevels.payouts?.[selectedLevel] || 0,
                    maxPayouts: userLevels.maxPayouts?.[selectedLevel] || 2,
                    rewardSum: userLevels.rewardSum?.[selectedLevel] || 0,
                    referralPayoutSum: userLevels.referralPayoutSum?.[selectedLevel] || 0,
                    index: selectedLevel
                  };

                  // Отладочная информация
                  console.log(`Level ${selectedLevel} data:`, {
                    selectedLevel,
                    foundIndex: levelData.index,
                    levelData,
                    allArrays: {
                      active: userLevels.active,
                      payouts: userLevels.payouts,
                      maxPayouts: userLevels.maxPayouts,
                      rewardSum: userLevels.rewardSum,
                    }
                  });
                }

                // Вычисление корректных значений цикла и прогресса, как в ProgramView
                const idxFor = (lvl: number, arrLen: number | undefined) =>
                  arrLen && arrLen >= 17 ? lvl : lvl - 1;
                const idxP = idxFor(selectedLevel, userLevels?.payouts?.length as any);
                const idxM = idxFor(selectedLevel, userLevels?.maxPayouts?.length as any);
                const payoutsNum = Number(userLevels?.payouts?.[idxP] ?? 0);
                const maxPayoutsNum = Math.max(1, Number(userLevels?.maxPayouts?.[idxM] ?? 2));
                const nextActiveFlag = Boolean(
                  userLevels?.active &&
                    (userLevels.active.length >= 17
                      ? (userLevels.active as any)[selectedLevel + 1]
                      : (userLevels.active as any)[selectedLevel])
                );
                const currentCycleCalc = nextActiveFlag
                  ? payoutsNum + 1
                  : Math.min(payoutsNum + 1, 2);
                // Align with Program View using queue position when available
                const qp = levelQueue;
                let cycleProgress = 0;
                if (qp && qp.total > 0) {
                  const total = Math.max(1, qp.total);
                  const place = Math.max(1, qp.place || 1);
                  if (place === 1) {
                    cycleProgress = 90;
                  } else {
                    cycleProgress = Math.max(0, Math.min(90, Math.round(((total - place + 1) / total) * 90)));
                  }
                } else {
                  // Fallback to payouts modulo logic
                  const peopleInCurrentCycle = payoutsNum % maxPayoutsNum;
                  cycleProgress = Math.max(
                    0,
                    Math.min(100, Math.round((peopleInCurrentCycle / maxPayoutsNum) * 100))
                  );
                }

                return (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                          status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
                          status === 'available' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                          status === 'locked' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/40' :
                          'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        }`}>
                          {selectedLevel}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-xl">Level {selectedLevel}</h3>
                          <p className="text-gray-400 text-sm">{formatBNB(LEVEL_PRICES[selectedLevel])} BNB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setLevelModalOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X size={20} className="text-gray-400" />
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                      status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
                      status === 'available' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                      status === 'locked' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/40' :
                      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}>
                      {status === 'active' && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                      {status === 'available' && <Play size={12} />}
                      {status === 'locked' && <Lock size={12} />}
                      {status === 'frozen' && <Snowflake size={12} />}
                      {status === 'active' ? 'Active' : 
                       status === 'available' ? 'Available' :
                       status === 'locked' ? 'Locked' : 'Frozen'}
                    </div>

                    {/* Content based on status */}
                    {status === 'active' && levelData && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                            <div className="text-gray-400 text-xs mb-1">Cycle</div>
                            <div className="text-white font-mono">{currentCycleCalc}/2</div>
                          </div>
                          <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                            <div className="text-gray-400 text-xs mb-1">Matrix</div>
                            <div className="text-white font-mono">{cycleProgress}%</div>
                          </div>
                        </div>

                        {/* Progress bar like Program View */}
                        <div className="mt-4">
                          <div className="text-xs mb-2 text-gray-400">{cycleProgress >= 90 ? 'Next participant = payout' : 'Cycle progress'}</div>
                          <div className="relative w-full bg-black/30 rounded-full h-3">
                            <motion.div
                              className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(0, Math.min(100, cycleProgress))}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                        </div>
                        
                        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                          <div className="text-green-400 text-sm font-medium mb-2">Total Earned</div>
                          <div className="text-green-400 font-bold text-xl font-mono">
                            {formatBNB(levelData.rewardSum + levelData.referralPayoutSum)} BNB
                          </div>
                          <div className="text-green-300 text-xs mt-1">
                            Matrix: {formatBNB(levelData.rewardSum)} + Referral: {formatBNB(levelData.referralPayoutSum)}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate('/program-view')}
                            className="flex-1 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-400/30 text-blue-400 font-medium transition-colors"
                          >
                            <Info size={16} className="inline mr-2" />
                            View Details
                          </button>
                        </div>
                      </div>
                    )}

                    {status === 'available' && (
                      <div className="space-y-4">
                        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                          <div className="text-blue-400 text-sm font-medium mb-2">Ready to Activate</div>
                          <div className="text-white">
                            Activate Level {selectedLevel} to start earning from this matrix level.
                          </div>
                        </div>

                        <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                          <div className="text-gray-400 text-sm mb-2">Activation Cost</div>
                          <div className="text-white font-bold text-2xl font-mono">
                            {formatBNB(LEVEL_PRICES[selectedLevel])} BNB
                          </div>
                          <div className="text-xs mt-2 flex justify-between">
                            <span className="text-gray-400">Your Balance:</span>
                            <span className={`font-mono ${
                              walletState.balance >= LEVEL_PRICES[selectedLevel] ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {formatBNB(walletState.balance)} BNB
                            </span>
                          </div>
                          {walletState.balance < LEVEL_PRICES[selectedLevel] && (
                            <div className="text-red-400 text-xs mt-2 p-2 bg-red-500/10 rounded border border-red-500/20">
                              ⚠️ Insufficient funds
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <motion.button
                            onClick={() => handleActivateLevel(selectedLevel)}
                            disabled={isActivatingLevel || walletState.balance < LEVEL_PRICES[selectedLevel]}
                            className={`flex-1 p-3 rounded-lg border font-medium transition-all duration-300 ${
                              isActivatingLevel || walletState.balance < LEVEL_PRICES[selectedLevel]
                                ? 'bg-gray-500/20 border-gray-500/30 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500/20 hover:bg-green-500/30 border-green-400/30 text-green-400'
                            }`}
                            whileHover={!isActivatingLevel && walletState.balance >= LEVEL_PRICES[selectedLevel] ? { scale: 1.02 } : {}}
                            whileTap={!isActivatingLevel && walletState.balance >= LEVEL_PRICES[selectedLevel] ? { scale: 0.98 } : {}}
                          >
                            {isActivatingLevel ? (
                              <>
                                <div className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                Activating...
                              </>
                            ) : walletState.balance < LEVEL_PRICES[selectedLevel] ? (
                              <>
                                <X size={16} className="inline mr-2" />
                                Insufficient Funds
                              </>
                            ) : (
                              <>
                                <Play size={16} className="inline mr-2" />
                                Activate Level
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {status === 'locked' && (
                      <div className="space-y-4">
                        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                          <div className="text-red-400 text-sm font-medium mb-2">Level Locked</div>
                          <div className="text-white">
                            Complete previous levels to unlock Level {selectedLevel}.
                          </div>
                        </div>

                        <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                          <div className="text-gray-400 text-sm mb-2">Time Until Unlock</div>
                          <div className="text-red-400 font-mono">
                            {/* Примерное время - можно добавить реальную логику */}
                            ~{selectedLevel * 2}h remaining
                          </div>
                        </div>
                      </div>
                    )}

                    {status === 'frozen' && (
                      <div className="space-y-4">
                        <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                          <div className="text-cyan-400 text-sm font-medium mb-2">Level Frozen</div>
                          <div className="text-white">
                            Level {selectedLevel} is temporarily unavailable. Check back later.
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {/* User Profile - Premium Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-gray-900/95 to-black/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20">
                  {/* Animated background elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/3 via-slate-500/3 to-gray-600/5"></div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-white/5 via-transparent to-transparent blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-gray-400/5 via-transparent to-transparent blur-3xl"></div>
                  
                  <div className="relative z-10 p-8">
                    {/* Profile Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                                                     <div className="w-20 h-20 rounded-2xl border-2 border-white/30 bg-gradient-to-br from-gray-700/60 via-slate-700/60 to-gray-800/60 flex items-center justify-center text-white font-bold text-xl shadow-2xl shadow-black/30 backdrop-blur-sm">
                             {(walletState.address || '#').slice(2, 4).toUpperCase()}
                           </div>
                           <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-slate-900 flex items-center justify-center">
                             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                           </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-4">
                            <span className="text-white font-mono font-black text-3xl">
                              #{formatUserId(contractInfo?.id)}
                            </span>
                            <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/40 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-green-300 text-xs font-semibold">ACTIVE</span>
                            </div>
                          </div>
                          <div className="text-white/60 font-mono text-sm bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                            {walletState.address ? `${walletState.address.slice(0, 14)}...${walletState.address.slice(-10)}` : '—'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right bg-black/30 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
                        <div className="text-gray-400 text-xs font-medium mb-1">TOTAL EARNINGS</div>
                        <div className="text-green-400 font-bold font-mono text-2xl">
                          {formatBNB(contractInfo?.levelsRewardSum ?? 0)} BNB
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="group relative bg-black/40 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="text-gray-400" size={14} />
                          <span className="text-gray-400 text-xs font-medium">MEMBER SINCE</span>
                        </div>
                        <div className="text-white font-mono text-sm font-semibold">
                          {contractInfo?.registrationTimestamp
                            ? new Date(contractInfo.registrationTimestamp).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })
                            : '—'}
                        </div>
                      </div>
                      
                      <div className="group relative bg-black/40 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="text-gray-400" size={14} />
                          <span className="text-gray-400 text-xs font-medium">INVITED BY</span>
                        </div>
                        <div className="text-white font-mono text-sm font-semibold">
                          {contractInfo?.referrerId && contractInfo.referrerId > 0
                            ? `#${formatUserId(contractInfo.referrerId)}`
                            : 'Direct Join'}
                        </div>
                      </div>
                      
                      <div className="group relative bg-black/40 rounded-xl p-4 border border-white/10 hover:border-green-400/30 transition-all duration-300 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="text-green-400" size={14} />
                          <span className="text-gray-400 text-xs font-medium">ACTIVE LEVELS</span>
                        </div>
                        <div className="text-green-400 font-bold text-sm font-mono">
                          {activatedCount}/16 Levels
                        </div>
                      </div>
                    </div>

                    {/* Referral Section */}
                    <div className="relative bg-black/30 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                          <Share2 className="text-white" size={18} />
                        </div>
                        <h4 className="text-white font-bold text-lg">
                          Your Referral Link
                        </h4>
                      </div>
                        <div className="bg-black/40 rounded-xl p-4 mb-4 border border-white/10 backdrop-blur-sm">
                          <div className="text-white/90 font-mono text-sm break-all leading-relaxed">
                            {generateReferralLink(formatUserId(contractInfo?.id))}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <motion.button
                            onClick={copyReferralLink}
                            className={`flex-1 p-4 rounded-xl transition-all duration-300 border text-sm font-semibold overflow-hidden relative backdrop-blur-sm ${
                              referralCopied
                                ? 'bg-green-500/20 border-green-400/40 text-green-300'
                                : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/40 hover:border-cyan-400/60 text-cyan-300'
                            }`}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-green-400/20 rounded-xl"
                              initial={{ scale: 0, opacity: 1 }}
                              animate={referralCopied ? {
                                scale: [0, 1.5],
                                opacity: [1, 0],
                                transition: { duration: 0.6, ease: "easeOut" }
                              } : { scale: 0, opacity: 0 }}
                            />
                            <motion.div 
                              className="inline-flex items-center relative z-10 gap-2"
                              initial={false}
                              animate={referralCopied ? {
                                y: [-15, 0],
                                opacity: [0, 1],
                                transition: { duration: 0.4, ease: "easeOut" }
                              } : { y: 0, opacity: 1 }}
                            >
                              <motion.div
                                initial={false}
                                animate={referralCopied ? {
                                  rotate: [0, -10, 10, 0],
                                  scale: [1, 1.2, 1],
                                  transition: { duration: 0.5, ease: "easeInOut" }
                                } : {}}
                              >
                                {referralCopied ? <Check size={18} /> : <Copy size={18} />}
                              </motion.div>
                              <motion.span
                                initial={false}
                                animate={referralCopied ? {
                                  scale: [1, 1.1, 1],
                                  transition: { duration: 0.3, delay: 0.1 }
                                } : {}}
                              >
                                {referralCopied ? 'Successfully Copied!' : 'Copy Referral Link'}
                              </motion.span>
                            </motion.div>
                          </motion.button>
                          <motion.button
                            onClick={openQrModal}
                            className="px-6 py-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-all duration-300 border border-purple-400/40 hover:border-purple-400/60 text-purple-300 text-sm font-semibold flex items-center gap-2 backdrop-blur-sm"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <QrCode size={18} />
                            QR Code
                          </motion.button>
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Level Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <GlassCard className="p-6 rounded-xl">
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
                        <div className="w-4 h-4 bg-gray-500 rounded border border-gray-500/40"></div>
                        <span className="text-gray-300">Locked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-cyan-400 rounded border border-cyan-400/40"></div>
                        <span className="text-gray-300">Frozen</span>
                      </div>
                    </div>
                  </div>

                  {renderLevelVisualization()}
                </GlassCard>
              </motion.div>

              {/* How Game Works - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Matrix */}
                    <div
                      className="relative p-3 rounded-xl transition-all duration-300 border bg-black/40 border-cyan-400/30 hover:border-cyan-400/50"
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
                      className="relative p-3 rounded-xl transition-all duration-300 border bg-black/40 border-purple-400/30 hover:border-purple-400/50"
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
                      className="relative p-3 rounded-xl transition-all duration-300 border bg-black/40 border-green-400/30 hover:border-green-400/50"
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
                      className="relative p-3 rounded-xl transition-all duration-300 border bg-black/40 border-orange-400/30 hover:border-orange-400/50"
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

              {/* How Game Works Expandable Section (moved under features grid) */}
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <GlassCard className="p-4 border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl">
                  <button
                    onClick={() => setIsGameWorksExpanded(!isGameWorksExpanded)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg border border-purple-400/30">
                        <BookOpen className="text-purple-400" size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">HOW GAME WORKS</h3>
                        <p className="text-gray-400 text-xs">Understanding the Quantum Profit Chain mechanics</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isGameWorksExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-purple-400"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isGameWorksExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 pt-6 border-t border-purple-400/20">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Matrix System */}
                            <div className="space-y-4">
                              <h4 className="text-base font-semibold text-cyan-400 flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                MATRIX SYSTEM
                              </h4>
                              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                                <p>
                                  <span className="text-cyan-400 font-medium">16 Levels:</span> Each level represents a matrix with increasing rewards and costs.
                                </p>
                                <p>
                                  <span className="text-cyan-400 font-medium">Activation:</span> Pay the level cost to activate your matrix position.
                                </p>
                                <p>
                                  <span className="text-cyan-400 font-medium">Cycles:</span> Each matrix has 2 cycles. Complete cycles to earn rewards.
                                </p>
                                <p>
                                  <span className="text-cyan-400 font-medium">Progression:</span> Higher levels unlock as you activate lower levels.
                                </p>
                              </div>
                            </div>

                            {/* Referral System */}
                            <div className="space-y-4">
                              <h4 className="text-base font-semibold text-purple-400 flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                REFERRAL SYSTEM
                              </h4>
                              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                                <p>
                                  <span className="text-purple-400 font-medium">26% Bonus:</span> Earn 26% of your referrals' level activations.
                                </p>
                                <p>
                                  <span className="text-purple-400 font-medium">Direct Referrals:</span> Invite users with your unique referral link.
                                </p>
                                <p>
                                  <span className="text-purple-400 font-medium">Passive Income:</span> Earn from all your referrals' activities.
                                </p>
                                  <p>
                                  <span className="text-purple-400 font-medium">No Limits:</span> Unlimited referral earnings potential.
                                </p>
                              </div>
                            </div>

                            {/* Rewards System */}
                            <div className="space-y-4">
                              <h4 className="text-base font-semibold text-green-400 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                REWARDS SYSTEM
                              </h4>
                              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                                <p>
                                  <span className="text-green-400 font-medium">Matrix Rewards:</span> Earn from completing matrix cycles.
                                </p>
                                <p>
                                  <span className="text-green-400 font-medium">Referral Bonuses:</span> 26% commission from referrals.
                                </p>
                                <p>
                                  <span className="text-green-400 font-medium">Level Scaling:</span> Higher levels = higher rewards.
                                </p>
                                <p>
                                  <span className="text-green-400 font-medium">Instant Payouts:</span> Rewards paid immediately upon completion.
                                </p>
                              </div>
                            </div>

                            {/* Security & Transparency */}
                            <div className="space-y-4">
                              <h4 className="text-base font-semibold text-blue-400 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                SECURITY & TRANSPARENCY
                              </h4>
                              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                                <p>
                                  <span className="text-blue-400 font-medium">Smart Contract:</span> All logic is on-chain and verifiable.
                                </p>
                                <p>
                                  <span className="text-blue-400 font-medium">BNB Network:</span> Built on BNB Smart Chain for speed and low fees.
                                </p>
                                <p>
                                  <span className="text-blue-400 font-medium">No Admin Keys:</span> Contract is immutable and secure.
                                </p>
                                <p>
                                  <span className="text-blue-400 font-medium">Public Data:</span> All transactions are transparent and verifiable.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Call to Action */}
                          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-400/20">
                            <div className="text-center">
                              <p className="text-white font-medium mb-2">Ready to start earning?</p>
                              <p className="text-gray-400 text-sm">
                                Activate your first level and begin your journey in the Quantum Profit Chain!
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                <GlassCard className="p-4 border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-xl">
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
                <GlassCard className="p-6 border border-green-400/20 bg-gradient-to-br from-green-500/5 to-cyan-500/5 rounded-xl">
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
                <GlassCard className="p-6 border border-orange-400/20 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-xl">
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

          {/* How Game Works Expandable Section */}
          {false && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
                            <GlassCard className="p-4 border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl">
              <button
                onClick={() => setIsGameWorksExpanded(!isGameWorksExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg border border-purple-400/30">
                    <BookOpen className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">HOW GAME WORKS</h3>
                    <p className="text-gray-400 text-xs">Understanding the Quantum Profit Chain mechanics</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isGameWorksExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-purple-400"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {isGameWorksExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t border-purple-400/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Matrix System */}
                        <div className="space-y-4">
                          <h4 className="text-base font-semibold text-cyan-400 flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            MATRIX SYSTEM
                          </h4>
                          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                            <p>
                              <span className="text-cyan-400 font-medium">16 Levels:</span> Each level represents a matrix with increasing rewards and costs.
                            </p>
                            <p>
                              <span className="text-cyan-400 font-medium">Activation:</span> Pay the level cost to activate your matrix position.
                            </p>
                            <p>
                              <span className="text-cyan-400 font-medium">Cycles:</span> Each matrix has 2 cycles. Complete cycles to earn rewards.
                            </p>
                            <p>
                              <span className="text-cyan-400 font-medium">Progression:</span> Higher levels unlock as you activate lower levels.
                            </p>
                          </div>
                        </div>

                        {/* Referral System */}
                        <div className="space-y-4">
                          <h4 className="text-base font-semibold text-purple-400 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            REFERRAL SYSTEM
                          </h4>
                          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                            <p>
                              <span className="text-purple-400 font-medium">26% Bonus:</span> Earn 26% of your referrals' level activations.
                            </p>
                            <p>
                              <span className="text-purple-400 font-medium">Direct Referrals:</span> Invite users with your unique referral link.
                            </p>
                            <p>
                              <span className="text-purple-400 font-medium">Passive Income:</span> Earn from all your referrals' activities.
                            </p>
                            <p>
                              <span className="text-purple-400 font-medium">No Limits:</span> Unlimited referral earnings potential.
                            </p>
                          </div>
                        </div>

                        {/* Rewards System */}
                        <div className="space-y-4">
                          <h4 className="text-base font-semibold text-green-400 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            REWARDS SYSTEM
                          </h4>
                          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                            <p>
                              <span className="text-green-400 font-medium">Matrix Rewards:</span> Earn from completing matrix cycles.
                            </p>
                            <p>
                              <span className="text-green-400 font-medium">Referral Bonuses:</span> 26% commission from referrals.
                            </p>
                            <p>
                              <span className="text-green-400 font-medium">Level Scaling:</span> Higher levels = higher rewards.
                            </p>
                            <p>
                              <span className="text-green-400 font-medium">Instant Payouts:</span> Rewards paid immediately upon completion.
                            </p>
                          </div>
                        </div>

                        {/* Security & Transparency */}
                        <div className="space-y-4">
                          <h4 className="text-base font-semibold text-blue-400 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            SECURITY & TRANSPARENCY
                          </h4>
                          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                            <p>
                              <span className="text-blue-400 font-medium">Smart Contract:</span> All logic is on-chain and verifiable.
                            </p>
                            <p>
                              <span className="text-blue-400 font-medium">BNB Network:</span> Built on BNB Smart Chain for speed and low fees.
                            </p>
                            <p>
                              <span className="text-blue-400 font-medium">No Admin Keys:</span> Contract is immutable and secure.
                            </p>
                            <p>
                              <span className="text-blue-400 font-medium">Public Data:</span> All transactions are transparent and verifiable.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-400/20">
                        <div className="text-center">
                          <p className="text-white font-medium mb-2">Ready to start earning?</p>
                          <p className="text-gray-400 text-sm">
                            Activate your first level and begin your journey in the Quantum Profit Chain!
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
          )}



          {/* Statistics removed from dashboard - not needed here */}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
