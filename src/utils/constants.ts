// Application constants

export const GAME_CONFIG = {
  MAX_LEVELS: 8,
  MIN_LEVEL_PRICE: 0.1,
  LEVEL_MULTIPLIER: 2,
  MATRIX_POSITIONS_BASE: 3,
  MATRIX_POSITIONS_MULTIPLIER: 3,
  REFERRAL_BONUS_PERCENTAGE: 10,
} as const;

export const NETWORK_CONFIG = {
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  BSC: {
    chainId: 56,
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
} as const;

export const CONTRACT_ADDRESSES = {
  ETHEREUM: {
    QUANTUM_GAME: '0x0000000000000000000000000000000000000000',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  POLYGON: {
    QUANTUM_GAME: '0x0000000000000000000000000000000000000000',
    USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  },
  BSC: {
    QUANTUM_GAME: '0x0000000000000000000000000000000000000000',
    BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  },
} as const;

export const ANIMATION_DELAYS = {
  STAGGER_BASE: 100,
  STAGGER_INCREMENT: 50,
  FADE_IN: 300,
  SLIDE_IN: 400,
  SCALE_IN: 200,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const STORAGE_KEYS = {
  WALLET_CONNECTED: 'quantum_wallet_connected',
  USER_PREFERENCES: 'quantum_user_preferences',
  GAME_STATE: 'quantum_game_state',
  THEME: 'quantum_theme',
} as const;

export const API_ENDPOINTS = {
  GAME_DATA: '/api/game',
  USER_PROFILE: '/api/user',
  TRANSACTIONS: '/api/transactions',
  LEADERBOARD: '/api/leaderboard',
  STATISTICS: '/api/stats',
} as const;

export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  NETWORK_NOT_SUPPORTED: 'Network not supported',
  TRANSACTION_FAILED: 'Transaction failed. Please try again',
  USER_NOT_REGISTERED: 'User not registered. Please register first',
  LEVEL_NOT_UNLOCKED: 'This level is not unlocked',
  INVALID_REFERRAL_CODE: 'Invalid referral code',
} as const;

export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  LEVEL_ACTIVATED: 'Level activated successfully',
  USER_REGISTERED: 'User registered successfully',
  TRANSACTION_COMPLETE: 'Transaction completed successfully',
  EARNINGS_RECEIVED: 'Earnings received successfully',
} as const;

export const SUPPORTED_WALLETS = [
  {
    name: 'MetaMask',
    icon: '🦊',
    connector: 'injected',
  },
  {
    name: 'WalletConnect',
    icon: '🔗',
    connector: 'walletconnect',
  },
  {
    name: 'Coinbase Wallet',
    icon: '🔵',
    connector: 'coinbase',
  },
] as const;
