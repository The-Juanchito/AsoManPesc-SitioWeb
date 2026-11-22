import { useEffect, useState } from 'react';

// Abre la política desde cualquier parte: abrirPrivacidad() o el enlace #privacidad
export const abrirPrivacidad = () => window.dispatchEvent(new Event('abrir-privacidad'));

const Seccion = ({ t, children }: { t: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <h3 className="font-bold text-green-800 mb-1">{t}</h3>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

export default function PoliticaPrivacidad() {
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    const abrir = () => setAbierta(true);
    const porHash = () => { if (location.hash === '#privacidad') setAbierta(true); };
    window.addEventListener('abrir-privacidad', abrir);
    window.addEventListener('hashchange', porHash);
    porHash();
    return () => { window.removeEventListener('abrir-privacidad', abrir); window.removeEventListener('hashchange', porHash); };
  }, []);

  useEffect(() => {
    if (!abierta) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [abierta]);

  const cerrar = () => {
    setAbierta(false);
    if (location.hash === '#privacidad') history.replaceState(null, '', location.pathname + location.search);
  };

  if (!abierta) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={cerrar} role="dialog" aria-modal="true" aria-labelledby="priv-titulo">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <h2 id="priv-titulo" className="text-xl font-bold text-green-900"><i className="bi bi-shield-check text-green-600 me-2"></i>Política de privacidad y tratamiento de datos</h2>
            <p className="text-xs text-gray-400 mt-1">Última actualización: noviembre de 2026</p>
          </div>
          <button onClick={cerrar} aria-label="Cerrar" className="text-gray-400 hover:text-gray-700 text-xl shrink-0"><i className="bi bi-x-lg"></i></button>
        </div>

        <div className="p-6 overflow-y-auto">
          <Seccion t="1. Quién es el responsable">
            <p>La <b>Asociación de Productores de Mango de Pescadero (AsoManPesc)</b> es la responsable del tratamiento de tus datos personales. Puedes contactarnos por WhatsApp al <b>+57 324 203 0867</b>.</p>
          </Seccion>
          <Seccion t="2. Qué datos recogemos">
            <p>Solo los que tú nos das al usar la página:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Formulario de contacto (reseñas y opiniones):</b> nombre, teléfono o WhatsApp y correo (opcionales), tu mensaje y calificación, y tu ubicación aproximada solo si decides compartirla.</li>
              <li><b>Cuentas de asociados y clientes:</b> nombre, cédula, correo, teléfono y contraseña (guardada cifrada, nunca en texto plano).</li>
              <li><b>Formato PQR:</b> nombre, fecha, descripción de la solicitud y firma.</li>
              <li><b>Pedidos y producción:</b> cantidades, productos y fechas asociadas a tu cuenta.</li>
            </ul>
          </Seccion>
          <Seccion t="3. Para qué los usamos">
            <p>Para responder tus mensajes, contactarte por tu pedido o solicitud, gestionar las cuentas y la producción de la asociación, atender peticiones, quejas y reclamos, y mejorar nuestro servicio. <b>No vendemos ni cedemos tus datos a terceros</b> con fines comerciales.</p>
          </Seccion>
          <Seccion t="4. Con quién se comparten">
            <p>Solo con los proveedores técnicos que hacen funcionar la página (alojamiento, base de datos y envío de correos), que los tratan únicamente para prestarnos ese servicio, y con las autoridades cuando la ley lo exija.</p>
          </Seccion>
          <Seccion t="5. Tus derechos (Ley 1581 de 2012)">
            <p>Como titular puedes <b>conocer, actualizar, rectificar y suprimir</b> tus datos, <b>revocar la autorización</b> que nos diste y pedir prueba de ella. Escríbenos por WhatsApp y atenderemos tu solicitud.</p>
          </Seccion>
          <Seccion t="6. Cuánto tiempo los guardamos">
            <p>Mientras sean necesarios para la finalidad por la que los recogimos o mientras mantengas una cuenta con nosotros. Si pides su eliminación, los borraremos, salvo que la ley nos obligue a conservarlos.</p>
          </Seccion>
          <Seccion t="7. Seguridad">
            <p>Usamos conexión segura (HTTPS), contraseñas cifradas y acceso restringido por roles. Ningún sistema es infalible, pero trabajamos para proteger tu información.</p>
          </Seccion>
          <Seccion t="8. Cambios">
            <p>Si actualizamos esta política, publicaremos la nueva versión en esta página con su fecha.</p>
          </Seccion>
        </div>

        <div className="p-4 border-t border-gray-100 text-right">
          <button onClick={cerrar} className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-800">Entendido</button>
        </div>
      </div>
    </div>
  );
}
