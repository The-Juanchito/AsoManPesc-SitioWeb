import { Router } from 'express';
import { pool, mapPedido, getPrecioCanasta } from '../db.js';
import { auth, requireRole, bad } from '../middleware.js';

const router = Router();
router.use(auth);

const ESTADOS = ['pendiente', 'confirmado', 'entregado'];

// GET /api/pedidos  -> admin: todos | cliente: solo los suyos | asociado: ninguno
router.get('/', async (req, res) => {
  if (req.user.role === 'asociado') return res.json([]);
  const [rows] = req.user.role === 'admin'
    ? await pool.query('SELECT * FROM pedidos ORDER BY id DESC')
    : await pool.query('SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY id DESC', [req.user.id]);
  res.json(rows.map(mapPedido));
});

// POST /api/pedidos  { producto, cantidad, notas? }
// El precio total lo calcula el servidor con el precio vigente.
router.post('/', requireRole('cliente'), async (req, res) => {
  const { producto, cantidad, notas } = req.body || {};
  const cant = Number(cantidad);
  if (!String(producto ?? '').trim()) return bad(res, 'Elige el producto');
  if (!(cant > 0)) return bad(res, 'La cantidad debe ser mayor a 0');

  const precio = await getPrecioCanasta();
  const [result] = await pool.query(
    `INSERT INTO pedidos (cliente_id, cliente_nombre, producto, cantidad, precio_total, notas)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, req.user.name, String(producto).trim(), cant, cant * precio, String(notas ?? '')]
  );
  const [rows] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [result.insertId]);
  res.status(201).json(mapPedido(rows[0]));
});

// PATCH /api/pedidos/:id/estado  { estado }  (solo admin)
router.patch('/:id/estado', requireRole('admin'), async (req, res) => {
  const { estado } = req.body || {};
  if (!ESTADOS.includes(estado)) return bad(res, 'Estado no válido');
  const [result] = await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, Number(req.params.id)]);
  if (!result.affectedRows) return bad(res, 'Pedido no encontrado', 404);
  res.json({ ok: true });
});

export default router;
