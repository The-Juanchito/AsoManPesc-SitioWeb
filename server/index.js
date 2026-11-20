import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool, getPrecioCanasta } from './db.js';
import { auth, requireRole } from './middleware.js';
import authRoutes from './routes/auth.js';
import usuariosRoutes from './routes/usuarios.js';
import canastasRoutes from './routes/canastas.js';
import registrosRoutes from './routes/registros.js';
import pedidosRoutes from './routes/pedidos.js';
import resenasRoutes from './routes/resenas.js';
import pqrRoutes from './routes/pqr.js';
import { DB_HOST, DB_NAME, DB_PORT, DB_USER } from './dbconfig.js';

if (!process.env.JWT_SECRET) {
  console.error('\n❌ Falta JWT_SECRET. Copia ".env.example" como ".env" y complétalo.\n');
  process.exit(1);
}

const app = express();
// CORS_ORIGIN admite varias direcciones separadas por coma (p. ej. Netlify y localhost)
const origenes = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim().replace(/\/$/, '')).filter(Boolean);
app.use(cors({ origin: origenes }));
app.use(express.json());

// Comprueba que el servidor y MySQL responden
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      ok: true,
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
    });
  } catch (err) {
    res.status(503).json({ ok: false, error: err.code || err.message });
  }
});

// Estado de la base de datos y cantidad de filas por tabla (solo admin)
app.get('/api/estado', auth, requireRole('admin'), async (_req, res) => {
  const tablas = ['usuarios', 'canastas', 'registros_produccion', 'pedidos', 'resenas', 'pqr', 'precios'];
  const filas = {};
  for (const t of tablas) {
    const [[r]] = await pool.query(`SELECT COUNT(*) AS n FROM ${t}`);
    filas[t] = r.n;
  }
  res.json({
    ok: true,
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    database: DB_NAME,
    tablas: filas,
  });
});

app.get('/api/precio', auth, async (_req, res) => {
  res.json({ precio: await getPrecioCanasta() });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/canastas', canastasRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/pqr', pqrRoutes);

app.use('/api', (_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Cualquier error inesperado llega aquí (no se muestran detalles internos al usuario)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, async () => {
  console.log(`\n🥭 API de AsoManPesc escuchando en http://localhost:${port}`);
  try {
    await pool.query('SELECT 1');
    console.log(`✅ Conectado a MySQL (${DB_NAME})\n`);
  } catch (err) {
    console.error(`❌ No se pudo conectar a MySQL: ${err.code || err.message}`);
    console.error('   Revisa DB_USER / DB_PASSWORD en .env y que MySQL esté encendido.\n');
  }
});
