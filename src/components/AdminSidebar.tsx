import { useAuth } from '../context/AuthContext';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onGoHome: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ currentPage, onNavigate, onGoHome, onLogout, isOpen, onClose }: AdminSidebarProps) {
  const { user } = useAuth();

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

  const handleNavigate = (page: string) => {
    onNavigate(page);
    // Cerrar sidebar en móvil después de navegar
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white z-[70] transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header del sidebar */}
        <div className="p-5 border-b border-green-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🥭</span>
            </div>
            <div>
              <h2 className="font-bold text-base">AsoManPesc</h2>
              <p className="text-[10px] text-green-300 flex items-center gap-1">
                <i className="bi bi-shield-fill-check text-amber-400"></i>
                Panel Administrador
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar menú"
          >
            <i className="bi bi-x-lg text-lg"></i>
          </button>
        </div>

        {/* Botón Volver al Inicio */}
        <div className="p-4 border-b border-green-700/50">
          <button
            onClick={onGoHome}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <i className="bi bi-arrow-left-circle-fill text-xl"></i>
            <div className="text-left">
              <span className="text-sm font-bold block">Volver al Inicio</span>
              <span className="text-[10px] text-white/70">Salir del panel admin</span>
            </div>
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-5">
          {sections.map((section) => (
            <div key={section}>
              <p className="text-[10px] uppercase tracking-widest text-green-400 font-bold px-3 mb-2 flex items-center gap-2">
                <i className="bi bi-dot text-green-500"></i>
                {section}
              </p>
              
              <div className="space-y-1">
                {menuItems
                  .filter(item => item.section === section)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                        currentPage === item.id
                          ? 'bg-white text-green-800 shadow-lg font-semibold scale-[1.02]'
                          : 'text-green-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                      }`}
                    >
                      <i className={`bi ${item.icon} text-lg ${
                        currentPage === item.id ? 'text-green-700' : 'text-green-300 group-hover:text-white'
                      }`}></i>
                      <span className="text-sm">{item.label}</span>
                      {currentPage === item.id && (
                        <i className="bi bi-chevron-right ml-auto text-xs"></i>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer del sidebar - Usuario */}
        <div className="p-4 border-t border-green-700/50 bg-green-900/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-green-300 flex items-center gap-1">
                <i className="bi bi-shield-fill-check text-amber-400"></i>
                Administrador
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300 hover:text-red-200"
              title="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-right text-lg"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
