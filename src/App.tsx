import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './components/AdminDashboard';
import AsociadoDashboard from './components/AsociadoDashboard';
import ClienteDashboard from './components/ClienteDashboard';
import LandingPage from './components/LandingPage';
import Chatbot from './components/Chatbot';
import AdminSidebar from './components/AdminSidebar';
import InicioPage from './components/admin/InicioPage';
import CanastasPage from './components/admin/CanastasPage';
import BaseDatosPage from './components/admin/BaseDatosPage';
import ReportesPage from './components/admin/ReportesPage';
import UsuariosPage from './components/admin/UsuariosPage';
import ResenasPage from './components/admin/ResenasPage';
import PedidosPage from './components/admin/PedidosPage';
import ProduccionPage from './components/admin/ProduccionPage';
import ColaboracionesPage from './components/admin/ColaboracionesPage';
import PqrAdminPage from './components/admin/PqrAdminPage';
import PqrPage from './components/PqrPage';

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Al iniciar sesión: el administrador aterriza en Inicio (Accesos Rápidos); los demás en su panel
  useEffect(() => {
    setCurrentPage(user?.role === 'admin' ? 'inicio' : 'dashboard');
  }, [user?.id, user?.role]);

  // Si está autenticado, mostrar el dashboard correspondiente
  if (isAuthenticated && user) {
    // Para admin: mostrar sidebar
    if (user.role === 'admin') {
      const handleGoHome = () => {
        logout();
        setShowLanding(true);
        setShowLogin(false);
        setSidebarOpen(false);
      };

      const renderAdminContent = () => {
        switch (currentPage) {
          case 'inicio':
            return <InicioPage onNavigate={setCurrentPage} />;
          case 'dashboard':
            return <AdminDashboard />;
          case 'canastas':
            return <CanastasPage />;
          case 'produccion':
            return <ProduccionPage />;
          case 'usuarios':
            return <UsuariosPage />;
          case 'pedidos':
            return <PedidosPage />;
          case 'colaboraciones':
            return <ColaboracionesPage />;
          case 'resenas':
            return <ResenasPage />;
          case 'pqr':
            return <PqrAdminPage />;
          case 'basededatos':
            return <BaseDatosPage />;
          case 'reportes':
            return <ReportesPage />;
          default:
            return <InicioPage onNavigate={setCurrentPage} />;
        }
      };

      return (
        <>
          <AdminSidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onGoHome={handleGoHome}
            onLogout={logout}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          {/* Botón flotante para abrir el menú */}
          <button
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-green-700 to-green-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${
              sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            title="Abrir menú"
          >
            <i className="bi bi-list text-2xl"></i>
          </button>

          {/* Contenido principal */}
          <div className="min-h-screen bg-gray-50 lg:pl-72">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-6">
              <main>
                {renderAdminContent()}
              </main>
            </div>
          </div>
          
          <Chatbot />
        </>
      );
    }

    // Para asociado y cliente: mantener layout con tabs
    const renderContent = () => {
      if (currentPage === 'pqr') return <PqrPage />;
      switch (user.role) {
        case 'asociado':
          return <AsociadoDashboard vista={currentPage} />;
        case 'cliente':
          return <ClienteDashboard vista={currentPage} />;
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
        <LoginPage onBack={() => { setShowLogin(false); setShowLanding(true); }} />
        <Chatbot />
      </>
    );
  }

  // Landing page pública
  if (showLanding) {
    return (
      <>
        <LandingPage onLogin={() => { setShowLogin(true); setShowLanding(false); }} />
        <Chatbot />
      </>
    );
  }

  return null;
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
