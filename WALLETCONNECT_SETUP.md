# WalletConnect Setup Instructions

## 1. Environment Configuration

Create a `.env.local` file in the project root (already created):

```
# Network Configuration
REACT_APP_NETWORK=testnet
```

**No Project ID required!** - We're using WalletConnect v1 with bridge server.

## 3. Test WalletConnect

1. Start the development server: `npm start`
2. Go to `/wallet` page
3. Click on "WalletConnect" option
4. Scan QR code with a mobile wallet (Trust Wallet, MetaMask Mobile, etc.)

## Features Implemented

✅ WalletConnect v2 integration
✅ QR code modal for mobile wallet connection
✅ BSC network support (mainnet/testnet)
✅ Error handling and user feedback
✅ Automatic network switching
✅ Session management and disconnect
✅ Event listeners for account/chain changes

## Supported Wallets

- MetaMask (browser extension)
- Trust Wallet (mobile + browser)
- TokenPocket (mobile + browser)
- Any WalletConnect compatible wallet (mobile)

## Usage in Components

```typescript
import { useWallet } from '../hooks/useWallet';

const MyComponent = () => {
  const { 
    connectWallet, // For browser wallets
    connectWalletConnectWallet, // For mobile wallets via WalletConnect
    walletState,
    isWalletConnectSupported
  } = useWallet();

  // Connect via WalletConnect
  const handleWalletConnect = async () => {
    if (isWalletConnectSupported) {
      await connectWalletConnectWallet();
    }
  };

  return (
    <button onClick={handleWalletConnect}>
      Connect Mobile Wallet
    </button>
  );
};
```
