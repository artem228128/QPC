// ===========================================
// 🏗️ LAYOUT COMPONENTS EXPORTS
// ===========================================

// Main Layout Components
export { LandingHeader } from './LandingHeader';
export { ConnectedHeader } from './ConnectedHeader';
export { AuthHeader } from './AuthHeader';
export { Sidebar } from './Sidebar';
export { DashboardSidebar } from './DashboardSidebar';
export { LayoutProvider, LayoutContextProvider, useLayout } from './LayoutProvider';

// Re-export types
export type { BreadcrumbItem, LayoutProviderProps } from './LayoutProvider';

// Default export for convenience
export { LayoutProvider as default } from './LayoutProvider';
