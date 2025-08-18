import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { LoadingSpinner } from '../common';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRegistration?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireRegistration = true 
}) => {
  const navigate = useNavigate();
  const { walletState, isUserRegistered, isLoading } = useWallet();
  const [checking, setChecking] = useState(true);
  const [registered, setRegistered] = useState(false);
  const previousAddress = useRef<string | null>(null);

  useEffect(() => {
    const checkRegistration = async () => {
      // If wallet not connected, redirect to home
      if (!walletState.isConnected || !walletState.address) {
        navigate('/');
        return;
      }

      // Only check if wallet address changed or first time
      if (previousAddress.current === walletState.address && previousAddress.current !== null) {
        return; // No change, skip check
      }

      previousAddress.current = walletState.address;

      if (requireRegistration) {
        setChecking(true);
        try {
          const isRegistered = await isUserRegistered();
          setRegistered(isRegistered);
          
          if (!isRegistered) {
            navigate('/');
            return;
          }
        } catch (error) {
          console.error('ProtectedRoute: Error checking registration:', error);
          setRegistered(false);
        }
        setChecking(false);
      } else {
        setChecking(false);
        setRegistered(true);
      }
    };

    // Add a small delay to ensure wallet state is fully loaded
    const timer = setTimeout(checkRegistration, 100);
    return () => clearTimeout(timer);
  }, [walletState.isConnected, walletState.address, requireRegistration, isUserRegistered, navigate]);

  // Show loading while checking
  if (checking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Neural background */}
        <div className="absolute inset-0 opacity-30">
          <div className="neural-grid"></div>
        </div>
        
        {/* Loading animation */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Quantum loading circles */}
          <div className="relative w-32 h-32 mb-8">
            {/* Outer ring */}
            <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin quantum-ring-1"></div>
            {/* Middle ring */}
            <div className="absolute inset-2 border-2 border-transparent border-t-purple-400 border-l-purple-400 rounded-full animate-spin quantum-ring-2"></div>
            {/* Inner ring */}
            <div className="absolute inset-4 border-2 border-transparent border-t-green-400 border-b-green-400 rounded-full animate-spin quantum-ring-3"></div>
            {/* Center pulse */}
            <div className="absolute inset-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Glowing text */}
          <div className="text-center">
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent animate-pulse mb-2">
              QUANTUM SYNC
            </div>
            <div className="text-sm text-gray-400 animate-fade-in-out">
              Establishing neural connection...
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-float"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        

      </div>
    );
  }

  // If we reach here and requireRegistration is true, user is registered
  if (requireRegistration && !registered) {
    return null; // This shouldn't happen due to redirect above, but just in case
  }

  return <>{children}</>;
};

export default ProtectedRoute;
