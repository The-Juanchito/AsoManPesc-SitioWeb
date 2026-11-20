// Crea la base de datos y las tablas (schema.sql) y crea el administrador predeterminado (datos en .env).
// Uso:  npm run setup
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './dbconfig.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const dbName = DB_NAME;

let conn;
try {
  conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
    charset: 'utf8mb4',
  });
} catch (err) {
  console.error(`\n❌ No se pudo conectar a MySQL: ${err.code || err.message}`);
  console.error('   Revisa DB_HOST, DB_USER y DB_PASSWORD en el archivo .env\n');
  process.exit(1);
}

// 1) Tablas
let schema = fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8');
schema = schema.replaceAll('asomanpesc_db', dbName); // por si usas otro nombre de base
await conn.query(schema);
await conn.changeUser({ database: dbName });
// Migración: bases creadas antes de existir la columna telefono en resenas
const [[{ tieneTelefono }]] = await conn.query(
  "SELECT COUNT(*) AS tieneTelefono FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'resenas' AND COLUMN_NAME = 'telefono'",
  [dbName]
);
if (!tieneTelefono) {
  await conn.query('ALTER TABLE resenas ADD COLUMN telefono VARCHAR(20) NULL AFTER contacto');
  console.log('✅ Columna resenas.telefono agregada');
}
console.log('✅ Tablas listas');

// 2) Administrador predeterminado (real, guardado en MySQL; NO es una cuenta demo)
//    Sus datos salen de server/.env. Solo se crea si todavía no existe ningún administrador.
const [[{ admins }]] = await conn.query("SELECT COUNT(*) AS admins FROM usuarios WHERE rol = 'admin'");
if (admins === 0) {
  const nombre = process.env.ADMIN_NAME || 'Administrador AsoManPesc';
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const cedula = (process.env.ADMIN_CEDULA || '').trim();
  let password = process.env.ADMIN_PASSWORD || '';
  if (!email || !cedula) {
    console.error('\n❌ Falta ADMIN_EMAIL o ADMIN_CEDULA en el archivo .env (mira .env.example).\n');
    await conn.end();
    process.exit(1);
  }
  let generada = false;
  if (!password) {
    password = crypto.randomBytes(9).toString('base64url'); // 12 caracteres aleatorios
    generada = true;
  }
  if (password.length < 6) {
    console.error('\n❌ ADMIN_PASSWORD debe tener al menos 6 caracteres.\n');
    await conn.end();
    process.exit(1);
  }
  await conn.query(
    `INSERT INTO usuarios (nombre, cedula, email, password_hash, rol, telefono, fecha_registro) VALUES (?, ?, ?, ?, 'admin', ?, CURDATE())`,
    [nombre, cedula, email, bcrypt.hashSync(password, 10), process.env.ADMIN_PHONE || null]
  );
  console.log(`✅ Administrador creado: ${email}`);
  if (generada) {
    console.log(`   Contraseña generada (anótala, no se vuelve a mostrar): ${password}`);
  }
} else {
  console.log('ℹ️  Ya existe un administrador; no se creó otro');
  // Cambio de contraseña del admin: pon ADMIN_RESET_PASSWORD=1 junto con ADMIN_PASSWORD, despliega y luego quita la variable.
  if (process.env.ADMIN_RESET_PASSWORD === '1') {
    const nueva = process.env.ADMIN_PASSWORD || '';
    const correo = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (nueva.length < 6 || !correo) {
      console.error('❌ Para cambiar la contraseña define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 6 caracteres).');
    } else {
      const [r] = await conn.query("UPDATE usuarios SET password_hash = ? WHERE email = ? AND rol = 'admin'", [bcrypt.hashSync(nueva, 10), correo]);
      console.log(r.affectedRows ? `✅ Contraseña del administrador ${correo} actualizada` : `⚠️  No hay un administrador con el correo ${correo}`);
    }
  }
}

await conn.end();
console.log('\n🥭 Listo. Ahora ejecuta:  npm start\n');
