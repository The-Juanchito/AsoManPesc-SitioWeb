import { useCallback, useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DBPqr, PqrTipo } from '../../services/database';
import { PQR_TIPOS, fechaLarga } from '../../pqr/PqrFormato';
import { descargarPqrPdf, nombreArchivoPqr } from '../../pqr/descargarPqrPdf';

export default function PqrAdminPage() {
  const [lista, setLista] = useState<DBPqr[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState<'todas' | PqrTipo>('todas');
  const [generando, setGenerando] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try { setLista(await api.getPqr()); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudieron cargar las solicitudes'); }
    setCargando(false);
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  const cambiarEstado = async (p: DBPqr, estado: DBPqr['estado']) => {
    try {
      await api.updatePqrEstado(p.id, estado);
      setLista(prev => prev.map(x => (x.id === p.id ? { ...x, estado } : x)));
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo actualizar'); }
  };

  const pdf = async (p: DBPqr) => {
    setGenerando(p.id);
    try { await descargarPqrPdf(p, nombreArchivoPqr(p.nombre, p.fecha)); }
    catch { setError('No se pudo generar el PDF'); }
    setGenerando(null);
  };

  const visibles = lista.filter(p => filtro === 'todas' || p.tipo === filtro);
  const pendientes = lista.filter(p => p.estado === 'pendiente').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-file-earmark-text-fill text-2xl text-orange-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">PQR · Peticiones, Quejas y Reclamos</h1>
          <p className="text-gray-500 text-sm">{lista.length} solicitudes · {pendientes} pendientes · cada una se descarga en el formato PDF de la asociación</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {([{ id: 'todas', label: 'Todas' }, ...PQR_TIPOS] as { id: 'todas' | PqrTipo; label: string }[]).map(f => (
          <button key={f.id} onClick={() => setFiltro(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${filtro === f.id ? 'bg-green-700 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" role="alert">{error}</div>}

      {cargando ? (
        <p className="text-gray-500 text-center py-10">Cargando...</p>
      ) : visibles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400"><i className="bi bi-inbox text-4xl block mb-2"></i>No hay solicitudes en esta vista</div>
      ) : (
        <div className="space-y-4">
          {visibles.map(p => (
            <article key={p.id} className={`bg-white rounded-2xl shadow-md border p-5 ${p.estado === 'pendiente' ? 'border-orange-300' : 'border-gray-100'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-800">{p.nombre}</p>
                  <p className="text-xs text-gray-500">{fechaLarga(p.fecha)}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{PQR_TIPOS.find(t => t.id === p.tipo)?.label}</span>
              </div>
              <p className="mt-3 text-gray-700 whitespace-pre-wrap break-words">{p.descripcion}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
                <select aria-label={`Estado de la solicitud de ${p.nombre}`} value={p.estado} onChange={e => cambiarEstado(p, e.target.value as DBPqr['estado'])}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${p.estado === 'atendida' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  <option value="pendiente">pendiente</option>
                  <option value="atendida">atendida</option>
                </select>
                <button onClick={() => pdf(p)} disabled={generando === p.id}
                  className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium disabled:opacity-60">
                  <i className="bi bi-file-earmark-pdf-fill me-1"></i>{generando === p.id ? 'Generando...' : 'Descargar PDF'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
