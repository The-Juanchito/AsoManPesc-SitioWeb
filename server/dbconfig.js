// Datos de conexión a MySQL. Sirven tanto en tu computador (.env con DB_*)
// como en Railway (que entrega las variables MYSQLHOST, MYSQLUSER, etc.).
import 'dotenv/config';

const e = process.env;
export const DB_HOST = e.DB_HOST || e.MYSQLHOST || 'localhost';
export const DB_PORT = Number(e.DB_PORT || e.MYSQLPORT || 3306);
export const DB_USER = e.DB_USER || e.MYSQLUSER || 'root';
export const DB_PASSWORD = e.DB_PASSWORD ?? e.MYSQLPASSWORD ?? '';
export const DB_NAME = e.DB_NAME || e.MYSQLDATABASE || 'asomanpesc_db';
