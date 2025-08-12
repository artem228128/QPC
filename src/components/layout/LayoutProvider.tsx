import React, { Suspense, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '../common';
import { LandingHeader } from './LandingHeader';
import { AuthHeader } from './AuthHeader';
import { Sidebar } from './Sidebar';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface LayoutProviderProps {
  children?: React.ReactNode;
  isAuthenticated?: boolean;
  userAddress?: string;
  bnbBalance?: number;
  notifications?: any[];
  onLogout?: () => void;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// ===========================================
// 🍞 BREADCRUMB GENERATOR
// ===========================================

const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return [{ label: 'Program', isActive: true }];
  }

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Program', href: '/game' }];

  const routeMap: Record<string, string> = {
    dashboard: 'Program',
    statistics: 'Statistics',
    'partner-bonus': 'Partner Bonus',
    information: 'Information',
    'telegram-bots': 'Telegram Bots',
    promo: 'Promo',
    profile: 'Profile',
    settings: 'Settings',
    support: 'Support',
  };

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label: routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: isLast ? undefined : currentPath,
      isActive: isLast,
    });
  });

  return breadcrumbs;
};

// ===========================================
// 📱 LOADING COMPONENT
// ===========================================

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center glass-panel-primary">
    <motion.div
      className="relative"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-16 h-16 border-4 border-neural-cyan/30 border-t-neural-cyan rounded-full" />
      <motion.div
        className="absolute inset-2 w-8 h-8 border-2 border-neural-purple/30 border-b-neural-purple rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  </div>
);

// ===========================================
// 🏠 LANDING LAYOUT
// ===========================================

const LandingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-quantum-space">
        <LandingHeader />
        <motion.main
          className="pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {children}
        </motion.main>
      </div>
    </ErrorBoundary>
  );
};

// ===========================================
// 🔐 AUTHENTICATED LAYOUT
// ===========================================

const AuthenticatedLayout: React.FC<{
  children: React.ReactNode;
  userAddress?: string;
  bnbBalance?: number;
  notifications?: any[];
  breadcrumbs: BreadcrumbItem[];
  onLogout?: () => void;
}> = ({ children, userAddress, bnbBalance, notifications, breadcrumbs, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-quantum-space flex">
        {/* Sidebar */}
        <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={setSidebarCollapsed} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <AuthHeader
            userAddress={userAddress}
            bnbBalance={bnbBalance}
            notifications={notifications}
            breadcrumbs={breadcrumbs}
            onLogout={onLogout}
          />

          {/* Page Content */}
          <motion.main
            className="flex-1 p-6 overflow-y-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div className="max-w-7xl mx-auto" layout transition={{ duration: 0.3 }}>
              {children}
            </motion.div>
          </motion.main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// ===========================================
// 🎭 PAGE TRANSITION WRAPPER
// ===========================================

const PageTransition: React.FC<{
  children: React.ReactNode;
  routeKey: string;
}> = ({ children, routeKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// ===========================================
// 🏗️ MAIN LAYOUT PROVIDER
// ===========================================

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  isAuthenticated = false,
  userAddress,
  bnbBalance = 0,
  notifications = [],
  onLogout = () => {},
}) => {
  const location = useLocation();

  // Generate breadcrumbs based on current route
  const breadcrumbs = useMemo(() => {
    if (!isAuthenticated) return [];
    return generateBreadcrumbs(location.pathname);
  }, [location.pathname, isAuthenticated]);

  // Determine if current route is a landing page
  const isLandingPage = useMemo(() => {
    const landingRoutes = ['/', '/about', '/how-it-works', '/faq', '/statistics'];
    return !isAuthenticated || landingRoutes.includes(location.pathname);
  }, [location.pathname, isAuthenticated]);

  // Create unique key for page transitions
  const routeKey = `${location.pathname}-${isAuthenticated ? 'auth' : 'public'}`;

  // Loading state
  if (isAuthenticated === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PageTransition routeKey={routeKey}>
        {isLandingPage ? (
          <LandingLayout>{children}</LandingLayout>
        ) : (
          <AuthenticatedLayout
            userAddress={userAddress}
            bnbBalance={bnbBalance}
            notifications={notifications}
            breadcrumbs={breadcrumbs}
            onLogout={onLogout}
          >
            {children}
          </AuthenticatedLayout>
        )}
      </PageTransition>
    </Suspense>
  );
};

// ===========================================
// 🎯 LAYOUT CONTEXT HOOK
// ===========================================

interface LayoutContextValue {
  isAuthenticated: boolean;
  userAddress?: string;
  bnbBalance: number;
  breadcrumbs: BreadcrumbItem[];
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: any) => void;
}

const LayoutContext = React.createContext<LayoutContextValue | undefined>(undefined);

export const useLayout = (): LayoutContextValue => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// ===========================================
// 🏗️ LAYOUT CONTEXT PROVIDER
// ===========================================

export const LayoutContextProvider: React.FC<{
  children: React.ReactNode;
  isAuthenticated: boolean;
  userAddress?: string;
  bnbBalance?: number;
}> = ({ children, isAuthenticated, userAddress, bnbBalance = 0 }) => {
  const location = useLocation();
  const [notifications, setNotifications] = React.useState<any[]>([]);

  const breadcrumbs = useMemo(() => {
    if (!isAuthenticated) return [];
    return generateBreadcrumbs(location.pathname);
  }, [location.pathname, isAuthenticated]);

  const markNotificationAsRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  }, []);

  const addNotification = React.useCallback((notification: any) => {
    setNotifications((prev) => [
      {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
        isRead: false,
      },
      ...prev,
    ]);
  }, []);

  const contextValue: LayoutContextValue = {
    isAuthenticated,
    userAddress,
    bnbBalance,
    breadcrumbs,
    notifications,
    setNotifications,
    markNotificationAsRead,
    addNotification,
  };

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};

// ===========================================
// 📤 EXPORTS
// ===========================================

export default LayoutProvider;

export type { BreadcrumbItem, LayoutProviderProps };
