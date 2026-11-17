// ============================================
// Tipos y utilidades de la base de datos - AsoManPesc
// Los datos viven en MySQL; el servidor (carpeta /server) los entrega por API.
// El esquema real está en server/schema.sql (se muestra tal cual en la pantalla "Base de Datos").
// ============================================
import schemaSQL from '../../server/schema.sql?raw';

// Datos de conexión que se muestran en pantalla (la contraseña NO se muestra).
// Los valores reales están en server/.env
export const MYSQL_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'asomanpesc_admin',
  database: 'asomanpesc_db',
  charset: 'utf8mb4',
  connectionLimit: 10,
};

export const MYSQL_SCHEMA: string = schemaSQL;

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password?: string; // el servidor nunca la devuelve
  role: 'admin' | 'asociado' | 'cliente';
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  cedula?: string;
}

export interface DBCanasta {
  id: string;
  fecha: string;
  productorId: string;
  productorNombre: string;
  cantidad: number;
  tipo: string;
  precioUnitario: number;
  estado: 'recogida' | 'pendiente' | 'entregada';
  createdAt: string;
}

export interface DBRegistro {
  id: string;
  asociadoId: string;
  asociadoNombre: string;
  fecha: string;
  producto: string;
  cantidadCajas: number;
  cantidadCanastas: number;
  notas: string;
  createdAt: string;
}

export interface DBPedido {
  id: string;
  clienteId: string;
  clienteNombre: string;
  producto: string;
  cantidad: number;
  precioTotal: number;
  notas: string;
  estado: 'pendiente' | 'confirmado' | 'entregado';
  createdAt: string;
}

export interface DBResena {
  id: string;
  nombre: string;
  contacto: string;
  tipo: 'resena' | 'opinion';
  calificacion: number | null;
  mensaje: string;
  latitud: number | null;
  longitud: number | null;
  precisionM: number | null;
  leida: boolean;
  createdAt?: string;
}

export type PqrTipo = 'sugerencia' | 'queja' | 'reclamo' | 'peticion';

export interface DBPqr {
  id: string;
  usuarioId: string | null;
  tipo: PqrTipo;
  nombre: string;
  fecha: string; // AAAA-MM-DD
  descripcion: string;
  firma: string;
  estado: 'pendiente' | 'atendida';
  createdAt?: string;
}

// Precio de respaldo de la canasta si el servidor no responde
export const PRECIO_CANASTA_COP = 4000;

// Función para formatear precios en COP
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
