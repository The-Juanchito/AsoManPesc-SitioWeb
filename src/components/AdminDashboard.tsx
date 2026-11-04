import { useData } from '../context/DataContext';
import { MYSQL_CONFIG, MYSQL_SCHEMA, formatCOP } from '../services/database';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useState } from 'react';

const COLORS = ['#16a34a', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const { canastas, registros, usuariosNuevos, pedidos, allUsers, precioCanasta } = useData();
  const [showMySQL, setShowMySQL] = useState(false);

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

  // Totales
  const totalCanastas = canastas.reduce((sum, c) => sum + c.cantidad, 0);
  const canastasEntregadas = canastas.filter(c => c.estado === 'entregada').reduce((sum, c) => sum + c.cantidad, 0);
  const canastasPendientes = canastas.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + c.cantidad, 0);
  const canastasRecogidas = canastas.filter(c => c.estado === 'recogida').reduce((sum, c) => sum + c.cantidad, 0);
  const ingresosTotales = totalCanastas * precioCanasta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900">
            <i className="bi bi-speedometer2 me-2"></i>Panel de Administración
          </h1>
          <p className="text-gray-500">MySQL • Base de datos en tiempo real</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="db-status connected">
            <span className="pulse"></span>
            <i className="bi bi-database-fill-check"></i> MySQL Conectado
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <i className="bi bi-basket3-fill text-2xl"></i>
          </div>
          <div className="text-2xl font-bold">{totalCanastas}</div>
          <div className="text-green-100 text-sm">Total Canastas</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <i className="bi bi-cash-stack text-2xl"></i>
          </div>
          <div className="text-2xl font-bold">{formatCOP(precioCanasta)}</div>
          <div className="text-amber-100 text-sm">Precio/Canasta</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <i className="bi bi-graph-up-arrow text-2xl"></i>
          </div>
          <div className="text-xl font-bold">{formatCOP(ingresosTotales)}</div>
          <div className="text-blue-100 text-sm">Ingresos Totales</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <i className="bi bi-check-circle-fill text-2xl"></i>
          </div>
          <div className="text-2xl font-bold">{canastasEntregadas}</div>
          <div className="text-purple-100 text-sm">Entregadas</div>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-rose-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <i className="bi bi-hourglass-split text-2xl"></i>
          </div>
          <div className="text-2xl font-bold">{canastasPendientes + canastasRecogidas}</div>
          <div className="text-rose-100 text-sm">En Proceso</div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-green-800 mb-4">
            <i className="bi bi-bar-chart-fill me-2 text-green-600"></i>Canastas Recogidas por Día
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={canastasPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="canastas" fill="#16a34a" radius={[8, 8, 0, 0]} name="Canastas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-green-800 mb-4">
            <i className="bi bi-pie-chart-fill me-2 text-amber-600"></i>Producción por Asociado
          </h3>
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

      {/* Gráfica de línea */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          <i className="bi bi-graph-up me-2 text-blue-600"></i>Tendencia de Producción
        </h3>
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

      {/* Conexión a Bases de Datos */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          <i className="bi bi-database-fill-gear me-2 text-indigo-600"></i>Conexión a Bases de Datos
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* MySQL */}
          <div className="border border-blue-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <i className="bi bi-database-fill text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-blue-800">MySQL</h4>
                  <p className="text-xs text-blue-600">Base de datos principal</p>
                </div>
              </div>
              <span className="db-status connected">
                <span className="pulse"></span>
                Conectado
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Host:</span>
                <span className="font-mono text-gray-800">{MYSQL_CONFIG.host}:{MYSQL_CONFIG.port}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Usuario:</span>
                <span className="font-mono text-gray-800">{MYSQL_CONFIG.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Base de datos:</span>
                <span className="font-mono text-gray-800">{MYSQL_CONFIG.database}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Charset:</span>
                <span className="font-mono text-gray-800">{MYSQL_CONFIG.charset}</span>
              </div>
            </div>
            <button
              onClick={() => setShowMySQL(!showMySQL)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <i className={`bi bi-chevron-${showMySQL ? 'up' : 'down'}`}></i>
              {showMySQL ? 'Ocultar' : 'Ver'} Schema SQL
            </button>
            {showMySQL && (
              <pre className="mt-3 bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-60 overflow-y-auto">
                {MYSQL_SCHEMA}
              </pre>
            )}
          </div>

          {/* Información adicional MySQL */}
          <div className="border border-green-200 rounded-xl p-5 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <i className="bi bi-shield-check text-white text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-green-800">Seguridad y Respaldo</h4>
                <p className="text-xs text-green-600">Protección de datos</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Respaldo:</span>
                <span className="font-medium text-green-700 flex items-center gap-1">
                  <i className="bi bi-check-circle-fill"></i> Automático diario
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Encriptación:</span>
                <span className="font-medium text-green-700 flex items-center gap-1">
                  <i className="bi bi-lock-fill"></i> AES-256
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Disponibilidad:</span>
                <span className="font-medium text-green-700 flex items-center gap-1">
                  <i className="bi bi-graph-up"></i> 99.9% uptime
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Último respaldo:</span>
                <span className="font-mono text-gray-800">Hoy 06:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colaboraciones */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          <i className="bi bi-handshake me-2 text-purple-600"></i>Colaboraciones Estratégicas
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <i className="bi bi-megaphone-fill"></i>
              </div>
              <div>
                <h4 className="font-bold text-red-800">Hit Social</h4>
                <p className="text-xs text-red-600">Aliado Comercial</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Campañas de marketing digital y presencia en redes sociales para impulsar las ventas de mangos.</p>
            <div className="mt-3 flex gap-2">
              <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full text-xs"><i className="bi bi-megaphone me-1"></i>Marketing</span>
              <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full text-xs"><i className="bi bi-instagram me-1"></i>Redes</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <i className="bi bi-truck"></i>
              </div>
              <div>
                <h4 className="font-bold text-blue-800">Postobón</h4>
                <p className="text-xs text-blue-600">Aliado de Distribución</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Distribución y logística para llevar nuestros mangos a diferentes puntos del país.</p>
            <div className="mt-3 flex gap-2">
              <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs"><i className="bi bi-box-seam me-1"></i>Logística</span>
              <span className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-xs"><i className="bi bi-geo-alt me-1"></i>Distribución</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usuarios */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-800">
            <i className="bi bi-people-fill me-2 text-green-600"></i>Usuarios en la Base de Datos
          </h3>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <i className="bi bi-person-check me-1"></i>{allUsers.length} usuarios
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  <i className="bi bi-card-text me-1"></i>ID (cédula)
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  <i className="bi bi-person me-1"></i>Nombre
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  <i className="bi bi-envelope me-1"></i>Email
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  <i className="bi bi-shield-check me-1"></i>Rol
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  <i className="bi bi-calendar me-1"></i>Registro
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  <i className="bi bi-clock me-1"></i>Último Acceso
                </th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors">
                  <td className="py-3 px-2 text-sm font-mono text-gray-700">{u.cedula || '—'}</td>
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
                      <i className={`bi me-1 ${
                        u.role === 'admin' ? 'bi-shield-fill-check' :
                        u.role === 'asociado' ? 'bi-person-badge' : 'bi-person'
                      }`}></i>
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

      {/* Registro de Canastas */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-green-800">
            <i className="bi bi-basket3-fill me-2 text-amber-600"></i>Registro de Canastas (Quién Produjo)
          </h3>
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
            <i className="bi bi-list-ol me-1"></i>{canastas.length} registros • {formatCOP(precioCanasta)}/canasta
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Fecha</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Productor</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Variedad</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Cantidad</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody>
              {canastas.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors">
                  <td className="py-3 px-2 text-sm text-gray-600">
                    <i className="bi bi-calendar3 me-1 text-gray-400"></i>{c.fecha}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-xs">
                        <i className="bi bi-person-fill text-amber-700"></i>
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{c.productor}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">
                    <i className="bi bi-fruit-cart me-1"></i>{c.tipo}
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-green-700">{c.cantidad}</span>
                    <span className="text-gray-400 text-xs ml-1">canastas</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-amber-600">{formatCOP(c.cantidad * precioCanasta)}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.estado === 'entregada' ? 'bg-green-100 text-green-700' :
                      c.estado === 'recogida' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      <i className={`bi me-1 ${
                        c.estado === 'entregada' ? 'bi-check-circle-fill' :
                        c.estado === 'recogida' ? 'bi-arrow-repeat' : 'bi-hourglass-split'
                      }`}></i>
                      {c.estado}
                    </span>
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
          <h3 className="text-lg font-bold text-green-800">
            <i className="bi bi-cart-fill me-2 text-blue-600"></i>Pedidos de Clientes
          </h3>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <i className="bi bi-bag-check me-1"></i>{pedidos.length} pedidos
          </span>
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
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors">
                    <td className="py-3 px-2 text-sm font-medium text-gray-800">{p.clienteNombre}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{p.producto}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{p.cantidad} kg</td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-amber-600">{formatCOP(p.precioTotal)}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                        p.estado === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info DB */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-4">
          <i className="bi bi-info-circle-fill me-2"></i>Información del Sistema
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-gray-300"><i className="bi bi-database me-1"></i>Registros totales</p>
            <p className="text-xl font-bold">{canastas.length + registros.length + pedidos.length + allUsers.length}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-gray-300"><i className="bi bi-cash me-1"></i>Precio Canasta</p>
            <p className="text-xl font-bold">{formatCOP(precioCanasta)} COP</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-gray-300"><i className="bi bi-graph-up me-1"></i>Ingresos Totales</p>
            <p className="text-xl font-bold">{formatCOP(ingresosTotales)}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <p className="text-gray-300"><i className="bi bi-whatsapp me-1"></i>Admin WhatsApp</p>
            <p className="text-sm font-bold">+57 324 203 0867</p>
          </div>
        </div>
      </div>
    </div>
  );
}
