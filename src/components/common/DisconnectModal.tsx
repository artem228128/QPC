import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogOut } from 'lucide-react';
import { GlassCard, GlassButton } from '../glass';

interface DisconnectModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDisconnecting: boolean;
}

export const DisconnectModal: React.FC<DisconnectModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isDisconnecting,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <GlassCard className="p-6 rounded-xl border border-red-400/20 bg-gradient-to-br from-red-500/5 to-orange-500/5">
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-400" size={32} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  Disconnect from App?
                </h3>

                {/* Description */}
                <div className="text-gray-300 text-sm mb-6 space-y-2">
                  <p>This will clear your session data and redirect you to the home page.</p>
                  <p className="text-yellow-400">
                    Your wallet will remain connected in the browser.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <GlassButton
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isDisconnecting}
                    className="flex-1 py-3"
                  >
                    Cancel
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    onClick={onConfirm}
                    disabled={isDisconnecting}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500/30 to-orange-500/30 border-red-400/50 text-red-300 hover:text-white"
                  >
                    {isDisconnecting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div>
                        <span>Disconnecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <LogOut size={16} />
                        <span>Disconnect</span>
                      </div>
                    )}
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
