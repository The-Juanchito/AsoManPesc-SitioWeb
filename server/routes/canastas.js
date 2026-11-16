import { Router } from 'express';
import { pool, mapCanasta, getPrecioCanasta } from '../db.js';
import { auth, requireRole, bad } from '../middleware.js';

const router = Router();
router.use(auth);

const ESTADOS = ['pendiente', 'recogida', 'entregada'];

// GET /api/canastas  -> admin: todas | asociado: solo las suyas | cliente: ninguna
router.get('/', async (req, res) => {
  if (req.user.role === 'cliente') return res.json([]);
  const [rows] = req.user.role === 'admin'
    ? await pool.query('SELECT * FROM canastas ORDER BY id DESC')
    : await pool.query('SELECT * FROM canastas WHERE productor_id = ? ORDER BY id DESC', [req.user.id]);
  res.json(rows.map(mapCanasta));
});

// POST /api/canastas  { tipo, cantidad, estado?, fecha?, productorId? (solo admin) }
router.post('/', requireRole('admin', 'asociado'), async (req, res) => {
  const { tipo, cantidad, estado = 'pendiente', fecha, productorId } = req.body || {};
  const cant = Number(cantidad);
  if (!String(tipo ?? '').trim()) return bad(res, 'Elige el tipo de mango');
  if (!Number.isInteger(cant) || cant <= 0) return bad(res, 'La cantidad debe ser un número entero mayor a 0');
  if (!ESTADOS.includes(estado)) return bad(res, 'Estado no válido');

  // Un asociado siempre registra a su nombre; el admin puede elegir productor
  const idProductor = req.user.role === 'admin' && productorId ? Number(productorId) : req.user.id;
  const [prod] = await pool.query('SELECT id, nombre FROM usuarios WHERE id = ?', [idProductor]);
  if (!prod[0]) return bad(res, 'Productor no encontrado', 404);

  const dia = /^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '') ? fecha : new Date().toISOString().slice(0, 10);
  const precio = await getPrecioCanasta();

  const [result] = await pool.query(
    `INSERT INTO canastas (fecha, productor_id, productor_nombre, cantidad, tipo_mango, precio_unitario, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [dia, prod[0].id, prod[0].nombre, cant, String(tipo).trim(), precio, estado]
  );
  const [rows] = await pool.query('SELECT * FROM canastas WHERE id = ?', [result.insertId]);
  res.status(201).json(mapCanasta(rows[0]));
});

// PATCH /api/canastas/:id/estado  { estado }  (solo admin)
router.patch('/:id/estado', requireRole('admin'), async (req, res) => {
  const { estado } = req.body || {};
  if (!ESTADOS.includes(estado)) return bad(res, 'Estado no válido');
  const [result] = await pool.query('UPDATE canastas SET estado = ? WHERE id = ?', [estado, Number(req.params.id)]);
  if (!result.affectedRows) return bad(res, 'Canasta no encontrada', 404);
  res.json({ ok: true });
});

export default router;
