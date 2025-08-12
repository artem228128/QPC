import React from 'react';
import { motion } from 'framer-motion';
import { ConnectedHeader, DashboardSidebar } from '../components/layout';
import { NeuralBackground } from '../components/neural';
import { PartnerBonusTable } from '../components/stats';

const PartnerBonusPage: React.FC = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Partner Bonus</h1>
            <p className="text-gray-400 text-lg">
              Track your referral bonuses and invite new partners to maximize earnings
            </p>
          </motion.div>

          {/* Partner Bonus Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <PartnerBonusTable />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PartnerBonusPage;
