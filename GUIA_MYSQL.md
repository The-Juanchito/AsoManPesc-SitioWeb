# Guía: conectar AsoManPesc con MySQL (paso a paso)

## 0. Cómo encaja todo (la analogía del restaurante)

| En el restaurante | En AsoManPesc | Dónde está |
|---|---|---|
| El **cliente** que pide | La **página web** (React) | carpeta `src/` |
| El **mesero** que lleva pedidos a la cocina | El **servidor / API** (Express) | carpeta `server/` |
| La **despensa** donde se guarda todo | **MySQL** | tu computador (MySQL Server) |

```
Navegador (React)  ──►  API Express (puerto 4000)  ──►  MySQL (puerto 3306)
 localhost:3000          valida y protege                guarda los datos
```

La página **nunca** habla directo con MySQL: si lo hiciera, la contraseña de la base de datos quedaría visible para cualquiera que abra la página. El mesero (API) es quien tiene la llave de la despensa.

---

## 1. Instalar MySQL Community

1. Entra a **dev.mysql.com/downloads/installer** y descarga **MySQL Installer for Windows** (el archivo grande, ~400 MB, sirve sin internet).
2. Ábrelo y elige **Developer Default** (instala MySQL Server + MySQL Workbench). Si prefieres algo liviano: **Custom** y marca solo *MySQL Server* y *MySQL Workbench*.
3. Sigue con **Next**. En la pantalla **Accounts and Roles** escribe una contraseña para el usuario **root** y **anótala**. Es la llave maestra.
4. Deja el puerto **3306** y marcado *Start the MySQL Server at System Startup*.
5. Termina con **Execute → Finish**.

**Comprobar que funciona:** abre **MySQL Workbench**, haz clic en la conexión *Local instance MySQL80* y escribe la contraseña de root. Si abre un editor, MySQL está listo.

---

## 2. Crear la base de datos y un usuario propio (en Workbench)

> Analogía: `root` es el dueño del restaurante con todas las llaves. Para el día a día creamos un **empleado** (`asomanpesc_admin`) que solo puede entrar a la despensa de AsoManPesc.

1. En Workbench, con la conexión abierta, haz clic en **File → New Query Tab** (o el icono de hoja con "SQL").
2. Pega esto, **cambiando la contraseña** `TuContraseñaSegura123`:

```sql
CREATE DATABASE IF NOT EXISTS asomanpesc_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'asomanpesc_admin'@'localhost' IDENTIFIED BY 'TuContraseñaSegura123';

GRANT ALL PRIVILEGES ON asomanpesc_db.* TO 'asomanpesc_admin'@'localhost';

FLUSH PRIVILEGES;
```

3. Pulsa el **rayo ⚡** (o `Ctrl + Enter` por línea; `Ctrl + Shift + Enter` ejecuta todo). Abajo debe aparecer *Action Output* en verde.

| Línea | Qué hace |
|---|---|
| `CREATE DATABASE` | Crea la "despensa" vacía |
| `CREATE USER` | Crea al empleado con su contraseña |
| `GRANT ... ON asomanpesc_db.*` | Le da permiso **solo** sobre esa base |
| `FLUSH PRIVILEGES` | Aplica los cambios |

---

## 3. Configurar y encender el servidor (carpeta `server/`)

Abre la terminal de VS Code y entra a la carpeta del servidor:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Abre el archivo **`server/.env`** y completa:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=asomanpesc_admin
DB_PASSWORD=TuContraseñaSegura123      # la del paso 2
DB_NAME=asomanpesc_db
PORT=4000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=escribe-aqui-una-frase-larga-y-secreta-que-nadie-conozca

# Administrador predeterminado (cuenta REAL que se guarda en MySQL)
ADMIN_NAME=Tu Nombre
ADMIN_EMAIL=tucorreo@gmail.com
ADMIN_CEDULA=1234567890
ADMIN_PASSWORD=una-contraseña-de-mínimo-8-caracteres
```

Luego crea las tablas y el **administrador predeterminado** con los datos de `ADMIN_*` (solo se hace una vez; si lo repites no duplica nada). Si dejas `ADMIN_PASSWORD` vacío, se genera una al azar y se muestra **una sola vez** en la terminal:

```powershell
npm run setup
```

Debe mostrar `✅ Tablas listas` y `✅ Administrador creado`. Después enciende el servidor:

```powershell
npm start
```

Debe decir `✅ Conectado a MySQL (asomanpesc_db)`. **Deja esta terminal abierta.**

---

## 4. Encender la página

Abre **otra terminal** en VS Code (el botón **+**), ve a la carpeta principal del proyecto y ejecuta:

```powershell
npm install        # solo la primera vez
npm run dev
```

Abre **http://localhost:3000**, pulsa *Iniciar Sesión* y entra con el correo y la contraseña de `ADMIN_*`. El administrador aterriza en **Inicio · Accesos Rápidos** y desde ahí llega a todo el panel. Los asociados y clientes los crea el administrador en **Usuarios → Nuevo usuario** (cada uno con su propio correo y contraseña). No hay cuentas de demostración.

> **¿Ya habías corrido la versión anterior (con datos de ejemplo)?** Pon tus `ADMIN_*` en `.env` y ejecuta una vez `npm run quitar-demo` dentro de `server/`: crea tu administrador real y borra las cuentas y datos de ejemplo.

En el panel de admin, la pantalla **Base de Datos** debe mostrar **Conectado** y el número real de filas de cada tabla.

> Siempre se necesitan **dos terminales abiertas**: una con `npm start` (en `server/`) y otra con `npm run dev` (en la raíz).

---

## 5. Ver y practicar con tus datos en Workbench

Abre una pestaña de consulta nueva y prueba (pulsa ⚡ después de cada una):

```sql
USE asomanpesc_db;

SELECT * FROM usuarios;                                  -- todos los usuarios
SELECT nombre, cedula, rol FROM usuarios WHERE rol = 'asociado';
SELECT * FROM canastas ORDER BY fecha DESC;              -- canastas más recientes
SELECT estado, SUM(cantidad) AS total FROM canastas GROUP BY estado;   -- resumen
SELECT p.producto, p.cantidad, u.nombre
  FROM pedidos p JOIN usuarios u ON u.id = p.cliente_id; -- pedidos con el nombre del cliente
```

Crea un usuario desde la página (Admin → Usuarios → Nuevo usuario) y vuelve a ejecutar `SELECT * FROM usuarios;`: aparece ahí. Así confirmas que todo se guarda de verdad.

| Instrucción | Para qué sirve | Ejemplo |
|---|---|---|
| `SELECT` | Leer datos | `SELECT * FROM pedidos;` |
| `INSERT` | Agregar una fila | `INSERT INTO precios (producto, precio_cop) VALUES ('Mango extra', 5000);` |
| `UPDATE` | Cambiar filas | `UPDATE canastas SET estado='entregada' WHERE id=5;` |
| `DELETE` | Borrar filas | `DELETE FROM pedidos WHERE id=2;` |
| `WHERE` | Elegir *cuáles* filas | `WHERE rol = 'cliente'` |

> ⚠️ En `UPDATE` y `DELETE` **siempre** pon `WHERE`. Sin él afectas **todas** las filas.

**Ver las reseñas y opiniones que llegan desde la página** (sección *Contacto*):

```sql
SELECT nombre, tipo, calificacion, mensaje, latitud, longitud, fecha_creacion
FROM resenas
ORDER BY fecha_creacion DESC;

SELECT AVG(calificacion) AS promedio FROM resenas WHERE calificacion IS NOT NULL;
```

También las puede leer el administrador en **Admin → Reseñas** (con enlace al mapa si la persona compartió su ubicación). Las que tienen ubicación se abren en Google Maps con `https://www.google.com/maps?q=LATITUD,LONGITUD`.

**Solicitudes PQR (Peticiones, Quejas y Reclamos):** los asociados y clientes las llenan en el menú **PQR**; al enviarlas se guardan en MySQL y se descarga el PDF con el formato de la asociación. El administrador las ve en **Admin → PQR** (cambia el estado a *atendida* y descarga el PDF). En Workbench:

```sql
SELECT tipo, nombre, fecha, estado, descripcion FROM pqr ORDER BY fecha_creacion DESC;
```

> Si tu base ya existía, ejecuta otra vez `npm run setup` dentro de `server/` para que se cree la tabla `pqr` (no borra nada).

**Cambiar el precio de la canasta** (la página lo toma de aquí):

```sql
INSERT INTO precios (producto, precio_cop, unidad, vigente_desde)
VALUES ('Canasta de Mangos', 4500, 'canasta', CURDATE());
```

---

## 6. Si algo falla

| Mensaje | Causa probable | Solución |
|---|---|---|
| `ER_ACCESS_DENIED_ERROR` | Usuario o contraseña incorrectos en `.env` | Revisa `DB_USER` y `DB_PASSWORD`; deben ser los del paso 2 |
| `ECONNREFUSED` | MySQL está apagado | Windows → *Servicios* → `MySQL80` → **Iniciar** |
| `ER_BAD_DB_ERROR` (Unknown database) | No se creó la base | Repite el paso 2 |
| `Falta JWT_SECRET` | No existe `.env` o está vacío | Repite `Copy-Item .env.example .env` y complétalo |
| La página dice "No se pudo conectar con el servidor" | `npm start` no está corriendo | Enciéndelo en `server/` |
| `EADDRINUSE :4000` | Ya hay un servidor encendido | Ciérralo (`Ctrl + C`) o cambia `PORT` |
| Error de autenticación `caching_sha2_password` | Cliente antiguo con MySQL 8 | En Workbench: `ALTER USER 'asomanpesc_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'TuContraseñaSegura123';` |
| Quiero empezar de cero | — | En Workbench: `DROP DATABASE asomanpesc_db;` y repite pasos 2 y 3 |

---

## 7. Qué hace cada archivo de `server/`

| Archivo | Función |
|---|---|
| `schema.sql` | Las tablas de la base (también se ve en el panel admin) |
| `setup.js` | Crea tablas + el administrador predeterminado (`npm run setup`) |
| `quitar-demo.js` | Borra los datos de ejemplo de versiones anteriores (`npm run quitar-demo`) |
| `index.js` | Enciende el servidor y conecta las rutas |
| `db.js` | Conexión a MySQL |
| `middleware.js` | Revisa quién eres (sesión) y qué rol tienes |
| `routes/*.js` | Las "puertas": `usuarios`, `canastas`, `registros`, `pedidos`, `resenas`, `auth` |
| `.env` | Tus claves. **No se sube a GitHub** (ya está en `.gitignore`) |

## 8. Seguridad y publicación

- Las contraseñas se guardan **cifradas** (bcrypt); ni tú puedes verlas en la base.
- Cada persona solo ve lo suyo: el asociado sus canastas y registros, el cliente sus pedidos; solo el admin gestiona usuarios.
- El formulario de **Contacto** es público (no pide iniciar sesión), por eso tiene protecciones: máximo 5 mensajes por hora por persona, un campo trampa contra robots y límites de longitud. La **ubicación solo se envía si la persona pulsa el botón** y acepta el permiso del navegador.
- La ubicación en tiempo real del navegador **solo funciona en `localhost` o en una página `https://`**. En GitHub Pages sí funciona (usa https).
- Antes de usar datos reales: usa una contraseña de administrador fuerte (no la compartas) y pon un `JWT_SECRET` propio.
- **GitHub Pages solo publica páginas estáticas**, no ejecuta el servidor ni MySQL. Tu sitio `the-juanchito.github.io` no podrá guardar datos hasta que el servidor y la base estén en un hosting (por ejemplo Render o Railway, que ofrecen MySQL). Al publicar, el frontend necesita la variable `VITE_API_URL` con la dirección de ese servidor.
