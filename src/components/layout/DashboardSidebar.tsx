import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Users, Gift, Info, MessageCircle, Megaphone, Settings } from 'lucide-react';
import { useMobileMenuContext } from '../../contexts/MobileMenuContext';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, route: '/dashboard' },
  { id: 'stats', label: 'Stats', icon: Users, route: '/stats' },
  { id: 'partner-bonus', label: 'Partner Bonus', icon: Gift, route: '/partner-bonus' },
  { id: 'information', label: 'Information', icon: Info, route: '/information' },
  { id: 'telegram-bots', label: 'Telegram Bots', icon: MessageCircle, route: '/telegram-bots' },
  { id: 'promo', label: 'Promo', icon: Megaphone, route: '/promo' },
  { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
];

export const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenuContext();

  const handleNavigate = (route: string) => {
    navigate(route);
    closeMobileMenu(); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-25 md:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`
          w-64 fixed left-0 top-16 bottom-0 z-20 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-lg border-r border-gray-800/50 shadow-2xl
          md:translate-x-0 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        initial={false}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400"></div>

        <div className="relative p-6">
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Navigation
            </h3>
            <div className="h-px bg-gradient-to-r from-cyan-400/50 via-purple-400/50 to-transparent"></div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {SIDEBAR_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.route;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item.route)}
                  className={`
                  group relative w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-4 overflow-hidden
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-400/50 text-white shadow-lg shadow-cyan-400/20'
                      : 'hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 text-gray-300 hover:text-white hover:border-white/30 border border-white/10 hover:shadow-lg hover:shadow-white/10'
                  }
                `}
                  style={{
                    backdropFilter: 'blur(8px)',
                    ...(isActive && {
                      boxShadow:
                        '0 0 30px rgba(0, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }),
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background Glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur-sm"></div>
                  )}

                  {/* Icon Container */}
                  <div
                    className={`
                    relative z-10 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-cyan-400/30 to-purple-400/30 border border-cyan-400/40'
                        : 'bg-white/5 group-hover:bg-white/10 border border-white/20'
                    }
                  `}
                  >
                    <Icon
                      size={20}
                      className={`transition-all duration-300 ${
                        isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`
                    relative z-10 font-medium transition-all duration-300
                    ${isActive ? 'text-white' : 'group-hover:text-white'}
                  `}
                  >
                    {item.label}
                  </span>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="ml-auto relative z-10"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></div>
                    </motion.div>
                  )}

                  {/* Hover Arrow */}
                  {!isActive && (
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Bottom Decoration */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400/50 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div
                className="w-2 h-2 bg-cyan-400/50 rounded-full animate-pulse"
                style={{ animationDelay: '1s' }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardSidebar;
