import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, Calendar, TrendingUp, UserPlus } from 'lucide-react';
import { GlassCard, GlassButton } from '../glass';

interface PartnerBonus {
  id: string;
  playerId: number;
  date: string;
  wallet: string;
  level: number;
  bonusReceived: number;
  totalBonus: number;
}

// Mock data - можно заменить на реальные данные
const MOCK_PARTNER_BONUSES: PartnerBonus[] = [
  // Пустой массив для демонстрации состояния "Пока бонусов нет"
];

// Пример с данными:
/*
const MOCK_PARTNER_BONUSES: PartnerBonus[] = [
  {
    id: 'pb1',
    playerId: 98765,
    date: '2025-01-13 11:45',
    wallet: '0x123a...def4',
    level: 2,
    bonusReceived: 0.014,
    totalBonus: 0.142,
  },
  {
    id: 'pb2',
    playerId: 45678,
    date: '2025-01-11 20:33',
    wallet: '0xabc1...567f',
    level: 2,
    bonusReceived: 0.018,
    totalBonus: 0.128,
  },
  {
    id: 'pb3',
    playerId: 78901,
    date: '2025-01-10 12:05',
    wallet: '0x456d...789c',
    level: 1,
    bonusReceived: 0.013,
    totalBonus: 0.110,
  },
];
*/

const MOCK_USER_DATA = {
  referralLink: 'https://quantum-profit-chain.com/ref/12345',
  totalPartnerBonus: MOCK_PARTNER_BONUSES.reduce((sum, bonus) => sum + bonus.bonusReceived, 0),
  partnersCount: MOCK_PARTNER_BONUSES.length,
};

export const PartnerBonusTable: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const formatBNB = (amount: number) => amount.toFixed(4);

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_USER_DATA.referralLink);
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
          url: MOCK_USER_DATA.referralLink,
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
        <GlassCard className="p-4 border border-purple-400/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="text-purple-400" size={20} />
            </div>
            <div>
              <div className="text-purple-400 text-lg font-bold">
                {MOCK_USER_DATA.partnersCount}
              </div>
              <div className="text-gray-400 text-xs">Active Partners</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border border-green-400/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div>
              <div className="text-green-400 text-lg font-bold">
                {formatBNB(MOCK_USER_DATA.totalPartnerBonus)}
              </div>
              <div className="text-gray-400 text-xs">Total Bonus BNB</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border border-blue-400/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="text-blue-400" size={20} />
            </div>
            <div>
              <div className="text-blue-400 text-lg font-bold">
                {MOCK_PARTNER_BONUSES.length > 0 ? MOCK_PARTNER_BONUSES.length : 0}
              </div>
              <div className="text-gray-400 text-xs">Bonus Transactions</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Referral Link Section */}
      <GlassCard className="p-6 border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Your Referral Link</h3>
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Share2 className="text-cyan-400" size={20} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-white border border-white/10">
            <div className="break-all">{MOCK_USER_DATA.referralLink}</div>
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
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="text-purple-400" size={20} />
            Partner Bonus History
          </h3>
        </div>

        {MOCK_PARTNER_BONUSES.length > 0 ? (
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
                {MOCK_PARTNER_BONUSES.map((bonus, index) => (
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
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
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
        ) : (
          /* No Bonuses State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
                {MOCK_USER_DATA.referralLink}
              </span>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
};

export default PartnerBonusTable;
