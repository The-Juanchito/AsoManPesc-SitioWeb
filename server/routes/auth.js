import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool, mapUser } from '../db.js';
import { signToken, bad } from '../middleware.js';

const router = Router();

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return bad(res, 'Escribe tu correo y contraseña');

  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [
    String(email).trim(),
  ]);
  const user = rows[0];
  const ok = user && (await bcrypt.compare(String(password), user.password_hash));
  if (!ok) return bad(res, 'Correo o contraseña incorrectos', 401);

  await pool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [user.id]);
  res.json({ token: signToken(user), user: mapUser(user) });
});

export default router;
