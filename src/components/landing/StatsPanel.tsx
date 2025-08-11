import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface StatsPanelProps {
  className?: string;
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
        {suffix}
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
            suffix={stat.suffix}
            duration={1200}
          />
        </div>

        {/* Growth Indicator */}
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

export const StatsPanel: React.FC<StatsPanelProps> = ({ className = '' }) => {
  // Static stats data - no WebSocket complexity
  const [stats] = useState<StatData[]>([
    {
      id: 'participants',
      icon: Users,
      label: 'Active Players',
      value: 12847,
      formatType: 'number',
      color: 'cyan',
      growth: 23.5,
    },
    {
      id: 'bnb',
      icon: DollarSign,
      label: 'BNB in Game',
      value: 2347.8,
      formatType: 'currency',
      color: 'mint',
      growth: 18.2,
    },
    {
      id: 'transactions',
      icon: Activity,
      label: 'Transactions',
      value: 2300000,
      formatType: 'number',
      color: 'purple',
      growth: 31.8,
    },
    {
      id: 'growth',
      icon: TrendingUp,
      label: 'Daily Growth',
      value: 127.3,
      formatType: 'percentage',
      color: 'coral',
      growth: 12.4,
    },
  ]);

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
            &gt; REAL_TIME_MATRIX_DATA <br />
            &gt; LIVE_ECOSYSTEM_METRICS
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
