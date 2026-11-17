import { ReactNode, useState } from 'react';
import { LOGO_URL } from '../data/variedades';
import { useAuth, UserRole } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'asociado': return 'Asociado';
      case 'cliente': return 'Cliente';
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
          { id: 'pqr', label: 'PQR', icon: 'bi-file-earmark-text-fill' },
        ];
      case 'cliente':
        return [
          { id: 'dashboard', label: 'Inicio', icon: 'bi-house-fill' },
          { id: 'productos', label: 'Productos', icon: 'bi-grid-fill' },
          { id: 'pedidos', label: 'Mis Pedidos', icon: 'bi-bag-fill' },
          { id: 'pqr', label: 'PQR', icon: 'bi-file-earmark-text-fill' },
        ];
      default:
        return [];
    }
  };

  const items = getNavItems();
  const go = (id: string) => { onNavigate(id); setMenuOpen(false); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior (solo móvil): botón de menú */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-white shadow-sm border-b border-gray-100 flex items-center gap-3 px-4">
        <button onClick={() => setMenuOpen(true)} aria-label="Abrir menú"
          className="w-10 h-10 rounded-xl bg-green-700 text-white flex items-center justify-center">
          <i className="bi bi-list text-2xl"></i>
        </button>
        <img src={LOGO_URL} alt="Logo AsoManPesc" className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400" />
        <span className="font-bold text-green-800">AsoManPesc</span>
      </header>

      {/* Fondo oscuro (móvil) */}
      <div onClick={() => setMenuOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>

      {/* Barra lateral izquierda */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-green-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img src={LOGO_URL} alt="Logo AsoManPesc" className="shrink-0 w-11 h-11 rounded-full object-cover shadow-lg ring-2 ring-amber-400" />
            <div>
              <h2 className="font-bold text-base">AsoManPesc</h2>
              <p className="text-[10px] text-green-300"><i className="bi bi-database-fill me-1"></i>MySQL Database</p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)} title="Cerrar menú"
            className="lg:hidden shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">
            <i className="bi bi-x-lg text-lg"></i>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-green-400 px-3 mb-2">Menú</p>
          {items.map(item => (
            <button key={item.id} onClick={() => go(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'bg-white text-green-800 shadow-lg font-semibold'
                  : 'text-green-100 hover:bg-white/10 hover:text-white'
              }`}>
              <i className={`bi ${item.icon} text-lg ${currentPage === item.id ? 'text-green-700' : 'text-green-300'}`}></i>
              <span className="text-sm">{item.label}</span>
              {currentPage === item.id && <i className="bi bi-chevron-right ml-auto text-xs"></i>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-green-700/50 bg-green-900/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              {user?.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-green-300"><i className={`bi ${getRoleIcon(user!.role)} me-1 text-amber-400`}></i>{getRoleLabel(user!.role)}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full bg-red-500/20 text-red-200 hover:bg-red-500/30 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <i className="bi bi-box-arrow-right"></i>Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-6">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
