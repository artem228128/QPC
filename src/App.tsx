import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ToastProvider } from './components/common';
import { MobileMenuProvider } from './contexts/MobileMenuContext';
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
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wallet" element={<WalletConnectPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/activate" element={<ActivateLevelPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/partner-bonus" element={<PartnerBonusPage />} />
              <Route path="/information" element={<InformationPage />} />
              <Route path="/program-view" element={<ProgramViewPage />} />
              <Route path="/telegram-bots" element={<TelegramBotsPage />} />
              <Route path="/promo" element={<PromoPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
        </MobileMenuProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
