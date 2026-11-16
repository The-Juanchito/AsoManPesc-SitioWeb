-- =============================================
-- AsoManPesc - Base de datos MySQL
-- Se puede ejecutar varias veces sin borrar datos.
-- =============================================

CREATE DATABASE IF NOT EXISTS asomanpesc_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE asomanpesc_db;

-- Personas que entran a la plataforma (admin, asociados y clientes)
CREATE TABLE IF NOT EXISTS usuarios (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  cedula         VARCHAR(20)  UNIQUE,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,           -- contraseña cifrada (bcrypt), nunca en texto plano
  rol            ENUM('admin', 'asociado', 'cliente') NOT NULL,
  telefono       VARCHAR(20),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso  DATETIME NULL,
  activo         BOOLEAN DEFAULT TRUE
);

-- Canastas entregadas por cada productor
CREATE TABLE IF NOT EXISTS canastas (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  fecha            DATE NOT NULL,
  productor_id     INT NULL,
  productor_nombre VARCHAR(100) NOT NULL,
  cantidad         INT NOT NULL,
  tipo_mango       VARCHAR(50) NOT NULL,
  precio_unitario  DECIMAL(10,2) NOT NULL DEFAULT 4000.00,
  estado           ENUM('pendiente', 'recogida', 'entregada') DEFAULT 'pendiente',
  fecha_creacion   DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- Si se borra al productor, el historial se conserva (queda sin productor_id)
  FOREIGN KEY (productor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Registros de producción de los asociados
CREATE TABLE IF NOT EXISTS registros_produccion (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  asociado_id       INT NULL,
  asociado_nombre   VARCHAR(100) NOT NULL,
  fecha             DATE NOT NULL,
  producto          VARCHAR(50) NOT NULL,
  cantidad_cajas    INT NOT NULL,
  cantidad_canastas INT NOT NULL,
  notas             TEXT,
  fecha_creacion    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asociado_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Pedidos de los clientes
CREATE TABLE IF NOT EXISTS pedidos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id     INT NULL,
  cliente_nombre VARCHAR(100) NOT NULL,
  producto       VARCHAR(100) NOT NULL,
  cantidad       DECIMAL(10,2) NOT NULL,
  precio_total   DECIMAL(10,2),
  notas          TEXT,
  estado         ENUM('pendiente', 'confirmado', 'entregado') DEFAULT 'pendiente',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Precio de la canasta (el vigente es la última fila)
CREATE TABLE IF NOT EXISTS precios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  producto      VARCHAR(100) NOT NULL,
  precio_cop    DECIMAL(10,2) NOT NULL,
  unidad        VARCHAR(20) DEFAULT 'canasta',
  vigente_desde DATE,
  vigente_hasta DATE
);

INSERT INTO precios (producto, precio_cop, unidad, vigente_desde)
SELECT 'Canasta de Mangos', 4000.00, 'canasta', CURDATE() FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM precios);
