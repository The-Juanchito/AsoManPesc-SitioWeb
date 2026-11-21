// Datos y exportación (PDF, Excel, imprimir) del reporte general
export interface DatosReporte {
  fecha: string;
  precioCanasta: number;
  kgCaja: number;
  kgCanasta: number;
  totalCanastas: number;
  ingresosCanastas: number;
  totalPedidos: number;
  ingresosPedidos: number;
  produccion: { cajas: number; canastas: number; kg: number; toneladas: number; registros: number };
  porAsociado: { nombre: string; cajas: number; canastas: number; kg: number }[];
  porProducto: { producto: string; cajas: number; canastas: number; kg: number }[];
  productores: { nombre: string; canastas: number; ingresos: number }[];
  variedades: { variedad: string; cantidad: number }[];
  usuarios: { admin: number; asociado: number; cliente: number };
}

export const KG_CAJA_DEFECTO = 20;
export const KG_CANASTA_DEFECTO = 15;

export const fmtNum = (n: number, dec = 2) => n.toLocaleString('es-CO', { maximumFractionDigits: dec });
export const fmtT = (kg: number) => fmtNum(kg / 1000, 3);
const cop = (n: number) => '$ ' + Math.round(n).toLocaleString('es-CO');

interface Entrada {
  canastas: { productor: string; cantidad: number; tipo: string }[];
  registros: { asociadoNombre: string; producto: string; cantidadCajas: number; cantidadCanastas: number }[];
  pedidos: { precioTotal: number }[];
  usuarios: { role: string }[];
  precioCanasta: number;
  kgCaja: number;
  kgCanasta: number;
}

export function armarReporte(e: Entrada): DatosReporte {
  const kgDe = (cajas: number, canastas: number) => cajas * e.kgCaja + canastas * e.kgCanasta;
  const agrupar = <K extends string>(clave: (r: Entrada['registros'][number]) => string, campo: K) => {
    const m = new Map<string, { cajas: number; canastas: number; kg: number }>();
    for (const r of e.registros) {
      const k = clave(r) || 'Sin nombre';
      const a = m.get(k) ?? { cajas: 0, canastas: 0, kg: 0 };
      a.cajas += r.cantidadCajas; a.canastas += r.cantidadCanastas;
      a.kg = kgDe(a.cajas, a.canastas);
      m.set(k, a);
    }
    return [...m.entries()].map(([nombre, v]) => ({ [campo]: nombre, ...v })).sort((a: any, b: any) => b.kg - a.kg);
  };

  const cajas = e.registros.reduce((s, r) => s + r.cantidadCajas, 0);
  const canastasProd = e.registros.reduce((s, r) => s + r.cantidadCanastas, 0);
  const kg = kgDe(cajas, canastasProd);
  const totalCanastas = e.canastas.reduce((s, c) => s + c.cantidad, 0);
  const ingresosPedidos = e.pedidos.reduce((s, p) => s + p.precioTotal, 0);

  const prod = new Map<string, number>();
  const vari = new Map<string, number>();
  for (const c of e.canastas) {
    prod.set(c.productor, (prod.get(c.productor) ?? 0) + c.cantidad);
    vari.set(c.tipo, (vari.get(c.tipo) ?? 0) + c.cantidad);
  }

  return {
    fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' }),
    precioCanasta: e.precioCanasta, kgCaja: e.kgCaja, kgCanasta: e.kgCanasta,
    totalCanastas, ingresosCanastas: totalCanastas * e.precioCanasta,
    totalPedidos: e.pedidos.length, ingresosPedidos,
    produccion: { cajas, canastas: canastasProd, kg, toneladas: kg / 1000, registros: e.registros.length },
    porAsociado: agrupar(r => r.asociadoNombre, 'nombre') as DatosReporte['porAsociado'],
    porProducto: agrupar(r => r.producto, 'producto') as DatosReporte['porProducto'],
    productores: [...prod.entries()].map(([nombre, canastas]) => ({ nombre, canastas, ingresos: canastas * e.precioCanasta })).sort((a, b) => b.canastas - a.canastas),
    variedades: [...vari.entries()].map(([variedad, cantidad]) => ({ variedad, cantidad })).sort((a, b) => b.cantidad - a.cantidad),
    usuarios: {
      admin: e.usuarios.filter(u => u.role === 'admin').length,
      asociado: e.usuarios.filter(u => u.role === 'asociado').length,
      cliente: e.usuarios.filter(u => u.role === 'cliente').length,
    },
  };
}

const archivo = (ext: string) => `Reporte-AsoManPesc-${new Date().toISOString().slice(0, 10)}.${ext}`;

// ---------- PDF ----------
async function logoDataUrl(): Promise<string | null> {
  try {
    const blob = await (await fetch('/logo.jpg')).blob();
    return await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(blob); });
  } catch { return null; }
}

export async function descargarPdf(d: DatosReporte) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, M = 15;
  let y = 0;
  const verde: [number, number, number] = [22, 101, 52];
  const gris: [number, number, number] = [90, 90, 90];

  const nueva = () => { pdf.addPage(); y = 20; };
  const asegurar = (alto: number) => { if (y + alto > 280) nueva(); };

  // Encabezado
  pdf.setFillColor(...verde); pdf.rect(0, 0, W, 34, 'F');
  const logo = await logoDataUrl();
  if (logo) pdf.addImage(logo, 'JPEG', M, 5, 24, 24);
  pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(18);
  pdf.text('AsoManPesc', M + 29, 15);
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10);
  pdf.text('Asociacion de Productores de Mango de Pescadero', M + 29, 21);
  pdf.text(`Reporte general - ${d.fecha}`, M + 29, 27);
  y = 44;

  const titulo = (t: string) => {
    asegurar(20);
    pdf.setTextColor(...verde); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(13);
    pdf.text(t, M, y); y += 2;
    pdf.setDrawColor(...verde); pdf.setLineWidth(0.5); pdf.line(M, y, W - M, y); y += 7;
  };
  const tabla = (cols: { t: string; x: number; der?: boolean }[], filas: string[][]) => {
    asegurar(14);
    pdf.setFillColor(240, 247, 242); pdf.rect(M, y - 5, W - 2 * M, 8, 'F');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...verde);
    cols.forEach(c => pdf.text(c.t, c.x, y, { align: c.der ? 'right' : 'left' }));
    y += 7;
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(40, 40, 40);
    if (!filas.length) { pdf.setTextColor(...gris); pdf.text('Sin datos todavia', M + 2, y); y += 7; }
    filas.forEach((f, i) => {
      asegurar(8);
      if (i % 2) { pdf.setFillColor(248, 248, 248); pdf.rect(M, y - 4.5, W - 2 * M, 6.5, 'F'); }
      pdf.setTextColor(40, 40, 40);
      f.forEach((v, j) => pdf.text(String(v), cols[j].x, y, { align: cols[j].der ? 'right' : 'left' }));
      y += 6.5;
    });
    y += 5;
  };
  const linea = (k: string, v: string) => {
    asegurar(8);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.setTextColor(...gris); pdf.text(k, M, y);
    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 30, 30); pdf.text(v, W - M, y, { align: 'right' }); y += 7;
  };

  titulo('Produccion de mango (toneladas)');
  pdf.setFillColor(254, 243, 199); pdf.roundedRect(M, y - 4, W - 2 * M, 18, 3, 3, 'F');
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(20); pdf.setTextColor(180, 83, 9);
  pdf.text(`${fmtNum(d.produccion.toneladas, 3)} toneladas`, M + 6, y + 8);
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...gris);
  pdf.text(`${fmtNum(d.produccion.kg, 0)} kg  |  ${d.produccion.cajas} cajas  |  ${d.produccion.canastas} canastas  |  ${d.produccion.registros} registros`, W - M - 4, y + 8, { align: 'right' });
  y += 20;
  pdf.setFontSize(8); pdf.text(`Estimado con ${d.kgCaja} kg por caja y ${d.kgCanasta} kg por canasta.`, M, y); y += 8;

  titulo('Produccion por asociado');
  tabla([{ t: 'Asociado', x: M + 2 }, { t: 'Cajas', x: 110, der: true }, { t: 'Canastas', x: 140, der: true }, { t: 'Toneladas', x: W - M - 2, der: true }],
    d.porAsociado.map(a => [a.nombre, String(a.cajas), String(a.canastas), fmtT(a.kg)]));

  titulo('Produccion por variedad');
  tabla([{ t: 'Variedad', x: M + 2 }, { t: 'Cajas', x: 110, der: true }, { t: 'Canastas', x: 140, der: true }, { t: 'Toneladas', x: W - M - 2, der: true }],
    d.porProducto.map(a => [a.producto, String(a.cajas), String(a.canastas), fmtT(a.kg)]));

  titulo('Resumen financiero');
  linea(`Ingresos por canastas (${d.totalCanastas} x ${cop(d.precioCanasta)})`, cop(d.ingresosCanastas));
  linea(`Ingresos por pedidos (${d.totalPedidos})`, cop(d.ingresosPedidos));
  linea('Total general', cop(d.ingresosCanastas + d.ingresosPedidos));
  y += 4;

  titulo('Ranking de productores (canastas entregadas)');
  tabla([{ t: 'Productor', x: M + 2 }, { t: 'Canastas', x: 130, der: true }, { t: 'Ingresos', x: W - M - 2, der: true }],
    d.productores.map(p => [p.nombre, String(p.canastas), cop(p.ingresos)]));

  titulo('Variedades mas entregadas');
  tabla([{ t: 'Variedad', x: M + 2 }, { t: 'Canastas', x: W - M - 2, der: true }], d.variedades.map(v => [v.variedad, String(v.cantidad)]));

  titulo('Usuarios');
  linea('Administradores', String(d.usuarios.admin));
  linea('Asociados', String(d.usuarios.asociado));
  linea('Clientes', String(d.usuarios.cliente));

  const paginas = pdf.getNumberOfPages();
  for (let i = 1; i <= paginas; i++) {
    pdf.setPage(i); pdf.setFontSize(8); pdf.setTextColor(150, 150, 150);
    pdf.text(`AsoManPesc - Pagina ${i} de ${paginas}`, W / 2, 290, { align: 'center' });
  }
  pdf.save(archivo('pdf'));
}

// ---------- Excel ----------
export async function descargarExcel(d: DatosReporte) {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = 'AsoManPesc';

  const hoja = (nombre: string, cols: { header: string; width: number; fmt?: string }[], filas: (string | number)[][]) => {
    const ws = wb.addWorksheet(nombre);
    ws.columns = cols.map(c => ({ header: c.header, width: c.width, style: c.fmt ? { numFmt: c.fmt } : {} }));
    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF166534' } };
    filas.forEach(f => ws.addRow(f));
    return ws;
  };

  const resumen = hoja('Resumen', [{ header: 'Concepto', width: 42 }, { header: 'Valor', width: 22 }], [
    ['Fecha del reporte', d.fecha],
    ['Producción total (toneladas)', Number((d.produccion.kg / 1000).toFixed(3))],
    ['Producción total (kg)', d.produccion.kg],
    ['Cajas registradas', d.produccion.cajas],
    ['Canastas registradas (producción)', d.produccion.canastas],
    ['kg por caja (estimado)', d.kgCaja],
    ['kg por canasta (estimado)', d.kgCanasta],
    ['Canastas entregadas', d.totalCanastas],
    ['Precio por canasta (COP)', d.precioCanasta],
    ['Ingresos por canastas (COP)', d.ingresosCanastas],
    ['Pedidos', d.totalPedidos],
    ['Ingresos por pedidos (COP)', d.ingresosPedidos],
    ['Total general (COP)', d.ingresosCanastas + d.ingresosPedidos],
    ['Administradores', d.usuarios.admin], ['Asociados', d.usuarios.asociado], ['Clientes', d.usuarios.cliente],
  ]);
  resumen.getColumn(2).alignment = { horizontal: 'right' };

  const colsProd = [{ header: 'Cajas', width: 12 }, { header: 'Canastas', width: 12 }, { header: 'Kilos', width: 14, fmt: '#,##0' }, { header: 'Toneladas', width: 14, fmt: '0.000' }];
  hoja('Toneladas por asociado', [{ header: 'Asociado', width: 34 }, ...colsProd],
    d.porAsociado.map(a => [a.nombre, a.cajas, a.canastas, a.kg, Number((a.kg / 1000).toFixed(3))]));
  hoja('Toneladas por variedad', [{ header: 'Variedad', width: 28 }, ...colsProd],
    d.porProducto.map(a => [a.producto, a.cajas, a.canastas, a.kg, Number((a.kg / 1000).toFixed(3))]));
  hoja('Productores', [{ header: 'Productor', width: 34 }, { header: 'Canastas', width: 12 }, { header: 'Ingresos (COP)', width: 18, fmt: '#,##0' }],
    d.productores.map(p => [p.nombre, p.canastas, p.ingresos]));
  hoja('Variedades', [{ header: 'Variedad', width: 28 }, { header: 'Canastas', width: 12 }], d.variedades.map(v => [v.variedad, v.cantidad]));

  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const a = document.createElement('a');
  a.href = url; a.download = archivo('xlsx'); document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
