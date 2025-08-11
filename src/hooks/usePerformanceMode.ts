import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  isLowEndDevice: boolean;
  isSlowNetwork: boolean;
  isMobile: boolean;
  shouldReduceAnimations: boolean;
  performanceMode: 'high' | 'medium' | 'low';
}

export const usePerformanceMode = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isLowEndDevice: false,
    isSlowNetwork: false,
    isMobile: false,
    shouldReduceAnimations: false,
    performanceMode: 'high',
  });

  useEffect(() => {
    const detectPerformance = () => {
      // Detect mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Detect small screens
      const isSmallScreen = window.innerWidth < 768 || window.innerHeight < 600;

      // Detect user preference for reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Detect hardware concurrency (CPU cores)
      const lowConcurrency = navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency <= 2
        : false;

      // Detect memory (if available)
      const lowMemory = (navigator as any).deviceMemory
        ? (navigator as any).deviceMemory <= 2
        : false;

      // Detect slow network
      const connection = (navigator as any).connection;
      const isSlowNetwork = connection
        ? connection.effectiveType === 'slow-2g' ||
          connection.effectiveType === '2g' ||
          connection.downlink < 1
        : false;

      // Calculate if it's a low-end device
      const isLowEndDevice = isMobile || isSmallScreen || lowConcurrency || lowMemory;

      // Determine if animations should be reduced
      const shouldReduceAnimations = prefersReducedMotion || isLowEndDevice || isSlowNetwork;

      // Determine performance mode
      let performanceMode: 'high' | 'medium' | 'low' = 'high';
      if (isLowEndDevice && (isSlowNetwork || lowMemory)) {
        performanceMode = 'low';
      } else if (isLowEndDevice || isSlowNetwork || shouldReduceAnimations) {
        performanceMode = 'medium';
      }

      setMetrics({
        isLowEndDevice,
        isSlowNetwork,
        isMobile,
        shouldReduceAnimations,
        performanceMode,
      });

      // Apply performance mode to body class
      document.body.classList.remove('performance-mode', 'medium-performance', 'low-performance');

      if (performanceMode === 'low') {
        document.body.classList.add('performance-mode', 'low-performance');
      } else if (performanceMode === 'medium') {
        document.body.classList.add('medium-performance');
      }
    };

    // Initial detection
    detectPerformance();

    // Re-detect on resize
    const handleResize = () => {
      detectPerformance();
    };

    window.addEventListener('resize', handleResize);

    // Re-detect on network change
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', detectPerformance);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (connection) {
        connection.removeEventListener('change', detectPerformance);
      }
    };
  }, []);

  return metrics;
};

// Utility function to check if performance mode is active
export const isPerformanceModeActive = (): boolean => {
  return document.body.classList.contains('performance-mode');
};

// Utility function to get current performance level
export const getPerformanceLevel = (): 'high' | 'medium' | 'low' => {
  if (document.body.classList.contains('low-performance')) return 'low';
  if (document.body.classList.contains('medium-performance')) return 'medium';
  return 'high';
};
