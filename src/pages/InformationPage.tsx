import React from 'react';
import { motion } from 'framer-motion';
import { ConnectedHeader, DashboardSidebar } from '../components/layout';
import { NeuralBackground } from '../components/neural';
import {
  AboutSection,
  LevelsTable,
  QuantumMechanics,
  RewardSystem,
  SecuritySection,
  FAQSection,
  OfficialResources,
} from '../components/info';

const InformationPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground intensity={0.6} particleCount={30} />
      <ConnectedHeader />
      <DashboardSidebar />

      <main className="relative z-10 pt-24 pb-16 ml-64">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Information & Game Mechanics
            </h1>
            <p className="text-gray-400 text-lg">
              Complete guide to Quantum Profit Chain - decentralized smart game mechanics, levels,
              and rewards
            </p>
          </motion.div>

          {/* Information Sections */}
          <div className="space-y-8">
            {/* About Game */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <AboutSection />
            </motion.div>

            {/* Level Structure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <LevelsTable />
            </motion.div>

            {/* Quantum Mechanics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <QuantumMechanics />
            </motion.div>

            {/* Reward System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <RewardSystem />
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <SecuritySection />
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <FAQSection />
            </motion.div>

            {/* Official Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <OfficialResources />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InformationPage;
