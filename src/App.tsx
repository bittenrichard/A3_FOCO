// Local: src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import LoginPage from './features/auth/components/LoginPage';
import SignUpPage from './features/auth/components/SignUpPage';
import DashboardPage from './features/dashboard/components/DashboardPage';
import NewScreeningPage from './features/screening/components/NewScreeningPage';
import ResultsPage from './features/results/components/ResultsPage';
import EditScreeningPage from './features/screening/components/EditScreeningPage';
import SettingsPage from './features/settings/components/SettingsPage';
import AgendaPage from './features/agenda/components/AgendaPage';
import CandidateDatabasePage from './features/database/components/CandidateDatabasePage';
import GoogleAuthCallback from './features/auth/components/GoogleAuthCallback';
import MainLayout from './components/layout/MainLayout';
import BehavioralTestPage from './features/behavioral-test/components/BehavioralTestPage'; // <<< NOVA IMPORTAÇÃO

function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary-blue border-t-transparent"></div>
      </div>
    );
  }
  return isAuthenticated ? <MainLayout><Outlet /></MainLayout> : <Navigate to="/login" replace />;
}

function AppContent() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/google/callback" element={<GoogleAuthCallback />} />
      
      {/* ROTA PÚBLICA PARA O TESTE COMPORTAMENTAL <<< NOVA ROTA */}
      <Route path="/teste/comportamental/:assessmentId" element={<BehavioralTestPage />} />

      {/* Rotas Privadas */}
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="nova-triagem" element={<NewScreeningPage />} />
        <Route path="resultados/:jobId" element={<ResultsPage />} />
        <Route path="editar-triagem/:jobId" element={<EditScreeningPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="banco-de-talentos" element={<CandidateDatabasePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;