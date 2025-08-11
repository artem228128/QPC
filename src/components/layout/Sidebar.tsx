import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Users,
  Info,
  MessageSquare,
  Gift,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  Badge as BadgeIcon,
} from 'lucide-react';
import { NeuralConnection } from '../neural';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  href: string;
  badge?: number;
  isExternal?: boolean;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

// ===========================================
// 📱 MENU CONFIGURATION
// ===========================================

const menuSections: MenuSection[] = [
  {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        href: '/dashboard',
      },
      {
        id: 'statistics',
        label: 'Statistics',
        icon: BarChart3,
        href: '/statistics',
      },
      {
        id: 'partner-bonus',
        label: 'Partner Bonus',
        icon: Users,
        href: '/partner-bonus',
        badge: 3,
      },
    ],
  },
  {
    title: 'Information',
    items: [
      {
        id: 'information',
        label: 'Information',
        icon: Info,
        href: '/information',
      },
      {
        id: 'telegram-bots',
        label: 'Telegram Bots',
        icon: MessageSquare,
        href: '/telegram-bots',
        isExternal: true,
      },
      {
        id: 'promo',
        label: 'Promo',
        icon: Gift,
        href: '/promo',
        badge: 1,
      },
    ],
  },
];

// ===========================================
// 🎯 MENU ITEM COMPONENT
// ===========================================

const SidebarMenuItem: React.FC<{
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ item, isActive, isCollapsed, onClick }) => {
  const IconComponent = item.icon;

  return (
    <motion.button
      className={`
        w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative group
        ${
          isActive
            ? 'glass-panel-neural text-white shadow-lg'
            : 'hover:glass-panel-secondary text-white/70 hover:text-white'
        }
      `}
      onClick={onClick}
      whileHover={{ x: isCollapsed ? 0 : 4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={isCollapsed ? item.label : undefined}
    >
      {/* Neural Glow for Active Item */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-neural-cyan/20 to-neural-purple/20 rounded-xl blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Icon */}
      <div className="relative z-10 flex-shrink-0">
        <IconComponent
          size={20}
          className={`${
            isActive ? 'text-neural-cyan' : 'text-current'
          } transition-colors duration-200`}
        />
        {item.isExternal && (
          <ExternalLink
            size={10}
            className="absolute -top-1 -right-1 text-neural-cyan opacity-60"
          />
        )}
      </div>

      {/* Label & Badge */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="relative z-10 flex items-center justify-between flex-1 min-w-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-medium truncate">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <motion.div
                className="ml-2 px-2 py-1 bg-neural-coral rounded-full flex items-center justify-center min-w-[20px] h-5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <span className="text-xs font-bold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Badge */}
      {isCollapsed && item.badge && item.badge > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-neural-coral rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <BadgeIcon size={8} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  );
};

// ===========================================
// 📑 MENU SECTION COMPONENT
// ===========================================

const SidebarSection: React.FC<{
  section: MenuSection;
  activeItemId: string;
  isCollapsed: boolean;
  onItemClick: (item: MenuItem) => void;
}> = ({ section, activeItemId, isCollapsed, onItemClick }) => {
  return (
    <div className="space-y-2">
      {/* Section Title */}
      <AnimatePresence>
        {section.title && !isCollapsed && (
          <motion.div
            className="px-4 mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              {section.title}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Items */}
      <div className="space-y-1">
        {section.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SidebarMenuItem
              item={item}
              isActive={activeItemId === item.id}
              isCollapsed={isCollapsed}
              onClick={() => onItemClick(item)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ===========================================
// 🔗 NEURAL CONNECTIONS
// ===========================================

const NeuralSidebarConnections: React.FC<{
  activeItemId: string;
  isCollapsed: boolean;
}> = ({ activeItemId, isCollapsed }) => {
  if (isCollapsed) return null;

  // Find active item index across all sections
  let activeIndex = -1;
  let currentIndex = 0;

  for (const section of menuSections) {
    for (const item of section.items) {
      if (item.id === activeItemId) {
        activeIndex = currentIndex;
        break;
      }
      currentIndex++;
    }
    if (activeIndex !== -1) break;
  }

  if (activeIndex === -1) return null;

  return (
    <div className="absolute left-2 top-20 bottom-20 w-px pointer-events-none overflow-hidden">
      <NeuralConnection
        direction="vertical"
        length={200}
        thickness={1}
        status="active"
        dataFlow
        particleCount={2}
        customColor="#00D4FF"
        className="opacity-30"
      />
    </div>
  );
};

// ===========================================
// 📱 MAIN SIDEBAR COMPONENT
// ===========================================

export const Sidebar: React.FC<SidebarProps> = ({
  className = '',
  isCollapsed: externalCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  // Determine active menu item based on current route
  const getActiveItemId = () => {
    const path = location.pathname;
    for (const section of menuSections) {
      for (const item of section.items) {
        if (path === item.href || path.startsWith(item.href + '/')) {
          return item.id;
        }
      }
    }
    return 'dashboard'; // Default to dashboard
  };

  const activeItemId = getActiveItemId();

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setInternalCollapsed(newCollapsed);
    onToggleCollapse?.(newCollapsed);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.isExternal) {
      window.open(item.href, '_blank');
    } else {
      navigate(item.href);
    }
  };

  return (
    <motion.aside
      className={`
        relative h-full glass-panel-primary border-r border-white/10 flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
        transition-all duration-300 ease-out
        ${className}
      `}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Neural Background Connections */}
      <NeuralSidebarConnections activeItemId={activeItemId} isCollapsed={isCollapsed} />

      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-8 z-10">
        <motion.button
          onClick={handleToggleCollapse}
          className="w-6 h-6 glass-panel-neural rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCollapsed ? (
            <ChevronRight size={14} className="text-neural-cyan" />
          ) : (
            <ChevronLeft size={14} className="text-neural-cyan" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuSections.map((section, sectionIndex) => (
          <SidebarSection
            key={sectionIndex}
            section={section}
            activeItemId={activeItemId}
            isCollapsed={isCollapsed}
            onItemClick={handleItemClick}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {/* Support Link */}
        <motion.a
          href="/support"
          className={`
            flex items-center space-x-3 px-4 py-2 rounded-lg hover:glass-panel-secondary text-white/60 hover:text-white transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
          whileHover={{ scale: 1.02 }}
          title={isCollapsed ? 'Support' : undefined}
        >
          <HelpCircle size={18} className="text-neural-cyan" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="text-sm font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Support
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>

        {/* Version Info */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="px-4 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="text-xs text-white/40">Version 2.1.0</p>
              <p className="text-xs text-neural-cyan">Neural Glass UI</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
