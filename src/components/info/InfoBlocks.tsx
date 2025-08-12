import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Shield,
  Zap,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { GlassCard, GlassButton } from '../glass';

interface LevelData {
  level: number;
  priceBNB: number;
  priceUSD: number;
  interval: string;
  status: 'available' | 'soon' | 'locked';
}

const LEVELS_DATA: LevelData[] = [
  { level: 16, priceBNB: 8, priceUSD: 3200, interval: 'Game Start', status: 'available' },
  { level: 15, priceBNB: 6.5, priceUSD: 2600, interval: '+12 hours', status: 'soon' },
  { level: 14, priceBNB: 4.4, priceUSD: 1760, interval: '+12 hours', status: 'soon' },
  { level: 13, priceBNB: 3.2, priceUSD: 1280, interval: '+12 hours', status: 'soon' },
  { level: 12, priceBNB: 2.2, priceUSD: 880, interval: '+24 hours', status: 'locked' },
  { level: 11, priceBNB: 1.6, priceUSD: 640, interval: '+24 hours', status: 'locked' },
  { level: 10, priceBNB: 1.1, priceUSD: 440, interval: '+24 hours', status: 'locked' },
  { level: 9, priceBNB: 0.8, priceUSD: 320, interval: '+24 hours', status: 'locked' },
  { level: 8, priceBNB: 0.55, priceUSD: 220, interval: '+48 hours', status: 'locked' },
  { level: 7, priceBNB: 0.4, priceUSD: 160, interval: '+48 hours', status: 'locked' },
  { level: 6, priceBNB: 0.28, priceUSD: 112, interval: '+48 hours', status: 'locked' },
  { level: 5, priceBNB: 0.2, priceUSD: 80, interval: '+48 hours', status: 'locked' },
  { level: 4, priceBNB: 0.14, priceUSD: 56, interval: '+72 hours', status: 'locked' },
  { level: 3, priceBNB: 0.1, priceUSD: 40, interval: '+72 hours', status: 'locked' },
  { level: 2, priceBNB: 0.07, priceUSD: 28, interval: '+72 hours', status: 'locked' },
  { level: 1, priceBNB: 0.05, priceUSD: 20, interval: '+72 hours', status: 'locked' },
];

const FAQ_DATA = [
  {
    question: 'What is Quantum Profit Chain?',
    answer:
      "A decentralized smart game on BSC blockchain with 16 levels, where participants earn rewards from other players' activity through quantum distribution algorithms.",
  },
  {
    question: 'How does quantum distribution work?',
    answer:
      'The smart contract uses pseudo-random number algorithms for fair participant placement in the structure, eliminating manipulation possibilities.',
  },
  {
    question: 'Can I lose my invested funds?',
    answer:
      "Funds are not accumulated in the contract - they are instantly distributed among participants. Risk is related to receiving rewards, which depend on other players' activity.",
  },
  {
    question: 'What fees does the platform charge?',
    answer:
      'The platform charges no fees. 100% of level activation is distributed among participants according to the algorithm.',
  },
  {
    question: 'How fast do payouts arrive?',
    answer:
      'All payouts happen instantly when levels are activated by other participants through the smart contract.',
  },
  {
    question: 'Can I participate without invitations?',
    answer:
      'Yes, you can register independently. The referral program provides additional bonuses but is not mandatory.',
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-center justify-between bg-black/20 hover:bg-black/30 transition-colors"
      >
        <span className="text-white font-medium">{question}</span>
        <ChevronDown
          className={`text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 text-gray-300 bg-black/10">{answer}</div>
      </motion.div>
    </motion.div>
  );
};

export const AboutSection: React.FC = () => (
  <GlassCard className="p-8 border border-cyan-400/20">
    <h1 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
      QUANTUM PROFIT CHAIN
    </h1>
    <h2 className="text-2xl text-white mb-6">Decentralized Smart Game of New Generation</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className="text-xl text-cyan-400 font-semibold mb-4">Game Features</h3>
        <ul className="space-y-3 text-gray-300">
          <li>• 16-level structure on BSC blockchain</li>
          <li>• Automatic reward distribution via smart contract</li>
          <li>• Gradual level opening (from 16th to 1st)</li>
          <li>• Quantum algorithm for participant distribution</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Zap, title: 'Instant Payouts', desc: 'No fund accumulation' },
          { icon: Shield, title: 'Decentralized', desc: 'Smart contract managed' },
          { icon: TrendingUp, title: 'Transparent', desc: 'All transactions on blockchain' },
          { icon: Users, title: 'Quantum Logic', desc: 'Fair reward distribution' },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-black/20 rounded-lg text-center"
          >
            <feature.icon className="text-cyan-400 mx-auto mb-2" size={24} />
            <div className="text-white font-medium text-sm">{feature.title}</div>
            <div className="text-gray-400 text-xs">{feature.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </GlassCard>
);

export const LevelsTable: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-400';
      case 'soon':
        return 'text-yellow-400';
      case 'locked':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '🟢';
      case 'soon':
        return '🟡';
      case 'locked':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <GlassCard className="p-6 border border-purple-400/20">
      <h2 className="text-2xl font-bold text-white mb-6">16 Levels with Gradual Opening</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left text-gray-400 pb-3 font-medium">Level</th>
              <th className="text-right text-gray-400 pb-3 font-medium">Price BNB</th>
              <th className="text-right text-gray-400 pb-3 font-medium">Price USD*</th>
              <th className="text-left text-gray-400 pb-3 font-medium">Opening Interval</th>
              <th className="text-center text-gray-400 pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {LEVELS_DATA.map((level, index) => (
              <motion.tr
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 text-white font-bold">{level.level}</td>
                <td className="py-3 text-right text-cyan-400 font-mono">{level.priceBNB}</td>
                <td className="py-3 text-right text-green-400 font-mono">
                  ${level.priceUSD.toLocaleString()}
                </td>
                <td className="py-3 text-gray-300">{level.interval}</td>
                <td className="py-3 text-center">
                  <span
                    className={`${getStatusColor(level.status)} flex items-center justify-center gap-1`}
                  >
                    {getStatusIcon(level.status)}
                    <span className="capitalize text-xs">{level.status}</span>
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-black/20 rounded-lg">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>🟢</span>
            <span className="text-green-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🟡</span>
            <span className="text-yellow-400">Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔴</span>
            <span className="text-red-400">Locked</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          *USD prices are approximate at 1 BNB = $400. All 16 levels will be available 23 days after
          launch.
        </div>
      </div>
    </GlassCard>
  );
};

export const QuantumMechanics: React.FC = () => (
  <GlassCard className="p-6 border border-green-400/20">
    <h2 className="text-2xl font-bold text-white mb-6">Quantum Distribution Algorithm</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="bg-black/20 p-6 rounded-lg mb-6">
          <div className="text-center font-mono text-sm">
            <div className="text-cyan-400 mb-4">LEVEL X</div>
            <div className="flex justify-center items-center mb-4">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-black font-bold">
                A
              </div>
              <span className="text-gray-400 ml-2">← Participant receives reward</span>
            </div>
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-black font-bold">
                B
              </div>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-black font-bold">
                C
              </div>
            </div>
            <div className="text-gray-400 text-xs mb-4">← New participants</div>
            <div className="flex justify-center gap-2">
              {['D', 'E', 'F', 'G'].map((letter) => (
                <div
                  key={letter}
                  className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-black font-bold text-xs"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="text-gray-400 text-xs mt-2">← Next participants</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl text-green-400 font-semibold mb-4">Quantum Process</h3>
        <div className="space-y-4 text-gray-300">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-xs mt-1">
              1
            </div>
            <div>
              <div className="font-medium text-white">Quantum Placement</div>
              <div className="text-sm">New players distributed by pseudo-random algorithm</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-black font-bold text-xs mt-1">
              2
            </div>
            <div>
              <div className="font-medium text-white">Cycle</div>
              <div className="text-sm">Each participant can accept 2 new players</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-black font-bold text-xs mt-1">
              3
            </div>
            <div>
              <div className="font-medium text-white">Recycle</div>
              <div className="text-sm">
                After cycle completion, participant moves to new line below
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs mt-1">
              4
            </div>
            <div>
              <div className="font-medium text-white">Instant Rewards</div>
              <div className="text-sm">Funds automatically distributed with each activation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
);

export const RewardSystem: React.FC = () => (
  <GlassCard className="p-6 border border-yellow-400/20">
    <h2 className="text-2xl font-bold text-white mb-6">100% Activation Amount Distribution</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-black/20 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">💰 Distribution Scheme</h3>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center p-2 bg-green-500/20 rounded">
            <span className="text-green-400">74% → Base Reward</span>
            <span className="text-white">(Quantum selected participant)</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-purple-500/20 rounded">
            <span className="text-purple-400">26% → Referral Bonuses</span>
            <span className="text-white">(3 lines)</span>
          </div>
          <div className="ml-4 space-y-2">
            <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
              <span className="text-blue-400">13% → 1st Line</span>
              <span className="text-gray-300">Direct partner</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
              <span className="text-blue-400">8% → 2nd Line</span>
              <span className="text-gray-300">Partner's partner</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
              <span className="text-blue-400">5% → 3rd Line</span>
              <span className="text-gray-300">Third level up</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">Important Conditions</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-400" size={16} />
              <span className="text-green-400 font-medium">Base Reward (74%)</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Goes to quantum selected participant in level structure</li>
              <li>• Instant payout on activation</li>
              <li>• Algorithm prevents manipulations</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-purple-400" size={16} />
              <span className="text-purple-400 font-medium">Referral Bonuses (26%)</span>
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Available only from activated levels</li>
              <li>• Frozen level income goes to active upline partner</li>
              <li>• Three-line deep structure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </GlassCard>
);

export const SecuritySection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const contractAddress = '0x1234567890abcdef1234567890abcdef12345678'; // Replace with real address

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <GlassCard className="p-6 border border-red-400/20">
      <h2 className="text-2xl font-bold text-white mb-6">Security & Audit Guarantees</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-red-400 mb-4">🔐 Technical Guarantees</h3>
          <div className="space-y-3">
            {[
              'Smart contract audit by independent experts',
              'Open source code with full transparency',
              'Immutable rules after deployment',
              'Decentralization with no single point of failure',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="text-green-400 flex-shrink-0" size={16} />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-red-400 mb-4">⚠️ Important Warnings</h3>
          <div className="space-y-3">
            {[
              'Project participation carries financial risks',
              'Study game mechanics before investing',
              'Invest only funds you can afford to lose',
              'Project does not guarantee profit',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-400 flex-shrink-0" size={16} />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-black/20 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-3">Smart Contract Address</h4>
        <div className="flex items-center gap-3">
          <code className="flex-1 p-2 bg-black/30 rounded text-cyan-400 font-mono text-sm">
            {contractAddress}
          </code>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={copyAddress}
            className="flex items-center gap-2"
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => window.open(`https://bscscan.com/address/${contractAddress}`, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink size={14} />
            BSCScan
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  );
};

export const FAQSection: React.FC = () => (
  <GlassCard className="p-6 border border-blue-400/20">
    <h2 className="text-2xl font-bold text-white mb-6">FAQ - Frequently Asked Questions</h2>
    <div className="space-y-4">
      {FAQ_DATA.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  </GlassCard>
);

export const OfficialResources: React.FC = () => (
  <GlassCard className="p-6 border border-indigo-400/20">
    <h2 className="text-2xl font-bold text-white mb-6">Official Resources</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">🌐 Official Links</h3>
        <div className="space-y-2">
          {[
            { label: 'Main Website', url: 'https://quantumprofitchain.com/' },
            { label: 'Documentation', url: 'https://docs.quantumprofitchain.com/' },
            { label: 'GitHub', url: 'https://github.com/quantumprofitchain' },
            { label: 'BSCScan', url: 'https://bscscan.com/' },
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
            >
              <ExternalLink size={12} />
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">📱 Social Media</h3>
        <div className="space-y-2">
          {[
            { label: 'Telegram Channel', url: 'https://t.me/quantumprofitchain_official' },
            { label: 'Telegram Chat', url: 'https://t.me/quantumprofitchain_chat' },
            { label: 'Twitter', url: 'https://twitter.com/QuantumProfitChain' },
            { label: 'Discord', url: 'https://discord.gg/quantumprofitchain' },
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              <ExternalLink size={12} />
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">🛠️ Support</h3>
        <div className="space-y-2">
          {[
            { label: 'Technical Support', url: 'mailto:support@quantumprofitchain.com' },
            { label: 'Telegram Support', url: 'https://t.me/qpc_support_bot' },
            { label: 'FAQ Database', url: 'https://help.quantumprofitchain.com/' },
            { label: 'Video Guides', url: 'https://youtube.com/quantumprofitchain' },
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm"
            >
              <ExternalLink size={12} />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-6 p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="text-red-400" size={20} />
        <span className="text-red-400 font-semibold">Warning! Beware of Scammers</span>
      </div>
      <ul className="text-sm text-gray-300 space-y-1">
        <li>• Use only official links</li>
        <li>• Administration never requests private keys</li>
        <li>• Don't follow suspicious links</li>
        <li>• Always verify smart contract addresses</li>
      </ul>
    </div>
  </GlassCard>
);
