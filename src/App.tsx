import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ToastProvider } from './components/common';
import { ProtectedRoute } from './components/auth';
import { MobileMenuProvider } from './contexts/MobileMenuContext';
import { useWalletGuard } from './hooks';
import {
  HomePage,
  WalletConnectPage,
  GamePage,
  ActivateLevelPage,
  DashboardPage,
  StatsPage,
  PartnerBonusPage,
  InformationPage,
  ProgramViewPage,
  TelegramBotsPage,
  PromoPage,
  SettingsPage,
} from './pages';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <MobileMenuProvider>
          <Router>
            <AppContent />
          </Router>
        </MobileMenuProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

// Separate component to use hooks inside Router context
function AppContent() {
  // This hook will monitor wallet changes and redirect if needed
  useWalletGuard();

  return (
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wallet" element={<WalletConnectPage />} />
                <Route 
                  path="/game" 
                  element={
                    <ProtectedRoute>
                      <GamePage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/activate" element={<ActivateLevelPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/stats" 
                  element={
                    <ProtectedRoute>
                      <StatsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/partner-bonus" 
                  element={
                    <ProtectedRoute>
                      <PartnerBonusPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/information" 
                  element={
                    <ProtectedRoute>
                      <InformationPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/program-view" 
                  element={
                    <ProtectedRoute>
                      <ProgramViewPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/telegram-bots" 
                  element={
                    <ProtectedRoute>
                      <TelegramBotsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/promo" 
                  element={
                    <ProtectedRoute>
                      <PromoPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>
  );
}

export default App;
