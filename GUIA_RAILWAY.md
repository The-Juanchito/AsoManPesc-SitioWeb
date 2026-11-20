# Guía: publicar el servidor y MySQL en Railway (para que Netlify funcione)

## 0. La idea (analogía del restaurante)

| En el restaurante | En línea | Dónde vive |
|---|---|---|
| El **comedor** que ven los clientes | La página (React) | **Netlify** |
| El **mesero** | El servidor API (`server/`) | **Railway** (servicio 1) |
| La **despensa** | MySQL | **Railway** (servicio 2) |

```
Navegador ──► Netlify (página) ──► Railway: API Express ──► Railway: MySQL
```

Hasta ahora Netlify solo tenía el comedor. Con Railway le ponemos mesero y despensa.

> Railway es un servicio de pago con prueba/crédito inicial; revisa su página de precios antes de dejarlo encendido.

---

## 1. Crear el proyecto y la base MySQL

1. Entra a **railway.com** e inicia sesión con tu GitHub.
2. **New Project → Deploy MySQL** (o *+ New → Database → MySQL*). Se crea un servicio llamado **MySQL**.
3. Railway le asigna solas las variables `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`. No tienes que crear usuario ni base.

## 2. Subir el servidor (el "mesero")

1. En el mismo proyecto: **+ New → GitHub Repo →** elige `AsoManPesc-SitioWeb`.
2. Abre ese servicio → **Settings**:

| Ajuste | Valor |
|---|---|
| **Source → Branch** | `mysql-backend` (o `main` si ya uniste el Pull Request) |
| **Source → Root Directory** | `server` |
| **Networking → Generate Domain** | pulsa el botón; te da una dirección `https://algo.up.railway.app` |

   El archivo `server/railway.json` ya le dice a Railway cómo arrancar (`npm run setup && npm start`): crea las tablas y tu administrador la primera vez, y enciende la API.

3. Pestaña **Variables → New Variable**. Escribe estas (las 5 primeras son *referencias* a la base: Railway las sugiere al escribir `${{`):

| Variable | Valor |
|---|---|
| `MYSQLHOST` | `${{MySQL.MYSQLHOST}}` |
| `MYSQLPORT` | `${{MySQL.MYSQLPORT}}` |
| `MYSQLUSER` | `${{MySQL.MYSQLUSER}}` |
| `MYSQLPASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `MYSQLDATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `JWT_SECRET` | una frase larga y secreta (inventa una) |
| `CORS_ORIGIN` | `https://asomanpesc.netlify.app` (sin `/` al final; puedes poner varias separadas por coma) |
| `ADMIN_NAME` | tu nombre |
| `ADMIN_EMAIL` | tu correo de administrador |
| `ADMIN_CEDULA` | tu cédula |
| `ADMIN_PASSWORD` | una contraseña fuerte (mín. 8). Si la dejas fuera, se genera una y aparece **una sola vez** en *Deployments → Logs* |

   Si tu servicio de base se llama distinto de `MySQL`, cambia ese nombre en las referencias.

4. Railway despliega solo. En **Deployments → Logs** debe aparecer `✅ Tablas listas`, `✅ Administrador creado` y `✅ Conectado a MySQL`.
5. **Prueba:** abre `https://TU-DOMINIO.up.railway.app/api/health`. Debe responder `{"ok":true,...}`.

## 3. Conectar Netlify con Railway

1. Netlify → tu sitio → **Site configuration → Environment variables → Add a variable**:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://TU-DOMINIO.up.railway.app/api` (**termina en `/api`**) |

2. **Deploys → Trigger deploy → Clear cache and deploy site.** La variable se "hornea" al construir la página, por eso hay que volver a desplegar.
3. Abre `asomanpesc.netlify.app` → *Iniciar Sesión* con el correo y la contraseña de `ADMIN_*`.

## 4. Si algo falla

| Síntoma | Causa probable | Solución |
|---|---|---|
| "No se pudo conectar con el servidor" | `VITE_API_URL` mal puesta o sin redeploy | Debe terminar en `/api` y volver a desplegar Netlify |
| Error CORS en la consola del navegador | `CORS_ORIGIN` no coincide con la dirección de Netlify | Cópiala exacta, sin `/` final |
| Logs: `Falta ADMIN_EMAIL o ADMIN_CEDULA` | Faltan variables ADMIN_* | Agrégalas y vuelve a desplegar |
| Logs: `ECONNREFUSED` / `ER_ACCESS_DENIED` | Referencias `MYSQL*` mal escritas | Revisa que el nombre del servicio coincida (`${{MySQL...}}`) |
| Login dice credenciales incorrectas | Contraseña con símbolos mal copiada | Pégala de nuevo; en Railway no necesita comillas |

## 5. Ver los datos en línea (opcional)

En el servicio **MySQL → Data** puedes ver las tablas desde Railway. Para conectarte con Workbench activa *Settings → Networking → Public Access* (aparece `MYSQL_PUBLIC_URL`); ten en cuenta que el acceso público puede generar costo de red.

Fuentes: [Railway · MySQL](https://docs.railway.com/databases/mysql).
