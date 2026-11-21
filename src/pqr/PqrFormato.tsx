// Formato de PQR (Peticiones, Quejas y Reclamos) de AsoManPesc.
// Se dibuja con estilos en línea y colores hexadecimales (sin Tailwind) para que html2canvas
// pueda convertirlo a imagen y de ahí a PDF tal cual se ve aquí.
import { LOGO_URL } from '../data/variedades';
import type { PqrTipo } from '../services/database';

export interface PqrDatos {
  tipo: PqrTipo;
  nombre: string;
  fecha: string; // AAAA-MM-DD
  descripcion: string;
  firma: string;
  firmaImagen?: string | null;
}

export const PQR_TIPOS: { id: PqrTipo; label: string }[] = [
  { id: 'sugerencia', label: 'Sugerencias' },
  { id: 'queja', label: 'Quejas' },
  { id: 'reclamo', label: 'Reclamos' },
  { id: 'peticion', label: 'Petición' },
];

export const PQR_MAX_DESCRIPCION = 600;

const VERDE = '#1d3b2a';
const NARANJA = '#e9a02a';
const CREMA = '#fdfbf4';
const LINEA = '#2b4a39';

export const fechaLarga = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
};

export default function PqrFormato({ datos }: { datos: PqrDatos }) {
  const campo = { position: 'absolute' as const, left: 66, right: 66 };
  const etiqueta = { fontSize: 20, fontWeight: 700, color: VERDE };
  const texto = { fontSize: 18, color: '#111', fontFamily: 'Arial, Helvetica, sans-serif' };
  const sobreLinea = { height: 30, lineHeight: '20px', paddingBottom: 0 };

  return (
    <div style={{ position: 'relative', width: 794, height: 1123, background: CREMA, overflow: 'hidden', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Fondo decorativo */}
      <svg width="794" height="1123" viewBox="0 0 794 1123" style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M0 0 H794 V330 Q397 400 0 330 Z" fill={VERDE} />
        <path d="M0 125 Q120 175 235 208 L235 218 Q110 190 0 150 Z" fill={NARANJA} />
        <path d="M0 150 Q110 205 235 222 L235 232 Q100 222 0 178 Z" fill="#7aa23c" />
        <path d="M794 125 Q674 175 559 208 L559 218 Q684 190 794 150 Z" fill={NARANJA} />
        <path d="M794 150 Q684 205 559 222 L559 232 Q694 222 794 178 Z" fill="#7aa23c" />
        <path d="M0 330 Q397 400 794 330" fill="none" stroke={NARANJA} strokeWidth="3" />
        <path d="M0 1123 V1045 C170 1028 330 1085 520 1062 C640 1050 720 1020 794 1032 V1123 Z" fill={VERDE} />
        <path d="M0 1045 C170 1028 330 1085 520 1062 C640 1050 720 1020 794 1032" fill="none" stroke={NARANJA} strokeWidth="4" />
        <ellipse cx="50" cy="1085" rx="22" ry="52" transform="rotate(-35 50 1085)" fill="#7aa23c" />
        <ellipse cx="95" cy="1092" rx="18" ry="44" transform="rotate(15 95 1092)" fill="#e9a02a" />
        <ellipse cx="725" cy="1075" rx="16" ry="48" transform="rotate(70 725 1075)" fill="#6a9a4a" />
      </svg>

      {/* Encabezado */}
      <img src={LOGO_URL} alt="" crossOrigin="anonymous"
        style={{ position: 'absolute', left: 297, top: 12, width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', border: '4px solid #d9a52b' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 212, textAlign: 'center', color: '#fff', fontSize: 54, fontWeight: 800, letterSpacing: 1 }}>ASOMANPESC</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 292, textAlign: 'center', color: '#fff', fontSize: 19, fontWeight: 700 }}>
        Asociación de Productores de Mango de Pescadero
      </div>

      {/* Cinta del título */}
      <div style={{ position: 'absolute', left: 130, right: 130, top: 332, height: 88, background: NARANJA, textAlign: 'center', border: '2px solid #f3c25c', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: VERDE, marginTop: 6, lineHeight: '44px' }}>FORMATO DE PQR</div>
        <div style={{ fontSize: 19, fontWeight: 700, color: VERDE }}>(Peticiones, Quejas y Reclamos)</div>
      </div>

      {/* Tipo de solicitud */}
      <div style={{ position: 'absolute', left: 66, right: 40, top: 454, display: 'flex', justifyContent: 'space-between' }}>
        {PQR_TIPOS.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, border: `2.5px solid ${LINEA}`, borderRadius: 3, textAlign: 'center', fontSize: 24, lineHeight: '24px', fontWeight: 800, color: VERDE, boxSizing: 'border-box', marginRight: 10 }}>
              <span style={{ position: 'relative', top: -4 }}>{datos.tipo === t.id ? 'X' : ''}</span>
            </div>
            <span style={{ ...etiqueta, fontSize: 19 }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Nombre */}
      <div style={{ ...campo, top: 514 }}>
        <div style={etiqueta}>Nombre del asociado o usuario:</div>
        <div style={{ ...texto, ...sobreLinea, marginTop: 14, borderBottom: `2px solid ${LINEA}`, whiteSpace: 'nowrap', overflow: 'hidden' }}>{datos.nombre}</div>
      </div>

      {/* Fecha */}
      <div style={{ ...campo, top: 584 }}>
        <div style={etiqueta}>Fecha:</div>
        <div style={{ ...texto, ...sobreLinea, marginTop: 14, borderBottom: `2px solid ${LINEA}` }}>{fechaLarga(datos.fecha)}</div>
      </div>

      {/* Descripción */}
      <div style={{ position: 'absolute', left: 52, right: 52, top: 676, height: 290, border: `2px solid ${LINEA}`, borderRadius: 22, boxSizing: 'border-box' }}>
        <div style={{ ...etiqueta, position: 'absolute', left: 26, top: 18 }}>Descripción de la solicitud:</div>
        <div style={{
          position: 'absolute', left: 26, right: 26, top: 52, height: 218, overflow: 'hidden',
          backgroundImage: `linear-gradient(to bottom, transparent 30px, ${LINEA} 30px, ${LINEA} 32px, transparent 32px)`,
          backgroundSize: '100% 32px',
        }}>
          <div style={{ ...texto, fontSize: 16, lineHeight: '32px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', position: 'relative', top: -6 }}>{datos.descripcion}</div>
        </div>
      </div>

      {/* Firma */}
      <div style={{ position: 'absolute', left: 66, right: 66, top: 982, display: 'flex', alignItems: 'flex-end' }}>
        <span style={etiqueta}>Firma:</span>
        {datos.firmaImagen ? (
          <div style={{ flex: 1, marginLeft: 14, height: 30, borderBottom: `2px solid ${LINEA}`, position: 'relative' }}>
            <img src={datos.firmaImagen} alt="" style={{ position: 'absolute', left: 10, bottom: 2, height: 52, maxWidth: 260, objectFit: 'contain' }} />
          </div>
        ) : (
          <div style={{ ...texto, flex: 1, marginLeft: 14, height: 30, borderBottom: `2px solid ${LINEA}`, fontStyle: 'italic', fontFamily: '"Brush Script MT", "Segoe Script", cursive', fontSize: 24, lineHeight: '22px' }}>{datos.firma}</div>
        )}
      </div>
      {datos.firmaImagen && (
        <div style={{ position: 'absolute', left: 130, right: 66, top: 1016, fontSize: 13, color: VERDE }}>{datos.firma}</div>
      )}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 1078, textAlign: 'center', color: '#fff', fontSize: 19, fontWeight: 700 }}>
        Trabajamos juntos por el desarrollo del campo
      </div>
    </div>
  );
}
