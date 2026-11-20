import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
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
  let ok = user && (await bcrypt.compare(String(password), user.password_hash));
  // ¿Usó la contraseña temporal que se envió por correo? (vale 1 hora; al usarla pasa a ser su contraseña)
  if (!ok && user?.clave_temporal_hash && user.clave_temporal_expira && new Date(String(user.clave_temporal_expira).replace(' ', 'T') + 'Z') > new Date()) {
    if (await bcrypt.compare(String(password), user.clave_temporal_hash)) {
      await pool.query('UPDATE usuarios SET password_hash = clave_temporal_hash WHERE id = ?', [user.id]);
      ok = true;
    }
  }
  if (!ok) {
    recientes(clave).push(Date.now());
    return bad(res, 'Correo o contraseña incorrectos', 401);
  }
  fallos.delete(clave);

  await pool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?', [user.id]);
  res.json({ token: signToken(user), user: mapUser(user) });
});

// POST /api/auth/forgot-password  { email }
// Envía por correo una contraseña TEMPORAL (vale 1 hora). Tu contraseña actual sigue funcionando hasta que se use la temporal,
// así nadie puede dejarte fuera de tu cuenta solo escribiendo tu correo.
const pedidos = new Map(); // clave -> marcas de tiempo
router.post('/forgot-password', async (req, res) => {
  if (!process.env.BREVO_API_KEY || !process.env.MAIL_FROM) {
    return bad(res, 'El envío de correos no está configurado. Pídele al administrador que te restablezca la contraseña.', 503);
  }
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email) return bad(res, 'Escribe tu correo');

  const clave = `${req.ip}|${email}`;
  const ahora = Date.now();
  const lista = (pedidos.get(clave) || []).filter(t => ahora - t < 60 * 60 * 1000);
  if (lista.length >= 3) return bad(res, 'Ya pediste varias contraseñas temporales. Espera una hora e inténtalo de nuevo.', 429);
  lista.push(ahora);
  pedidos.set(clave, lista);

  const generico = { ok: true, mensaje: 'Si el correo está registrado, te enviamos una contraseña temporal. Revisa tu bandeja de entrada y el spam.' };
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ? AND activo = 1', [email]);
  const user = rows[0];
  if (!user) return res.json(generico); // no revelamos si el correo existe

  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const temporal = Array.from(crypto.randomBytes(10), b => alfabeto[b % alfabeto.length]).join('');
  await pool.query(
    'UPDATE usuarios SET clave_temporal_hash = ?, clave_temporal_expira = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR) WHERE id = ?',
    [bcrypt.hashSync(temporal, 10), user.id]
  );

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'AsoManPesc', email: process.env.MAIL_FROM },
        to: [{ email: user.email, name: user.nombre }],
        subject: 'Tu contraseña temporal de AsoManPesc',
        htmlContent: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#166534">🥭 AsoManPesc</h2>
          <p>Hola ${String(user.nombre).replace(/[<>&]/g, '')},</p>
          <p>Recibimos una solicitud para recuperar tu contraseña. Usa esta contraseña <b>temporal</b> para entrar (vale 1 hora):</p>
          <p style="font-size:24px;letter-spacing:2px;background:#f0fdf4;border:2px dashed #16a34a;padding:14px;text-align:center;font-family:monospace"><b>${temporal}</b></p>
          <p>Al entrar con ella, esa pasa a ser tu contraseña. Si quieres otra, pídele al administrador que te la cambie.</p>
          <p style="color:#6b7280;font-size:12px">Si no fuiste tú, ignora este correo: tu contraseña actual sigue funcionando.</p></div>`,
      }),
    });
    if (!r.ok) throw new Error(`Brevo respondió ${r.status}: ${(await r.text()).slice(0, 200)}`);
  } catch (e) {
    console.error('No se pudo enviar el correo de recuperación:', e.message);
    await pool.query('UPDATE usuarios SET clave_temporal_hash = NULL, clave_temporal_expira = NULL WHERE id = ?', [user.id]);
    return bad(res, 'No se pudo enviar el correo en este momento. Inténtalo más tarde o pídele al administrador que te restablezca la contraseña.', 502);
  }
  res.json(generico);
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
