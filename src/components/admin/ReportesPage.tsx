import { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatCOP } from '../../services/database';
import {
  armarReporte, descargarExcel, descargarPdf, fmtNum, fmtT, KG_CAJA_DEFECTO, KG_CANASTA_DEFECTO,
} from '../../reportes/exportar';

const leerKg = (clave: string, defecto: number) => {
  try { const v = Number(localStorage.getItem(clave)); return v > 0 ? v : defecto; } catch { return defecto; }
};

export default function ReportesPage() {
  const { canastas, pedidos, allUsers, precioCanasta, registros } = useData();
  const [kgCaja, setKgCaja] = useState(() => leerKg('kgCaja', KG_CAJA_DEFECTO));
  const [kgCanasta, setKgCanasta] = useState(() => leerKg('kgCanasta', KG_CANASTA_DEFECTO));
  const [exportando, setExportando] = useState<'' | 'pdf' | 'excel'>('');
  const [errorExp, setErrorExp] = useState('');

  const cambiarKg = (clave: 'kgCaja' | 'kgCanasta', valor: string) => {
    const n = Number(valor);
    (clave === 'kgCaja' ? setKgCaja : setKgCanasta)(n > 0 ? n : 0);
    try { if (n > 0) localStorage.setItem(clave, String(n)); } catch { /* sin almacenamiento */ }
  };

  const reporte = useMemo(
    () => armarReporte({ canastas, registros, pedidos, usuarios: allUsers, precioCanasta, kgCaja: kgCaja || KG_CAJA_DEFECTO, kgCanasta: kgCanasta || KG_CANASTA_DEFECTO }),
    [canastas, registros, pedidos, allUsers, precioCanasta, kgCaja, kgCanasta]
  );

  const exportar = async (tipo: 'pdf' | 'excel') => {
    setErrorExp(''); setExportando(tipo);
    try { await (tipo === 'pdf' ? descargarPdf(reporte) : descargarExcel(reporte)); }
    catch { setErrorExp('No se pudo generar el archivo. Inténtalo de nuevo.'); }
    setExportando('');
  };

  const totalCanastas = canastas.reduce((sum, c) => sum + c.cantidad, 0);
  const ingresosTotales = totalCanastas * precioCanasta;
  const totalPedidos = pedidos.length;
  const ingresosPedidos = pedidos.reduce((sum, p) => sum + p.precioTotal, 0);

  // Productores con más producción
  const productoresRanking = canastas.reduce((acc, c) => {
    const existing = acc.find(a => a.nombre === c.productor);
    if (existing) {
      existing.canastas += c.cantidad;
      existing.ingresos += c.cantidad * precioCanasta;
    } else {
      acc.push({ nombre: c.productor, canastas: c.cantidad, ingresos: c.cantidad * precioCanasta });
    }
    return acc;
  }, [] as { nombre: string; canastas: number; ingresos: number }[]).sort((a, b) => b.canastas - a.canastas);

  // Variedades más producidas
  const variedadesRanking = canastas.reduce((acc, c) => {
    const existing = acc.find(a => a.variedad === c.tipo);
    if (existing) {
      existing.cantidad += c.cantidad;
    } else {
      acc.push({ variedad: c.tipo, cantidad: c.cantidad });
    }
    return acc;
  }, [] as { variedad: string; cantidad: number }[]).sort((a, b) => b.cantidad - a.cantidad);

  return (
    <div className="space-y-6">
      <div id="reporte-imprimible" className="space-y-6">
      <div className="hidden print-only items-center gap-3 border-b pb-3">
        <img src="/logo.jpg" alt="" className="w-14 h-14 rounded-full" />
        <div><p className="text-xl font-bold text-green-900">AsoManPesc</p><p className="text-sm text-gray-600">Reporte general - {reporte.fecha}</p></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <i className="bi bi-file-earmark-bar-graph-fill text-2xl text-purple-600"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Reportes Generales</h1>
          <p className="text-gray-500 text-sm">Estadísticas y análisis del sistema</p>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <i className="bi bi-cash-coin"></i> Resumen Financiero
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-green-200 text-sm">Ingresos por Canastas</p>
            <p className="text-2xl font-bold">{formatCOP(ingresosTotales)}</p>
            <p className="text-xs text-green-300 mt-1">{totalCanastas} canastas × {formatCOP(precioCanasta)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-green-200 text-sm">Ingresos por Pedidos</p>
            <p className="text-2xl font-bold">{formatCOP(ingresosPedidos)}</p>
            <p className="text-xs text-green-300 mt-1">{totalPedidos} pedidos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-green-200 text-sm">Total General</p>
            <p className="text-2xl font-bold">{formatCOP(ingresosTotales + ingresosPedidos)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-green-200 text-sm">Precio Canasta</p>
            <p className="text-2xl font-bold">{formatCOP(precioCanasta)}</p>
            <p className="text-xs text-green-300 mt-1">COP</p>
          </div>
        </div>
      </div>

      {/* Producción en toneladas */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-200">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
              <i className="bi bi-box-seam-fill text-amber-600"></i> Producción de Mango (toneladas)
            </h3>
            <p className="text-xs text-gray-500 mt-1">Calculada con los registros de producción de los asociados.</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-extrabold text-amber-600">{fmtNum(reporte.produccion.toneladas, 3)} <span className="text-lg">t</span></p>
            <p className="text-xs text-gray-500">{fmtNum(reporte.produccion.kg, 0)} kg · {reporte.produccion.cajas} cajas · {reporte.produccion.canastas} canastas</p>
          </div>
        </div>

        <div className="no-print bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm">
          <p className="font-medium text-amber-900 mb-2"><i className="bi bi-sliders me-1"></i>Peso estimado (ajústalo al real de la asociación)</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-gray-700">1 caja pesa
              <input type="number" min={1} value={kgCaja || ''} onChange={e => cambiarKg('kgCaja', e.target.value)} className="w-20 px-2 py-1 rounded-lg border border-amber-300 text-center" /> kg
            </label>
            <label className="flex items-center gap-2 text-gray-700">1 canasta pesa
              <input type="number" min={1} value={kgCanasta || ''} onChange={e => cambiarKg('kgCanasta', e.target.value)} className="w-20 px-2 py-1 rounded-lg border border-amber-300 text-center" /> kg
            </label>
          </div>
        </div>

        {reporte.produccion.registros === 0 ? (
          <p className="text-center text-gray-400 py-6">Aún no hay registros de producción. Cuando los asociados registren cajas y canastas, aquí verás las toneladas.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {[{ t: 'Por asociado', f: reporte.porAsociado.map(a => ({ n: a.nombre, kg: a.kg })) },
              { t: 'Por variedad', f: reporte.porProducto.map(a => ({ n: a.producto, kg: a.kg })) }].map(b => (
              <div key={b.t} className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-green-800 mb-2">{b.t}</p>
                {b.f.map(x => (
                  <div key={x.n} className="flex justify-between py-1.5 border-b border-gray-200 last:border-0 text-sm">
                    <span className="text-gray-700">{x.n}</span><span className="font-bold text-amber-700">{fmtT(x.kg)} t</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rankings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ranking de Productores */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
            <i className="bi bi-trophy-fill text-amber-500"></i> Ranking de Productores
          </h3>
          <div className="space-y-3">
            {productoresRanking.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  i === 0 ? 'bg-amber-400 text-white' :
                  i === 1 ? 'bg-gray-300 text-white' :
                  i === 2 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{p.nombre}</p>
                  <p className="text-xs text-gray-500">{p.canastas} canastas</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{formatCOP(p.ingresos)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking de Variedades */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
            <i className="bi bi-fruit-cart text-green-600"></i> Variedades Más Producidas
          </h3>
          <div className="space-y-3">
            {variedadesRanking.map((v, i) => {
              const maxCantidad = variedadesRanking[0]?.cantidad || 1;
              const porcentaje = (v.cantidad / maxCantidad) * 100;
              return (
                <div key={i} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-gray-800">{v.variedad}</p>
                    <span className="text-sm font-bold text-green-700">{v.cantidad} canastas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumen de usuarios */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <i className="bi bi-people-fill text-blue-600"></i> Resumen de Usuarios
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
            <i className="bi bi-shield-fill-check text-3xl text-red-600"></i>
            <p className="text-2xl font-bold text-red-700 mt-2">
              {allUsers.filter(u => u.role === 'admin').length}
            </p>
            <p className="text-sm text-red-600">Administradores</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
            <i className="bi bi-person-badge-fill text-3xl text-amber-600"></i>
            <p className="text-2xl font-bold text-amber-700 mt-2">
              {allUsers.filter(u => u.role === 'asociado').length}
            </p>
            <p className="text-sm text-amber-600">Asociados</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
            <i className="bi bi-person-fill text-3xl text-blue-600"></i>
            <p className="text-2xl font-bold text-blue-700 mt-2">
              {allUsers.filter(u => u.role === 'cliente').length}
            </p>
            <p className="text-sm text-blue-600">Clientes</p>
          </div>
        </div>
      </div>

      </div>

      {/* Exportar reporte */}
      <div className="no-print bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <i className="bi bi-download"></i> Exportar Reporte
            </h3>
            <p className="text-indigo-200 text-sm mt-1">Descarga el reporte completo en diferentes formatos</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportar('pdf')} disabled={!!exportando} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-60">
              <i className={`bi ${exportando === 'pdf' ? 'bi-hourglass-split' : 'bi-file-earmark-pdf-fill'}`}></i> PDF
            </button>
            <button onClick={() => exportar('excel')} disabled={!!exportando} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-60">
              <i className={`bi ${exportando === 'excel' ? 'bi-hourglass-split' : 'bi-file-earmark-excel-fill'}`}></i> Excel
            </button>
            <button onClick={() => window.print()} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
              <i className="bi bi-printer-fill"></i> Imprimir
            </button>
          </div>
        </div>
        {errorExp && <p className="mt-3 text-sm text-red-100"><i className="bi bi-exclamation-triangle-fill me-1"></i>{errorExp}</p>}
      </div>
    </div>
  );
}
