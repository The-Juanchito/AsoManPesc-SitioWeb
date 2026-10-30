import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './components/AdminDashboard';
import AsociadoDashboard from './components/AsociadoDashboard';
import ClienteDashboard from './components/ClienteDashboard';
import LandingPage from './components/LandingPage';
import Chatbot from './components/Chatbot';
import { db } from './services/database';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  // Inicializar base de datos al cargar
  useEffect(() => {
    db.initialize();
  }, []);

  // Si está autenticado, mostrar el dashboard correspondiente
  if (isAuthenticated && user) {
    const renderContent = () => {
      switch (user.role) {
        case 'admin':
          return <AdminDashboard />;
        case 'asociado':
          return <AsociadoDashboard />;
        case 'cliente':
          return <ClienteDashboard />;
        default:
          return null;
      }
    };

    return (
      <>
        <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
          {renderContent()}
        </DashboardLayout>
        <Chatbot />
      </>
    );
  }

  // Si está en la página de login
  if (showLogin) {
    return (
      <>
        <LoginPage onBack={() => setShowLogin(false)} />
        <Chatbot />
      </>
    );
  }

  // Landing page pública
  return (
    <>
      <LandingPage onLogin={() => setShowLogin(true)} />
      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
