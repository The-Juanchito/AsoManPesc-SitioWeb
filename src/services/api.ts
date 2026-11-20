// ============================================
// Cliente de la API de AsoManPesc (Express + MySQL)
// Todas las pantallas hablan con el servidor a través de este archivo.
// ============================================
import type { DBUser, DBCanasta, DBRegistro, DBPedido, DBResena, DBPqr } from './database';

// En desarrollo Vite redirige /api -> http://localhost:4000 (ver vite.config.js).
// Al publicar, define VITE_API_URL con la dirección del servidor.
const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

// La sesión vive solo en memoria: al recargar la página hay que volver a entrar.
let token: string | null = null;
export const setToken = (t: string | null) => { token = t; };

async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. ¿Está encendido? (en la carpeta server: npm start)');
  }

  let data: any = null;
  try { data = await res.json(); } catch { /* respuesta sin cuerpo */ }

  if (!res.ok) {
    throw new ApiError(data?.error ?? `Error del servidor (${res.status})`, res.status);
  }
  return data as T;
}

export interface EstadoBD {
  ok: boolean;
  host: string;
  port: number;
  user: string;
  database: string;
  tablas: Record<string, number>;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: Omit<DBUser, 'password'> }>('/auth/login', 'POST', { email, password }),

  getPrecio: () => request<{ precio: number }>('/precio').then(r => r.precio),
  getEstadoBD: () => request<EstadoBD>('/estado'),

  getUsuarios: () => request<DBUser[]>('/usuarios'),
  addUsuario: (u: Partial<DBUser>) => request<DBUser>('/usuarios', 'POST', u),
  updateUsuario: (id: string, changes: Partial<DBUser>) => request<DBUser>(`/usuarios/${id}`, 'PUT', changes),
  deleteUsuario: (id: string) => request<{ ok: true }>(`/usuarios/${id}`, 'DELETE'),

  getCanastas: () => request<DBCanasta[]>('/canastas'),
  addCanasta: (c: Partial<DBCanasta>) => request<DBCanasta>('/canastas', 'POST', c),
  updateCanastaEstado: (id: string, estado: DBCanasta['estado']) =>
    request<{ ok: true }>(`/canastas/${id}/estado`, 'PATCH', { estado }),

  getRegistros: () => request<DBRegistro[]>('/registros'),
  addRegistro: (r: Partial<DBRegistro>) => request<DBRegistro>('/registros', 'POST', r),

  // Reseñas: enviar es público (formulario de contacto); verlas y gestionarlas es solo del admin
  enviarResena: (r: {
    nombre: string; contacto?: string; telefono?: string; tipo: 'resena' | 'opinion'; calificacion?: number | null;
    mensaje: string; latitud?: number; longitud?: number; precisionM?: number; website?: string;
  }) => request<{ ok: true }>('/resenas', 'POST', r),
  getResenas: () => request<DBResena[]>('/resenas'),
  marcarResenaLeida: (id: string, leida: boolean) =>
    request<{ ok: true }>(`/resenas/${id}/leida`, 'PATCH', { leida }),
  deleteResena: (id: string) => request<{ ok: true }>(`/resenas/${id}`, 'DELETE'),

  // PQR: asociados y clientes las envían; el admin las ve todas y cambia su estado
  getPqr: () => request<DBPqr[]>('/pqr'),
  addPqr: (p: Pick<DBPqr, 'tipo' | 'nombre' | 'fecha' | 'descripcion' | 'firma'>) => request<DBPqr>('/pqr', 'POST', p),
  updatePqrEstado: (id: string, estado: DBPqr['estado']) =>
    request<{ ok: true }>(`/pqr/${id}/estado`, 'PATCH', { estado }),

  getPedidos: () => request<DBPedido[]>('/pedidos'),
  addPedido: (p: Partial<DBPedido>) => request<DBPedido>('/pedidos', 'POST', p),
  updatePedidoEstado: (id: string, estado: DBPedido['estado']) =>
    request<{ ok: true }>(`/pedidos/${id}/estado`, 'PATCH', { estado }),
};
