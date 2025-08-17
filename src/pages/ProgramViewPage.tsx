import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ConnectedHeader } from '../components/layout';
import { NeuralBackground } from '../components/neural';
import { ProgramViewGrid, EarningsOverview, LiveActivationsTable } from '../components/matrix';
import { GlassButton } from '../components/glass';
import { useWallet } from '../hooks/useWallet';

const ProgramViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { buyLevel, userLevels } = useWallet();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground intensity={0.6} particleCount={30} />
      <ConnectedHeader />

      {/* Fullscreen Content */}
      <main className="relative z-10 pt-16 pb-8">
        <div className="w-full px-4 md:px-6 lg:px-8">
          {/* Page Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-4 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassButton
                    variant="secondary"
                    onClick={handleBack}
                    className="group px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-2 border-gray-600/50 hover:border-cyan-400/60 rounded-xl backdrop-blur-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowLeft
                        size={18}
                        className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 group-hover:-translate-x-1 transform transition-transform"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm font-medium">
                        Back
                      </span>
                    </div>
                  </GlassButton>
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold font-cyberpunk">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    PROGRAM VIEW
                  </span>
                </h1>
              </div>

              {/* Compact Earnings Overview */}
              <div className="hidden lg:block">
                <EarningsOverview userLevels={userLevels} />
              </div>
            </div>

            <p className="text-gray-400 text-lg">
              Complete matrix overview - track your levels, profits, and partner positions
            </p>
          </motion.div>

          {/* Program View Content - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ProgramViewGrid onActivate={buyLevel} userLevels={userLevels} />
          </motion.div>

          {/* Live Activations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            <LiveActivationsTable />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProgramViewPage;
