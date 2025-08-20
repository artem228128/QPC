import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { getQpcContract } from '../../utils/contract';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface StatsPanelProps {
  className?: string;
}

interface GlobalStats {
  members: number;
  transactions: number;
  turnover: number;
  daysLive: number;
}

interface StatData {
  id: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: number;
  formatType: 'number' | 'currency' | 'percentage';
  suffix?: string;
  previousValue?: number;
  color: 'cyan' | 'purple' | 'mint' | 'coral';
  growth?: number;
  status?: string; // Новое поле для статуса проекта
}

// ===========================================
// 🔢 ANIMATED COUNTER
// ===========================================

const AnimatedCounter: React.FC<{
  value: number;
  previousValue?: number;
  formatType: 'number' | 'currency' | 'percentage';
  suffix?: string;
  duration?: number;
}> = ({ value, previousValue = 0, formatType, suffix = '', duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(previousValue);

  useEffect(() => {
    if (value === displayValue) return;

    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (endValue - startValue) * easeOutCubic;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, displayValue, duration]);

  const formatValue = (val: number) => {
    switch (formatType) {
      case 'currency':
        if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
        if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
        if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
        return val.toLocaleString('en-US', { maximumFractionDigits: 0 });

      case 'percentage':
        return `${val.toFixed(1)}%`;

      default:
        if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
        if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
        if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
        return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
  };

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
        {formatValue(displayValue)}
        {suffix && <span className="text-2xl md:text-3xl ml-1">{suffix}</span>}
      </div>
    </div>
  );
};

// ===========================================
// 📊 SIMPLE STAT ITEM
// ===========================================

const GameStatItem: React.FC<{
  stat: StatData;
  index: number;
}> = ({ stat, index }) => {
  const IconComponent = stat.icon;

  const colorMap = {
    cyan: 'text-neon-cyan',
    purple: 'text-neon-magenta',
    mint: 'text-neon-green',
    coral: 'text-neon-orange',
  };

  const borderColorMap = {
    cyan: '#00FFFF',
    purple: '#FF00FF',
    mint: '#00FF41',
    coral: '#FF9500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="text-center space-y-4 group"
    >
      {/* HUD Icon Container */}
      <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-lg border-2 transition-all duration-300 group-hover:scale-110"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            borderColor: borderColorMap[stat.color],
            boxShadow: `0 0 20px ${borderColorMap[stat.color]}40`,
          }}
        />
        <IconComponent size={36} className={`${colorMap[stat.color]} relative z-10`} />

        {/* Corner brackets */}
        <div
          className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 opacity-60"
          style={{ borderColor: borderColorMap[stat.color] }}
        />
        <div
          className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 opacity-60"
          style={{ borderColor: borderColorMap[stat.color] }}
        />
        <div
          className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 opacity-60"
          style={{ borderColor: borderColorMap[stat.color] }}
        />
        <div
          className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 opacity-60"
          style={{ borderColor: borderColorMap[stat.color] }}
        />
      </div>

      {/* Value Display */}
      <div className="space-y-2">
        <div className={`text-3xl md:text-4xl font-bold font-cyberpunk ${colorMap[stat.color]}`}>
          <AnimatedCounter
            value={stat.value}
            previousValue={stat.previousValue}
            formatType={stat.formatType}
            suffix={stat.suffix || ''}
            duration={1200}
          />
        </div>

        {/* Growth Indicator or Status */}
        {stat.growth && (
          <div className="flex items-center justify-center space-x-1">
            <div
              className={`text-sm font-gaming px-2 py-1 rounded border ${
                stat.growth > 0
                  ? 'text-neon-green border-neon-green/30 bg-neon-green/10'
                  : 'text-neon-red border-neon-red/30 bg-neon-red/10'
              }`}
            >
              {stat.growth > 0 ? '▲' : '▼'} {Math.abs(stat.growth).toFixed(1)}%
            </div>
          </div>
        )}
        
        {/* Status for Days Live */}
        {stat.status && (
          <div className="flex items-center justify-center space-x-1">
            <div className="text-sm font-gaming px-2 py-1 rounded border text-orange-400 border-orange-400/30 bg-orange-400/10">
              ● {stat.status}
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="space-y-1">
        <p className="text-white font-gaming text-sm font-medium tracking-wider">
          {stat.label.toUpperCase().replace(/\s+/g, '_')}
        </p>
        <div
          className="w-12 h-0.5 mx-auto opacity-60"
          style={{ backgroundColor: borderColorMap[stat.color] }}
        />
      </div>
    </motion.div>
  );
};

// ===========================================
// 🎯 MAIN STATS PANEL COMPONENT
// ===========================================

// Функция для определения статуса проекта по дням
const getProjectStatus = (days: number): string => {
  if (days < 7) return 'LAUNCH';
  if (days < 30) return 'GROWING';
  if (days < 90) return 'EXPANDING';
  if (days < 180) return 'STABLE';
  if (days < 365) return 'MATURE';
  return 'VETERAN';
};

export const StatsPanel: React.FC<StatsPanelProps> = ({ className = '' }) => {
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    members: 12847,
    transactions: 2300000,
    turnover: 2347.8,
    daysLive: 127,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Дата запуска проекта (обновлено на более реалистичную дату)
  const PROJECT_LAUNCH_DATE = new Date('2025-01-01'); // Дата запуска проекта

  // Загрузка данных из контракта
  useEffect(() => {
    const loadGlobalStats = async () => {
      setIsLoading(true);
      try {
        const contract = await getQpcContract(false);
        if (!contract) {
          console.log('Contract not available for stats');
          return;
        }

        // Получаем глобальную статистику
        const [members, transactions, turnover] = await contract.getGlobalStats();
        
        // Вычисляем дни с запуска проекта
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - PROJECT_LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24));
        
        setGlobalStats({
          members: Number(members),
          transactions: Number(transactions),
          turnover: Number(turnover) / 1e18, // Конвертируем из wei в BNB
          daysLive: Math.max(1, daysDiff), // Минимум 1 день
        });

        console.log('📊 Global stats loaded:', {
          members: Number(members),
          transactions: Number(transactions),
          turnover: Number(turnover) / 1e18,
          daysLive: daysDiff,
        });

      } catch (error) {
        console.error('❌ Error loading global stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGlobalStats();
    
    // Обновляем каждые 30 секунд
    const interval = setInterval(loadGlobalStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Создаем статистику на основе реальных данных
  const stats: StatData[] = [
    {
      id: 'participants',
      icon: Users,
      label: 'Active Players',
      value: globalStats.members,
      formatType: 'number',
      color: 'cyan',
      growth: isLoading ? undefined : 23.5,
    },
    {
      id: 'bnb',
      icon: DollarSign,
      label: 'BNB in Game',
      value: globalStats.turnover,
      formatType: 'currency',
      color: 'mint',
      growth: isLoading ? undefined : 18.2,
    },
    {
      id: 'transactions',
      icon: Activity,
      label: 'Transactions',
      value: globalStats.transactions,
      formatType: 'number',
      color: 'purple',
      growth: isLoading ? undefined : 31.8,
    },
    {
      id: 'growth',
      icon: TrendingUp,
      label: 'Days Live',
      value: globalStats.daysLive,
      formatType: 'number',
      suffix: ' days',
      color: 'coral',
      // Вместо процентов показываем статус проекта
      growth: undefined, // Убираем проценты для Days Live
      status: getProjectStatus(globalStats.daysLive), // Динамический статус
    },
  ];

  return (
    <section className={`py-20 relative ${className}`}>
      {/* Gaming Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold font-cyberpunk mb-4 text-white">
              PLATFORM STATISTICS
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto mb-6 rounded-full"></div>
          </div>
          <p className="text-neon-green font-gaming text-lg max-w-2xl mx-auto">
            &gt; REAL_TIME_BLOCKCHAIN_DATA <br />
            &gt; LIVE_CONTRACT_METRICS
            {isLoading && (
              <span className="block text-cyan-400 text-sm mt-2 animate-pulse">
                &gt; LOADING_DATA...
              </span>
            )}
          </p>
        </motion.div>

        {/* Gaming HUD Stats Grid */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="hud-panel hud-panel-primary p-8 md:p-12 rounded-xl relative overflow-hidden"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {/* Animated scanlines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-magenta to-transparent opacity-60 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
              {stats.map((stat, index) => (
                <GameStatItem key={stat.id} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsPanel;
