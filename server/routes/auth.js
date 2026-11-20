import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool, mapUser } from '../db.js';
import { signToken, bad } from '../middleware.js';

const router = Router();

// Freno contra adivinar contraseñas: máximo 8 intentos fallidos cada 15 minutos por persona (IP + correo)
const fallos = new Map(); // clave -> [marcas de tiempo]
const VENTANA_MS = 15 * 60 * 1000;
const MAX_FALLOS = 8;
const recientes = (clave) => {
  const ahora = Date.now();
  const lista = (fallos.get(clave) || []).filter(t => ahora - t < VENTANA_MS);
  fallos.set(clave, lista);
  return lista;
};

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return bad(res, 'Escribe tu correo y contraseña');

  const clave = `${req.ip}|${String(email).trim().toLowerCase()}`;
  if (recientes(clave).length >= MAX_FALLOS) {
    return bad(res, 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.', 429);
  }

  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [
    String(email).trim(),
  ]);
  const user = rows[0];
  const ok = user && (await bcrypt.compare(String(password), user.password_hash));
  if (!ok) {
    recientes(clave).push(Date.now());
    return bad(res, 'Correo o contraseña incorrectos', 401);
  }
  fallos.delete(clave);

  await pool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [user.id]);
  res.json({ token: signToken(user), user: mapUser(user) });
});

// GET /api/auth/google-config -> { clientId } (null si el acceso con Google no está activado)
router.get('/google-config', (_req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID || null });
});

// POST /api/auth/google  { credential }  (token que entrega el botón "Continuar con Google")
// Solo entra quien YA tiene cuenta creada por el administrador con ese mismo correo.
router.post('/google', async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return bad(res, 'El acceso con Google no está activado', 503);
  const { credential } = req.body || {};
  if (!credential) return bad(res, 'Falta la credencial de Google');

  let info;
  try {
    const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(String(credential)));
    if (!r.ok) return bad(res, 'No se pudo validar tu cuenta de Google', 401);
    info = await r.json();
  } catch {
    return bad(res, 'No se pudo comunicar con Google. Intenta de nuevo.', 502);
  }
  if (info.aud !== clientId || !['true', true].includes(info.email_verified) || !info.email) {
    return bad(res, 'No se pudo validar tu cuenta de Google', 401);
  }

  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [String(info.email).toLowerCase()]);
  const user = rows[0];
  if (!user) {
    return bad(res, `El correo ${info.email} no está registrado. Pídele al administrador que cree tu cuenta con ese correo.`, 403);
  }
  await pool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [user.id]);
  res.json({ token: signToken(user), user: mapUser(user) });
});

export default router;
