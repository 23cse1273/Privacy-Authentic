import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RiskProvider } from './context/RiskContext';
import { TelemetryProvider } from './context/TelemetryContext';
import Navbar from './components/common/Navbar';
import PrivacyPledgeBanner from './components/common/PrivacyPledgeBanner';
import MfaModal from './components/auth/MfaModal';
import DashboardPage from './pages/DashboardPage';
import PlaygroundPage from './pages/PlaygroundPage';
import PrivacyAuditPage from './pages/PrivacyAuditPage';
import LoginPage from './pages/LoginPage';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-medium">Initializing Continuous Authentication Engine...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Privacy Pledge Banner */}
      <PrivacyPledgeBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'playground' && <PlaygroundPage />}
        {activeTab === 'privacy' && <PrivacyAuditPage />}
      </main>

      {/* Adaptive Step-Up MFA Modal Triggered on Anomaly */}
      <MfaModal />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>B.Tech CSE Project — Privacy-Preserving Continuous User Authentication Using Multimodal Behavioral Biometrics & XAI</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RiskProvider>
        <TelemetryProvider>
          <MainApp />
        </TelemetryProvider>
      </RiskProvider>
    </AuthProvider>
  );
}
