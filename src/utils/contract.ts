// ===========================================
// 🔗 SMART CONTRACT CONFIGURATION
// ===========================================

// Contract Address on BSC Mainnet
// TODO: Replace with your actual deployed contract address
export const CONTRACT_ADDRESS = '0x...'; // Your deployed contract address

// Simplified ABI for the main functions we need
export const CONTRACT_ABI = [
  // Registration functions
  { inputs: [], name: 'register', outputs: [], stateMutability: 'payable', type: 'function' },
  { inputs: [{ internalType: 'address', name: 'referrer', type: 'address' }], name: 'registerWithReferrer', outputs: [], stateMutability: 'payable', type: 'function' },
  
  // Level purchase
  { inputs: [{ internalType: 'uint8', name: 'level', type: 'uint8' }], name: 'buyLevel', outputs: [], stateMutability: 'payable', type: 'function' },

  // View functions
  { inputs: [{ internalType: 'address', name: 'userAddress', type: 'address' }], name: 'getUser', outputs: [ { internalType: 'uint256', name: 'id', type: 'uint256' }, { internalType: 'uint256', name: 'registrationTimestamp', type: 'uint256' }, { internalType: 'uint256', name: 'referrerId', type: 'uint256' }, { internalType: 'address', name: 'referrer', type: 'address' }, { internalType: 'uint256', name: 'referrals', type: 'uint256' }, { internalType: 'uint256', name: 'referralPayoutSum', type: 'uint256' }, { internalType: 'uint256', name: 'levelsRewardSum', type: 'uint256' }, { internalType: 'uint256', name: 'missedReferralPayoutSum', type: 'uint256' } ], stateMutability: 'view', type: 'function' },
  
  { inputs: [{ internalType: 'address', name: 'userAddress', type: 'address' }], name: 'getUserLevels', outputs: [ { internalType: 'bool[]', name: 'active', type: 'bool[]' }, { internalType: 'uint16[]', name: 'payouts', type: 'uint16[]' }, { internalType: 'uint16[]', name: 'maxPayouts', type: 'uint16[]' }, { internalType: 'uint16[]', name: 'activationTimes', type: 'uint16[]' }, { internalType: 'uint256[]', name: 'rewardSum', type: 'uint256[]' }, { internalType: 'uint256[]', name: 'referralPayoutSum', type: 'uint256[]' } ], stateMutability: 'view', type: 'function' },

  { inputs: [{ internalType: 'address', name: 'userAddress', type: 'address' }], name: 'isUserRegistered', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },

  { inputs: [], name: 'getGlobalStats', outputs: [ { internalType: 'uint256', name: 'members', type: 'uint256' }, { internalType: 'uint256', name: 'transactions', type: 'uint256' }, { internalType: 'uint256', name: 'turnover', type: 'uint256' } ], stateMutability: 'view', type: 'function' },

  { inputs: [], name: 'getAllLevelPrices', outputs: [{ internalType: 'uint256[17]', name: '', type: 'uint256[17]' }], stateMutability: 'view', type: 'function' },

  // Constants
  { inputs: [], name: 'REGISTRATION_PRICE', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'userId', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'referrerId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'userAddress', type: 'address' },
    ],
    name: 'UserRegistration',
    type: 'event',
  },
  
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'userId', type: 'uint256' },
      { indexed: true, internalType: 'uint8', name: 'level', type: 'uint8' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'BuyLevel',
    type: 'event',
  }
] as const;

// Contract Constants
export const CONTRACT_CONSTANTS = {
  REGISTRATION_PRICE: '0.025', // BNB
  MAX_LEVELS: 16,
  REWARD_PERCENT: 74,
  BSC_CHAIN_ID: '0x38', // 56 in hex
  BSC_NETWORK: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  }
} as const;

// Level Prices in BNB (matching contract)
export const LEVEL_PRICES = [
  0,      // Level 0 (unused)
  0.05,   // Level 1
  0.07,   // Level 2  
  0.1,    // Level 3
  0.14,   // Level 4
  0.2,    // Level 5
  0.28,   // Level 6
  0.4,    // Level 7
  0.55,   // Level 8
  0.8,    // Level 9
  1.1,    // Level 10
  1.6,    // Level 11
  2.2,    // Level 12
  3.2,    // Level 13
  4.4,    // Level 14
  6.5,    // Level 15
  8       // Level 16
] as const;

// Utility function to format BNB amounts
export const formatBNB = (amount: number | string, decimals: number = 4): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(decimals);
};

// Utility function to convert BNB to Wei
export const toWei = (bnb: number | string): string => {
  const num = typeof bnb === 'string' ? parseFloat(bnb) : bnb;
  return (num * Math.pow(10, 18)).toString();
};

// Utility function to convert Wei to BNB
export const fromWei = (wei: string | number): number => {
  const num = typeof wei === 'string' ? parseInt(wei, 16) : wei;
  return num / Math.pow(10, 18);
};
