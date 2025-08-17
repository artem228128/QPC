import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MobileMenuContextType {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export const useMobileMenuContext = () => {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenuContext must be used within a MobileMenuProvider');
  }
  return context;
};

interface MobileMenuProviderProps {
  children: ReactNode;
}

export const MobileMenuProvider: React.FC<MobileMenuProviderProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const value = {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
  };

  return <MobileMenuContext.Provider value={value}>{children}</MobileMenuContext.Provider>;
};
