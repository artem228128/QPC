import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw, Filter, Clock, Award, Activity, Eye } from 'lucide-react';
import { GlassPanel } from '../glass';
import { NeuralNode } from '../neural';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface LiveActivationsTableProps {
  className?: string;
}

interface Activation {
  id: string;
  userId: string;
  level: number;
  amount: number;
  timestamp: Date;
  status: 'active' | 'recycling' | 'completed';
  txHash: string;
  isNew?: boolean;
}

interface TableFilters {
  status: 'all' | 'active' | 'recycling' | 'completed';
  level: 'all' | number;
  timeRange: 'all' | '1h' | '24h' | '7d';
}

// ===========================================
// 🎯 ACTIVATION STATUS BADGE
// ===========================================

const StatusBadge: React.FC<{ status: Activation['status'] }> = ({ status }) => {
  const statusConfig = {
    active: {
      color: 'bg-neural-mint',
      text: 'Active',
      shortText: 'Act',
      glow: 'shadow-neural-mint',
    },
    recycling: {
      color: 'bg-neural-purple',
      text: 'Recycling',
      shortText: 'Rec',
      glow: 'shadow-neural-purple',
    },
    completed: {
      color: 'bg-neural-cyan',
      text: 'Completed',
      shortText: 'Done',
      glow: 'shadow-neural-cyan',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      className={`inline-flex items-center space-x-1 xs:space-x-2 px-2.5 xs:px-3 py-1 xs:py-1 rounded-full glass-panel-secondary ${config.glow}`}
      whileHover={{ scale: 1.05 }}
      layout
    >
      <div
        className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full ${config.color} animate-neural-pulse`}
      />
      <span className="text-xs xs:text-sm font-medium text-white whitespace-nowrap">
        <span className="hidden sm:inline">{config.text}</span>
        <span className="sm:hidden">{config.shortText}</span>
      </span>
    </motion.div>
  );
};

// ===========================================
// 📱 LEVEL BADGE
// ===========================================

const LevelBadge: React.FC<{ level: number; className?: string }> = ({ level, className = '' }) => {
  const getLevelColor = (lvl: number) => {
    if (lvl <= 4) return 'text-neural-mint border-neural-mint';
    if (lvl <= 8) return 'text-neural-cyan border-neural-cyan';
    if (lvl <= 12) return 'text-neural-purple border-neural-purple';
    return 'text-neural-coral border-neural-coral';
  };

  return (
    <motion.div
      className={`inline-flex items-center space-x-0.5 xs:space-x-1 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-lg border glass-panel-neural ${getLevelColor(level)} ${className}`}
      whileHover={{ scale: 1.1 }}
    >
      <Award size={10} className="xs:w-3 xs:h-3" />
      <span className="text-xs xs:text-sm font-bold">{level}</span>
    </motion.div>
  );
};

// ===========================================
// ⏰ RELATIVE TIME
// ===========================================

const RelativeTime: React.FC<{ timestamp: Date }> = ({ timestamp }) => {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) {
        setTimeString(`${seconds}s ago`);
      } else if (minutes < 60) {
        setTimeString(`${minutes}m ago`);
      } else if (hours < 24) {
        setTimeString(`${hours}h ago`);
      } else {
        setTimeString(`${days}d ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div className="flex items-center space-x-1 text-white/60">
      <Clock size={10} className="xs:w-3 xs:h-3" />
      <span className="text-xs xs:text-sm">{timeString}</span>
    </div>
  );
};

// ===========================================
// 📊 TABLE ROW COMPONENT
// ===========================================

const ActivationRow: React.FC<{
  activation: Activation;
  index: number;
  onViewDetails: (activation: Activation) => void;
}> = ({ activation, index, onViewDetails }) => {
  const formatUserId = (userId: string) => {
    return `${userId.slice(0, 6)}...${userId.slice(-4)}`;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const handleTxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://bscscan.com/tx/${activation.txHash}`, '_blank');
  };

  return (
    <motion.tr
      className="group hover:bg-white/5 cursor-pointer transition-colors duration-200 border-b border-white/10"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onViewDetails(activation)}
      layout
    >
      {/* User ID */}
      <td className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4" style={{ minWidth: '120px' }}>
        <div className="flex items-center space-x-1 xs:space-x-2 lg:space-x-3">
          <NeuralNode
            size="small"
            color="primary"
            status={activation.isNew ? 'pulsing' : 'active'}
            disableHover
            className="w-2 h-2 xs:w-3 xs:h-3 flex-shrink-0"
          />
          <span className="font-mono text-xs xs:text-sm text-white group-hover:text-neural-cyan transition-colors truncate">
            <span className="hidden lg:inline">{formatUserId(activation.userId)}</span>
            <span className="lg:hidden">
              {activation.userId.slice(0, 4)}...{activation.userId.slice(-2)}
            </span>
          </span>
        </div>
      </td>

      {/* Level */}
      <td className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4" style={{ minWidth: '70px' }}>
        <LevelBadge level={activation.level} className="text-xs xs:text-sm" />
      </td>

      {/* Amount */}
      <td className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4" style={{ minWidth: '110px' }}>
        <div className="text-right">
          <div className="text-sm xs:text-lg font-bold text-white truncate">
            {formatAmount(activation.amount)}
          </div>
          <div className="text-xs xs:text-sm text-white/60">BNB</div>
        </div>
      </td>

      {/* Time */}
      <td className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4" style={{ minWidth: '90px' }}>
        <RelativeTime timestamp={activation.timestamp} />
      </td>

      {/* Status */}
      <td className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4" style={{ minWidth: '130px' }}>
        <StatusBadge status={activation.status} />
      </td>

      {/* TX Link */}
      <td className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4" style={{ minWidth: '100px' }}>
        <div className="flex items-center space-x-1 xs:space-x-2">
          <motion.button
            onClick={handleTxClick}
            className="p-1.5 xs:p-2 rounded-lg hover:bg-white/10 text-neural-cyan hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink size={12} className="xs:w-4 xs:h-4" />
          </motion.button>
          <motion.button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onViewDetails(activation);
            }}
            className="p-1.5 xs:p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={12} className="xs:w-4 xs:h-4" />
          </motion.button>
        </div>
      </td>

      {/* New Badge */}
      <AnimatePresence>
        {activation.isNew && (
          <motion.td
            className="absolute right-2 top-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-3 h-3 rounded-full bg-neural-coral animate-neural-pulse" />
          </motion.td>
        )}
      </AnimatePresence>
    </motion.tr>
  );
};

// ===========================================
// 🔍 FILTERS COMPONENT
// ===========================================

const TableFiltersComponent: React.FC<{
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
}> = ({ filters, onFiltersChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <Filter size={16} className="text-white/60" />
        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
          className="glass-panel-secondary px-3 py-2 rounded-lg text-white text-sm bg-transparent border-none focus:ring-2 focus:ring-neural-cyan"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="recycling">Recycling</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Level Filter */}
      <select
        value={filters.level}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            level: e.target.value === 'all' ? 'all' : parseInt(e.target.value),
          })
        }
        className="glass-panel-secondary px-3 py-2 rounded-lg text-white text-sm bg-transparent border-none focus:ring-2 focus:ring-neural-cyan"
      >
        <option value="all">All Levels</option>
        {Array.from({ length: 16 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            Level {i + 1}
          </option>
        ))}
      </select>

      {/* Time Range Filter */}
      <select
        value={filters.timeRange}
        onChange={(e) => onFiltersChange({ ...filters, timeRange: e.target.value as any })}
        className="glass-panel-secondary px-3 py-2 rounded-lg text-white text-sm bg-transparent border-none focus:ring-2 focus:ring-neural-cyan"
      >
        <option value="all">All Time</option>
        <option value="1h">Last Hour</option>
        <option value="24h">Last 24h</option>
        <option value="7d">Last 7 days</option>
      </select>
    </div>
  );
};

// ===========================================
// 💀 LOADING SKELETON
// ===========================================

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={i}
        className="h-16 glass-panel-secondary rounded-lg"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

// ===========================================
// 📊 MAIN TABLE COMPONENT
// ===========================================

export const LiveActivationsTable: React.FC<LiveActivationsTableProps> = ({ className = '' }) => {
  const [activations, setActivations] = useState<Activation[]>([]);
  const [filteredActivations, setFilteredActivations] = useState<Activation[]>([]);
  const [filters, setFilters] = useState<TableFilters>({
    status: 'all',
    level: 'all',
    timeRange: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [, setSelectedActivation] = useState<Activation | null>(null);

  const itemsPerPage = 8;

  // Mock data generator
  const generateMockActivation = (): Activation => {
    const statuses: Activation['status'][] = ['active', 'recycling', 'completed'];
    const now = new Date();

    return {
      id: Math.random().toString(36).substr(2, 9),
      userId: `0x${Math.random().toString(16).substr(2, 40)}`,
      level: Math.floor(Math.random() * 16) + 1,
      amount: Math.random() * 10 + 0.1,
      timestamp: new Date(now.getTime() - Math.random() * 3600000), // Last hour
      status: statuses[Math.floor(Math.random() * statuses.length)],
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      isNew: Math.random() > 0.7, // 30% chance of being new
    };
  };

  // Initial data load
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData = Array.from({ length: 50 }, generateMockActivation).sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      setActivations(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new activation
        const newActivation = generateMockActivation();
        newActivation.isNew = true;

        setActivations((prev) => [newActivation, ...prev.slice(0, 49)]);

        // Remove new flag after 5 seconds
        setTimeout(() => {
          setActivations((prev) =>
            prev.map((act) => (act.id === newActivation.id ? { ...act, isNew: false } : act))
          );
        }, 5000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter activations
  useEffect(() => {
    let filtered = [...activations];

    if (filters.status !== 'all') {
      filtered = filtered.filter((act) => act.status === filters.status);
    }

    if (filters.level !== 'all') {
      filtered = filtered.filter((act) => act.level === filters.level);
    }

    if (filters.timeRange !== 'all') {
      const now = new Date();
      let cutoff = new Date();

      switch (filters.timeRange) {
        case '1h':
          cutoff.setHours(now.getHours() - 1);
          break;
        case '24h':
          cutoff.setDate(now.getDate() - 1);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
      }

      filtered = filtered.filter((act) => act.timestamp >= cutoff);
    }

    setFilteredActivations(filtered);
  }, [activations, filters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const paginatedActivations = filteredActivations.slice(0, page * itemsPerPage);

  return (
    <section className={`py-12 xs:py-16 mt-8 xs:mt-12 ${className}`}>
      <div className="container mx-auto px-2 xs:px-4">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6 xs:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white mb-2">
              <span className="hidden xs:inline">Live Activations</span>
              <span className="xs:hidden">Live Activity</span>
            </h2>
            <div className="flex items-center space-x-1 xs:space-x-2 text-white/60">
              <Activity size={14} className="xs:w-4 xs:h-4 text-neural-cyan" />
              <span className="text-xs xs:text-sm">
                <span className="hidden sm:inline">Real-time network activity</span>
                <span className="sm:hidden">Real-time activity</span>
              </span>
            </div>
          </div>

          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 xs:p-3 glass-panel-secondary rounded-lg hover:glass-panel-neural transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw
              size={16}
              className={`xs:w-5 xs:h-5 text-neural-cyan ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <TableFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel variant="primary" padding="none" className="overflow-hidden">
            {isLoading ? (
              <div className="p-4 xs:p-6">
                <LoadingSkeleton />
              </div>
            ) : (
              <div className="relative">
                {/* Mobile scroll indicator */}
                <div className="lg:hidden flex justify-center mb-2">
                  <div className="flex items-center space-x-1 text-white/40 text-xs">
                    <span>←</span>
                    <span>Swipe to see more</span>
                    <span>→</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full lg:table-auto table-fixed lg:min-w-0 min-w-[650px]">
                    <colgroup className="lg:hidden">
                      <col style={{ width: '120px' }} />
                      <col style={{ width: '70px' }} />
                      <col style={{ width: '110px' }} />
                      <col style={{ width: '90px' }} />
                      <col style={{ width: '130px' }} />
                      <col style={{ width: '100px' }} />
                    </colgroup>
                    <thead className="border-b border-white/20">
                      <tr className="text-left">
                        <th
                          className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4 text-xs xs:text-sm font-semibold text-white/80 uppercase tracking-wider"
                          style={{ minWidth: '120px' }}
                        >
                          User
                        </th>
                        <th
                          className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4 text-xs xs:text-sm font-semibold text-white/80 uppercase tracking-wider"
                          style={{ minWidth: '70px' }}
                        >
                          <span className="hidden xs:inline">Level</span>
                          <span className="xs:hidden">Lvl</span>
                        </th>
                        <th
                          className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4 text-xs xs:text-sm font-semibold text-white/80 uppercase tracking-wider text-right"
                          style={{ minWidth: '110px' }}
                        >
                          Amount
                        </th>
                        <th
                          className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4 text-xs xs:text-sm font-semibold text-white/80 uppercase tracking-wider"
                          style={{ minWidth: '90px' }}
                        >
                          Time
                        </th>
                        <th
                          className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4 text-xs xs:text-sm font-semibold text-white/80 uppercase tracking-wider"
                          style={{ minWidth: '130px' }}
                        >
                          Status
                        </th>
                        <th
                          className="px-2 xs:px-3 lg:px-4 py-3 xs:py-4 text-xs xs:text-sm font-semibold text-white/80 uppercase tracking-wider"
                          style={{ minWidth: '100px' }}
                        >
                          <span className="hidden sm:inline">Actions</span>
                          <span className="sm:hidden">Act</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {paginatedActivations.map((activation, index) => (
                          <ActivationRow
                            key={activation.id}
                            activation={activation}
                            index={index}
                            onViewDetails={setSelectedActivation}
                          />
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Load More */}
            {!isLoading && paginatedActivations.length < filteredActivations.length && (
              <div className="p-4 xs:p-6 border-t border-white/10 text-center">
                <motion.button
                  onClick={handleLoadMore}
                  className="glass-button-secondary px-4 xs:px-6 py-2 xs:py-3 rounded-lg text-white hover:text-neural-cyan transition-colors text-sm xs:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="hidden xs:inline">
                    Load More ({filteredActivations.length - paginatedActivations.length} remaining)
                  </span>
                  <span className="xs:hidden">
                    Load More ({filteredActivations.length - paginatedActivations.length})
                  </span>
                </motion.button>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveActivationsTable;
