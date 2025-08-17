import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Wallet } from 'lucide-react';
import { GlassCard } from '../glass';

interface InsufficientFundsToastProps {
  show: boolean;
  onClose: () => void;
  requiredAmount: string;
  level: number;
  currentBalance?: number;
}

export const InsufficientFundsToast: React.FC<InsufficientFundsToastProps> = ({
  show,
  onClose,
  requiredAmount,
  level,
  currentBalance
}) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 6000); // Auto-close after 6 seconds
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-20 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, x: 300, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <GlassCard className="border-2 border-red-400/50 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg border border-red-400/40">
                    <AlertTriangle className="text-red-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Insufficient Funds</h3>
                    <p className="text-red-400 text-xs">Cannot activate Level {level}</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="text-gray-400 hover:text-white" size={16} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="bg-black/30 rounded-lg p-3 border border-red-400/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">Required:</span>
                    <span className="text-red-400 font-mono font-bold">{requiredAmount} BNB</span>
                  </div>
                  {currentBalance !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Current balance:</span>
                      <span className="text-gray-300 font-mono text-sm">
                        {currentBalance.toFixed(4)} BNB
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-yellow-400 text-xs">
                  <Wallet size={12} />
                  <span>Please add more BNB to your wallet</span>
                </div>
              </div>

              {/* Action */}
              <motion.div
                className="mt-4 pt-3 border-t border-gray-700/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">
                    You need{' '}
                    <span className="text-red-400 font-medium">
                      {currentBalance !== undefined
                        ? (parseFloat(requiredAmount) - currentBalance).toFixed(4)
                        : requiredAmount}{' '}
                      BNB
                    </span>{' '}
                    more to activate this level
                  </p>
                  <motion.button
                    onClick={onClose}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-medium underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    Got it
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Progress bar for auto-close */}
            <motion.div
              className="h-1 bg-red-400/30 rounded-b-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-red-400 to-orange-400"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 6, ease: 'linear' }}
              />
            </motion.div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InsufficientFundsToast;
