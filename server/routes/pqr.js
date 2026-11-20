import { Router } from 'express';
import { pool, mapPqr } from '../db.js';
import { auth, requireRole, bad } from '../middleware.js';

const router = Router();
router.use(auth);

const TIPOS = ['sugerencia', 'queja', 'reclamo', 'peticion'];

// GET /api/pqr  -> admin: todas | asociado y cliente: solo las suyas
router.get('/', async (req, res) => {
  const [rows] = req.user.role === 'admin'
    ? await pool.query('SELECT * FROM pqr ORDER BY id DESC')
    : await pool.query('SELECT * FROM pqr WHERE usuario_id = ? ORDER BY id DESC', [req.user.id]);
  res.json(rows.map(mapPqr));
});

// POST /api/pqr  { tipo, nombre, fecha, descripcion, firma }  (asociado o cliente)
router.post('/', async (req, res) => {
  const b = req.body || {};
  const nombre = String(b.nombre ?? '').trim();
  const descripcion = String(b.descripcion ?? '').trim();
  const firma = String(b.firma ?? '').trim();
  const fecha = String(b.fecha ?? '').slice(0, 10);

  if (!TIPOS.includes(b.tipo)) return bad(res, 'Elige el tipo de solicitud');
  if (!nombre || nombre.length > 100) return bad(res, 'Escribe el nombre (máximo 100 caracteres)');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || isNaN(new Date(fecha).getTime())) return bad(res, 'La fecha no es válida');
  if (descripcion.length < 10) return bad(res, 'Describe tu solicitud (mínimo 10 caracteres)');
  if (descripcion.length > 1500) return bad(res, 'La descripción es demasiado larga (máximo 1500 caracteres)');
  if (!firma || firma.length > 100) return bad(res, 'Escribe tu nombre como firma');

  const [result] = await pool.query(
    'INSERT INTO pqr (usuario_id, tipo, nombre, fecha, descripcion, firma) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, b.tipo, nombre, fecha, descripcion, firma]
  );
  const [rows] = await pool.query('SELECT * FROM pqr WHERE id = ?', [result.insertId]);
  res.status(201).json(mapPqr(rows[0]));
});

// PATCH /api/pqr/:id/estado  { estado }  (solo admin)
router.patch('/:id/estado', requireRole('admin'), async (req, res) => {
  const { estado } = req.body || {};
  if (!['pendiente', 'atendida'].includes(estado)) return bad(res, 'Estado no válido');
  const [r] = await pool.query('UPDATE pqr SET estado = ? WHERE id = ?', [estado, Number(req.params.id)]);
  if (!r.affectedRows) return res.status(404).json({ error: 'No encontrada' });
  res.json({ ok: true });
});

export default router;
