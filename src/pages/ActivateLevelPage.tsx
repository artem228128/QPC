import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowLeft, Shield, Zap } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { LEVEL_PRICES, formatBNB } from '../utils/contract';
import { NeuralBackground } from '../components/neural';

const ALL_LEVELS = Array.from({ length: 16 }, (_, i) => i + 1);

const ActivateLevelPage: React.FC = () => {
  const navigate = useNavigate();
  const { walletState, switchToBSC, contractInfo, isLoading, registerUser, buyLevel } = useWallet();

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [activationError, setActivationError] = useState<string | null>(null);

  const levelPrice = useMemo(() => {
    return LEVEL_PRICES[selectedLevel] ?? 0;
  }, [selectedLevel]);


  const isOnBSC = 
    walletState.network === 'bsc' || 
    (walletState.chainIdHex || '').toLowerCase() === '0x61' || 
    (walletState.chainIdHex || '').toLowerCase() === '0x38' ||
    Number(walletState.chainIdHex) === 97 ||
    Number(walletState.chainIdHex) === 56;
    
  const hasSufficientBalance = (walletState.balance || 0) >= levelPrice;
  const isConnected = walletState.isConnected;
  const canActivate = isConnected && isOnBSC && hasSufficientBalance;

  const handleSwitchNetwork = useCallback(async () => {
    await switchToBSC();
  }, [switchToBSC]);

  const handleActivate = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setActivationError(null);

      // If not registered, register first
      if (!contractInfo) {
        await registerUser();
      }

      // Real buy level call on selected network
      await buyLevel(selectedLevel, levelPrice);

      setStep('success');
    } catch (err: any) {
      console.error('Activation failed:', err);
      setActivationError(err?.message || 'Activation failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [contractInfo, registerUser, buyLevel, selectedLevel, levelPrice]);

  const goToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const connectTelegramBot = useCallback(() => {
    window.open('https://t.me/your_notifications_bot', '_blank');
  }, []);

  const renderContent = () => {
    if (step === 'success') {
      return (
        <motion.div
          className="text-center max-w-sm mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl shadow-black/30">
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="text-white w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">Congratulations!</h3>
            <p className="text-gray-400 text-sm mb-4">
              Level {selectedLevel} successfully activated
            </p>
            <div className="bg-white/5 rounded-lg p-3 text-sm mb-6">
              <div className="text-cyan-400 font-mono">
                Level {selectedLevel} - {formatBNB(levelPrice)} BNB
              </div>
              <div className="text-gray-400 text-xs mt-1">Transaction confirmed</div>
            </div>

            <div className="space-y-3">
              <p className="text-white text-sm">Get notifications via Telegram?</p>
              <div className="flex flex-col space-y-2">
                <motion.button
                  onClick={connectTelegramBot}
                  className="w-full p-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl transition-all duration-200 text-cyan-300 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Connect Telegram Bot
                </motion.button>
                <motion.button
                  onClick={goToDashboard}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 text-gray-300 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Dashboard
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl shadow-black/30">
          {/* Upline Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              Upline Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                <span className="text-gray-400">Address:</span>
                <span className="text-white font-mono text-xs">
                  {contractInfo?.referrer
                    ? `${contractInfo.referrer.slice(0, 6)}...${contractInfo.referrer.slice(-4)}`
                    : 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                <span className="text-gray-400">ID:</span>
                <span className="text-white">{contractInfo?.referrerId ?? 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Level Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Level Selection
            </h3>
            <select
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(parseInt(e.target.value, 10))}
              disabled={isSubmitting || isLoading}
            >
              {ALL_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-white/10 text-white">
                  Level {lvl} — {formatBNB(LEVEL_PRICES[lvl])} BNB
                </option>
              ))}
            </select>

            <div className="mt-3 p-3 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Price:</span>
                <span className="text-white font-semibold">{formatBNB(levelPrice)} BNB</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-400">Gas fee:</span>
                <span className="text-yellow-400">+ estimated</span>
              </div>
              <div className="border-t border-white/10 mt-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-cyan-400 font-bold">{formatBNB(levelPrice)} BNB + gas</span>
                </div>
              </div>
            </div>
          </div>

          {/* DEBUG INFO */}
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h3 className="text-sm font-semibold text-red-400 mb-2">DEBUG INFO</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <div>network: "{walletState.network}"</div>
              <div>chainIdHex: "{walletState.chainIdHex}"</div>
              <div>isOnBSC: {isOnBSC ? 'TRUE' : 'FALSE'}</div>
              <div>isConnected: {walletState.isConnected ? 'TRUE' : 'FALSE'}</div>
            </div>
          </div>

          {/* Status Checks */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Status Check
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-gray-400 text-sm">Wallet:</span>
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">Connected</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-400 text-sm">Not connected</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-gray-400 text-sm">Network:</span>
                <div className="flex items-center gap-2">
                  {isOnBSC ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">BSC</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-400 text-sm">Wrong network</span>
                      <div className="text-xs text-gray-400 mt-1">
                        Debug: network="{walletState.network}", chainId="{walletState.chainIdHex}"
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-gray-400 text-sm">Balance:</span>
                <div className="flex items-center gap-2">
                  {hasSufficientBalance ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">
                        {formatBNB(walletState.balance || 0)} BNB
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-400 text-sm">Insufficient</span>
                    </>
                  )}
                </div>
              </div>

              {!isOnBSC && isConnected && (
                <motion.button
                  onClick={handleSwitchNetwork}
                  className="w-full p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg transition-all duration-200 text-yellow-300 font-medium text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Switch to BNB Smart Chain
                </motion.button>
              )}
            </div>
          </div>

          {/* Activate Button */}
          <motion.button
            onClick={handleActivate}
            disabled={!canActivate || isSubmitting || isLoading}
            className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 ${
              canActivate && !isSubmitting && !isLoading
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={canActivate && !isSubmitting && !isLoading ? { scale: 1.02 } : {}}
            whileTap={canActivate && !isSubmitting && !isLoading ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting || isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Activate Level {selectedLevel}
                </>
              )}
            </div>
          </motion.button>

          {/* Error Messages */}
          {activationError && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {activationError}
              </div>
            </div>
          )}
          {!isConnected && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                Connect your wallet to continue
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Neural Background */}
      <NeuralBackground intensity={0.8} particleCount={30} />
      {/* Header */}
      <div className="relative pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Title Section */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Activate Your Level
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Select a level and activate it on BNB Smart Chain.
                <br />
                Secure blockchain transactions powered by smart contracts.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>BNB Smart Chain</span>
              </div>
              <div className="w-px h-4 bg-gray-600" />
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure Connection</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Need help?{' '}
              <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateLevelPage;
