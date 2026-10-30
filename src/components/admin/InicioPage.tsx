import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCOP } from '../../services/database';

interface InicioPageProps {
  onNavigate: (page: string) => void;
}

export default function InicioPage({ onNavigate }: InicioPageProps) {
  const { user } = useAuth();
  const { canastas, pedidos, allUsers, precioCanasta } = useData();

  const totalCanastas = canastas.reduce((sum, c) => sum + c.cantidad, 0);
  const ingresosTotales = totalCanastas * precioCanasta;

  const quickActions = [
    { id: 'dashboard', label: 'Ver Dashboard', icon: 'bi-speedometer2', color: 'bg-green-600 hover:bg-green-700', desc: 'Gráficas y estadísticas' },
    { id: 'canastas', label: 'Gestionar Canastas', icon: 'bi-basket3-fill', color: 'bg-amber-600 hover:bg-amber-700', desc: 'Ver y actualizar estados' },
    { id: 'usuarios', label: 'Ver Usuarios', icon: 'bi-people-fill', color: 'bg-blue-600 hover:bg-blue-700', desc: 'Lista de registrados' },
    { id: 'pedidos', label: 'Ver Pedidos', icon: 'bi-bag-check-fill', color: 'bg-purple-600 hover:bg-purple-700', desc: 'Pedidos de clientes' },
    { id: 'basededatos', label: 'Base de Datos', icon: 'bi-database-fill-gear', color: 'bg-indigo-600 hover:bg-indigo-700', desc: 'MySQL y SQL Server' },
    { id: 'reportes', label: 'Reportes', icon: 'bi-file-earmark-bar-graph-fill', color: 'bg-rose-600 hover:bg-rose-700', desc: 'Estadísticas completas' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <i className="bi bi-person-circle text-3xl"></i>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">¡Hola, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-green-200">Bienvenido al panel de administración de AsoManPesc</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <p className="text-green-200 text-xs">Total Canastas</p>
              <p className="text-xl font-bold">{totalCanastas}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <p className="text-green-200 text-xs">Ingresos</p>
              <p className="text-xl font-bold">{formatCOP(ingresosTotales)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <p className="text-green-200 text-xs">Usuarios</p>
              <p className="text-xl font-bold">{allUsers.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <p className="text-green-200 text-xs">Pedidos</p>
              <p className="text-xl font-bold">{pedidos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
          <i className="bi bi-grid-fill text-amber-500"></i> Accesos Rápidos
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className={`${action.color} text-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all text-left group hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-lg">{action.label}</p>
                  <p className="text-white/70 text-sm mt-1">{action.desc}</p>
                </div>
                <i className={`bi ${action.icon} text-3xl opacity-50 group-hover:opacity-100 transition-opacity`}></i>
              </div>
              <div className="mt-4 flex items-center gap-1 text-white/70 text-sm group-hover:text-white transition-colors">
                <span>Ir a sección</span>
                <i className="bi bi-arrow-right"></i>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <i className="bi bi-activity text-green-600"></i> Actividad Reciente
        </h3>
        <div className="space-y-3">
          {canastas.slice(-5).reverse().map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="bi bi-basket3-fill text-green-600"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  <span className="text-green-700">{c.productor}</span> registró {c.cantidad} canastas de {c.tipo}
                </p>
                <p className="text-xs text-gray-500">{c.fecha} • {formatCOP(c.cantidad * precioCanasta)}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                c.estado === 'entregada' ? 'bg-green-100 text-green-700' :
                c.estado === 'recogida' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {c.estado}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contacto rápido */}
      <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <i className="bi bi-whatsapp text-4xl"></i>
            <div>
              <h3 className="font-bold text-lg">¿Necesitas ayuda?</h3>
              <p className="text-white/80 text-sm">Contacta al administrador por WhatsApp</p>
            </div>
          </div>
          <a
            href="https://wa.me/573242030867?text=Hola, soy usuario de AsoManPesc"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <i className="bi bi-whatsapp"></i>
            +57 324 203 0867
          </a>
        </div>
      </div>
    </div>
  );
}
