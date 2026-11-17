import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatCOP } from '../../services/database';

type Estado = 'pendiente' | 'confirmado' | 'entregado';
const ESTADOS: Estado[] = ['pendiente', 'confirmado', 'entregado'];
const color: Record<Estado, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmado: 'bg-blue-100 text-blue-700',
  entregado: 'bg-green-100 text-green-700',
};

export default function PedidosPage() {
  const { pedidos, updatePedidoEstado } = useData();
  const [filtro, setFiltro] = useState<'todos' | Estado>('todos');
  const [error, setError] = useState('');
  const [cargandoId, setCargandoId] = useState<string | null>(null);

  const visibles = pedidos.filter(p => filtro === 'todos' || p.estado === filtro);
  const total = visibles.reduce((s, p) => s + p.precioTotal, 0);

  const cambiar = async (id: string, estado: Estado) => {
    setError('');
    setCargandoId(id);
    try {
      await updatePedidoEstado(id, estado);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar el estado');
    }
    setCargandoId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-cart-fill text-2xl text-blue-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Pedidos de Clientes</h1>
          <p className="text-gray-500 text-sm">Cambia el estado de cada pedido; se guarda en MySQL</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['todos', ...ESTADOS] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
              filtro === f ? 'bg-green-700 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'
            }`}>
            {f} ({f === 'todos' ? pedidos.length : pedidos.filter(p => p.estado === f).length})
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="text-lg font-bold text-green-800">Lista de pedidos</h3>
          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
            Total mostrado: {formatCOP(total)}
          </span>
        </div>
        {visibles.length === 0 ? (
          <p className="text-gray-400 text-center py-8"><i className="bi bi-inbox text-3xl block mb-1"></i>No hay pedidos en esta vista</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                  <th className="py-3 px-2 font-medium">Cliente</th>
                  <th className="py-3 px-2 font-medium">Producto</th>
                  <th className="py-3 px-2 font-medium">Cantidad</th>
                  <th className="py-3 px-2 font-medium">Total</th>
                  <th className="py-3 px-2 font-medium">Notas</th>
                  <th className="py-3 px-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-green-50/50">
                    <td className="py-3 px-2 text-sm font-medium text-gray-800">{p.clienteNombre || 'Cliente eliminado'}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{p.producto}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{p.cantidad} kg</td>
                    <td className="py-3 px-2 font-bold text-amber-600">{formatCOP(p.precioTotal)}</td>
                    <td className="py-3 px-2 text-sm text-gray-500 max-w-[200px] truncate" title={p.notas}>{p.notas || '—'}</td>
                    <td className="py-3 px-2">
                      <select aria-label={`Estado del pedido de ${p.clienteNombre}`} value={p.estado} disabled={cargandoId === p.id}
                        onChange={e => cambiar(p.id, e.target.value as Estado)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${color[p.estado]}`}>
                        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
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
