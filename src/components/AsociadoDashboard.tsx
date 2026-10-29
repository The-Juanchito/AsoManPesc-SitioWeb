import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AsociadoDashboard() {
  const { user } = useAuth();
  const { registros, addRegistro, canastas, addCanasta } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [showCanastaForm, setShowCanastaForm] = useState(false);
  const [formData, setFormData] = useState({
    producto: '',
    cantidadCajas: '',
    cantidadCanastas: '',
    notas: ''
  });
  const [canastaForm, setCanastaForm] = useState({
    tipo: '',
    cantidad: '',
    estado: 'pendiente' as 'recogida' | 'pendiente' | 'entregada'
  });

  // Filtrar registros del asociado actual
  const misRegistros = registros.filter(r => r.asociadoId === user?.id);
  const misCanastas = canastas.filter(c => c.productor === user?.name);
  
  // Totales del asociado
  const totalCajas = misRegistros.reduce((sum, r) => sum + r.cantidadCajas, 0);
  const totalCanastas = misRegistros.reduce((sum, r) => sum + r.cantidadCanastas, 0);
  const totalCanastasRecogidas = misCanastas.filter(c => c.estado === 'recogida' || c.estado === 'entregada').reduce((sum, c) => sum + c.cantidad, 0);

  // Datos para gráfica
  const datosGrafica = misRegistros.map(r => ({
    fecha: r.fecha,
    cajas: r.cantidadCajas,
    canastas: r.cantidadCanastas
  }));

  const handleSubmitRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.producto || !formData.cantidadCajas || !formData.cantidadCanastas) return;
    
    addRegistro({
      asociadoId: user!.id,
      asociadoNombre: user!.name,
      fecha: new Date().toISOString().split('T')[0],
      producto: formData.producto,
      cantidadCajas: Number(formData.cantidadCajas),
      cantidadCanastas: Number(formData.cantidadCanastas),
      notas: formData.notas
    });
    
    setFormData({ producto: '', cantidadCajas: '', cantidadCanastas: '', notas: '' });
    setShowForm(false);
  };

  const handleSubmitCanasta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canastaForm.tipo || !canastaForm.cantidad) return;
    
    addCanasta({
      fecha: new Date().toISOString().split('T')[0],
      productor: user!.name,
      cantidad: Number(canastaForm.cantidad),
      tipo: canastaForm.tipo,
      estado: canastaForm.estado
    });
    
    setCanastaForm({ tipo: '', cantidad: '', estado: 'pendiente' });
    setShowCanastaForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Panel del Asociado</h1>
          <p className="text-gray-500">Hola {user?.name}, aquí puedes gestionar tu producción</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-1">📦</div>
          <div className="text-2xl font-bold">{totalCanastas}</div>
          <div className="text-green-100 text-sm">Total Canastas</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-1">📫</div>
          <div className="text-2xl font-bold">{totalCajas}</div>
          <div className="text-amber-100 text-sm">Total Cajas</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-1">✅</div>
          <div className="text-2xl font-bold">{totalCanastasRecogidas}</div>
          <div className="text-blue-100 text-sm">Canastas Recogidas</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-5 rounded-2xl shadow-lg">
          <div className="text-3xl mb-1">📝</div>
          <div className="text-2xl font-bold">{misRegistros.length}</div>
          <div className="text-purple-100 text-sm">Registros</div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>📝</span> Registrar Producción
        </button>
        <button
          onClick={() => setShowCanastaForm(!showCanastaForm)}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>🧺</span> Registrar Canasta
        </button>
      </div>

      {/* Formulario de registro de producción */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100 animate-in">
          <h3 className="text-lg font-bold text-green-800 mb-4">📝 Registrar Nueva Producción</h3>
          <form onSubmit={handleSubmitRegistro} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Producto / Variedad</label>
              <select
                value={formData.producto}
                onChange={(e) => setFormData({...formData, producto: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="Tommy Atkins">Tommy Atkins</option>
                <option value="Ataulfo">Ataulfo (Mango de Oro)</option>
                <option value="Kent">Kent</option>
                <option value="Haden">Haden</option>
                <option value="Keitt">Keitt</option>
                <option value="Manila">Manila</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Cajas</label>
              <input
                type="number"
                value={formData.cantidadCajas}
                onChange={(e) => setFormData({...formData, cantidadCajas: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                placeholder="Ej: 50"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Canastillas</label>
              <input
                type="number"
                value={formData.cantidadCanastas}
                onChange={(e) => setFormData({...formData, cantidadCanastas: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                placeholder="Ej: 25"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <input
                type="text"
                value={formData.notas}
                onChange={(e) => setFormData({...formData, notas: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                placeholder="Observaciones..."
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-800 transition-all">
                Guardar Registro
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulario de registro de canasta */}
      {showCanastaForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100">
          <h3 className="text-lg font-bold text-amber-800 mb-4">🧺 Registrar Canasta Recogida</h3>
          <form onSubmit={handleSubmitCanasta} className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variedad de Mango</label>
              <select
                value={canastaForm.tipo}
                onChange={(e) => setCanastaForm({...canastaForm, tipo: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="Tommy Atkins">Tommy Atkins</option>
                <option value="Ataulfo">Ataulfo</option>
                <option value="Kent">Kent</option>
                <option value="Haden">Haden</option>
                <option value="Keitt">Keitt</option>
                <option value="Manila">Manila</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Canastas</label>
              <input
                type="number"
                value={canastaForm.cantidad}
                onChange={(e) => setCanastaForm({...canastaForm, cantidad: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
                placeholder="Ej: 10"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={canastaForm.estado}
                onChange={(e) => setCanastaForm({...canastaForm, estado: e.target.value as any})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
              >
                <option value="pendiente">⏳ Pendiente</option>
                <option value="recogida">🔄 Recogida</option>
                <option value="entregada">✅ Entregada</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex gap-3">
              <button type="submit" className="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 transition-all">
                Registrar Canasta
              </button>
              <button type="button" onClick={() => setShowCanastaForm(false)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gráfica de producción */}
      {datosGrafica.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-green-800 mb-4">📊 Mi Producción</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={datosGrafica}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="cajas" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Cajas" />
              <Bar dataKey="canastas" fill="#16a34a" radius={[4, 4, 0, 0]} name="Canastas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Historial de registros */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">📋 Mi Historial de Producción</h3>
        {misRegistros.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <span className="text-4xl block mb-2">📭</span>
            <p>Aún no tienes registros. ¡Comienza registrando tu producción!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {misRegistros.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">🥭</div>
                  <div>
                    <p className="font-medium text-green-800">{r.producto}</p>
                    <p className="text-xs text-gray-500">{r.fecha} • {r.notas}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{r.cantidadCanastas} canastas</p>
                  <p className="text-xs text-gray-500">{r.cantidadCajas} cajas</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mis canastas */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-amber-800 mb-4">🧺 Mis Canastas Registradas</h3>
        {misCanastas.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <span className="text-4xl block mb-2">🧺</span>
            <p>No has registrado canastas aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Fecha</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Variedad</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Cantidad</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {misCanastas.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-amber-50/50">
                    <td className="py-3 px-2 text-sm text-gray-600">{c.fecha}</td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-800">{c.tipo}</td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-amber-700">{c.cantidad}</span>
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
        )}
      </div>
    </div>
  );
}
