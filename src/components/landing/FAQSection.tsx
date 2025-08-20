import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Filter,
  HelpCircle,
  MessageCircle,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { GlassPanel } from '../glass';
import { NeuralButton } from '../neural';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface FAQSectionProps {
  className?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'financial';
  tags: string[];
  isPopular?: boolean;
}

interface FAQCategories {
  general: { label: 'General'; icon: typeof HelpCircle; color: 'cyan' };
  technical: { label: 'Technical'; icon: typeof Filter; color: 'purple' };
  financial: { label: 'Financial'; icon: typeof ExternalLink; color: 'mint' };
}

// ===========================================
// 📚 FAQ DATA
// ===========================================

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How to start playing?',
    answer:
      "To start playing Quantum Profit Chain, you need to: 1) Connect your BSC-compatible wallet (MetaMask, Trust Wallet, etc.), 2) Have BNB for the first level activation (minimum 0.1 BNB), 3) Get a referral link from an existing player or use our default link, 4) Activate Level 1 to enter the matrix system. Once activated, you'll be placed in a 2x1 matrix and can start earning from referrals and spillover.",
    category: 'general',
    tags: ['start', 'wallet', 'first-time', 'activation'],
    isPopular: true,
  },
  {
    id: '2',
    question: 'What is the recycling system?',
    answer:
      'The recycling system is the core mechanism that ensures continuous earnings. When your 2x1 matrix fills up (gets 3 positions), it automatically "recycles" - meaning it restarts with a new matrix while you retain your position. This allows for infinite earning cycles. Each recycling gives you the opportunity to earn again from new referrals and spillover, creating a sustainable income stream.',
    category: 'technical',
    tags: ['recycling', 'matrix', 'earning', 'automatic'],
    isPopular: true,
  },
  {
    id: '3',
    question: 'How do referral bonuses work?',
    answer:
      'Referral bonuses follow a simple structure: 74% of each activation goes directly to the referrer, 13% to the company, 8% for marketing, and 5% to the foundation. When someone joins using your referral link and activates a level, you immediately receive 74% of their payment. Additionally, you benefit from spillover when people are placed under you in the matrix system.',
    category: 'financial',
    tags: ['referral', 'bonus', 'commission', 'percentage'],
    isPopular: true,
  },
  {
    id: '4',
    question: 'What happens when a level is frozen?',
    answer:
      'Levels are released gradually based on community growth and platform stability. When a level is "frozen" or not yet unlocked, it means the community hasn\'t reached the required milestone for that level to be activated. This ensures sustainable growth and prevents the system from being overwhelmed. You\'ll be notified when new levels become available.',
    category: 'technical',
    tags: ['frozen', 'levels', 'unlock', 'community'],
  },
  {
    id: '5',
    question: 'How to connect notifications?',
    answer:
      "To receive real-time notifications about your earnings and matrix activity: 1) Join our official Telegram channel, 2) Connect your wallet address in the bot, 3) Enable browser notifications in your profile settings, 4) For mobile users, download our upcoming mobile app for push notifications. You'll receive alerts for new referrals, recycling events, and earnings.",
    category: 'technical',
    tags: ['notifications', 'telegram', 'alerts', 'mobile'],
  },
  {
    id: '6',
    question: 'Is the smart contract audited?',
    answer:
      'Yes, our smart contract has been audited by leading blockchain security firms. The audit reports are publicly available on our website. The contract is also verified on BSCScan, meaning the source code is transparent and can be reviewed by anyone. We prioritize security and transparency in all our operations.',
    category: 'technical',
    tags: ['audit', 'security', 'contract', 'transparency'],
    isPopular: true,
  },
  {
    id: '7',
    question: 'How to withdraw earnings?',
    answer:
      "Earnings in Quantum Profit Chain are automatically sent to your wallet in real-time. There's no manual withdrawal process - when you earn from referrals or matrix recycling, the BNB is immediately transferred to your connected wallet address. You can see all transactions on BSCScan using your wallet address.",
    category: 'financial',
    tags: ['withdraw', 'automatic', 'real-time', 'wallet'],
    isPopular: true,
  },
  {
    id: '8',
    question: 'What are the risks?',
    answer:
      "As with any DeFi/crypto investment, there are inherent risks: 1) Smart contract risks (though we're audited), 2) Cryptocurrency volatility affecting BNB value, 3) Regulatory changes in your jurisdiction, 4) Market adoption risks. Never invest more than you can afford to lose. The matrix system depends on continued participation, so earnings may vary based on community activity.",
    category: 'financial',
    tags: ['risks', 'investment', 'volatility', 'disclaimer'],
    isPopular: true,
  },
];

const categories: FAQCategories = {
  general: { label: 'General', icon: HelpCircle, color: 'cyan' },
  technical: { label: 'Technical', icon: Filter, color: 'purple' },
  financial: { label: 'Financial', icon: ExternalLink, color: 'mint' },
};

// ===========================================
// 🔍 SEARCH BAR
// ===========================================

const SearchBar: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
}> = ({ searchTerm, onSearchChange }) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60"
        />
        <input
          type="text"
          placeholder="Search frequently asked questions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 glass-panel-secondary rounded-xl text-white placeholder-white/60 border-none focus:ring-2 focus:ring-neural-cyan focus:outline-none transition-all duration-300"
        />
        {searchTerm && (
          <motion.button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ×
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// ===========================================
// 🏷️ CATEGORY TABS
// ===========================================

const CategoryTabs: React.FC<{
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts: Record<string, number>;
}> = ({ activeCategory, onCategoryChange, categoryCounts }) => {
  const allCategories = ['all', ...Object.keys(categories)];

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {allCategories.map((category) => {
        const isActive = activeCategory === category;
        const categoryData =
          category === 'all'
            ? { label: 'All Questions', icon: Tag, color: 'coral' }
            : categories[category as keyof FAQCategories];

        const IconComponent = categoryData.icon;
        const count = categoryCounts[category] || 0;

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              isActive
                ? 'glass-panel-neural neural-glow text-white'
                : 'glass-panel-secondary text-white/70 hover:text-white hover:glass-panel-primary'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <IconComponent size={16} />
            <span>{categoryData.label}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isActive ? 'bg-white/20' : 'bg-white/10'
              }`}
            >
              {count}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

// ===========================================
// ❓ FAQ ITEM COMPONENT
// ===========================================

const FAQItemComponent: React.FC<{
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  searchTerm: string;
}> = ({ faq, isOpen, onToggle, searchTerm }) => {
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.replace(regex, '<mark class="bg-neural-cyan/30 text-white rounded px-1">$1</mark>');
  };

  const categoryConfig = categories[faq.category];
  const IconComponent = categoryConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <GlassPanel
        variant={isOpen ? 'neural' : 'secondary'}
        padding="none"
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'neural-glow' : ''}`}
        animate
      >
        {/* Question Header */}
        <motion.button
          onClick={onToggle}
          className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200 focus:outline-none"
          whileHover={{ x: 4 }}
        >
          <div className="flex items-start justify-between space-x-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                {faq.isPopular && (
                  <span className="px-2 py-1 text-xs bg-neural-coral/20 text-neural-coral rounded-full font-medium">
                    Popular
                  </span>
                )}
                <div className="flex items-center space-x-2 text-xs text-white/60">
                  <IconComponent size={12} />
                  <span className="capitalize">{faq.category}</span>
                </div>
              </div>
              <h3
                className="text-lg font-semibold text-white leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightText(faq.question, searchTerm),
                }}
              />
              <div className="flex flex-wrap gap-2">
                {faq.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isOpen ? (
                  <Minus size={20} className="text-neural-cyan" />
                ) : (
                  <Plus size={20} className="text-white/60" />
                )}
              </motion.div>
            </div>
          </div>
        </motion.button>

        {/* Answer Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-white/10">
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="pt-4 space-y-4"
                >
                  <div
                    className="text-white/80 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(faq.answer, searchTerm),
                    }}
                  />

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {faq.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-neural-cyan/10 text-neural-cyan rounded-full border border-neural-cyan/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>
    </motion.div>
  );
};

// ===========================================
// 💬 HELP CTA SECTION
// ===========================================

const HelpCTASection: React.FC = () => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <GlassPanel variant="neural" padding="lg" className="max-w-2xl mx-auto neural-glow">
        <MessageCircle size={48} className="text-neural-cyan mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
        <p className="text-white/70 mb-6">
          Our community and support team are here to help you get started with Quantum Profit Chain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NeuralButton
            size="lg"
            onClick={() => window.open('https://t.me/quantumprofitchain', '_blank')}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>Join Telegram</span>
            </div>
          </NeuralButton>
          <motion.button
            className="glass-button-secondary px-6 py-3 rounded-lg text-white hover:text-neural-cyan transition-colors flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('mailto:support@quantumprofitchain.com')}
          >
            <ExternalLink size={20} />
            <span>Contact Support</span>
          </motion.button>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

// ===========================================
// 🎯 MAIN FAQ SECTION
// ===========================================

export const FAQSection: React.FC<FAQSectionProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['1'])); // First item open by default

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((faq) => faq.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(term) ||
          faq.answer.toLowerCase().includes(term) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [searchTerm, activeCategory]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: faqData.length,
    };

    Object.keys(categories).forEach((category) => {
      counts[category] = faqData.filter((faq) => faq.category === category).length;
    });

    return counts;
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section id="faq" className={`pt-24 pb-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Find answers to common questions about Quantum Profit Chain matrix system
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          <AnimatePresence>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <FAQItemComponent
                    faq={faq}
                    isOpen={openItems.has(faq.id)}
                    onToggle={() => toggleItem(faq.id)}
                    searchTerm={searchTerm}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <HelpCircle size={48} className="text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No questions found</h3>
                <p className="text-white/60">
                  Try adjusting your search terms or browse different categories
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help CTA */}
        <HelpCTASection />
      </div>
    </section>
  );
};

export default FAQSection;
