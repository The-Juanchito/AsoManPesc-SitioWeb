import { ReactNode } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'asociado': return 'Asociado';
      case 'cliente': return 'Cliente';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'asociado': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cliente': return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'bi-shield-fill-check';
      case 'asociado': return 'bi-person-badge-fill';
      case 'cliente': return 'bi-person-fill';
    }
  };

  const getNavItems = () => {
    switch(user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
          { id: 'canastas', label: 'Canastas', icon: 'bi-basket3-fill' },
          { id: 'usuarios', label: 'Usuarios', icon: 'bi-people-fill' },
          { id: 'colaboraciones', label: 'Aliados', icon: 'bi-handshake' },
        ];
      case 'asociado':
        return [
          { id: 'dashboard', label: 'Mi Panel', icon: 'bi-speedometer2' },
          { id: 'produccion', label: 'Producción', icon: 'bi-pencil-square' },
          { id: 'canastas', label: 'Mis Canastas', icon: 'bi-basket3-fill' },
        ];
      case 'cliente':
        return [
          { id: 'dashboard', label: 'Inicio', icon: 'bi-house-fill' },
          { id: 'productos', label: 'Productos', icon: 'bi-fruit-cart' },
          { id: 'pedidos', label: 'Mis Pedidos', icon: 'bi-bag-fill' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥭</span>
              <div>
                <h1 className="text-lg font-bold text-green-800">AsoManPesc</h1>
                <p className="text-xs text-gray-400 -mt-0.5">
                  <i className="bi bi-database-fill me-1"></i>MySQL + SQL Server
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                  {user?.name.charAt(0)}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${getRoleColor(user!.role)}`}>
                    <i className={`bi ${getRoleIcon(user!.role)}`}></i>
                    {getRoleLabel(user!.role)}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {getNavItems().map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                currentPage === item.id
                  ? 'bg-green-700 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200'
              }`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
