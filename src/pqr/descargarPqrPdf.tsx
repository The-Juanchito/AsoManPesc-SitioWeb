import { createRoot } from 'react-dom/client';
import PqrFormato, { PqrDatos } from './PqrFormato';

// Dibuja el formato fuera de pantalla, lo convierte en imagen y lo guarda como PDF (tamaño carta/A4)
export async function descargarPqrPdf(datos: PqrDatos, nombreArchivo = 'PQR-AsoManPesc.pdf') {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:1123px;';
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    root.render(<PqrFormato datos={datos} />);
    await new Promise(r => setTimeout(r, 150));
    await Promise.all(Array.from(host.querySelectorAll('img')).map(img =>
      img.complete ? Promise.resolve() : new Promise<void>(r => { img.onload = img.onerror = () => r(); })
    ));
    const canvas = await html2canvas(host.firstElementChild as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#fdfbf4' });
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    pdf.save(nombreArchivo);
  } finally {
    root.unmount();
    host.remove();
  }
}

export const nombreArchivoPqr = (nombre: string, fecha: string) =>
  `PQR-${nombre.normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '')}-${fecha}.pdf`;
