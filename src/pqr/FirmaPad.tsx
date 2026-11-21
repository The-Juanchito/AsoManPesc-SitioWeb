import { useEffect, useRef, useState } from 'react';

// Firma: se dibuja con el dedo / mouse o se adjunta una foto. Entrega una imagen PNG pequeña con fondo transparente.
const ANCHO = 500, ALTO = 160;

// Recorta el espacio vacío alrededor del trazo para que la firma quede pegada a la línea
function recortar(c: HTMLCanvasElement): string {
  const ctx = c.getContext('2d')!;
  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return c.toDataURL('image/png');
  const pad = 6;
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(width - 1, x1 + pad); y1 = Math.min(height - 1, y1 + pad);
  const out = document.createElement('canvas');
  out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
  out.getContext('2d')!.drawImage(c, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  return out.toDataURL('image/png');
}

function limpiarFondo(origen: HTMLCanvasElement | HTMLImageElement, w: number, h: number): string {
  const c = document.createElement('canvas');
  c.width = ANCHO; c.height = ALTO;
  const ctx = c.getContext('2d')!;
  const escala = Math.min(ANCHO / w, ALTO / h);
  const dw = w * escala, dh = h * escala;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, ANCHO, ALTO);
  ctx.drawImage(origen, (ANCHO - dw) / 2, (ALTO - dh) / 2, dw, dh);
  // Lo claro (papel blanco) pasa a transparente y la tinta se oscurece
  const img = ctx.getImageData(0, 0, ANCHO, ALTO);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (lum > 200) d[i + 3] = 0;
    else { d[i] = d[i + 1] = d[i + 2] = Math.min(d[i], d[i + 1], d[i + 2], 40); d[i + 3] = lum < 120 ? 255 : Math.round(255 * (200 - lum) / 80); }
  }
  ctx.putImageData(img, 0, 0);
  return recortar(c);
}

export default function FirmaPad({ valor, onChange }: { valor: string | null; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const dibujando = useRef(false);
  const hayTrazo = useRef(false);
  const [modo, setModo] = useState<'dibujar' | 'foto'>('dibujar');
  const [error, setError] = useState('');

  const pintarBase = () => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  };
  useEffect(() => { if (modo === 'dibujar') pintarBase(); }, [modo]);

  const punto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = ref.current!, r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  };
  const inicio = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dibujando.current = true;
    const ctx = ref.current!.getContext('2d')!, p = punto(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 0.1, p.y + 0.1); ctx.stroke();
    hayTrazo.current = true;
  };
  const mover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando.current) return;
    const ctx = ref.current!.getContext('2d')!, p = punto(e);
    ctx.lineTo(p.x, p.y); ctx.stroke();
  };
  const fin = () => {
    if (!dibujando.current) return;
    dibujando.current = false;
    if (hayTrazo.current) onChange(recortar(ref.current!));
  };

  const borrar = () => { hayTrazo.current = false; pintarBase(); onChange(null); setError(''); };

  const subir = (f: File | undefined) => {
    setError('');
    if (!f) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(f.type)) { setError('Adjunta una imagen PNG, JPG o WEBP'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('La imagen pesa más de 5 MB'); return; }
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => { onChange(limpiarFondo(im, im.width, im.height)); URL.revokeObjectURL(url); };
    im.onerror = () => { setError('No se pudo leer la imagen'); URL.revokeObjectURL(url); };
    im.src = url;
  };

  const tab = (activo: boolean) => `px-4 py-1.5 rounded-lg text-sm font-medium ${activo ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" className={tab(modo === 'dibujar')} onClick={() => { setModo('dibujar'); onChange(null); hayTrazo.current = false; }}>
          <i className="bi bi-pencil-fill me-1"></i>Dibujar firma
        </button>
        <button type="button" className={tab(modo === 'foto')} onClick={() => { setModo('foto'); onChange(null); }}>
          <i className="bi bi-image-fill me-1"></i>Adjuntar imagen
        </button>
      </div>

      {modo === 'dibujar' ? (
        <div>
          <canvas ref={ref} width={ANCHO} height={ALTO}
            onPointerDown={inicio} onPointerMove={mover} onPointerUp={fin} onPointerLeave={fin} onPointerCancel={fin}
            className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-crosshair"
            style={{ touchAction: 'none', aspectRatio: `${ANCHO} / ${ALTO}` }} />
          <p className="text-xs text-gray-400 mt-1">Firma con el dedo o el mouse dentro del recuadro.</p>
        </div>
      ) : (
        <div>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => subir(e.target.files?.[0])}
            className="block w-full text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-800 file:font-medium" />
          <p className="text-xs text-gray-400 mt-1">Sube una foto de tu firma hecha en papel blanco con lapicero oscuro. El fondo se quita solo.</p>
          {valor && <img src={valor} alt="Vista previa de la firma" className="mt-2 h-20 bg-white border border-gray-200 rounded-lg p-1" />}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {(valor || hayTrazo.current) && (
        <button type="button" onClick={borrar} className="text-sm text-red-600 hover:underline"><i className="bi bi-trash3 me-1"></i>Quitar firma</button>
      )}
    </div>
  );
}
