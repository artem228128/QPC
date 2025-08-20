import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Calendar, TrendingUp, Users, Wallet, RefreshCw, Activity } from 'lucide-react';
import { GlassCard, GlassButton } from '../glass';
import { useWallet } from '../../hooks/useWallet';
import { getQpcContract } from '../../utils/contract';
import { formatBNB } from '../../utils/format';

interface Transaction {
  id: string;
  userId: number;
  type: 'level_purchase' | 'partner_bonus' | 'matrix_reward' | 'referral_bonus' | 'registration';
  date: string;
  level?: number;
  wallet: string;
  amount: number;
  profit?: number;
  blockNumber?: number;
  transactionHash?: string;
}

// Mock data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    userId: 12345,
    type: 'level_purchase',
    date: '2025-01-13 14:32',
    level: 3,
    wallet: '0x742d...8af9',
    amount: 0.1,
    profit: 0,
  },
  {
    id: 'tx2',
    userId: 98765,
    type: 'partner_bonus',
    date: '2025-01-13 11:45',
    level: 2,
    wallet: '0x123a...def4',
    amount: 0,
    profit: 0.014,
  },
  {
    id: 'tx3',
    userId: 23456,
    type: 'matrix_reward',
    date: '2025-01-12 16:22',
    level: 1,
    wallet: '0x567b...890c',
    amount: 0,
    profit: 0.037,
  },
  {
    id: 'tx4',
    userId: 34567,
    type: 'level_purchase',
    date: '2025-01-12 09:15',
    level: 4,
    wallet: '0x890d...234e',
    amount: 0.14,
    profit: 0,
  },
  {
    id: 'tx5',
    userId: 45678,
    type: 'referral_bonus',
    date: '2025-01-11 20:33',
    level: 2,
    wallet: '0xabc1...567f',
    amount: 0,
    profit: 0.018,
  },
  {
    id: 'tx6',
    userId: 56789,
    type: 'level_purchase',
    date: '2025-01-11 13:41',
    level: 5,
    wallet: '0xdef2...891a',
    amount: 0.2,
    profit: 0,
  },
  {
    id: 'tx7',
    userId: 67890,
    type: 'matrix_reward',
    date: '2025-01-10 18:27',
    level: 3,
    wallet: '0x123c...456b',
    amount: 0,
    profit: 0.074,
  },
  {
    id: 'tx8',
    userId: 78901,
    type: 'partner_bonus',
    date: '2025-01-10 12:05',
    level: 1,
    wallet: '0x456d...789c',
    amount: 0,
    profit: 0.013,
  },
];

const TYPE_LABELS = {
  level_purchase: 'Level Purchase',
  partner_bonus: 'Partner Bonus',
  matrix_reward: 'Matrix Reward',
  referral_bonus: 'Referral Bonus',
  registration: 'Registration',
};

const TYPE_COLORS = {
  level_purchase: 'text-blue-400',
  partner_bonus: 'text-purple-400',
  matrix_reward: 'text-green-400',
  referral_bonus: 'text-yellow-400',
  registration: 'text-cyan-400',
};

const TYPE_ICONS = {
  level_purchase: '🔥',
  partner_bonus: '💰',
  matrix_reward: '🎯',
  referral_bonus: '🤝',
  registration: '👤',
};

export const StatsTable: React.FC = () => {
  const { walletState, contractInfo } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [realTransactions, setRealTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState({
    totalTransactions: 0,
    totalMatrixProfit: 0,
    totalReferralProfit: 0,
  });

  // Функция загрузки данных из контракта
  const loadContractData = async () => {
    if (!walletState.isConnected) return;
    
    setIsLoading(true);
    try {
      const contract = await getQpcContract(false);
      if (!contract) {
        console.log('Contract not available');
        return;
      }

      console.log('🔍 Loading contract statistics...');
      
      // Получаем события за последние 100 блоков (как в PartnerBonusTable)
      const fromBlock = -100;
      
      const transactions: Transaction[] = [];
      const userIds = new Set<number>();
      let totalMatrixProfit = 0;
      let totalReferralProfit = 0;

      try {
        // Получаем события регистрации
        const registrationEvents = await contract.queryFilter(
          contract.filters.UserRegistration(),
          fromBlock
        );

        for (const event of registrationEvents) {
          if ('args' in event && event.args) {
            const block = await event.getBlock();
            const userId = Number(event.args.userId);
            userIds.add(userId);
            
            transactions.push({
              id: `reg-${event.transactionHash}-${event.index || 0}`,
              userId,
              type: 'registration',
              date: new Date(block.timestamp * 1000).toLocaleString(),
              wallet: event.args.userAddress,
              amount: 0.025, // Registration fee
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash,
            });
            // Регистрация не влияет на прибыль
          }
        }

        // Получаем события покупки уровней
        const buyLevelEvents = await contract.queryFilter(
          contract.filters.BuyLevel(),
          fromBlock
        );

        for (const event of buyLevelEvents) {
          if ('args' in event && event.args) {
            const block = await event.getBlock();
            const userId = Number(event.args.userId);
            const level = Number(event.args.level);
            const value = Number(event.args.value) / 1e18;
            userIds.add(userId);
            
            transactions.push({
              id: `buy-${event.transactionHash}-${event.index || 0}`,
              userId,
              type: 'level_purchase',
              date: new Date(block.timestamp * 1000).toLocaleString(),
              level,
              wallet: await contract.usersAddressById(userId),
              amount: value,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash,
            });
            // Покупка уровня не влияет на прибыль
          }
        }

        // Получаем события выплат уровней
        const levelPayoutEvents = await contract.queryFilter(
          contract.filters.LevelPayout(),
          fromBlock
        );

        for (const event of levelPayoutEvents) {
          if ('args' in event && event.args) {
            const block = await event.getBlock();
            const userId = Number(event.args.userId);
            const level = Number(event.args.level);
            const reward = Number(event.args.rewardValue) / 1e18;
            userIds.add(userId);
            
            transactions.push({
              id: `payout-${event.transactionHash}-${event.index || 0}`,
              userId,
              type: 'matrix_reward',
              date: new Date(block.timestamp * 1000).toLocaleString(),
              level,
              wallet: await contract.usersAddressById(userId),
              amount: 0,
              profit: reward,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash,
            });
            totalMatrixProfit += reward;
          }
        }

        // Получаем события реферальных выплат
        const referralPayoutEvents = await contract.queryFilter(
          contract.filters.ReferralPayout(),
          fromBlock
        );

        for (const event of referralPayoutEvents) {
          if ('args' in event && event.args) {
            const block = await event.getBlock();
            const referrerId = Number(event.args.referrerId);
            const level = Number(event.args.level);
            const reward = Number(event.args.rewardValue) / 1e18;
            userIds.add(referrerId);
            
            transactions.push({
              id: `ref-${event.transactionHash}-${event.index || 0}`,
              userId: referrerId,
              type: 'referral_bonus',
              date: new Date(block.timestamp * 1000).toLocaleString(),
              level,
              wallet: await contract.usersAddressById(referrerId),
              amount: 0,
              profit: reward,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash,
            });
            totalReferralProfit += reward;
          }
        }

        // Сортируем по дате (новые сначала)
        transactions.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0));
        
        setRealTransactions(transactions);
        setGlobalStats({
          totalTransactions: transactions.length,
          totalMatrixProfit,
          totalReferralProfit,
        });

        console.log(`📊 Loaded ${transactions.length} transactions, ${userIds.size} unique users`);
        
      } catch (eventError) {
        console.error('❌ Error loading events:', eventError);
        // Fallback to mock data if events fail
        setRealTransactions([]);
      }

    } catch (error) {
      console.error('❌ Error loading contract data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем данные при подключении кошелька или изменении contractInfo
  useEffect(() => {
    if (walletState.isConnected) {
      loadContractData();
    }
  }, [walletState.isConnected, contractInfo]);

  // Используем данные из контракта если доступны, иначе mock
  const dataToUse = realTransactions.length > 0 ? realTransactions : MOCK_TRANSACTIONS;
  const statsToUse = contractInfo ? {
    totalTransactions: realTransactions.length || MOCK_TRANSACTIONS.length,
    totalMatrixProfit: contractInfo.levelsRewardSum || 0,
    totalReferralProfit: contractInfo.referralPayoutSum || 0,
  } : {
    totalTransactions: MOCK_TRANSACTIONS.length,
    totalMatrixProfit: MOCK_TRANSACTIONS.filter(tx => tx.type === 'matrix_reward').reduce((sum, tx) => sum + (tx.profit || 0), 0),
    totalReferralProfit: MOCK_TRANSACTIONS.filter(tx => tx.type === 'referral_bonus').reduce((sum, tx) => sum + (tx.profit || 0), 0),
  };

  const filteredTransactions = useMemo(() => {
    return dataToUse.filter((tx) => {
      const matchesSearch =
        tx.userId.toString().includes(searchTerm) ||
        tx.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        TYPE_LABELS[tx.type].toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.transactionHash && tx.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const matchesLevel = levelFilter === 'all' || (tx.level && tx.level.toString() === levelFilter);

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const txDate = new Date(tx.date);
        const now = new Date();

        switch (dateFilter) {
          case 'today':
            matchesDate = txDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = txDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = txDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesType && matchesLevel && matchesDate;
    });
  }, [dataToUse, searchTerm, typeFilter, levelFilter, dateFilter]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 rounded-xl border border-blue-400/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Users className="text-blue-400" size={20} />
            </div>
            <div>
              <div className="text-blue-400 text-lg font-bold">
                {isLoading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  statsToUse.totalTransactions
                )}
              </div>
              <div className="text-gray-400 text-xs">Total Transactions</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 rounded-xl border border-green-400/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div>
              <div className="text-green-400 text-lg font-bold">
                {isLoading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  formatBNB(statsToUse.totalMatrixProfit)
                )}
              </div>
              <div className="text-gray-400 text-xs">Matrix Profit BNB</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 rounded-xl border border-purple-400/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Users className="text-purple-400" size={20} />
            </div>
            <div>
              <div className="text-purple-400 text-lg font-bold">
                {isLoading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  formatBNB(statsToUse.totalReferralProfit)
                )}
              </div>
              <div className="text-gray-400 text-xs">Referral Profit BNB</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-6 rounded-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="text-cyan-400" size={20} />
              Transaction Statistics
              {contractInfo && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-xl text-xs font-medium">
                  Contract Data
                </span>
              )}
            </h3>
            {walletState.isConnected && (
              <GlassButton
                variant="secondary"
                onClick={loadContractData}
                disabled={isLoading}
                className="p-2"
              >
                <RefreshCw 
                  size={16} 
                  className={`text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} 
                />
              </GlassButton>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search user ID, wallet, type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black/40 border border-white/20 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none w-64"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="registration">Registration</option>
              <option value="level_purchase">Level Purchase</option>
              <option value="partner_bonus">Partner Bonus</option>
              <option value="matrix_reward">Matrix Reward</option>
              <option value="referral_bonus">Referral Bonus</option>
            </select>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Levels</option>
              {Array.from({ length: 16 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Level {i + 1}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 pb-3 font-medium">User ID</th>
                <th className="text-left text-gray-400 pb-3 font-medium">Type</th>
                <th className="text-left text-gray-400 pb-3 font-medium">Date</th>
                <th className="text-left text-gray-400 pb-3 font-medium">Level</th>
                <th className="text-left text-gray-400 pb-3 font-medium">Wallet</th>
                <th className="text-right text-gray-400 pb-3 font-medium">Amount (BNB)</th>
                <th className="text-right text-gray-400 pb-3 font-medium">Profit (BNB)</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 text-white font-mono">#{tx.userId}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{TYPE_ICONS[tx.type]}</span>
                      <span className={`${TYPE_COLORS[tx.type]} font-medium`}>
                        {TYPE_LABELS[tx.type]}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-300 font-mono text-xs">{tx.date}</td>
                  <td className="py-3">
                    {tx.level ? (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-xl text-xs font-medium">
                        Level {tx.level}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="py-3 text-gray-300 font-mono text-xs">{tx.wallet}</td>
                  <td className="py-3 text-right">
                    {tx.amount > 0 ? (
                      <span className="text-red-400 font-mono">-{formatBNB(tx.amount)}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {tx.profit && tx.profit > 0 ? (
                      <span className="text-green-400 font-mono">+{formatBNB(tx.profit)}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent"></div>
              <div className="text-gray-400">Loading transaction data...</div>
            </div>
          </div>
        )}

        {!isLoading && filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center">
                <Search className="text-gray-400" size={32} />
              </div>
              <div className="text-gray-400">
                {!contractInfo && walletState.isConnected 
                  ? "No contract data found. Try connecting your wallet or check back later."
                  : "No transactions found matching your filters."
                }
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default StatsTable;
