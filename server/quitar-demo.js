// Borra las cuentas y datos de DEMOSTRACIÓN de una base que ya se había cargado con la versión anterior.
// Antes crea el administrador real (ADMIN_* del .env) si hace falta. Uso:  npm run quitar-demo
import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './dbconfig.js';

const DEMO = ['admin@asomanpesc.com', 'jose@asomanpesc.com', 'maria@asomanpesc.com', 'carlos@cliente.com', 'ana@cliente.com'];
const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const cedula = (process.env.ADMIN_CEDULA || '').trim();
const password = process.env.ADMIN_PASSWORD || '';

if (!email || !cedula || password.length < 6 || DEMO.includes(email)) {
  console.error('\n❌ Define en .env un ADMIN_EMAIL (que no sea de demo), ADMIN_CEDULA y ADMIN_PASSWORD (mín. 6 caracteres) antes de quitar la demo.\n');
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  charset: 'utf8mb4',
});

// 1) Administrador real (si ya existe ese correo, se actualiza su contraseña y rol)
const [ex] = await conn.query('SELECT id FROM usuarios WHERE email = ?', [email]);
const hash = bcrypt.hashSync(password, 10);
if (ex.length) {
  await conn.query("UPDATE usuarios SET rol='admin', activo=1, password_hash=? WHERE id=?", [hash, ex[0].id]);
} else {
  await conn.query(
    `INSERT INTO usuarios (nombre, cedula, email, password_hash, rol, telefono, fecha_registro) VALUES (?, ?, ?, ?, 'admin', ?, CURDATE())`,
    [process.env.ADMIN_NAME || 'Administrador AsoManPesc', cedula, email, hash, process.env.ADMIN_PHONE || null]
  );
}

// 2) Datos de las cuentas demo y las cuentas mismas
const [demo] = await conn.query('SELECT id FROM usuarios WHERE email IN (?)', [DEMO]);
const ids = demo.map(d => d.id);
if (ids.length) {
  await conn.query('DELETE FROM canastas WHERE productor_id IN (?)', [ids]);
  await conn.query('DELETE FROM registros_produccion WHERE asociado_id IN (?)', [ids]);
  await conn.query('DELETE FROM pedidos WHERE cliente_id IN (?)', [ids]);
  await conn.query('DELETE FROM usuarios WHERE id IN (?)', [ids]);
}
console.log(`✅ Administrador listo: ${email}`);
console.log(`✅ Cuentas demo eliminadas: ${ids.length}`);
await conn.end();
