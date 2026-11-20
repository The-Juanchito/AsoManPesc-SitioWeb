import { useData } from '../../context/DataContext';

export default function ProduccionPage() {
  const { registros } = useData();
  const cajas = registros.reduce((s, r) => s + r.cantidadCajas, 0);
  const canastas = registros.reduce((s, r) => s + r.cantidadCanastas, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-flower1 text-2xl text-green-700"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Producción de los Asociados</h1>
          <p className="text-gray-500 text-sm">Registros de cosecha que envían los asociados</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { n: registros.length, l: 'Registros', c: 'text-green-800' },
          { n: cajas, l: 'Cajas', c: 'text-amber-600' },
          { n: canastas, l: 'Canastas', c: 'text-blue-600' },
        ].map(x => (
          <div key={x.l} className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 text-center">
            <p className={`text-2xl sm:text-3xl font-bold ${x.c}`}>{x.n}</p>
            <p className="text-xs sm:text-sm text-gray-500">{x.l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        {registros.length === 0 ? (
          <p className="text-gray-400 text-center py-8"><i className="bi bi-inbox text-3xl block mb-1"></i>Aún no hay registros de producción</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                  <th className="py-3 px-2 font-medium">Fecha</th>
                  <th className="py-3 px-2 font-medium">Asociado</th>
                  <th className="py-3 px-2 font-medium">Variedad</th>
                  <th className="py-3 px-2 font-medium">Cajas</th>
                  <th className="py-3 px-2 font-medium">Canastas</th>
                  <th className="py-3 px-2 font-medium">Notas</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-green-50/50">
                    <td className="py-3 px-2 text-sm text-gray-600">{r.fecha}</td>
                    <td className="py-3 px-2 text-sm font-medium text-gray-800">{r.asociadoNombre || 'Asociado eliminado'}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{r.producto}</td>
                    <td className="py-3 px-2 font-bold text-amber-600">{r.cantidadCajas}</td>
                    <td className="py-3 px-2 font-bold text-green-700">{r.cantidadCanastas}</td>
                    <td className="py-3 px-2 text-sm text-gray-500 max-w-[220px] truncate" title={r.notas}>{r.notas || '—'}</td>
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
