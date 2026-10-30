import { useData } from '../../context/DataContext';
import { formatCOP } from '../../services/database';

export default function CanastasPage() {
  const { canastas, precioCanasta, updateCanastaEstado } = useData();

  const totalCanastas = canastas.reduce((sum, c) => sum + c.cantidad, 0);
  const ingresosTotales = totalCanastas * precioCanasta;
  const porEstado = {
    entregada: canastas.filter(c => c.estado === 'entregada').reduce((s, c) => s + c.cantidad, 0),
    recogida: canastas.filter(c => c.estado === 'recogida').reduce((s, c) => s + c.cantidad, 0),
    pendiente: canastas.filter(c => c.estado === 'pendiente').reduce((s, c) => s + c.cantidad, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-basket3-fill text-2xl text-amber-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Gestión de Canastas</h1>
          <p className="text-gray-500 text-sm">Administra todas las canastas registradas</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <i className="bi bi-basket3-fill text-xl"></i>
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalCanastas}</p>
          <p className="text-xs text-gray-500">canastas</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <i className="bi bi-check-circle-fill text-xl"></i>
            <span className="text-sm font-medium">Entregadas</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{porEstado.entregada}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <i className="bi bi-arrow-repeat text-xl"></i>
            <span className="text-sm font-medium">Recogidas</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{porEstado.recogida}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <i className="bi bi-cash-stack text-xl"></i>
            <span className="text-sm font-medium">Ingresos</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{formatCOP(ingresosTotales)}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4">
          <i className="bi bi-list-ul me-2"></i>Registro Completo de Canastas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-500">Fecha</th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-500">Productor</th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-500">Variedad</th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-500">Cantidad</th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-500">Estado</th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {canastas.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-green-50/50">
                  <td className="py-3 px-3 text-sm text-gray-600">
                    <i className="bi bi-calendar3 me-1 text-gray-400"></i>{c.fecha}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center">
                        <i className="bi bi-person-fill text-amber-700 text-xs"></i>
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{c.productor}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-600">{c.tipo}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-green-700">{c.cantidad}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-amber-600">{formatCOP(c.cantidad * precioCanasta)}</span>
                  </td>
                  <td className="py-3 px-3">
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
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      {c.estado !== 'recogida' && (
                        <button
                          onClick={() => updateCanastaEstado(c.id, 'recogida')}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Marcar como recogida"
                        >
                          <i className="bi bi-arrow-repeat text-xs"></i>
                        </button>
                      )}
                      {c.estado !== 'entregada' && (
                        <button
                          onClick={() => updateCanastaEstado(c.id, 'entregada')}
                          className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          title="Marcar como entregada"
                        >
                          <i className="bi bi-check-lg text-xs"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
