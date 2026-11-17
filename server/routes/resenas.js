import { Router } from 'express';
import { pool, mapResena } from '../db.js';
import { auth, requireRole, bad } from '../middleware.js';

const router = Router();

// ---- Freno anti-spam sencillo: máximo 5 envíos por hora desde la misma dirección ----
const envios = new Map(); // ip -> [marcas de tiempo]
const VENTANA_MS = 60 * 60 * 1000;
const MAX_ENVIOS = 5;

function demasiadosEnvios(ip) {
  const ahora = Date.now();
  const recientes = (envios.get(ip) || []).filter(t => ahora - t < VENTANA_MS);
  if (recientes.length >= MAX_ENVIOS) {
    envios.set(ip, recientes);
    return true;
  }
  recientes.push(ahora);
  envios.set(ip, recientes);
  return false;
}

// POST /api/resenas  (público: no requiere iniciar sesión)
// { nombre, contacto?, tipo, calificacion?, mensaje, latitud?, longitud?, precisionM? }
router.post('/', async (req, res) => {
  const b = req.body || {};

  // Campo trampa: los robots lo llenan, las personas no lo ven. Se responde "ok" sin guardar.
  if (b.website) return res.status(201).json({ ok: true });

  const nombre = String(b.nombre ?? '').trim();
  const mensaje = String(b.mensaje ?? '').trim();
  const contacto = String(b.contacto ?? '').trim();
  const tipo = b.tipo === 'opinion' ? 'opinion' : 'resena';

  if (!nombre) return bad(res, 'Escribe tu nombre');
  if (nombre.length > 100) return bad(res, 'El nombre es demasiado largo');
  if (mensaje.length < 5) return bad(res, 'Cuéntanos un poco más (mínimo 5 caracteres)');
  if (mensaje.length > 1000) return bad(res, 'El mensaje es demasiado largo (máximo 1000 caracteres)');
  if (contacto.length > 150) return bad(res, 'El dato de contacto es demasiado largo');

  let calificacion = null;
  if (b.calificacion !== undefined && b.calificacion !== null && b.calificacion !== '') {
    calificacion = Number(b.calificacion);
    if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
      return bad(res, 'La calificación debe ser de 1 a 5 estrellas');
    }
  }

  let latitud = null, longitud = null, precisionM = null;
  if (b.latitud !== undefined && b.latitud !== null && b.longitud !== undefined && b.longitud !== null) {
    latitud = Number(b.latitud);
    longitud = Number(b.longitud);
    if (!(latitud >= -90 && latitud <= 90) || !(longitud >= -180 && longitud <= 180)) {
      return bad(res, 'La ubicación no es válida');
    }
    if (b.precisionM != null && Number.isFinite(Number(b.precisionM))) {
      precisionM = Math.min(Math.round(Number(b.precisionM)), 2_000_000);
    }
  }

  if (demasiadosEnvios(req.ip)) {
    return bad(res, 'Has enviado muchos mensajes seguidos. Intenta de nuevo más tarde.', 429);
  }

  await pool.query(
    `INSERT INTO resenas (nombre, contacto, tipo, calificacion, mensaje, latitud, longitud, precision_m)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, contacto || null, tipo, calificacion, mensaje, latitud, longitud, precisionM]
  );
  res.status(201).json({ ok: true });
});

// ---- Desde aquí solo el administrador ----

// GET /api/resenas
router.get('/', auth, requireRole('admin'), async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM resenas ORDER BY id DESC');
  res.json(rows.map(mapResena));
});

// PATCH /api/resenas/:id/leida  { leida }
router.patch('/:id/leida', auth, requireRole('admin'), async (req, res) => {
  const [result] = await pool.query('UPDATE resenas SET leida = ? WHERE id = ?', [
    req.body?.leida ? 1 : 0,
    Number(req.params.id),
  ]);
  if (!result.affectedRows) return bad(res, 'Reseña no encontrada', 404);
  res.json({ ok: true });
});

// DELETE /api/resenas/:id
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  const [result] = await pool.query('DELETE FROM resenas WHERE id = ?', [Number(req.params.id)]);
  if (!result.affectedRows) return bad(res, 'Reseña no encontrada', 404);
  res.json({ ok: true });
});

export default router;
