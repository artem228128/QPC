import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Eye, Award, TrendingUp, Wallet, Activity } from 'lucide-react';
import { getQpcContract, formatBNB, LEVEL_PRICES } from '../../utils/contract';
import { formatUserId } from '../../utils/format';
import { toast } from 'react-hot-toast';

// Convert display ID (36145+) to real contract ID
const parseDisplayId = (displayId: string): string => {
  const numId = parseInt(displayId, 10);
  if (isNaN(numId) || numId < 36146) return displayId; // Keep as is if not our format
  return (numId - 36145).toString();
};

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface AccountLookupProps {
  className?: string;
}

interface UserData {
  id: string;
  address: string;
  joinDate: Date;
  currentLevel: number;
  totalEarnings: number;
  totalInvested: number;
  referrals: number;
  activeMatrices: number;
  completedCycles: number;
  lastActivity: Date;
  referralEarnings: number;
  missedReferralEarnings: number;
  levels: {
    level: number;
    isActive: boolean;
    cyclesCompleted: number;
    earnings: number;
    referralEarnings: number;
    maxPayouts: number;
    activationTimes: number;
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
          placeholder="Enter User ID (e.g. 36146) or Wallet Address (0x...)"
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
            {levelData.cyclesCompleted}/{levelData.maxPayouts} cycles • {formatBNB(levelData.earnings)} BNB
          </div>
          <div className="text-white/40 text-xs">
            Ref: {formatBNB(levelData.referralEarnings)} BNB • Activations: {levelData.activationTimes}
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
            <p className="text-neon-cyan font-mono text-sm">#{userData.id}</p>
            <p className="text-white/60 text-xs font-terminal">
              Address: {userData.address.slice(0, 6)}...{userData.address.slice(-4)}
            </p>
            <p className="text-white/60 text-xs font-terminal">
              Joined: {formatDate(userData.joinDate)}
              {userData.missedReferralEarnings > 0 && (
                <span className="text-red-400"> • Missed: {formatBNB(userData.missedReferralEarnings)} BNB</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="MATRIX EARNINGS"
          value={formatBNB(userData.totalEarnings)}
          subValue="BNB from levels"
          color="green"
        />
        <StatCard
          icon={Wallet}
          label="REFERRAL EARNINGS"
          value={formatBNB(userData.referralEarnings)}
          subValue="BNB from referrals"
          color="cyan"
        />
        <StatCard
          icon={Award}
          label="HIGHEST LEVEL"
          value={userData.currentLevel.toString()}
          subValue={`${userData.activeMatrices}/16 active`}
          color="magenta"
        />
        <StatCard
          icon={Activity}
          label="TOTAL REFERRALS"
          value={userData.referrals.toString()}
          subValue={`${userData.completedCycles} payouts received`}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {userData.levels
            .sort((a, b) => a.level - b.level) // Ensure levels are sorted by level number
            .map((level) => (
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

  // Real blockchain data fetcher
  const fetchUserDataFromBlockchain = async (searchInput: string): Promise<UserData> => {
    let userAddress: string;
    let displayId: string = ''; // Store the display ID for showing to user
    
    // Determine if input is user ID or wallet address
    if (searchInput.startsWith('0x') && searchInput.length === 42) {
      // It's a wallet address
      userAddress = searchInput.toLowerCase();
    } else if (/^\d+$/.test(searchInput)) {
      // It's a user ID, convert display ID to contract ID and get address
      const contractId = parseDisplayId(searchInput);
      displayId = searchInput; // Keep the original display ID for showing
      const contract = await getQpcContract(false); // Read-only
      userAddress = await contract.usersAddressById(contractId);
      
      if (!userAddress || userAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('User ID not found in the system');
      }
    } else {
      throw new Error('Invalid format. Enter User ID (numeric) or Wallet Address (0x...)');
    }

    const contract = await getQpcContract(false); // Read-only

    // Check if user is registered
    const isRegistered = await contract.isUserRegistered(userAddress);
    if (!isRegistered) {
      throw new Error('User is not registered in the system');
    }

    // Get user basic info
    const [id, registrationTimestamp, referrerId, referrer, referrals, referralPayoutSum, levelsRewardSum, missedReferralPayoutSum] = 
      await contract.getUser(userAddress);

    // If searching by wallet address, we need to calculate display ID
    if (!displayId) {
      displayId = formatUserId(id.toString());
    }

    // Get user levels data
    const [active, payouts, maxPayouts, activationTimes, rewardSum, referralPayoutSumByLevel] = 
      await contract.getUserLevels(userAddress);

    // Convert BigInt values to numbers
    const userData: UserData = {
      id: displayId, // Use display ID instead of contract ID
      address: userAddress,
      joinDate: new Date(Number(registrationTimestamp) * 1000),
      referrals: Number(referrals),
      referralEarnings: Number(referralPayoutSum) / Math.pow(10, 18), // Convert from wei to BNB
      totalEarnings: Number(levelsRewardSum) / Math.pow(10, 18), // Convert from wei to BNB
      missedReferralEarnings: Number(missedReferralPayoutSum) / Math.pow(10, 18),
      lastActivity: new Date(), // We'll use current time as we don't track this in contract
      activeMatrices: 0,
      completedCycles: 0,
      currentLevel: 1,
      totalInvested: 0,
      levels: []
    };

    // Process levels data
    const levels = [];
    let activeMatricesCount = 0;
    let totalCycles = 0;
    let currentLevel = 1;
    let totalInvested = 0;

    for (let level = 1; level <= 16; level++) {
      // Contract returns arrays where index matches level number (index 0 is unused)
      const isActive = active[level];
      const levelPayouts = Number(payouts[level]);
      const levelMaxPayouts = Number(maxPayouts[level]);
      const levelActivationTimes = Number(activationTimes[level]);
      const levelEarnings = Number(rewardSum[level]) / Math.pow(10, 18);
      const levelReferralEarnings = Number(referralPayoutSumByLevel[level]) / Math.pow(10, 18);

      if (isActive) {
        activeMatricesCount++;
        totalInvested += LEVEL_PRICES[level];
        if (level > currentLevel) {
          currentLevel = level;
        }
      }

      totalCycles += levelPayouts;

      // Show all 16 levels
      const shouldShowLevel = true;
      
      if (shouldShowLevel) {
        levels.push({
          level, // Now correctly: level 1 has data from active[1], level 2 from active[2], etc.
          isActive,
          cyclesCompleted: levelPayouts,
          earnings: levelEarnings,
          referralEarnings: levelReferralEarnings,
          maxPayouts: levelMaxPayouts,
          activationTimes: levelActivationTimes,
        });
      }
    }

    userData.activeMatrices = activeMatricesCount;
    userData.completedCycles = totalCycles;
    userData.currentLevel = currentLevel;
    userData.totalInvested = totalInvested;
    userData.levels = levels;



    return userData;
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setError(null);
    setUserData(null);

    try {
      // Fetch real data from blockchain
      const realUserData = await fetchUserDataFromBlockchain(searchValue.trim());
      setUserData(realUserData);
      
      // Show success toast
      toast.success(`User ${realUserData.id} data loaded successfully!`, {
        duration: 3000,
        position: 'top-center',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch user data';
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });
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
              className="max-w-lg mx-auto"
            >
              <div
                className="hud-panel hud-panel-secondary p-6 rounded-lg text-center"
                style={{
                  background: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div className="text-red-400 text-lg font-cyberpunk mb-2">SEARCH.ERROR</div>
                <div className="text-white/80 mb-3">{error}</div>
                <div className="text-white/60 text-xs font-terminal">
                  Try entering a valid User ID (e.g. 1, 2, 3...) or Wallet Address (0x...)
                </div>
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
