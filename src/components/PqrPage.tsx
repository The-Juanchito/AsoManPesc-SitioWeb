import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DBPqr, PqrTipo } from '../services/database';
import { PQR_TIPOS, PQR_MAX_DESCRIPCION, fechaLarga } from '../pqr/PqrFormato';
import { descargarPqrPdf, nombreArchivoPqr } from '../pqr/descargarPqrPdf';

const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const etiquetaTipo = (t: PqrTipo) => PQR_TIPOS.find(x => x.id === t)?.label ?? t;

// Formulario de PQR para asociados y clientes. Al enviar, se guarda en MySQL y se descarga el PDF del formato.
export default function PqrPage() {
  const { user } = useAuth();
  const [tipo, setTipo] = useState<PqrTipo | ''>('');
  const [nombre, setNombre] = useState(user?.name ?? '');
  const [fecha, setFecha] = useState(hoy());
  const [descripcion, setDescripcion] = useState('');
  const [firma, setFirma] = useState(user?.name ?? '');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState<DBPqr | null>(null);
  const [mias, setMias] = useState<DBPqr[]>([]);
  const [generando, setGenerando] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try { setMias(await api.getPqr()); } catch { /* se muestra vacío */ }
  }, []);
  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { setError(''); }, [tipo, nombre, fecha, descripcion, firma]);

  const pdf = async (p: Pick<DBPqr, 'tipo' | 'nombre' | 'fecha' | 'descripcion' | 'firma'> & { id?: string }) => {
    setGenerando(p.id ?? 'nuevo');
    try { await descargarPqrPdf(p, nombreArchivoPqr(p.nombre, p.fecha)); }
    catch { setError('No se pudo generar el PDF. Intenta de nuevo.'); }
    setGenerando(null);
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo) { setError('Elige el tipo de solicitud'); return; }
    if (descripcion.trim().length < 10) { setError('Describe tu solicitud (mínimo 10 caracteres)'); return; }
    setEnviando(true);
    try {
      const guardada = await api.addPqr({ tipo, nombre: nombre.trim(), fecha, descripcion: descripcion.trim(), firma: firma.trim() });
      setOk(guardada);
      setTipo(''); setDescripcion('');
      await cargar();
      await pdf(guardada);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar');
    }
    setEnviando(false);
  };

  const input = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-file-earmark-text-fill text-2xl text-orange-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Formato de PQR</h1>
          <p className="text-gray-500 text-sm">Peticiones, Quejas y Reclamos · se guarda y se descarga en PDF</p>
        </div>
      </div>

      {ok && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm flex flex-wrap items-center gap-3" role="status">
          <i className="bi bi-check-circle-fill text-xl"></i>
          <span className="flex-1">Tu solicitud quedó registrada y el PDF se descargó.</span>
          <button onClick={() => pdf(ok)} className="bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-800">
            <i className="bi bi-download me-1"></i>Descargar otra vez
          </button>
        </div>
      )}

      <form onSubmit={enviar} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-5">
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">Tipo de solicitud</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PQR_TIPOS.map(t => (
              <button type="button" key={t.id} onClick={() => setTipo(t.id)} aria-pressed={tipo === t.id}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  tipo === t.id ? 'border-green-600 bg-green-50 text-green-800' : 'border-gray-200 text-gray-600 hover:border-green-300'
                }`}>
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${tipo === t.id ? 'border-green-600 bg-green-600 text-white' : 'border-gray-400'}`}>
                  {tipo === t.id && <i className="bi bi-check-lg"></i>}
                </span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pqr-nombre">Nombre del asociado o usuario</label>
            <input id="pqr-nombre" className={input} value={nombre} onChange={e => setNombre(e.target.value)} maxLength={100} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pqr-fecha">Fecha</label>
            <input id="pqr-fecha" type="date" className={input} value={fecha} onChange={e => setFecha(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pqr-desc">Descripción de la solicitud</label>
          <textarea id="pqr-desc" className={`${input} resize-none`} rows={6} value={descripcion} maxLength={PQR_MAX_DESCRIPCION}
            onChange={e => setDescripcion(e.target.value)} placeholder="Cuéntanos qué necesitas, qué pasó o qué sugieres..." />
          <p className="text-xs text-gray-400 text-right mt-1">{descripcion.length}/{PQR_MAX_DESCRIPCION}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pqr-firma">Firma (escribe tu nombre)</label>
          <input id="pqr-firma" className={input} value={firma} onChange={e => setFirma(e.target.value)} maxLength={100} required />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        <button type="submit" disabled={enviando || generando === 'nuevo'}
          className="w-full sm:w-auto bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 disabled:opacity-60 flex items-center justify-center gap-2">
          <i className={`bi ${enviando ? 'bi-hourglass-split' : 'bi-file-earmark-pdf-fill'}`}></i>
          {enviando ? 'Enviando...' : 'Enviar y descargar PDF'}
        </button>
      </form>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4"><i className="bi bi-clock-history me-2 text-orange-500"></i>Mis solicitudes</h3>
        {mias.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Todavía no has enviado ninguna</p>
        ) : (
          <div className="space-y-3">
            {mias.map(p => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-gray-50">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{etiquetaTipo(p.tipo)}</span>
                <div className="flex-1 min-w-[160px]">
                  <p className="text-sm text-gray-700 line-clamp-2">{p.descripcion}</p>
                  <p className="text-xs text-gray-400">{fechaLarga(p.fecha)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.estado === 'atendida' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.estado}</span>
                <button onClick={() => pdf(p)} disabled={generando === p.id}
                  className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium disabled:opacity-60">
                  <i className="bi bi-file-earmark-pdf-fill me-1"></i>PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
