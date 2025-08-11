import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Eye, Award, TrendingUp, Wallet, Activity } from 'lucide-react';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface AccountLookupProps {
  className?: string;
}

interface UserData {
  id: string;
  joinDate: Date;
  currentLevel: number;
  totalEarnings: number;
  totalInvested: number;
  referrals: number;
  activeMatrices: number;
  completedCycles: number;
  lastActivity: Date;
  levels: {
    level: number;
    isActive: boolean;
    cyclesCompleted: number;
    earnings: number;
    joinDate: Date;
  }[];
}

// ===========================================
// 🔍 SEARCH COMPONENT
// ===========================================

const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}> = ({ value, onChange, onSearch, isLoading }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter User ID (e.g. 1234567)"
          className="w-full bg-black/60 border border-neon-cyan/30 rounded-lg p-4 pr-12 text-white font-mono placeholder-white/40 focus:border-neon-cyan focus:outline-none transition-colors"
        />
        <motion.button
          onClick={onSearch}
          disabled={isLoading || !value.trim()}
          className="absolute right-2 top-2 p-2 bg-neon-cyan/20 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Search size={20} />
            </motion.div>
          ) : (
            <Search size={20} />
          )}
        </motion.button>
      </div>
    </div>
  );
};

// ===========================================
// 📊 USER STATS CARD
// ===========================================

type IconComponent = React.ComponentType<{ size?: number | string; className?: string }>;

const StatCard: React.FC<{
  icon: IconComponent;
  label: string;
  value: string;
  subValue?: string;
  color: string;
}> = ({ icon: Icon, label, value, subValue, color }) => {
  return (
    <motion.div
      className="hud-panel hud-panel-primary p-4 rounded-lg relative overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: `1px solid rgba(${color === 'cyan' ? '0, 255, 255' : color === 'green' ? '0, 255, 0' : '255, 0, 255'}, 0.3)`,
        boxShadow: `0 0 20px rgba(${color === 'cyan' ? '0, 255, 255' : color === 'green' ? '0, 255, 0' : '255, 0, 255'}, 0.2)`,
        backdropFilter: 'blur(4px)',
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-neon-${color}/20 border border-neon-${color}/30`}>
          <Icon size={20} className={`text-neon-${color}`} />
        </div>
        <div className="flex-1">
          <div className="text-white/60 text-xs font-terminal mb-1">{label}</div>
          <div className={`text-lg font-cyberpunk text-neon-${color}`}>{value}</div>
          {subValue && <div className="text-white/40 text-xs">{subValue}</div>}
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================
// 🎯 LEVEL STATUS COMPONENT
// ===========================================

const LevelStatus: React.FC<{ levelData: UserData['levels'][0] }> = ({ levelData }) => {
  return (
    <motion.div
      className="hud-panel hud-panel-secondary p-3 rounded-lg flex items-center justify-between"
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
        backdropFilter: 'blur(2px)',
      }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            levelData.isActive ? 'bg-neon-green text-black' : 'bg-white/20 text-white/60'
          }`}
        >
          {levelData.level}
        </div>
        <div>
          <div className="text-white font-cyberpunk text-sm">Level {levelData.level}</div>
          <div className="text-white/60 text-xs">
            {levelData.cyclesCompleted} cycles • {levelData.earnings.toFixed(4)} BNB
          </div>
        </div>
      </div>
      <div
        className={`px-2 py-1 rounded text-xs font-terminal ${
          levelData.isActive ? 'bg-neon-green/20 text-neon-green' : 'bg-white/10 text-white/60'
        }`}
      >
        {levelData.isActive ? 'ACTIVE' : 'INACTIVE'}
      </div>
    </motion.div>
  );
};

// ===========================================
// 📱 USER DASHBOARD
// ===========================================

const UserDashboard: React.FC<{ userData: UserData }> = ({ userData }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatUserId = (id: string) => {
    return `ID: ${id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* User Header */}
      <div
        className="hud-panel hud-panel-primary p-6 rounded-lg"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-neon-cyan/20 border border-neon-cyan/30 rounded-lg">
            <User size={32} className="text-neon-cyan" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-cyberpunk text-white mb-1">USER.PROFILE</h3>
            <p className="text-neon-cyan font-mono text-sm">{formatUserId(userData.id)}</p>
            <p className="text-white/60 text-xs font-terminal">
              Joined: {formatDate(userData.joinDate)} • Last Activity:{' '}
              {formatDate(userData.lastActivity)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="TOTAL EARNINGS"
          value={`${userData.totalEarnings.toFixed(4)}`}
          subValue="BNB"
          color="green"
        />
        <StatCard
          icon={Wallet}
          label="TOTAL INVESTED"
          value={`${userData.totalInvested.toFixed(4)}`}
          subValue="BNB"
          color="cyan"
        />
        <StatCard
          icon={Award}
          label="CURRENT LEVEL"
          value={userData.currentLevel.toString()}
          subValue={`${userData.activeMatrices} active`}
          color="magenta"
        />
        <StatCard
          icon={Activity}
          label="REFERRALS"
          value={userData.referrals.toString()}
          subValue={`${userData.completedCycles} cycles`}
          color="cyan"
        />
      </div>

      {/* Levels Overview */}
      <div
        className="hud-panel hud-panel-primary p-6 rounded-lg"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <h4 className="text-lg font-cyberpunk text-white mb-4 flex items-center space-x-2">
          <Eye size={20} className="text-neon-cyan" />
          <span>MATRIX.LEVELS.STATUS</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {userData.levels.map((level) => (
            <LevelStatus key={level.level} levelData={level} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ===========================================
// 🎯 MAIN COMPONENT
// ===========================================

export const AccountLookup: React.FC<AccountLookupProps> = ({ className = '' }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock user data generator
  const generateMockUserData = (id: string): UserData => {
    const joinDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const levels = Array.from({ length: 16 }, (_, i) => {
      const level = i + 1;
      const isActive = Math.random() > 0.6; // 40% chance of being active
      return {
        level,
        isActive,
        cyclesCompleted: isActive ? Math.floor(Math.random() * 10) + 1 : 0,
        earnings: isActive ? Math.random() * 5 : 0,
        joinDate: new Date(joinDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      };
    });

    const activeLevels = levels.filter((l) => l.isActive);
    const totalEarnings = levels.reduce((sum, l) => sum + l.earnings, 0);
    const totalInvested = activeLevels.length * 0.5; // Mock investment

    return {
      id,
      joinDate,
      currentLevel: Math.max(...activeLevels.map((l) => l.level), 1),
      totalEarnings,
      totalInvested,
      referrals: Math.floor(Math.random() * 100) + 5,
      activeMatrices: activeLevels.length,
      completedCycles: levels.reduce((sum, l) => sum + l.cyclesCompleted, 0),
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      levels,
    };
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setError(null);
    setUserData(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validate ID format (basic check)
      if (!/^\d+$/.test(searchValue) || searchValue.length < 4) {
        throw new Error('Invalid ID format. Use numeric ID (e.g. 1234567)');
      }

      // Generate mock data
      const mockData = generateMockUserData(searchValue);
      setUserData(mockData);
    } catch (err: any) {
      setError(err.message || 'User not found');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`py-12 xs:py-16 ${className}`}>
      <div className="container mx-auto px-2 xs:px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8 xs:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold font-cyberpunk text-white mb-3 xs:mb-4">
            <span className="hidden xs:inline">ACCOUNT.LOOKUP</span>
            <span className="xs:hidden">SEARCH.USERS</span>
          </h2>
          <div className="h-0.5 xs:h-1 w-20 xs:w-32 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-green mx-auto mb-3 xs:mb-4 rounded-full"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-sm xs:text-lg font-terminal">
            <span className="hidden xs:inline">
              {`> SEARCH.USER.PROFILE_`}
              <br />
              View public dashboard of any network participant
            </span>
            <span className="xs:hidden">{`> FIND.USER.DATA_`}</span>
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div
                className="hud-panel hud-panel-secondary p-6 rounded-lg text-center"
                style={{
                  background: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="text-red-400 text-lg font-cyberpunk mb-2">ERROR.404</div>
                <div className="text-white/80">{error}</div>
              </div>
            </motion.div>
          )}

          {userData && <UserDashboard userData={userData} />}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AccountLookup;
