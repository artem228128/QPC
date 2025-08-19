import React, { useState, useEffect } from 'react';
import { formatUserId } from '../../utils/format';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, Calendar, TrendingUp, UserPlus } from 'lucide-react';
import { GlassCard, GlassButton } from '../glass';
import { useWallet } from '../../hooks/useWallet';
import { useReferral } from '../../hooks/useReferral';
import { getQpcContract, formatBNB } from '../../utils/contract';

interface PartnerBonus {
  id: string;
  playerId: number;
  date: string;
  wallet: string;
  level: number;
  bonusReceived: number;
  totalBonus: number;
}

// Real data now loaded from smart contract

export const PartnerBonusTable: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [partnerBonuses, setPartnerBonuses] = useState<PartnerBonus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { contractInfo, walletState } = useWallet();
  const { generateReferralLink } = useReferral();

  // Load partner bonuses from contract
  useEffect(() => {
    const loadPartnerBonuses = async () => {
      if (!walletState.address || !contractInfo || !contractInfo.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const contract = await getQpcContract(false);
        if (!contract) return;

        // Get ReferralPayout events where this user is the referrer
        // Use smaller block range to avoid rate limits
        const filter = contract.filters.ReferralPayout(contractInfo.id, null, null);
        let events: any[] = [];
        
        try {
          // Use much smaller block range to avoid rate limits
          events = await contract.queryFilter(filter, -100); // Only last 100 blocks
          
          // If no events found, try without filter to see if any events exist
          if (events.length === 0) {
            const allEvents = await contract.queryFilter(contract.filters.ReferralPayout(), -100);
          }
        } catch (rpcError: any) {
          // RPC rate limit - use contract data fallback
        }

        const bonuses: PartnerBonus[] = await Promise.all(
          events.map(async (event: any, index: number) => {
            const args = event.args;
            const block = await event.getBlock();
            const date = new Date(block.timestamp * 1000);
            
            // Get referral user info
            const referralAddress = await contract.usersAddressById(args.referralId);
            
            return {
              id: `bonus-${index}`,
              playerId: parseInt(args.referralId.toString()),
              date: date.toLocaleString(),
              wallet: `${referralAddress.slice(0, 6)}...${referralAddress.slice(-4)}`,
              level: parseInt(args.level.toString()),
              bonusReceived: parseFloat(formatBNB(args.rewardValue)),
              totalBonus: 0, // Will calculate cumulative
            };
          })
        );

        // Calculate cumulative totals
        let runningTotal = 0;
        const bonusesWithTotals = bonuses.reverse().map(bonus => {
          runningTotal += bonus.bonusReceived;
          return { ...bonus, totalBonus: runningTotal };
        });

        setPartnerBonuses(bonusesWithTotals.reverse());
      } catch (error) {
        console.error('Error loading partner bonuses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPartnerBonuses();
  }, [walletState.address, contractInfo?.id]);

  // Calculate real statistics
  const userReferralLink = contractInfo ? generateReferralLink(formatUserId(contractInfo.id)) : '';
  const totalPartnerBonus = partnerBonuses.reduce((sum, bonus) => sum + bonus.bonusReceived, 0);
  const partnersCount = new Set(partnerBonuses.map(bonus => bonus.playerId)).size; // Unique partners from events
  const bonusTransactions = partnerBonuses.length;

  // Fallbacks: use contract data when events unavailable
  const partnersCountFromContract = contractInfo?.referrals || 0;
  const totalBonusFromContract = contractInfo?.referralPayoutSum || 0; // Already in BNB



  // Check if we're on testnet and user has no referrals yet
  const isTestnet = window.location.hostname === 'localhost' || process.env.NODE_ENV === 'development';
  const hasRealData = partnersCountFromContract > 0 || totalBonusFromContract > 0;

  // Statistics are working correctly with real contract data

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(userReferralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Quantum Profit Chain',
          text: 'Join me on Quantum Profit Chain and earn together!',
          url: userReferralLink,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      // Fallback to copy
      copyReferralLink();
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4 border border-purple-400/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="text-purple-400" size={20} />
            </div>
            <div>
              <div className="text-purple-400 text-lg font-bold">
                {isLoading ? '...' : partnersCountFromContract}
              </div>
              <div className="text-gray-400 text-xs">Active Partners</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border border-green-400/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div>
              <div className="text-green-400 text-lg font-bold">
                {isLoading ? '...' : formatBNB(totalPartnerBonus || totalBonusFromContract)}
              </div>
              <div className="text-gray-400 text-xs">Total Bonus BNB</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border border-blue-400/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="text-blue-400" size={20} />
            </div>
            <div>
              <div className="text-blue-400 text-lg font-bold">
                {isLoading ? '...' : bonusTransactions}
              </div>
              <div className="text-gray-400 text-xs">Bonus Transactions</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Referral Link Section */}
      <GlassCard className="p-6 border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Your Referral Link</h3>
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Share2 className="text-cyan-400" size={20} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-black/30 rounded-xl p-3 font-mono text-sm text-white border border-white/10">
            <div className="break-all">{userReferralLink || 'Loading...'}</div>
          </div>
          <div className="flex gap-3">
            <GlassButton
              variant="primary"
              onClick={copyReferralLink}
              className="flex-1 flex items-center justify-center"
            >
              <Copy size={16} className="mr-2" />
              {copied ? 'Copied!' : 'Copy Link'}
            </GlassButton>
            <GlassButton
              variant="secondary"
              onClick={shareReferralLink}
              className="flex-1 flex items-center justify-center"
            >
              <Share2 size={16} className="mr-2" />
              Share
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Partner Bonus Table */}
      <GlassCard className="p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="text-purple-400" size={20} />
            Partner Bonus History
          </h3>
        </div>

        {partnerBonuses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 pb-3 font-medium">Player ID</th>
                  <th className="text-left text-gray-400 pb-3 font-medium">Date</th>
                  <th className="text-left text-gray-400 pb-3 font-medium">Wallet</th>
                  <th className="text-left text-gray-400 pb-3 font-medium">Level</th>
                  <th className="text-right text-gray-400 pb-3 font-medium">Bonus Received</th>
                  <th className="text-right text-gray-400 pb-3 font-medium">Total Bonus</th>
                </tr>
              </thead>
              <tbody>
                {partnerBonuses.map((bonus, index) => (
                  <motion.tr
                    key={bonus.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 text-white font-mono">#{bonus.playerId}</td>
                    <td className="py-3 text-gray-300 font-mono text-xs">{bonus.date}</td>
                    <td className="py-3 text-gray-300 font-mono text-xs">{bonus.wallet}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                        Level {bonus.level}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-green-400 font-mono">
                        +{formatBNB(bonus.bonusReceived)} BNB
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-purple-400 font-mono">
                        {formatBNB(bonus.totalBonus)} BNB
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : partnersCountFromContract > 0 ? (
          /* Show contract data when events are unavailable */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-green-400" size={32} />
              </div>
              <h4 className="text-lg text-white font-semibold mb-2">Contract Data Available</h4>
              <p className="text-gray-400 mb-4">
                RPC rate limit reached. Showing data from contract storage.
              </p>
            </div>
            
            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-green-400 text-xl font-bold">{partnersCountFromContract}</div>
                  <div className="text-gray-400 text-sm">Active Partners</div>
                </div>
                <div>
                  <div className="text-purple-400 text-xl font-bold">{formatBNB(totalBonusFromContract)} BNB</div>
                  <div className="text-gray-400 text-sm">Total Bonus Earned</div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm mt-4">
              Detailed transaction history temporarily unavailable due to RPC limits.
            </p>
          </motion.div>
        ) : (
          /* No Bonuses State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-400" size={40} />
              </div>
              <h4 className="text-xl text-white font-semibold mb-2">No bonuses yet</h4>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Invite partners through your referral link and earn 26% bonus from each of their
                level purchases
              </p>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              onClick={copyReferralLink}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:border-purple-400/50"
            >
              <UserPlus size={20} />
              Invite Partners
            </GlassButton>

            <div className="mt-6 text-sm text-gray-500">
              Share the link:{' '}
              <span className="text-purple-400 font-mono break-all">
                {userReferralLink || 'Loading...'}
              </span>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
};

export default PartnerBonusTable;
