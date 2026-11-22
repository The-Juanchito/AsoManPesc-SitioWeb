import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { abrirPrivacidad } from './PoliticaPrivacidad';

type Ubicacion = { lat: number; lng: number; precision: number };
type EstadoUbicacion = 'inactiva' | 'buscando' | 'activa' | 'error';

const WHATSAPP = 'https://wa.me/573242030867';

export default function ContactoSection() {
  const [tipo, setTipo] = useState<'resena' | 'opinion'>('resena');
  const [acepto, setAcepto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [website, setWebsite] = useState(''); // campo trampa anti-robots (oculto)

  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [estadoUbicacion, setEstadoUbicacion] = useState<EstadoUbicacion>('inactiva');
  const [errorUbicacion, setErrorUbicacion] = useState('');
  const watchId = useRef<number | null>(null);
  const tienePosicion = useRef(false); // ¿ya hubo al menos una lectura buena?

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const detenerUbicacion = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  // El aviso de error desaparece en cuanto la persona corrige algo
  useEffect(() => { setError(''); }, [nombre, mensaje, tipo]);

  // Al salir de la página se apaga el GPS
  useEffect(() => detenerUbicacion, []);

  // Sigue la ubicación en tiempo real mientras el formulario está abierto
  const compartirUbicacion = () => {
    if (!('geolocation' in navigator)) {
      setEstadoUbicacion('error');
      setErrorUbicacion('Tu navegador no permite obtener la ubicación.');
      return;
    }
    detenerUbicacion();
    setErrorUbicacion('');
    setEstadoUbicacion('buscando');
    tienePosicion.current = false;
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        tienePosicion.current = true;
        setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude, precision: pos.coords.accuracy });
        setEstadoUbicacion('activa');
        setErrorUbicacion('');
      },
      (err) => {
        // Sin permiso no hay nada que hacer: se detiene.
        if (err.code === err.PERMISSION_DENIED) {
          setEstadoUbicacion('error');
          setErrorUbicacion('No diste permiso. Actívalo en el candado de la barra de direcciones y vuelve a intentarlo.');
          detenerUbicacion();
          return;
        }
        // Errores pasajeros (señal débil, lugar cerrado...): se sigue intentando
        // y se conserva la última ubicación conocida.
        const aviso = err.code === err.TIMEOUT
          ? 'Está tardando en actualizar tu ubicación; seguimos intentando...'
          : 'Señal de ubicación débil; seguimos intentando...';
        setErrorUbicacion(aviso);
        if (!tienePosicion.current) setEstadoUbicacion('buscando');
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
  };

  const quitarUbicacion = () => {
    detenerUbicacion();
    setUbicacion(null);
    tienePosicion.current = false;
    setEstadoUbicacion('inactiva');
    setErrorUbicacion('');
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nombre.trim()) return setError('Escribe tu nombre');
    if (!acepto) return setError('Debes aceptar la política de privacidad para enviar');
    if (mensaje.trim().length < 5) return setError('Cuéntanos un poco más (mínimo 5 caracteres)');
    if (telefono.trim()) {
      const d = telefono.replace(/\D/g, '');
      if (!/^[\d\s+()-]+$/.test(telefono) || d.length < 7 || d.length > 15) return setError('Escribe un teléfono válido (solo números, de 7 a 15 dígitos)');
    }

    setEnviando(true);
    try {
      await api.enviarResena({
        nombre: nombre.trim(),
        contacto: contacto.trim() || undefined,
        telefono: telefono.trim() || undefined,
        tipo,
        calificacion: calificacion || null,
        mensaje: mensaje.trim(),
        latitud: ubicacion?.lat,
        longitud: ubicacion?.lng,
        precisionM: ubicacion?.precision,
        website,
      });
      detenerUbicacion();
      setUbicacion(null);
      setEstadoUbicacion('inactiva');
      setNombre(''); setContacto(''); setTelefono(''); setCalificacion(0); setMensaje(''); setTipo('resena'); setAcepto(false);
      setEnviado(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  // El mapa solo se recarga cuando te mueves ~10 metros (4 decimales)
  const mapaSrc = ubicacion
    ? (() => {
        const lat = Number(ubicacion.lat.toFixed(4));
        const lng = Number(ubicacion.lng.toFixed(4));
        return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.004}%2C${lat - 0.003}%2C${lng + 0.004}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;
      })()
    : null;

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all';

  return (
    <section id="contacto" className="py-20 bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-green-700 font-semibold text-sm uppercase tracking-wider bg-green-100 px-4 py-1.5 rounded-full border border-green-200">
            <i className="bi bi-chat-heart-fill"></i>
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mt-4 mb-4">Cuéntanos tu experiencia</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Déjanos tu reseña u opinión y, si quieres, comparte tu ubicación actual para saber desde dónde nos escribes.
          </p>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Información */}
          <div className="lg:col-span-2 space-y-4">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-md border border-green-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                <i className="bi bi-whatsapp text-white text-2xl"></i>
              </div>
              <div>
                <p className="font-bold text-green-900">WhatsApp</p>
                <p className="text-sm text-gray-600">+57 324 203 0867 · Respuesta directa</p>
              </div>
            </a>
            <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-md border border-green-100">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                <i className="bi bi-envelope-fill text-white text-2xl"></i>
              </div>
              <div>
                <p className="font-bold text-green-900">Correo</p>
                <p className="text-sm text-gray-600">ventas@asomanpesc.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-md border border-green-100">
              <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shrink-0">
                <i className="bi bi-geo-alt-fill text-white text-2xl"></i>
              </div>
              <div>
                <p className="font-bold text-green-900">Pescadero</p>
                <p className="text-sm text-gray-600">Asociación de Productores de Mango</p>
              </div>
            </div>
            <div className="bg-green-900 text-white p-5 rounded-2xl text-sm leading-relaxed">
              <p className="font-bold mb-1"><i className="bi bi-shield-lock-fill me-2 text-amber-400"></i>Tu privacidad</p>
              Tu ubicación solo se envía si pulsas el botón y aceptas el permiso del navegador. Puedes quitarla antes de enviar.
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-green-100 p-6 sm:p-8">
            {enviado ? (
              <div className="text-center py-10" role="status">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-check-circle-fill text-green-600 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">¡Gracias por escribirnos!</h3>
                <p className="text-gray-600 mb-6">Recibimos tu mensaje. Tu opinión nos ayuda a mejorar.</p>
                <button onClick={() => setEnviado(false)}
                  className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-800 transition-all">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={enviar} className="space-y-5" noValidate>
                {/* Tipo */}
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl" role="radiogroup" aria-label="Tipo de mensaje">
                  {([['resena', 'bi-star-fill', 'Reseña'], ['opinion', 'bi-chat-quote-fill', 'Opinión']] as const).map(([valor, icono, texto]) => (
                    <button key={valor} type="button" role="radio" aria-checked={tipo === valor}
                      onClick={() => setTipo(valor)}
                      className={`py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                        tipo === valor ? 'bg-white text-green-800 shadow' : 'text-gray-500 hover:text-gray-700'
                      }`}>
                      <i className={`bi ${icono}`}></i>{texto}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-nombre" className="block text-sm font-medium text-gray-700 mb-1">Tu nombre</label>
                    <input id="c-nombre" className={inputClass} value={nombre} maxLength={100}
                      onChange={e => setNombre(e.target.value)} placeholder="Nombre y apellido" />
                  </div>
                  <div>
                    <label htmlFor="c-telefono" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono / WhatsApp <span className="text-gray-400">(opcional)</span>
                    </label>
                    <input id="c-telefono" type="tel" inputMode="tel" autoComplete="tel" className={inputClass} value={telefono} maxLength={20}
                      onChange={e => setTelefono(e.target.value)} placeholder="Ej: 300 123 4567" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="c-contacto" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo <span className="text-gray-400">(opcional)</span>
                    </label>
                    <input id="c-contacto" className={inputClass} value={contacto} maxLength={150}
                      onChange={e => setContacto(e.target.value)} placeholder="Para responderte" />
                  </div>
                </div>

                {/* Estrellas */}
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Calificación <span className="text-gray-400">(opcional)</span>
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                        onClick={() => setCalificacion(calificacion === n ? 0 : n)}
                        className="text-3xl leading-none transition-transform hover:scale-110">
                        <i className={`bi ${n <= calificacion ? 'bi-star-fill text-amber-400' : 'bi-star text-gray-300'}`}></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="c-mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                    {tipo === 'resena' ? 'Tu reseña' : 'Tu opinión'}
                  </label>
                  <textarea id="c-mensaje" rows={4} className={`${inputClass} resize-none`} value={mensaje} maxLength={1000}
                    onChange={e => setMensaje(e.target.value)}
                    placeholder={tipo === 'resena' ? '¿Cómo te pareció nuestro mango y el servicio?' : '¿Qué podemos mejorar? ¿Qué te gustaría ver?'} />
                  <p className="text-xs text-gray-400 text-right mt-1">{mensaje.length}/1000</p>
                </div>

                {/* Campo trampa: las personas no lo ven */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label>No llenar este campo
                    <input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
                  </label>
                </div>

                {/* Ubicación en tiempo real */}
                <div className="rounded-2xl border border-green-200 bg-green-50/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-green-900 flex items-center gap-2">
                        <i className="bi bi-geo-alt-fill text-rose-500"></i>Mi ubicación en tiempo real
                        <span className="text-xs font-normal text-gray-400">(opcional)</span>
                      </p>
                      <p className="text-xs text-gray-500">Se actualiza mientras tengas el formulario abierto.</p>
                    </div>
                    {estadoUbicacion === 'inactiva' || estadoUbicacion === 'error' ? (
                      <button type="button" onClick={compartirUbicacion}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-all flex items-center gap-2">
                        <i className="bi bi-crosshair"></i>Compartir mi ubicación
                      </button>
                    ) : (
                      <button type="button" onClick={quitarUbicacion}
                        className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2">
                        <i className="bi bi-x-circle"></i>Quitar ubicación
                      </button>
                    )}
                  </div>

                  {estadoUbicacion === 'buscando' && (
                    <p className="text-sm text-gray-600 mt-3 flex items-center gap-2" role="status">
                      <i className="bi bi-hourglass-split"></i>Buscando tu ubicación... acepta el permiso del navegador.
                    </p>
                  )}
                  {errorUbicacion && (
                    <p className="text-sm text-red-600 mt-3 flex items-start gap-2" role="alert">
                      <i className="bi bi-exclamation-triangle-fill mt-0.5"></i>{errorUbicacion}
                    </p>
                  )}
                  {ubicacion && mapaSrc && (
                    <div className="mt-3">
                      <p className="text-sm text-green-800 flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                        <span className="flex items-center gap-1">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                          En vivo
                        </span>
                        <span className="font-mono text-xs">{ubicacion.lat.toFixed(5)}, {ubicacion.lng.toFixed(5)}</span>
                        <span className="text-xs text-gray-500">± {Math.round(ubicacion.precision)} m</span>
                      </p>
                      <iframe title="Mapa con tu ubicación" src={mapaSrc} loading="lazy"
                        className="w-full h-48 rounded-xl border border-green-200" />
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={acepto} onChange={e => setAcepto(e.target.checked)} className="mt-1 w-4 h-4 accent-green-700 shrink-0" />
                  <span>Autorizo el tratamiento de mis datos según la{' '}
                    <button type="button" onClick={abrirPrivacidad} className="text-green-700 font-semibold underline">política de privacidad</button>.
                  </span>
                </label>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>{error}
                  </div>
                )}

                <button type="submit" disabled={enviando}
                  className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  <i className={`bi ${enviando ? 'bi-hourglass-split' : 'bi-send-fill'}`}></i>
                  {enviando ? 'Enviando...' : `Enviar ${tipo === 'resena' ? 'reseña' : 'opinión'}`}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Precio destacado */}
        <div className="mt-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-6xl">🥭</span>
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-amber-100">Canasta de Mangos Frescos</p>
              <p className="text-3xl sm:text-4xl font-bold">Precio Variable</p>
              <p className="text-amber-100 mt-1 text-sm">Según el mercado • Consulta por WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
