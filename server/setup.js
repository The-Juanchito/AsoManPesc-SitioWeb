// Crea la base de datos y las tablas (schema.sql) y carga los datos de ejemplo.
// Uso:  npm run setup
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const dbName = process.env.DB_NAME || 'asomanpesc_db';

let conn;
try {
  conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
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
console.log('✅ Tablas listas');

// 2) Datos de ejemplo (solo si no hay usuarios todavía)
const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM usuarios');
if (total === 0) {
  const hash = (p) => bcrypt.hashSync(p, 10);
  await conn.query(
    `INSERT INTO usuarios (id, nombre, cedula, email, password_hash, rol, telefono, fecha_registro) VALUES ?`,
    [[
      [1, 'Admin Principal', '1000000001', 'admin@asomanpesc.com', hash('admin123'), 'admin', '+57 3242030867', '2024-01-01'],
      [2, 'José Martínez', '1000000002', 'jose@asomanpesc.com', hash('asociado123'), 'asociado', null, '2024-01-05'],
      [3, 'María López', '1000000003', 'maria@asomanpesc.com', hash('asociado123'), 'asociado', null, '2024-01-05'],
      [4, 'Carlos Rodríguez', '1000000004', 'carlos@cliente.com', hash('cliente123'), 'cliente', null, '2024-01-10'],
      [5, 'Ana García', '1000000005', 'ana@cliente.com', hash('cliente123'), 'cliente', null, '2024-01-10'],
    ]]
  );
  await conn.query(
    `INSERT INTO canastas (fecha, productor_id, productor_nombre, cantidad, tipo_mango, precio_unitario, estado) VALUES ?`,
    [[
      ['2024-01-15', 2, 'José Martínez', 25, 'Tommy Atkins', 4000, 'entregada'],
      ['2024-01-15', 3, 'María López', 18, 'Ataulfo', 4000, 'entregada'],
      ['2024-01-16', 2, 'José Martínez', 30, 'Kent', 4000, 'entregada'],
      ['2024-01-16', 2, 'José Martínez', 22, 'Haden', 4000, 'recogida'],
      ['2024-01-17', 3, 'María López', 15, 'Manila', 4000, 'pendiente'],
      ['2024-01-17', 2, 'José Martínez', 28, 'Tommy Atkins', 4000, 'recogida'],
      ['2024-01-18', 3, 'María López', 20, 'Keitt', 4000, 'pendiente'],
      ['2024-01-18', 3, 'María López', 35, 'Ataulfo', 4000, 'recogida'],
    ]]
  );
  await conn.query(
    `INSERT INTO registros_produccion (asociado_id, asociado_nombre, fecha, producto, cantidad_cajas, cantidad_canastas, notas) VALUES ?`,
    [[
      [2, 'José Martínez', '2024-01-15', 'Tommy Atkins', 50, 25, 'Cosecha excelente'],
      [3, 'María López', '2024-01-15', 'Ataulfo', 36, 18, 'Fruta madura lista'],
      [2, 'José Martínez', '2024-01-16', 'Kent', 60, 30, 'Gran producción'],
    ]]
  );
  await conn.query(
    `INSERT INTO pedidos (cliente_id, cliente_nombre, producto, cantidad, precio_total, notas, estado) VALUES ?`,
    [[
      [4, 'Carlos Rodríguez', 'Mango Ataulfo', 10, 40000, 'Para mi restaurante', 'confirmado'],
      [5, 'Ana García', 'Mango Tommy Atkins', 5, 20000, '', 'pendiente'],
    ]]
  );
  console.log('✅ Datos de ejemplo cargados (5 usuarios, canastas, registros y pedidos)');
} else {
  console.log('ℹ️  La base ya tiene usuarios; no se cargaron datos de ejemplo');
}

await conn.end();
console.log('\n🥭 Listo. Ahora ejecuta:  npm start\n');
