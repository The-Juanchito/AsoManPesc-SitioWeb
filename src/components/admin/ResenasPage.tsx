import { useCallback, useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DBResena } from '../../services/database';

type Filtro = 'todas' | 'nuevas' | 'resena' | 'opinion';

const fechaLegible = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const Estrellas = ({ n }: { n: number | null }) =>
  n ? (
    <span className="text-amber-400 whitespace-nowrap" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`bi ${i <= n ? 'bi-star-fill' : 'bi-star text-gray-300'}`}></i>
      ))}
    </span>
  ) : (
    <span className="text-xs text-gray-400">Sin calificación</span>
  );

// Si el dato de contacto parece correo o teléfono, lo vuelve un enlace
function enlaceContacto(contacto: string) {
  if (!contacto) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto)) return `mailto:${contacto}`;
  const digitos = contacto.replace(/\D/g, '');
  if (digitos.length >= 7 && /^[\d\s+()-]+$/.test(contacto)) {
    return `https://wa.me/${digitos.length === 10 ? '57' + digitos : digitos}`;
  }
  return null;
}

export default function ResenasPage() {
  const [resenas, setResenas] = useState<DBResena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [porBorrar, setPorBorrar] = useState<DBResena | null>(null);

  const cargar = useCallback(async () => {
    try {
      setResenas(await api.getResenas());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los mensajes');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const alternarLeida = async (r: DBResena) => {
    try {
      await api.marcarResenaLeida(r.id, !r.leida);
      setResenas(prev => prev.map(x => (x.id === r.id ? { ...x, leida: !r.leida } : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar');
    }
  };

  const borrar = async () => {
    if (!porBorrar) return;
    try {
      await api.deleteResena(porBorrar.id);
      setResenas(prev => prev.filter(x => x.id !== porBorrar.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar');
    }
    setPorBorrar(null);
  };

  const nuevas = resenas.filter(r => !r.leida).length;
  const calificadas = resenas.filter(r => r.calificacion);
  const promedio = calificadas.length
    ? calificadas.reduce((s, r) => s + (r.calificacion ?? 0), 0) / calificadas.length
    : null;

  const visibles = resenas.filter(r =>
    filtro === 'todas' ? true : filtro === 'nuevas' ? !r.leida : r.tipo === filtro
  );

  const filtros: { id: Filtro; label: string }[] = [
    { id: 'todas', label: `Todas (${resenas.length})` },
    { id: 'nuevas', label: `Sin leer (${nuevas})` },
    { id: 'resena', label: 'Reseñas' },
    { id: 'opinion', label: 'Opiniones' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-chat-heart-fill text-2xl text-amber-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Reseñas y Opiniones</h1>
          <p className="text-gray-500 text-sm">Mensajes enviados desde la sección Contacto de la página</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-green-800">{resenas.length}</p>
          <p className="text-xs sm:text-sm text-gray-500">Mensajes</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-rose-600">{nuevas}</p>
          <p className="text-xs sm:text-sm text-gray-500">Sin leer</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-amber-500">
            {promedio ? promedio.toFixed(1) : '—'} <i className="bi bi-star-fill text-xl"></i>
          </p>
          <p className="text-xs sm:text-sm text-gray-500">Promedio</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filtros.map(f => (
          <button key={f.id} onClick={() => setFiltro(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filtro === f.id ? 'bg-green-700 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>{error}
        </div>
      )}

      {cargando ? (
        <p className="text-gray-500 text-center py-10"><i className="bi bi-hourglass-split me-2"></i>Cargando...</p>
      ) : visibles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          <i className="bi bi-inbox text-4xl block mb-2"></i>No hay mensajes en esta vista
        </div>
      ) : (
        <div className="space-y-4">
          {visibles.map(r => {
            const enlace = enlaceContacto(r.contacto);
            const tieneUbicacion = r.latitud !== null && r.longitud !== null;
            return (
              <article key={r.id}
                className={`bg-white rounded-2xl shadow-md border p-5 ${r.leida ? 'border-gray-100' : 'border-green-300 ring-1 ring-green-200'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                      {r.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {r.nombre}
                        {!r.leida && <span className="ml-2 text-[10px] uppercase bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full align-middle">Nuevo</span>}
                      </p>
                      <p className="text-xs text-gray-500">{fechaLegible(r.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      r.tipo === 'resena' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {r.tipo === 'resena' ? 'Reseña' : 'Opinión'}
                    </span>
                    <Estrellas n={r.calificacion} />
                  </div>
                </div>

                {/* React escapa el texto, así que el mensaje se muestra tal cual y sin riesgo */}
                <p className="mt-3 text-gray-700 whitespace-pre-wrap break-words">{r.mensaje}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  {r.contacto && (
                    <span className="text-gray-600 flex items-center gap-1">
                      <i className="bi bi-person-lines-fill text-green-600"></i>
                      {enlace
                        ? <a href={enlace} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">{r.contacto}</a>
                        : r.contacto}
                    </span>
                  )}
                  {r.telefono && (
                    <span className="text-gray-600 flex items-center gap-2">
                      <i className="bi bi-telephone-fill text-green-600"></i>
                      <a href={`tel:${r.telefono.replace(/[^\d+]/g, '')}`} className="text-green-700 underline">{r.telefono}</a>
                      <a href={`https://wa.me/${(() => { const d = r.telefono.replace(/\D/g, ''); return d.length === 10 ? '57' + d : d; })()}`}
                        target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700" title="Escribir por WhatsApp">
                        <i className="bi bi-whatsapp"></i>
                      </a>
                    </span>
                  )}
                  {tieneUbicacion && (
                    <a href={`https://www.google.com/maps?q=${r.latitud},${r.longitud}`} target="_blank" rel="noopener noreferrer"
                      className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium">
                      <i className="bi bi-geo-alt-fill"></i>Ver ubicación en el mapa
                      {r.precisionM !== null && <span className="text-xs text-gray-400 font-normal">(± {r.precisionM} m)</span>}
                    </a>
                  )}
                  <span className="ml-auto flex gap-2">
                    <button onClick={() => alternarLeida(r)}
                      className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium flex items-center gap-1">
                      <i className={`bi ${r.leida ? 'bi-envelope' : 'bi-envelope-open'}`}></i>
                      {r.leida ? 'Marcar sin leer' : 'Marcar leída'}
                    </button>
                    <button onClick={() => setPorBorrar(r)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium flex items-center gap-1">
                      <i className="bi bi-trash-fill"></i>Eliminar
                    </button>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {porBorrar && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setPorBorrar(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center text-gray-800">¿Eliminar este mensaje?</h3>
            <p className="text-sm text-gray-600 text-center mt-2">De <strong>{porBorrar.nombre}</strong>. No se puede deshacer.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setPorBorrar(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200">Cancelar</button>
              <button onClick={borrar} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
