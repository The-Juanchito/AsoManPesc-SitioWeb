import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool, mapUser } from '../db.js';
import { auth, requireRole, bad } from '../middleware.js';

const router = Router();
router.use(auth, requireRole('admin')); // Solo el administrador gestiona usuarios

const ROLES = ['admin', 'asociado', 'cliente'];

function validar({ cedula, name, email, role, password }, { creando }) {
  if (creando || cedula !== undefined) {
    if (!/^\d{5,12}$/.test(String(cedula ?? ''))) return 'La cédula debe tener solo números (5 a 12 dígitos)';
  }
  if (creando || name !== undefined) {
    if (!String(name ?? '').trim()) return 'El nombre es obligatorio';
  }
  if (creando || email !== undefined) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? ''))) return 'El correo no es válido';
  }
  if (role !== undefined && !ROLES.includes(role)) return 'Rol no válido';
  if (creando && !role) return 'El rol es obligatorio';
  if ((creando || password) && String(password ?? '').length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
}

// Traduce el error de duplicado de MySQL a un mensaje claro
function errorDuplicado(err, res) {
  if (err.code === 'ER_DUP_ENTRY') {
    return bad(res, err.message.includes('cedula')
      ? 'Ya existe un usuario con esa cédula'
      : 'Ya existe un usuario con ese correo', 409);
  }
  throw err;
}

// GET /api/usuarios
router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
  res.json(rows.map(mapUser));
});

// POST /api/usuarios
router.post('/', async (req, res) => {
  const b = req.body || {};
  const error = validar(b, { creando: true });
  if (error) return bad(res, error);

  try {
    const hash = await bcrypt.hash(String(b.password), 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, cedula, email, password_hash, rol, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [String(b.name).trim(), String(b.cedula), String(b.email).trim(), hash, b.role, b.phone?.trim() || null]
    );
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [result.insertId]);
    res.status(201).json(mapUser(rows[0]));
  } catch (err) {
    errorDuplicado(err, res);
  }
});

// PUT /api/usuarios/:id  (solo cambia los campos que lleguen)
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const b = req.body || {};
  const error = validar(b, { creando: false });
  if (error) return bad(res, error);

  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  const actual = rows[0];
  if (!actual) return bad(res, 'Usuario no encontrado', 404);

  if (b.role && b.role !== actual.rol) {
    if (id === req.user.id) return bad(res, 'No puedes cambiar tu propio rol');
    if (actual.rol === 'admin') {
      const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'admin'");
      if (total <= 1) return bad(res, 'Debe existir al menos un administrador');
    }
  }

  const campos = [];
  const valores = [];
  const set = (columna, valor) => { campos.push(`${columna} = ?`); valores.push(valor); };
  if (b.name !== undefined) set('nombre', String(b.name).trim());
  if (b.cedula !== undefined) set('cedula', String(b.cedula));
  if (b.email !== undefined) set('email', String(b.email).trim());
  if (b.phone !== undefined) set('telefono', String(b.phone).trim() || null);
  if (b.role !== undefined) set('rol', b.role);
  if (b.password) set('password_hash', await bcrypt.hash(String(b.password), 10));
  if (!campos.length) return bad(res, 'No hay cambios para guardar');

  try {
    await pool.query(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, [...valores, id]);
    const [nuevo] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    res.json(mapUser(nuevo[0]));
  } catch (err) {
    errorDuplicado(err, res);
  }
});

// DELETE /api/usuarios/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) return bad(res, 'No puedes eliminarte a ti mismo');

  const [rows] = await pool.query('SELECT rol FROM usuarios WHERE id = ?', [id]);
  if (!rows[0]) return bad(res, 'Usuario no encontrado', 404);
  if (rows[0].rol === 'admin') {
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'admin'");
    if (total <= 1) return bad(res, 'No se puede eliminar al único administrador');
  }

  await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
  res.json({ ok: true });
});

export default router;
