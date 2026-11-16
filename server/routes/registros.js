import { Router } from 'express';
import { pool, mapRegistro } from '../db.js';
import { auth, requireRole, bad } from '../middleware.js';

const router = Router();
router.use(auth);

// GET /api/registros  -> admin: todos | asociado: solo los suyos | cliente: ninguno
router.get('/', async (req, res) => {
  if (req.user.role === 'cliente') return res.json([]);
  const [rows] = req.user.role === 'admin'
    ? await pool.query('SELECT * FROM registros_produccion ORDER BY id DESC')
    : await pool.query('SELECT * FROM registros_produccion WHERE asociado_id = ? ORDER BY id DESC', [req.user.id]);
  res.json(rows.map(mapRegistro));
});

// POST /api/registros  { producto, cantidadCajas, cantidadCanastas, notas?, fecha? }
router.post('/', requireRole('admin', 'asociado'), async (req, res) => {
  const { producto, cantidadCajas, cantidadCanastas, notas, fecha } = req.body || {};
  const cajas = Number(cantidadCajas);
  const canastas = Number(cantidadCanastas);
  if (!String(producto ?? '').trim()) return bad(res, 'Elige el producto');
  if (!Number.isInteger(cajas) || cajas < 0 || !Number.isInteger(canastas) || canastas < 0) {
    return bad(res, 'Las cantidades deben ser números enteros');
  }

  const dia = /^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '') ? fecha : new Date().toISOString().slice(0, 10);
  const [result] = await pool.query(
    `INSERT INTO registros_produccion (asociado_id, asociado_nombre, fecha, producto, cantidad_cajas, cantidad_canastas, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, req.user.name, dia, String(producto).trim(), cajas, canastas, String(notas ?? '')]
  );
  const [rows] = await pool.query('SELECT * FROM registros_produccion WHERE id = ?', [result.insertId]);
  res.status(201).json(mapRegistro(rows[0]));
});

export default router;
