import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from './useWallet';

/**
 * Hook to guard against accessing protected routes with unregistered wallet
 * Redirects to home page if wallet changes to unregistered address
 */
export const useWalletGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { walletState, isUserRegistered } = useWallet();

  useEffect(() => {
    const checkWalletAndRedirect = async () => {
      // List of protected routes that require registration
      const protectedRoutes = [
        '/dashboard',
        '/game',
        '/stats',
        '/partner-bonus',
        '/information',
        '/program-view',
        '/telegram-bots',
        '/promo',
        '/settings'
      ];

      // Check if current route is protected
      const isProtectedRoute = protectedRoutes.some(route => 
        location.pathname.startsWith(route)
      );

      if (!isProtectedRoute) return;

      // If wallet not connected, redirect to home
      if (!walletState.isConnected || !walletState.address) {
        navigate('/');
        return;
      }

      // Check if user is registered
      try {
        const registered = await isUserRegistered();
        if (!registered) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking registration in wallet guard:', error);
        // On error, redirect to home for safety
        navigate('/');
      }
    };

    // Only check if we have a wallet address (connected or changed)
    if (walletState.address) {
      checkWalletAndRedirect();
    }
  }, [walletState.address, walletState.isConnected, location.pathname, navigate, isUserRegistered]);
};

export default useWalletGuard;
