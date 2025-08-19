import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatUserId } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Shield,
  Network,
  Share2,
  Settings as SettingsIcon,
  HelpCircle,
  Wallet,
  Mail,
  Moon,
  Sun,
  Globe,
  Eye,
  EyeOff,
  Download,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  LogOut,
  RotateCcw,
  Info,
  Code,
  MessageCircle,
  Monitor,
  Smartphone,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { ConnectedHeader, DashboardSidebar } from '../components/layout';
import { NeuralBackground } from '../components/neural';
import { GlassCard, GlassButton } from '../components/glass';
import { DisconnectModal } from '../components/common';
import { useWallet } from '../hooks/useWallet';
import { formatAddress, formatBNB } from '../utils/format';

interface SettingsState {
  // Account
  nickname: string;
  avatar: string;

  // Notifications
  pushNotifications: {
    levelActivations: boolean;
    referralBonuses: boolean;
    matrixCompletions: boolean;
    systemAnnouncements: boolean;
  };
  emailNotifications: {
    weeklyReports: boolean;
    securityAlerts: boolean;
    importantUpdates: boolean;
  };
  telegramBot: {
    connected: boolean;
    frequency: 'instant' | 'hourly' | 'daily';
  };

  // Display
  theme: 'dark' | 'light';
  performanceMode: boolean;
  language: string;
  currencyDisplay: 'BNB' | 'USD';
  dashboardLayout: 'compact' | 'expanded';

  // Security
  hideBalance: boolean;
  anonymousMode: boolean;
  autoLogout: number; // minutes

  // Network
  preferredGasPrice: 'slow' | 'normal' | 'fast';
  slippageTolerance: number;

  // Advanced
  developerMode: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  nickname: '',
  avatar: '',
  pushNotifications: {
    levelActivations: true,
    referralBonuses: true,
    matrixCompletions: true,
    systemAnnouncements: true,
  },
  emailNotifications: {
    weeklyReports: true,
    securityAlerts: true,
    importantUpdates: true,
  },
  telegramBot: {
    connected: false,
    frequency: 'instant',
  },
  theme: 'dark',
  performanceMode: false,
  language: 'en',
  currencyDisplay: 'BNB',
  dashboardLayout: 'expanded',
  hideBalance: false,
  anonymousMode: false,
  autoLogout: 30,
  preferredGasPrice: 'normal',
  slippageTolerance: 0.5,
  developerMode: false,
};

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { walletState, contractInfo, disconnectWallet, BSC_NETWORK } = useWallet();
  const [activeTab, setActiveTab] = useState<
    | 'account'
    | 'notifications'
    | 'display'
    | 'security'
    | 'network'
    | 'referral'
    | 'advanced'
    | 'support'
  >('account');
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('qpc-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = key.split('.');
      let current: any = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newSettings;
    });
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('qpc-settings', JSON.stringify(settings));
      setHasChanges(false);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const copyReferralLink = () => {
    const link = `https://quantumprofitchain.com?ref=${formatUserId(contractInfo?.id) || 'YOUR_ID'}`;
    navigator.clipboard.writeText(link);
  };

  const exportData = (type: 'transactions' | 'earnings' | 'all') => {
    // In real implementation, this would trigger actual data export
    console.log(`Exporting ${type} data...`);
  };

  const handleDisconnectConfirm = async () => {
    setDisconnecting(true);
    try {
      await disconnectWallet();
      setShowDisconnectModal(false);
      // Redirect to home page after successful disconnection
      navigate('/');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleDisconnectCancel = () => {
    setShowDisconnectModal(false);
  };

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(walletState.address || '');
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  }, [walletState.address]);

  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Profile Information */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <User className="text-cyan-400" size={24} />
          Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Nickname</label>
            <input
              type="text"
              value={settings.nickname}
              onChange={(e) => updateSetting('nickname', e.target.value)}
              placeholder="Enter your nickname"
              className="w-full glass-panel-secondary p-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">User ID</label>
            <div className="glass-panel-secondary p-3 rounded-xl text-gray-400 border border-white/10">
              {contractInfo?.id ? `#${formatUserId(contractInfo.id)}` : 'Not registered'}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Wallet Address</label>
            <div className="glass-panel-secondary p-3 rounded-xl text-gray-400 border border-white/10 font-mono text-sm">
              {walletState.address ? formatAddress(walletState.address) : 'Not connected'}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Registration Date</label>
            <div className="glass-panel-secondary p-3 rounded-xl text-gray-400 border border-white/10">
              {contractInfo?.registrationTimestamp
                ? new Date(Number(contractInfo.registrationTimestamp)).toLocaleDateString()
                : 'Not registered'}
            </div>
          </div>


        </div>
      </GlassCard>

      {/* Wallet Connection */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Wallet className="text-purple-400" size={24} />
          Wallet Connection
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-panel-secondary rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div>
                <div className="text-white font-medium">Connected Wallet</div>
                <div className="text-gray-400 text-sm font-mono">
                  {walletState.address ? formatAddress(walletState.address) : 'Not connected'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={copyAddress}
                className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-xl transition-all duration-300 border border-blue-400/40 hover:border-blue-400/60 text-blue-300 hover:text-white backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                disabled={addressCopied}
              >
                <motion.div
                  initial={false}
                  animate={addressCopied ? {
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.5, ease: "easeInOut" }
                  } : {}}
                >
                  {addressCopied ? <Check size={16} /> : <Copy size={16} />}
                </motion.div>
              </motion.button>
              <GlassButton
                variant="secondary"
                onClick={() => setShowDisconnectModal(true)}
                className="px-3 py-2 border-red-500/50 text-red-400 hover:border-red-400 hover:bg-red-500/10 hover:rounded-xl transition-all duration-300"
                disabled={disconnecting}
              >
                <LogOut size={16} />
              </GlassButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel-secondary p-3 rounded-xl border border-white/10">
              <div className="text-gray-400 text-sm">Network</div>
              <div className="text-white font-medium">{BSC_NETWORK.chainName}</div>
            </div>
            <div className="glass-panel-secondary p-3 rounded-xl border border-white/10">
              <div className="text-gray-400 text-sm">Balance</div>
              <div className="text-white font-medium">
                {settings.hideBalance ? '••••••' : formatBNB(walletState.balance)} BNB
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {/* Push Notifications */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Bell className="text-yellow-400" size={24} />
          Push Notifications
        </h3>

        <div className="space-y-4">
          {Object.entries(settings.pushNotifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 glass-panel-secondary rounded-xl border border-white/10"
            >
              <div>
                <div className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
                <div className="text-gray-400 text-sm">
                  {key === 'levelActivations' && 'Get notified when new levels are activated'}
                  {key === 'referralBonuses' && 'Receive alerts for referral bonus payments'}
                  {key === 'matrixCompletions' && 'Notifications for completed matrix cycles'}
                  {key === 'systemAnnouncements' && 'Important system updates and announcements'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateSetting(`pushNotifications.${key}`, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Email Notifications */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Mail className="text-blue-400" size={24} />
          Email Notifications
        </h3>

        <div className="space-y-4">
          {Object.entries(settings.emailNotifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 glass-panel-secondary rounded-xl border border-white/10"
            >
              <div>
                <div className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </div>
                <div className="text-gray-400 text-sm">
                  {key === 'weeklyReports' && 'Weekly summary of your earnings and activity'}
                  {key === 'securityAlerts' && 'Security-related notifications and warnings'}
                  {key === 'importantUpdates' && 'Major platform updates and announcements'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateSetting(`emailNotifications.${key}`, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[.*] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Telegram Bot */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <MessageCircle className="text-green-400" size={24} />
          Telegram Bot Integration
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 glass-panel-secondary rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-xl ${settings.telegramBot.connected ? 'bg-green-400' : 'bg-gray-500'}`}
              ></div>
              <div>
                <div className="text-white font-medium">Notification Bot</div>
                <div className="text-gray-400 text-sm">@QuantumProfitNotifyBot</div>
              </div>
            </div>
            <GlassButton
              variant={settings.telegramBot.connected ? 'secondary' : 'primary'}
              onClick={() =>
                updateSetting('telegramBot.connected', !settings.telegramBot.connected)
              }
              className={`px-4 py-2 ${settings.telegramBot.connected ? 'border-red-500/50 text-red-400 hover:border-red-400' : ''}`}
            >
              {settings.telegramBot.connected ? 'Disconnect' : 'Connect'}
            </GlassButton>
          </div>

          {settings.telegramBot.connected && (
            <div>
              <label className="block text-gray-300 text-sm mb-2">Notification Frequency</label>
              <select
                value={settings.telegramBot.frequency}
                onChange={(e) => updateSetting('telegramBot.frequency', e.target.value)}
                className="w-full glass-panel-secondary p-3 rounded-xl text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
              >
                <option value="instant">Instant</option>
                <option value="hourly">Hourly Summary</option>
                <option value="daily">Daily Summary</option>
              </select>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      {/* Theme Settings */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Palette className="text-purple-400" size={24} />
          Theme & Appearance
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => updateSetting('theme', 'dark')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                settings.theme === 'dark'
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-white/10 glass-panel-secondary hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Moon className="text-cyan-400" size={20} />
                <span className="text-white font-medium">Dark Mode</span>
              </div>
              <div className="text-gray-400 text-sm">Current theme</div>
            </div>

            <div
              onClick={() => updateSetting('theme', 'light')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                settings.theme === 'light'
                  ? 'border-yellow-400 bg-yellow-500/10'
                  : 'border-white/10 glass-panel-secondary hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Sun className="text-yellow-400" size={20} />
                <span className="text-white font-medium">Light Mode</span>
              </div>
              <div className="text-gray-400 text-sm">Coming soon</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 glass-panel-secondary rounded-xl border border-white/10">
            <div>
              <div className="text-white font-medium">Performance Mode</div>
              <div className="text-gray-400 text-sm">
                Reduce animations and effects for better performance
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.performanceMode}
                onChange={(e) => updateSetting('performanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[.*] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>
      </GlassCard>

      {/* Language & Currency */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Globe className="text-green-400" size={24} />
          Language & Currency
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Interface Language</label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full glass-panel-secondary p-3 rounded-xl text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Currency Display</label>
            <select
              value={settings.currencyDisplay}
              onChange={(e) => updateSetting('currencyDisplay', e.target.value)}
              className="w-full glass-panel-secondary p-3 rounded-xl text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
            >
              <option value="BNB">BNB</option>
              <option value="USD">USD (approx.)</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Dashboard Layout */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Monitor className="text-blue-400" size={24} />
          Dashboard Layout
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => updateSetting('dashboardLayout', 'compact')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              settings.dashboardLayout === 'compact'
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-white/10 glass-panel-secondary hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="text-blue-400" size={20} />
              <span className="text-white font-medium">Compact</span>
            </div>
            <div className="text-gray-400 text-sm">Dense layout with smaller widgets</div>
          </div>

          <div
            onClick={() => updateSetting('dashboardLayout', 'expanded')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              settings.dashboardLayout === 'expanded'
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-white/10 glass-panel-secondary hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="text-blue-400" size={20} />
              <span className="text-white font-medium">Expanded</span>
            </div>
            <div className="text-gray-400 text-sm">Spacious layout with larger widgets</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Shield className="text-red-400" size={24} />
          Privacy & Security
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 glass-panel-secondary rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <Eye className="text-gray-400" size={20} />
              <div>
                <div className="text-white font-medium">Hide Balance</div>
                <div className="text-gray-400 text-sm">
                  Hide balance amounts from screenshots and screen sharing
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hideBalance}
                onChange={(e) => updateSetting('hideBalance', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[.*] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 glass-panel-secondary rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <EyeOff className="text-gray-400" size={20} />
              <div>
                <div className="text-white font-medium">Anonymous Mode</div>
                <div className="text-gray-400 text-sm">
                  Hide personal information in leaderboards and public stats
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.anonymousMode}
                onChange={(e) => updateSetting('anonymousMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[.*] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </GlassCard>

      {/* Session Management */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <RotateCcw className="text-orange-400" size={24} />
          Session Management
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Auto-logout Timer</label>
            <select
              value={settings.autoLogout}
              onChange={(e) => updateSetting('autoLogout', parseInt(e.target.value))}
              className="w-full glass-panel-secondary p-3 rounded-xl text-white border border-white/10 focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={240}>4 hours</option>
              <option value={0}>Never</option>
            </select>
            <div className="text-gray-400 text-sm mt-1">
              Automatically disconnect wallet after inactivity
            </div>
          </div>

          <div className="p-4 glass-panel-secondary rounded-xl border border-orange-400/20 bg-orange-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-400 mt-1" size={20} />
              <div>
                <div className="text-orange-400 font-medium">Security Reminder</div>
                <div className="text-gray-300 text-sm mt-1">
                  Always disconnect your wallet when using public computers or shared devices.
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderNetworkSettings = () => (
    <div className="space-y-6">
      {/* Network Configuration */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Network className="text-blue-400" size={24} />
          Network Configuration
        </h3>

        <div className="space-y-4">
          <div className="p-4 glass-panel-secondary rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-medium">Current Network</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">{BSC_NETWORK.chainName}</div>
          </div>
        </div>
      </GlassCard>

      {/* Transaction Settings */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <SettingsIcon className="text-green-400" size={24} />
          Transaction Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Preferred Gas Price</label>
            <select
              value={settings.preferredGasPrice}
              onChange={(e) => updateSetting('preferredGasPrice', e.target.value)}
              className="w-full glass-panel-secondary p-3 rounded-xl text-white border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400"
            >
              <option value="slow">Slow (Lower fees, longer confirmation)</option>
              <option value="normal">Normal (Balanced)</option>
              <option value="fast">Fast (Higher fees, quick confirmation)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Slippage Tolerance</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={settings.slippageTolerance}
                onChange={(e) => updateSetting('slippageTolerance', parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
              />
              <div className="glass-panel-secondary px-3 py-2 rounded-xl text-white text-sm min-w-[60px] text-center">
                {settings.slippageTolerance}%
              </div>
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Maximum price movement tolerance for transactions
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderReferralSettings = () => (
    <div className="space-y-6">
      {/* Referral Tools */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Share2 className="text-cyan-400" size={24} />
          Referral Tools
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Your Referral Link</label>
            <div className="flex gap-2">
              <div className="flex-1 glass-panel-secondary p-3 rounded-xl text-white font-mono text-sm border border-white/10">
                https://quantumprofitchain.com?ref={formatUserId(contractInfo?.id) || 'YOUR_ID'}
              </div>
              <GlassButton variant="secondary" onClick={copyReferralLink} className="px-4">
                <Copy size={16} />
              </GlassButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassButton
              variant="primary"
              onClick={() => {
                /* Generate QR code */
              }}
              className="py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <QrCode size={16} />
                <span>Generate QR Code</span>
              </div>
            </GlassButton>

            <GlassButton
              variant="secondary"
              onClick={() => window.open('/promo', '_blank')}
              className="py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <ExternalLink size={16} />
                <span>Promo Materials</span>
              </div>
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Referral Statistics */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <SettingsIcon className="text-purple-400" size={24} />
          Statistics Visibility
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 glass-panel-secondary rounded-xl border border-white/10">
            <div>
              <div className="text-white font-medium">Show Referral Count</div>
              <div className="text-gray-400 text-sm">Display your referral count publicly</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={true} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[.*] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 glass-panel-secondary rounded-xl border border-white/10">
            <div>
              <div className="text-white font-medium">Show Earnings</div>
              <div className="text-gray-400 text-sm">Display your earnings in leaderboards</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={false} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[.*] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      {/* Data Export */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Download className="text-green-400" size={24} />
          Data Export
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassButton
              variant="secondary"
              onClick={() => exportData('transactions')}
              className="py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <Download size={16} />
                <span>Transactions</span>
              </div>
            </GlassButton>

            <GlassButton
              variant="secondary"
              onClick={() => exportData('earnings')}
              className="py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <Download size={16} />
                <span>Earnings</span>
              </div>
            </GlassButton>

            <GlassButton variant="secondary" onClick={() => exportData('all')} className="py-3">
              <div className="flex items-center justify-center gap-2">
                <Download size={16} />
                <span>All Data</span>
              </div>
            </GlassButton>
          </div>

          <div className="text-gray-400 text-sm">
            Export your transaction history, earnings reports, and account data in CSV format.
          </div>
        </div>
      </GlassCard>

      {/* Developer Mode */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Code className="text-purple-400" size={24} />
          Developer Options
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 glass-panel-secondary rounded-xl border border-white/10">
            <div>
              <div className="text-white font-medium">Developer Mode</div>
              <div className="text-gray-400 text-sm">
                Show contract interaction logs and debug information
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.developerMode}
                onChange={(e) => updateSetting('developerMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[.*] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          {settings.developerMode && (
            <div className="p-4 glass-panel-secondary rounded-xl border border-purple-400/20 bg-purple-500/5">
              <div className="text-purple-400 font-medium mb-2">Debug Information</div>
              <div className="space-y-1 text-sm text-gray-300 font-mono">
                <div>
                  Contract: {process.env.REACT_APP_CONTRACT_ADDRESS_TESTNET || 'Not configured'}
                </div>
                <div>Network: {BSC_NETWORK.chainName}</div>
                <div>Chain ID: {BSC_NETWORK.chainId}</div>
                <div>App Version: 1.0.0</div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );

  const renderSupportSettings = () => (
    <div className="space-y-6">
      {/* Help & Support */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <HelpCircle className="text-blue-400" size={24} />
          Help & Support
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassButton
              variant="secondary"
              onClick={() => window.open('/information', '_blank')}
              className="py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <HelpCircle size={16} />
                <span>FAQ</span>
              </div>
            </GlassButton>

            <GlassButton
              variant="secondary"
              onClick={() => window.open('/telegram-bots', '_blank')}
              className="py-3"
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                <span>Contact Support</span>
              </div>
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* System Information */}
      <GlassCard className="p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Info className="text-gray-400" size={24} />
          System Information
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 glass-panel-secondary rounded-xl border border-white/10">
            <span className="text-gray-300">App Version</span>
            <span className="text-white">1.0.0</span>
          </div>

          <div className="flex justify-between items-center p-3 glass-panel-secondary rounded-xl border border-white/10">
            <span className="text-gray-300">Contract Version</span>
            <span className="text-white">2.0.0</span>
          </div>

          <div className="flex justify-between items-center p-3 glass-panel-secondary rounded-xl border border-white/10">
            <span className="text-gray-300">Last Sync</span>
            <span className="text-white">{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="flex justify-between items-center p-3 glass-panel-secondary rounded-xl border border-white/10">
            <span className="text-gray-300">Network Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400">Online</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'referral', label: 'Referral', icon: Share2 },
    { id: 'advanced', label: 'Advanced', icon: SettingsIcon },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

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
                    SETTINGS
                  </span>
                </h1>
                <p className="text-gray-300">Customize your experience and preferences</p>
              </div>

              {hasChanges && (
                <GlassButton
                  variant="primary"
                  onClick={saveSettings}
                  disabled={saving}
                  className="px-6 py-3"
                >
                  <div className="flex items-center gap-2">
                    {saving ? (
                      <div className="animate-spin rounded-xl h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </div>
                </GlassButton>
              )}
            </div>
          </motion.div>

          {/* Settings Navigation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <GlassButton
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-3 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-400/50 text-cyan-300'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </div>
                  </GlassButton>
                );
              })}
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'account' && renderAccountSettings()}
                {activeTab === 'notifications' && renderNotificationSettings()}
                {activeTab === 'display' && renderDisplaySettings()}
                {activeTab === 'security' && renderSecuritySettings()}
                {activeTab === 'network' && renderNetworkSettings()}
                {activeTab === 'referral' && renderReferralSettings()}
                {activeTab === 'advanced' && renderAdvancedSettings()}
                {activeTab === 'support' && renderSupportSettings()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Disconnect Modal */}
      <DisconnectModal
        isOpen={showDisconnectModal}
        onConfirm={handleDisconnectConfirm}
        onCancel={handleDisconnectCancel}
        isDisconnecting={disconnecting}
      />
    </div>
  );
};

export default SettingsPage;
