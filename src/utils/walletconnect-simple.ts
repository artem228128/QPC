// ===========================================
// 🔗 SIMPLE WALLETCONNECT IMPLEMENTATION
// ===========================================

// Simple QR code generator for WalletConnect URI
const generateWalletConnectQR = (uri: string): string => {
  // Use a simple QR code generator service
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(uri)}`;
};

// Generate a simple WalletConnect URI for demo purposes
const generateWalletConnectURI = (): string => {
  const bridge = 'https://bridge.walletconnect.org';
  const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const chainId = 56; // BSC mainnet
  const version = 1;
  
  return `wc:${key}@${version}?bridge=${encodeURIComponent(bridge)}&key=${key}&chainId=${chainId}`;
};

// ===========================================
// 🔗 SIMPLE WALLETCONNECT MODAL
// ===========================================

interface WalletConnectModal {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

let currentModal: HTMLElement | null = null;

export const createWalletConnectModal = (): WalletConnectModal => {
  let isOpen = false;

  const open = () => {
    if (isOpen) return;

    const uri = generateWalletConnectURI();
    const qrCodeUrl = generateWalletConnectQR(uri);

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1a1a1a;
      border-radius: 16px;
      padding: 32px;
      max-width: 400px;
      width: 90vw;
      text-align: center;
      border: 1px solid #333;
    `;

    modal.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="color: white; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">
          Connect Wallet
        </h2>
        <p style="color: #888; margin: 0; font-size: 14px;">
          Scan with your mobile wallet to connect
        </p>
      </div>
      
      <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <img src="${qrCodeUrl}" alt="WalletConnect QR Code" style="width: 250px; height: 250px; display: block; margin: 0 auto;" />
      </div>
      
      <div style="margin-bottom: 24px;">
        <p style="color: #ccc; font-size: 14px; margin: 0 0 12px 0;">
          Supported Wallets:
        </p>
        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
          <span style="background: #2a2a2a; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px;">Trust Wallet</span>
          <span style="background: #2a2a2a; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px;">MetaMask</span>
          <span style="background: #2a2a2a; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px;">TokenPocket</span>
          <span style="background: #2a2a2a; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px;">SafePal</span>
        </div>
      </div>
      
      <button id="wc-close" style="
        background: #0891b2;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      ">
        Cancel
      </button>
    `;

    // Add hover effect for button
    const closeButton = modal.querySelector('#wc-close') as HTMLElement;
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.background = '#0e7490';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.background = '#0891b2';
    });

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    currentModal = overlay;
    isOpen = true;

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
      }
    });

    // Close on button click
    closeButton.addEventListener('click', close);

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Store escape handler for cleanup
    (overlay as any)._escapeHandler = handleEscape;

    // Copy URI to clipboard on QR click
    const qrImage = modal.querySelector('img') as HTMLElement;
    qrImage.style.cursor = 'pointer';
    qrImage.title = 'Click to copy connection link';
    qrImage.addEventListener('click', () => {
      navigator.clipboard.writeText(uri).then(() => {
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #0891b2;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 10001;
          animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = 'Connection link copied to clipboard';
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.remove();
          style.remove();
        }, 3000);
      }).catch(console.error);
    });
  };

  const close = () => {
    if (!isOpen || !currentModal) return;

    // Remove escape handler
    if ((currentModal as any)._escapeHandler) {
      document.removeEventListener('keydown', (currentModal as any)._escapeHandler);
    }

    currentModal.remove();
    currentModal = null;
    isOpen = false;
  };

  return { open, close, isOpen };
};

// ===========================================
// 🔗 EXPORTED FUNCTIONS
// ===========================================

export const connectWalletConnect = async (): Promise<{
  provider: null;
  accounts: string[];
}> => {
  return new Promise((resolve, reject) => {
    const modal = createWalletConnectModal();
    
    // Show modal
    modal.open();
    
    // For demo purposes, simulate connection after 3 seconds
    // In real implementation, this would wait for actual wallet connection
    const timeout = setTimeout(() => {
      modal.close();
      reject(new Error('Connection timeout - this is a demo implementation'));
    }, 30000);

    // Simulate successful connection (you can remove this in production)
    const simulateConnection = setTimeout(() => {
      modal.close();
      clearTimeout(timeout);
      // resolve({ provider: null, accounts: ['0x742d35Cc6635C0532925a3b8D40331E'] }); // Demo
      reject(new Error('Demo mode - scan QR code with a real WalletConnect wallet to connect'));
    }, 1000);
  });
};

export const disconnectWalletConnect = async (): Promise<void> => {
  // Close modal if open
  if (currentModal) {
    currentModal.remove();
    currentModal = null;
  }
};

export const isWalletConnectSupported = (): boolean => {
  return true; // Always supported since it's just QR code display
};

export const setupWalletConnectListeners = () => {
  // No-op for demo
};

export const removeWalletConnectListeners = () => {
  // No-op for demo
};
