import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ToastProvider } from './components/common';
import { HomePage, WalletConnectPage, GamePage, ActivateLevelPage, DashboardPage } from './pages';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wallet" element={<WalletConnectPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/activate" element={<ActivateLevelPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
