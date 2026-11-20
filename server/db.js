import 'dotenv/config';
import mysql from 'mysql2/promise';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './dbconfig.js';

// Conexión (pool) a MySQL. Los datos vienen del archivo .env
export const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,     // DATE/DATETIME llegan como texto, sin problemas de zona horaria
  decimalNumbers: true,  // DECIMAL llega como número
});

// ---- Convierte filas de MySQL al formato que usa la página ----
const dateOnly = (v) => (v ? String(v).slice(0, 10) : undefined);
const isoDateTime = (v) => (v ? String(v).replace(' ', 'T') : undefined);

export const mapUser = (r) => ({
  id: String(r.id),
  name: r.nombre,
  cedula: r.cedula ?? undefined,
  email: r.email,
  role: r.rol,
  phone: r.telefono ?? undefined,
  createdAt: dateOnly(r.fecha_registro),
  lastLogin: isoDateTime(r.ultimo_acceso),
});

export const mapCanasta = (r) => ({
  id: String(r.id),
  fecha: dateOnly(r.fecha),
  productorId: r.productor_id == null ? '' : String(r.productor_id),
  productorNombre: r.productor_nombre,
  cantidad: r.cantidad,
  tipo: r.tipo_mango,
  precioUnitario: r.precio_unitario,
  estado: r.estado,
  createdAt: isoDateTime(r.fecha_creacion),
});

export const mapRegistro = (r) => ({
  id: String(r.id),
  asociadoId: r.asociado_id == null ? '' : String(r.asociado_id),
  asociadoNombre: r.asociado_nombre,
  fecha: dateOnly(r.fecha),
  producto: r.producto,
  cantidadCajas: r.cantidad_cajas,
  cantidadCanastas: r.cantidad_canastas,
  notas: r.notas ?? '',
  createdAt: isoDateTime(r.fecha_creacion),
});

export const mapPedido = (r) => ({
  id: String(r.id),
  clienteId: r.cliente_id == null ? '' : String(r.cliente_id),
  clienteNombre: r.cliente_nombre,
  producto: r.producto,
  cantidad: r.cantidad,
  precioTotal: r.precio_total ?? 0,
  notas: r.notas ?? '',
  estado: r.estado,
  createdAt: isoDateTime(r.fecha_creacion),
});

export const mapResena = (r) => ({
  id: String(r.id),
  nombre: r.nombre,
  contacto: r.contacto ?? '',
  telefono: r.telefono ?? '',
  tipo: r.tipo,
  calificacion: r.calificacion ?? null,
  mensaje: r.mensaje,
  latitud: r.latitud ?? null,
  longitud: r.longitud ?? null,
  precisionM: r.precision_m ?? null,
  leida: !!r.leida,
  createdAt: isoDateTime(r.fecha_creacion),
});

export const mapPqr = (r) => ({
  id: String(r.id),
  usuarioId: r.usuario_id == null ? null : String(r.usuario_id),
  tipo: r.tipo,
  nombre: r.nombre,
  fecha: String(r.fecha).slice(0, 10),
  descripcion: r.descripcion,
  firma: r.firma,
  estado: r.estado,
  createdAt: isoDateTime(r.fecha_creacion),
});

// Precio vigente de la canasta
export async function getPrecioCanasta() {
  const [rows] = await pool.query(
    "SELECT precio_cop FROM precios WHERE producto = 'Canasta de Mangos' ORDER BY id DESC LIMIT 1"
  );
  return rows[0]?.precio_cop ?? 4000;
}
