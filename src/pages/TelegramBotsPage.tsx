import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Bell, MessageCircle, Users, Bot, Zap, Shield, Clock } from 'lucide-react';
import { ConnectedHeader, DashboardSidebar } from '../components/layout';
import { NeuralBackground } from '../components/neural';
import { GlassCard, GlassButton } from '../components/glass';

const TelegramBotsPage: React.FC = () => {
  const handleBotRedirect = (botUrl: string) => {
    window.open(botUrl, '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground intensity={0.6} particleCount={30} />
      <ConnectedHeader />
      <DashboardSidebar />

      <main className="relative z-10 pt-16 pb-16 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            className="mt-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-cyberpunk mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    TELEGRAM BOTS
                  </span>
                </h1>
                <p className="text-gray-300">Stay connected with automated notifications and support</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Bots Section */}
            <div className="space-y-6">
              {/* Notification Bot */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <GlassCard className="p-6 border border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <Bell className="text-cyan-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Notification Bot</h3>
                        <p className="text-cyan-400 text-sm">@QuantumProfitNotifyBot</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Online</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-gray-300 text-sm">
                      Get instant notifications about your matrix activity, earnings, and level activations directly to your Telegram.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="text-yellow-400" size={16} />
                          <span className="text-yellow-400 text-xs font-medium">Real-time</span>
                        </div>
                        <div className="text-white text-sm">Instant Alerts</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="text-green-400" size={16} />
                          <span className="text-green-400 text-xs font-medium">Secure</span>
                        </div>
                        <div className="text-white text-sm">Encrypted</div>
                      </div>
                    </div>
                  </div>

                  <GlassButton
                    variant="primary"
                    onClick={() => handleBotRedirect('https://t.me/QuantumProfitNotifyBot')}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:text-white shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Bot size={18} />
                      <span className="font-semibold">Start Notifications</span>
                      <ExternalLink size={16} />
                    </div>
                  </GlassButton>
                </GlassCard>
              </motion.div>

              {/* Support Bot */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <GlassCard className="p-6 border border-purple-400/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <MessageCircle className="text-purple-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Support Bot</h3>
                        <p className="text-purple-400 text-sm">@QuantumProfitSupportBot</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">24/7</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <p className="text-gray-300 text-sm">
                      Get instant help with questions, technical issues, and guidance through our automated support system.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-blue-400" size={16} />
                          <span className="text-blue-400 text-xs font-medium">24/7</span>
                        </div>
                        <div className="text-white text-sm">Always Available</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="text-purple-400" size={16} />
                          <span className="text-purple-400 text-xs font-medium">Community</span>
                        </div>
                        <div className="text-white text-sm">Expert Help</div>
                      </div>
                    </div>
                  </div>

                  <GlassButton
                    variant="primary"
                    onClick={() => handleBotRedirect('https://t.me/QuantumProfitSupportBot')}
                    className="w-full py-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400/50 hover:border-purple-300 text-purple-300 hover:text-white shadow-lg shadow-purple-400/20 hover:shadow-purple-400/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MessageCircle size={18} />
                      <span className="font-semibold">Get Support</span>
                      <ExternalLink size={16} />
                    </div>
                  </GlassButton>
                </GlassCard>
              </motion.div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Bot Features</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mt-0.5">
                        <Bell size={12} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Matrix Notifications</div>
                        <div className="text-gray-400 text-sm">Get notified when you receive payouts, level activations, and referral bonuses</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mt-0.5">
                        <Users size={12} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Referral Updates</div>
                        <div className="text-gray-400 text-sm">Instant alerts when new users join your referral network</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mt-0.5">
                        <Zap size={12} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">System Status</div>
                        <div className="text-gray-400 text-sm">Smart contract updates, network status, and important announcements</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mt-0.5">
                        <MessageCircle size={12} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Live Support</div>
                        <div className="text-gray-400 text-sm">Chat with our support team and get help with technical issues</div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* How to Setup */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <GlassCard className="p-6 border border-yellow-400/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Setup</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        1
                      </div>
                      <div className="text-gray-300 text-sm">Click on the bot button above</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        2
                      </div>
                      <div className="text-gray-300 text-sm">Start the bot in Telegram</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        3
                      </div>
                      <div className="text-gray-300 text-sm">Connect your wallet address</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        4
                      </div>
                      <div className="text-gray-300 text-sm">Receive instant notifications!</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Community */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <GlassCard className="p-6 border border-green-400/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                  <h3 className="text-xl font-semibold text-white mb-4">Join Community</h3>
                  
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">
                      Connect with other Quantum Profit Chain users, share strategies, and get real-time updates from our official channels.
                    </p>

                    <div className="flex gap-3">
                      <GlassButton
                        variant="secondary"
                        onClick={() => handleBotRedirect('https://t.me/QuantumProfitChain')}
                        className="flex-1 py-2 text-sm"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Users size={14} />
                          <span>Channel</span>
                        </div>
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        onClick={() => handleBotRedirect('https://t.me/QuantumProfitChat')}
                        className="flex-1 py-2 text-sm"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <MessageCircle size={14} />
                          <span>Chat</span>
                        </div>
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TelegramBotsPage;
