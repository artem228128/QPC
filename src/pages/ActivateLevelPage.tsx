import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowLeft, CheckCircle, Shield, Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../components/common';
import {
  LEVEL_PRICES,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  CONTRACT_CONSTANTS,
} from '../utils/contract';

// Ethers v6 imports (already in deps)
import { BrowserProvider, Contract, parseEther } from 'ethers';

const formatBnb = (n: number) => n.toFixed(4);

const getQueryParam = (search: string, key: string) => new URLSearchParams(search).get(key) || '';

const ActivateLevelPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { walletState, switchToBSC, isUserRegistered } = useWallet();

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<'form' | 'register_success'>('form');
  const [estimatedGasFeeBnb] = useState<number>(0.0005);
  const [isBscOk, setIsBscOk] = useState<boolean>(walletState.network === 'bsc');

  const referralFromUrl = useMemo(() => getQueryParam(location.search, 'ref'), [location.search]);

  // Derived values
  const levelPriceBnb = useMemo(() => LEVEL_PRICES[selectedLevel] || 0, [selectedLevel]);
  const needsRegistration = useMemo(() => false, []); // Registration flow is handled dynamically below

  const totalAmountBnb = useMemo(
    () =>
      levelPriceBnb + (needsRegistration ? parseFloat(CONTRACT_CONSTANTS.REGISTRATION_PRICE) : 0),
    [levelPriceBnb, needsRegistration]
  );

  useEffect(() => {
    setIsBscOk(walletState.network === 'bsc');
  }, [walletState.network]);

  const ensureBsc = useCallback(async () => {
    if (walletState.network !== 'bsc') {
      const switched = await switchToBSC();
      setIsBscOk(switched);
      if (!switched) {
        toast.warning('Wrong network', 'Please switch to BNB Smart Chain');
      }
      return switched;
    }
    return true;
  }, [switchToBSC, walletState.network, toast]);

  const hasSufficientBalance = useMemo(() => {
    return walletState.balance >= totalAmountBnb; // gas excluded; we show notice
  }, [walletState.balance, totalAmountBnb]);

  const canTransact = useMemo(() => {
    return isBscOk && hasSufficientBalance && !!walletState.address && totalAmountBnb > 0;
  }, [isBscOk, hasSufficientBalance, walletState.address, totalAmountBnb]);

  const goDashboardIfActive = useCallback(async () => {
    // In future: check user levels via contract and redirect if active
    // For now, if user is registered, we let them proceed to game after buy
    return false;
  }, []);

  const getSignerAndContract = useCallback(async () => {
    if (!window.ethereum) throw new Error('Wallet not found');
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.length < 10) {
      throw new Error('Contract address not configured');
    }
    const provider = new BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI as any, signer);
    return { provider, signer, contract };
  }, []);

  const handleActivate = useCallback(async () => {
    try {
      setIsProcessing(true);

      // 1) Ensure BSC
      const ok = await ensureBsc();
      if (!ok) return;

      // 2) Wallet connected check
      if (!walletState.address) {
        toast.info('Connect wallet', 'Please connect wallet first');
        navigate('/wallet');
        return;
      }

      // 3) Balance check
      if (!hasSufficientBalance) {
        toast.error('Insufficient balance', 'Not enough BNB to activate the level');
        return;
      }

      const { contract } = await getSignerAndContract();

      // 4) Check registration status
      let registered = false;
      try {
        registered = await isUserRegistered(walletState.address);
      } catch (e) {
        // fallback: not critical
        registered = false;
      }

      // 5) If not registered, register first with optional referrer
      if (!registered) {
        const normalizedRef = (manualUpline || referralFromUrl || '').trim();
        const referralAddress = normalizedRef.startsWith('0x') ? normalizedRef : undefined;
        // If referral is not provided, call register() which uses owner as referrer
        if (referralAddress) {
          const tx = await contract.registerWithReferrer(referralAddress, {
            value: parseEther(CONTRACT_CONSTANTS.REGISTRATION_PRICE),
          });
          toast.info('Registration pending', 'Confirming transaction...');
          await tx.wait();
        } else {
          const tx = await contract.register({
            value: parseEther(CONTRACT_CONSTANTS.REGISTRATION_PRICE),
          });
          toast.info('Registration pending', 'Confirming transaction...');
          await tx.wait();
        }

        // Show success step and propose Telegram bot
        setStep('register_success');
        toast.success('Registered!', 'Welcome to Quantum Profit Chain');
        return;
      }

      // 6) Buy level
      if (selectedLevel < 1 || selectedLevel > 16) {
        toast.error('Invalid level', 'Please select a valid level (1-16)');
        return;
      }

      const price = LEVEL_PRICES[selectedLevel];
      const tx = await contract.buyLevel(selectedLevel, { value: parseEther(String(price)) });
      toast.info('Activation pending', 'Confirming transaction...');
      await tx.wait();

      toast.success('Level activated', `Level ${selectedLevel} is now active`);

      // If user has access, go to dashboard
      const shouldGoDashboard = await goDashboardIfActive();
      navigate(shouldGoDashboard ? '/game' : '/game');
    } catch (err: any) {
      console.error(err);
      toast.error('Transaction failed', err?.reason || err?.message || 'Please try again');
    } finally {
      setIsProcessing(false);
    }
  }, [
    ensureBsc,
    walletState.address,
    hasSufficientBalance,
    getSignerAndContract,
    isUserRegistered,
    referralFromUrl,
    selectedLevel,
    toast,
    goDashboardIfActive,
    navigate,
  ]);

  const handleContinueAfterRegister = useCallback(async () => {
    // Continue to buy selected level after registration success screen
    setStep('form');
    await handleActivate();
  }, [handleActivate]);

  const networkBadge = (
    <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
      <div className={`w-2 h-2 rounded-full ${isBscOk ? 'bg-green-400' : 'bg-orange-400'}`} />
      <span>{isBscOk ? 'BNB Smart Chain' : 'Wrong Network'}</span>
    </div>
  );

  // Upline: allow manual input override
  const [manualUpline, setManualUpline] = useState<string>('');
  const uplineDisplay = (manualUpline || referralFromUrl || 'Default (Owner)') as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="relative pt-8 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="text-center mt-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Activate Level</h1>
            <p className="text-gray-400">
              Select level, verify network and balance, then confirm activation
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        {/* Registration success step */}
        <AnimatePresence>
          {step === 'register_success' && (
            <motion.div
              className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-2xl font-semibold mb-2">Congratulations!</h3>
                <p className="text-gray-400">You are now registered in Quantum Profit Chain</p>

                <div className="mt-6 bg-black/20 rounded-lg p-4 text-left">
                  <div className="text-gray-300 text-sm mb-2">Stay informed:</div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="text-gray-400 text-sm">
                      Connect our Telegram bot to receive payout and queue updates
                    </div>
                    <div className="flex items-center space-x-3">
                      <a
                        href="https://t.me/"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                      >
                        Connect Telegram Bot
                      </a>
                      <button
                        onClick={handleContinueAfterRegister}
                        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main form */}
        {step === 'form' && (
          <div className="space-y-6">
            {/* Upline */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-400 text-sm">Upline Address / ID</div>
                    <div className="text-white font-mono break-all">{uplineDisplay}</div>
                  </div>
                  <div>{networkBadge}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={manualUpline}
                    onChange={(e) => setManualUpline(e.target.value.trim())}
                    placeholder="Enter referrer address (0x...) or numeric ID"
                    className="flex-1 bg-black/40 border border-white/20 text-white rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setManualUpline('')}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Level Select */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-gray-400 text-sm mb-2">Select Level (1-16)</div>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(parseInt(e.target.value, 10))}
                    className="bg-black/40 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {Array.from({ length: 16 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Level {i + 1} — {formatBnb(LEVEL_PRICES[i + 1])} BNB
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Price</div>
                  <div className="text-white text-xl font-semibold">
                    {formatBnb(levelPriceBnb)} BNB
                  </div>
                </div>
              </div>
            </div>

            {/* Summary & Actions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Your balance</span>
                  <span className="text-white">{formatBnb(walletState.balance)} BNB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total to pay</span>
                  <span className="text-white">{formatBnb(totalAmountBnb)} BNB</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Gas fee (approx.)</span>
                  <span className="text-gray-400">~{formatBnb(estimatedGasFeeBnb)} BNB</span>
                </div>

                {!hasSufficientBalance && (
                  <div className="flex items-center space-x-2 text-orange-300 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Insufficient balance. Please top up your wallet.</span>
                  </div>
                )}

                {!isBscOk && (
                  <div className="flex items-center space-x-2 text-orange-300 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Please switch to BNB Smart Chain network</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    disabled={!canTransact || isProcessing}
                    onClick={handleActivate}
                    className={`w-full inline-flex items-center justify-center space-x-2 rounded-lg px-4 py-3 font-semibold transition-colors ${
                      !canTransact || isProcessing
                        ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? 'Processing...'
                        : `Activate — ${formatBnb(totalAmountBnb)} BNB`}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Transactions are processed via smart contract on BSC</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivateLevelPage;
