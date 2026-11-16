import jwt from 'jsonwebtoken';
import { pool } from './db.js';

export const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '8h' });
}

// Exige haber iniciado sesión. Vuelve a leer el usuario en la base de datos,
// así un cambio de rol o un usuario eliminado se nota de inmediato.
export async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Debes iniciar sesión' });

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Tu sesión venció, inicia sesión de nuevo' });
  }

  const [rows] = await pool.query(
    'SELECT id, nombre, rol FROM usuarios WHERE id = ? AND activo = 1',
    [payload.id]
  );
  if (!rows[0]) return res.status(401).json({ error: 'Usuario no válido' });

  req.user = { id: rows[0].id, name: rows[0].nombre, role: rows[0].rol };
  next();
}

// Limita una ruta a ciertos roles: requireRole('admin', 'asociado')
export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ error: 'No tienes permiso para hacer esto' });

// Respuesta de error con mensaje claro
export const bad = (res, message, status = 400) => res.status(status).json({ error: message });
