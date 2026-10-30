import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#16a34a', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const { canastas, registros, usuariosNuevos, pedidos, allUsers } = useData();

  // Datos para gráfica de canastas por día
  const canastasPorDia = canastas.reduce((acc, c) => {
    const existing = acc.find(a => a.dia === c.fecha);
    if (existing) {
      existing.canastas += c.cantidad;
    } else {
      acc.push({ dia: c.fecha, canastas: c.cantidad });
    }
    return acc;
  }, [] as { dia: string; canastas: number }[]).sort((a, b) => a.dia.localeCompare(b.dia));

  // Datos para gráfica de productores
  const productoresData = canastas.reduce((acc, c) => {
    const existing = acc.find(a => a.name === c.productor);
    if (existing) {
      existing.value += c.cantidad;
    } else {
      acc.push({ name: c.productor, value: c.cantidad });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Total de canastas
  const totalCanastas = canastas.reduce((sum, c) => sum + c.cantidad, 0);
  const canastasEntregadas = canastas.filter(c => c.estado === 'entregada').reduce((sum, c) => sum + c.cantidad, 0);
  const canastasPendientes = canastas.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + c.cantidad, 0);
  const canastasRecogidas = canastas.filter(c => c.estado === 'recogida').reduce((sum, c) => sum + c.cantidad, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Panel de Administración</h1>
          <p className="text-gray-500">Base de datos activa • Datos en tiempo real</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            DB Conectada
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-1">📦</div>
          <div className="text-2xl font-bold">{totalCanastas}</div>
          <div className="text-green-100 text-sm">Total Canastas</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-1">✅</div>
          <div className="text-2xl font-bold">{canastasEntregadas}</div>
          <div className="text-amber-100 text-sm">Entregadas</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-1">🔄</div>
          <div className="text-2xl font-bold">{canastasRecogidas}</div>
          <div className="text-blue-100 text-sm">Recogidas</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-1">⏳</div>
          <div className="text-2xl font-bold">{canastasPendientes}</div>
          <div className="text-purple-100 text-sm">Pendientes</div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gráfica de barras - Canastas por día */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-green-800 mb-4">📊 Canastas Recogidas por Día</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={canastasPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="canastas" fill="#16a34a" radius={[8, 8, 0, 0]} name="Canastas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de pie - Productores */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-green-800 mb-4">🥭 Producción por Asociado</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productoresData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
              >
                {productoresData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica de línea - Tendencia */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">📈 Tendencia de Producción</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={canastasPorDia}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Line type="monotone" dataKey="canastas" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 5 }} name="Canastas" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Colaboraciones */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">🤝 Colaboraciones Estratégicas</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">H</div>
              <div>
                <h4 className="font-bold text-red-800">Hit Social</h4>
                <p className="text-xs text-red-600">Aliado Comercial</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Campañas de marketing digital y presencia en redes sociales para impulsar las ventas de mangos.</p>
            <div className="mt-3 flex gap-2">
              <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full text-xs">Marketing</span>
              <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full text-xs">Redes Sociales</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">P</div>
              <div>
                <h4 className="font-bold text-blue-800">Postobón</h4>
                <p className="text-xs text-blue-600">Aliado de Distribución</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Distribución y logística para llevar nuestros mangos a diferentes puntos del país.</p>
            <div className="mt-3 flex gap-2">
              <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs">Logística</span>
              <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs">Distribución</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usuarios Registrados en la DB */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-800">👥 Usuarios en la Base de Datos</h3>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{allUsers.length} usuarios</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Nombre</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Rol</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Registro</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Último Acceso</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">{u.email}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'admin' ? 'bg-red-100 text-red-700' :
                      u.role === 'asociado' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-500">{u.createdAt}</td>
                  <td className="py-3 px-2 text-sm text-gray-500">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pedidos */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-800">🛒 Pedidos de Clientes</h3>
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">{pedidos.length} pedidos</span>
        </div>
        {pedidos.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No hay pedidos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Cliente</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Producto</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Cantidad</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Estado</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors">
                    <td className="py-3 px-2 text-sm font-medium text-gray-800">{p.clienteNombre}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{p.producto}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{p.cantidad} kg</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                        p.estado === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detalle de canastas - Quién produjo */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-800">📋 Registro Detallado de Canastas (Quién Produjo)</h3>
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">{canastas.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Fecha</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Productor</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Variedad</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Cantidad</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody>
              {canastas.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors">
                  <td className="py-3 px-2 text-sm text-gray-600">{c.fecha}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-xs">🥭</div>
                      <span className="font-medium text-gray-800 text-sm">{c.productor}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">{c.tipo}</td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-green-700">{c.cantidad}</span>
                    <span className="text-gray-400 text-xs ml-1">canastas</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.estado === 'entregada' ? 'bg-green-100 text-green-700' :
                      c.estado === 'recogida' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.estado === 'entregada' ? '✅ Entregada' : c.estado === 'recogida' ? '🔄 Recogida' : '⏳ Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info de la base de datos */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-3">💾 Información de la Base de Datos</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-gray-300">Registros en DB</p>
            <p className="text-xl font-bold">{canastas.length + registros.length + pedidos.length + allUsers.length}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-gray-300">Tipo de DB</p>
            <p className="text-xl font-bold">LocalStorage</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-gray-300">Tablas</p>
            <p className="text-xl font-bold">5</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-gray-300">Persistencia</p>
            <p className="text-xl font-bold">✅ Activa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
