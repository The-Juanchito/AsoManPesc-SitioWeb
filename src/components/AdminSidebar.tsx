import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onGoHome: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({ currentPage, onNavigate, onGoHome, onLogout }: AdminSidebarProps) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: 'bi-house-fill', section: 'Principal' },
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', section: 'Principal' },
    { id: 'canastas', label: 'Canastas', icon: 'bi-basket3-fill', section: 'Gestión' },
    { id: 'produccion', label: 'Producción', icon: 'bi-graph-up-arrow', section: 'Gestión' },
    { id: 'usuarios', label: 'Usuarios', icon: 'bi-people-fill', section: 'Gestión' },
    { id: 'pedidos', label: 'Pedidos', icon: 'bi-bag-check-fill', section: 'Gestión' },
    { id: 'colaboraciones', label: 'Aliados', icon: 'bi-handshake', section: 'Configuración' },
    { id: 'basededatos', label: 'Base de Datos', icon: 'bi-database-fill-gear', section: 'Configuración' },
    { id: 'reportes', label: 'Reportes', icon: 'bi-file-earmark-bar-graph-fill', section: 'Configuración' },
  ];

  const sections = [...new Set(menuItems.map(item => item.section))];

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-green-900 to-green-800 text-white z-50 transition-all duration-300 shadow-2xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Header del sidebar */}
        <div className="p-4 border-b border-green-700/50">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥭</span>
                <div>
                  <h2 className="font-bold text-sm">AsoManPesc</h2>
                  <p className="text-[10px] text-green-300">Panel Admin</p>
                </div>
              </div>
            )}
            {collapsed && <span className="text-2xl mx-auto">🥭</span>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 hover:bg-green-700 rounded-lg transition-colors"
              title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-sm`}></i>
            </button>
          </div>
        </div>

        {/* Botón Volver al Inicio */}
        <div className="p-3 border-b border-green-700/50">
          <button
            onClick={onGoHome}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Volver al inicio"
          >
            <i className="bi bi-arrow-left-circle-fill text-lg"></i>
            {!collapsed && <span className="text-sm">Volver al Inicio</span>}
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map((section) => (
            <div key={section}>
              {!collapsed && (
                <p className="text-[10px] uppercase tracking-wider text-green-400 font-semibold px-3 mb-2">
                  {section}
                </p>
              )}
              {collapsed && <div className="w-8 h-px bg-green-700 mx-auto mb-2"></div>}
              
              <div className="space-y-1">
                {menuItems
                  .filter(item => item.section === section)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        currentPage === item.id
                          ? 'bg-white text-green-800 shadow-lg font-medium'
                          : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : ''}
                    >
                      <i className={`bi ${item.icon} text-lg`}></i>
                      {!collapsed && <span className="text-sm">{item.label}</span>}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer del sidebar - Usuario */}
        <div className="p-3 border-t border-green-700/50">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-[10px] text-green-300 flex items-center gap-1">
                  <i className="bi bi-shield-fill-check"></i>
                  Administrador
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300 hover:text-red-200"
                title="Cerrar sesión"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.name.charAt(0)}
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300 hover:text-red-200"
                title="Cerrar sesión"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay para mobile */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setCollapsed(true)}></div>
    </>
  );
}
