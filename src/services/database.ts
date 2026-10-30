// ============================================
// SERVICIO DE BASE DE DATOS - AsoManPesc
// Soporte para MySQL y SQL Server
// ============================================

// Configuración de conexión a MySQL
export const MYSQL_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'asomanpesc_admin',
  password: '••••••••',
  database: 'asomanpesc_db',
  charset: 'utf8mb4',
  connectionLimit: 10,
  status: 'connected' as 'connected' | 'disconnected' | 'connecting'
};

// Nota: SQL Server fue reemplazado por MySQL como única base de datos
// export const SQLSERVER_CONFIG = { ... }; // Eliminado

// Esquema de tablas MySQL
export const MYSQL_SCHEMA = `
-- =============================================
-- Base de Datos: asomanpesc_db (MySQL)
-- =============================================

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'asociado', 'cliente') NOT NULL,
  telefono VARCHAR(20),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso DATETIME,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS canastas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  productor_id INT NOT NULL,
  productor_nombre VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL,
  tipo_mango VARCHAR(50) NOT NULL,
  precio_unitario DECIMAL(10,2) DEFAULT 4000.00,
  estado ENUM('pendiente', 'recogida', 'entregada') DEFAULT 'pendiente',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productor_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS registros_produccion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asociado_id INT NOT NULL,
  asociado_nombre VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  producto VARCHAR(50) NOT NULL,
  cantidad_cajas INT NOT NULL,
  cantidad_canastas INT NOT NULL,
  notas TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asociado_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  cliente_nombre VARCHAR(100) NOT NULL,
  producto VARCHAR(100) NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  precio_total DECIMAL(10,2),
  notas TEXT,
  estado ENUM('pendiente', 'confirmado', 'entregado') DEFAULT 'pendiente',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS mensajes_chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  usuario_nombre VARCHAR(100),
  mensaje TEXT NOT NULL,
  tipo ENUM('user', 'bot', 'system') DEFAULT 'user',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Precio base de canasta: $4,000 COP
CREATE TABLE IF NOT EXISTS precios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto VARCHAR(100) NOT NULL,
  precio_cop DECIMAL(10,2) NOT NULL,
  unidad VARCHAR(20) DEFAULT 'canasta',
  vigente_desde DATE,
  vigente_hasta DATE
);

INSERT INTO precios (producto, precio_cop, unidad, vigente_desde) VALUES
('Canasta de Mangos', 4000.00, 'canasta', CURDATE());
`;

// Esquema de tablas SQL Server
export const SQLSERVER_SCHEMA = `
-- =============================================
-- Base de Datos: AsoManPescDB (SQL Server)
-- =============================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AsoManPescDB')
BEGIN
    CREATE DATABASE AsoManPescDB;
END
GO

USE AsoManPescDB;
GO

CREATE TABLE dbo.Usuarios (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nombre NVARCHAR(100) NOT NULL,
  Email NVARCHAR(150) UNIQUE NOT NULL,
  Password NVARCHAR(255) NOT NULL,
  Rol NVARCHAR(20) NOT NULL CHECK (Rol IN ('admin', 'asociado', 'cliente')),
  Telefono NVARCHAR(20),
  FechaRegistro DATETIME DEFAULT GETDATE(),
  UltimoAcceso DATETIME,
  Activo BIT DEFAULT 1
);

CREATE TABLE dbo.Canastas (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Fecha DATE NOT NULL,
  ProductorId INT NOT NULL,
  ProductorNombre NVARCHAR(100) NOT NULL,
  Cantidad INT NOT NULL,
  TipoMango NVARCHAR(50) NOT NULL,
  PrecioUnitario DECIMAL(10,2) DEFAULT 4000.00,
  Estado NVARCHAR(20) DEFAULT 'pendiente' CHECK (Estado IN ('pendiente', 'recogida', 'entregada')),
  FechaCreacion DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (ProductorId) REFERENCES dbo.Usuarios(Id)
);

CREATE TABLE dbo.RegistrosProduccion (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  AsociadoId INT NOT NULL,
  AsociadoNombre NVARCHAR(100) NOT NULL,
  Fecha DATE NOT NULL,
  Producto NVARCHAR(50) NOT NULL,
  CantidadCajas INT NOT NULL,
  CantidadCanastas INT NOT NULL,
  Notas NVARCHAR(MAX),
  FechaCreacion DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (AsociadoId) REFERENCES dbo.Usuarios(Id)
);

CREATE TABLE dbo.Pedidos (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  ClienteId INT NOT NULL,
  ClienteNombre NVARCHAR(100) NOT NULL,
  Producto NVARCHAR(100) NOT NULL,
  Cantidad DECIMAL(10,2) NOT NULL,
  PrecioTotal DECIMAL(10,2),
  Notas NVARCHAR(MAX),
  Estado NVARCHAR(20) DEFAULT 'pendiente' CHECK (Estado IN ('pendiente', 'confirmado', 'entregado')),
  FechaCreacion DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (ClienteId) REFERENCES dbo.Usuarios(Id)
);

-- Precio base de canasta: $4,000 COP
CREATE TABLE dbo.Precios (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Producto NVARCHAR(100) NOT NULL,
  PrecioCOP DECIMAL(10,2) NOT NULL,
  Unidad NVARCHAR(20) DEFAULT 'canasta',
  VigenteDesde DATE,
  VigenteHasta DATE
);

INSERT INTO dbo.Precios (Producto, PrecioCOP, Unidad, VigenteDesde) 
VALUES ('Canasta de Mangos', 4000.00, 'canasta', GETDATE());
GO
`;

// ============================================
// CLASE DATABASE - Simulación con LocalStorage
// En producción se conectaría a MySQL/SQL Server
// ============================================

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'asociado' | 'cliente';
  createdAt: string;
  lastLogin?: string;
  phone?: string;
}

export interface DBCanasta {
  id: string;
  fecha: string;
  productorId: string;
  productorNombre: string;
  cantidad: number;
  tipo: string;
  precioUnitario: number;
  estado: 'recogida' | 'pendiente' | 'entregada';
  createdAt: string;
}

export interface DBRegistro {
  id: string;
  asociadoId: string;
  asociadoNombre: string;
  fecha: string;
  producto: string;
  cantidadCajas: number;
  cantidadCanastas: number;
  notas: string;
  createdAt: string;
}

export interface DBPedido {
  id: string;
  clienteId: string;
  clienteNombre: string;
  producto: string;
  cantidad: number;
  precioTotal: number;
  notas: string;
  estado: 'pendiente' | 'confirmado' | 'entregado';
  createdAt: string;
}

export interface DBMensaje {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: 'user' | 'bot' | 'system';
}

// Precio constante de la canasta
export const PRECIO_CANASTA_COP = 4000;

const DB_KEYS = {
  USERS: 'asomanpesc_users',
  CANASTAS: 'asomanpesc_canastas',
  REGISTROS: 'asomanpesc_registros',
  PEDIDOS: 'asomanpesc_pedidos',
  MENSAJES: 'asomanpesc_mensajes',
  INITIALIZED: 'asomanpesc_initialized'
};

const initialUsers: DBUser[] = [
  { id: '1', name: 'Admin Principal', email: 'admin@asomanpesc.com', password: 'admin123', role: 'admin', createdAt: '2024-01-01', phone: '+57 3242030867' },
  { id: '2', name: 'José Martínez', email: 'jose@asomanpesc.com', password: 'asociado123', role: 'asociado', createdAt: '2024-01-05' },
  { id: '3', name: 'María López', email: 'maria@asomanpesc.com', password: 'asociado123', role: 'asociado', createdAt: '2024-01-05' },
  { id: '4', name: 'Carlos Rodríguez', email: 'carlos@cliente.com', password: 'cliente123', role: 'cliente', createdAt: '2024-01-10' },
  { id: '5', name: 'Ana García', email: 'ana@cliente.com', password: 'cliente123', role: 'cliente', createdAt: '2024-01-10' },
];

const initialCanastas: DBCanasta[] = [
  { id: '1', fecha: '2024-01-15', productorId: '2', productorNombre: 'José Martínez', cantidad: 25, tipo: 'Tommy Atkins', precioUnitario: PRECIO_CANASTA_COP, estado: 'entregada', createdAt: '2024-01-15T08:00:00' },
  { id: '2', fecha: '2024-01-15', productorId: '3', productorNombre: 'María López', cantidad: 18, tipo: 'Ataulfo', precioUnitario: PRECIO_CANASTA_COP, estado: 'entregada', createdAt: '2024-01-15T09:00:00' },
  { id: '3', fecha: '2024-01-16', productorId: '2', productorNombre: 'José Martínez', cantidad: 30, tipo: 'Kent', precioUnitario: PRECIO_CANASTA_COP, estado: 'entregada', createdAt: '2024-01-16T08:00:00' },
  { id: '4', fecha: '2024-01-16', productorId: '2', productorNombre: 'José Martínez', cantidad: 22, tipo: 'Haden', precioUnitario: PRECIO_CANASTA_COP, estado: 'recogida', createdAt: '2024-01-16T10:00:00' },
  { id: '5', fecha: '2024-01-17', productorId: '3', productorNombre: 'María López', cantidad: 15, tipo: 'Manila', precioUnitario: PRECIO_CANASTA_COP, estado: 'pendiente', createdAt: '2024-01-17T08:00:00' },
  { id: '6', fecha: '2024-01-17', productorId: '2', productorNombre: 'José Martínez', cantidad: 28, tipo: 'Tommy Atkins', precioUnitario: PRECIO_CANASTA_COP, estado: 'recogida', createdAt: '2024-01-17T09:00:00' },
  { id: '7', fecha: '2024-01-18', productorId: '3', productorNombre: 'María López', cantidad: 20, tipo: 'Keitt', precioUnitario: PRECIO_CANASTA_COP, estado: 'pendiente', createdAt: '2024-01-18T08:00:00' },
  { id: '8', fecha: '2024-01-18', productorId: '3', productorNombre: 'María López', cantidad: 35, tipo: 'Ataulfo', precioUnitario: PRECIO_CANASTA_COP, estado: 'recogida', createdAt: '2024-01-18T10:00:00' },
];

const initialRegistros: DBRegistro[] = [
  { id: '1', asociadoId: '2', asociadoNombre: 'José Martínez', fecha: '2024-01-15', producto: 'Tommy Atkins', cantidadCajas: 50, cantidadCanastas: 25, notas: 'Cosecha excelente', createdAt: '2024-01-15T08:00:00' },
  { id: '2', asociadoId: '3', asociadoNombre: 'María López', fecha: '2024-01-15', producto: 'Ataulfo', cantidadCajas: 36, cantidadCanastas: 18, notas: 'Fruta madura lista', createdAt: '2024-01-15T09:00:00' },
  { id: '3', asociadoId: '2', asociadoNombre: 'José Martínez', fecha: '2024-01-16', producto: 'Kent', cantidadCajas: 60, cantidadCanastas: 30, notas: 'Gran producción', createdAt: '2024-01-16T08:00:00' },
];

const initialPedidos: DBPedido[] = [
  { id: '1', clienteId: '4', clienteNombre: 'Carlos Rodríguez', producto: 'Mango Ataulfo', cantidad: 10, precioTotal: 40000, notas: 'Para mi restaurante', estado: 'confirmado', createdAt: '2024-01-17T10:00:00' },
  { id: '2', clienteId: '5', clienteNombre: 'Ana García', producto: 'Mango Tommy Atkins', cantidad: 5, precioTotal: 20000, notas: '', estado: 'pendiente', createdAt: '2024-01-18T14:00:00' },
];

class Database {
  private isInitialized(): boolean {
    return localStorage.getItem(DB_KEYS.INITIALIZED) === 'true';
  }

  initialize(): void {
    if (!this.isInitialized()) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(initialUsers));
      localStorage.setItem(DB_KEYS.CANASTAS, JSON.stringify(initialCanastas));
      localStorage.setItem(DB_KEYS.REGISTROS, JSON.stringify(initialRegistros));
      localStorage.setItem(DB_KEYS.PEDIDOS, JSON.stringify(initialPedidos));
      localStorage.setItem(DB_KEYS.MENSAJES, JSON.stringify([]));
      localStorage.setItem(DB_KEYS.INITIALIZED, 'true');
    }
  }

  // Users
  getUsers(): DBUser[] {
    const data = localStorage.getItem(DB_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  getUserByEmail(email: string): DBUser | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  getUserById(id: string): DBUser | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  addUser(user: Omit<DBUser, 'id' | 'createdAt'>): DBUser {
    const users = this.getUsers();
    const newUser: DBUser = {
      ...user,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return newUser;
  }

  updateUserLastLogin(id: string): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index].lastLogin = new Date().toISOString();
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }
  }

  // Canastas
  getCanastas(): DBCanasta[] {
    const data = localStorage.getItem(DB_KEYS.CANASTAS);
    return data ? JSON.parse(data) : [];
  }

  getCanastasByProductor(productorId: string): DBCanasta[] {
    return this.getCanastas().filter(c => c.productorId === productorId);
  }

  addCanasta(canasta: Omit<DBCanasta, 'id' | 'createdAt' | 'precioUnitario'>): DBCanasta {
    const canastas = this.getCanastas();
    const newCanasta: DBCanasta = {
      ...canasta,
      precioUnitario: PRECIO_CANASTA_COP,
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    canastas.push(newCanasta);
    localStorage.setItem(DB_KEYS.CANASTAS, JSON.stringify(canastas));
    return newCanasta;
  }

  updateCanastaEstado(id: string, estado: DBCanasta['estado']): void {
    const canastas = this.getCanastas();
    const index = canastas.findIndex(c => c.id === id);
    if (index !== -1) {
      canastas[index].estado = estado;
      localStorage.setItem(DB_KEYS.CANASTAS, JSON.stringify(canastas));
    }
  }

  // Registros
  getRegistros(): DBRegistro[] {
    const data = localStorage.getItem(DB_KEYS.REGISTROS);
    return data ? JSON.parse(data) : [];
  }

  getRegistrosByAsociado(asociadoId: string): DBRegistro[] {
    return this.getRegistros().filter(r => r.asociadoId === asociadoId);
  }

  addRegistro(registro: Omit<DBRegistro, 'id' | 'createdAt'>): DBRegistro {
    const registros = this.getRegistros();
    const newRegistro: DBRegistro = {
      ...registro,
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    registros.push(newRegistro);
    localStorage.setItem(DB_KEYS.REGISTROS, JSON.stringify(registros));
    return newRegistro;
  }

  // Pedidos
  getPedidos(): DBPedido[] {
    const data = localStorage.getItem(DB_KEYS.PEDIDOS);
    return data ? JSON.parse(data) : [];
  }

  getPedidosByCliente(clienteId: string): DBPedido[] {
    return this.getPedidos().filter(p => p.clienteId === clienteId);
  }

  addPedido(pedido: Omit<DBPedido, 'id' | 'createdAt' | 'precioTotal'>): DBPedido {
    const pedidos = this.getPedidos();
    const newPedido: DBPedido = {
      ...pedido,
      precioTotal: pedido.cantidad * PRECIO_CANASTA_COP,
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    pedidos.push(newPedido);
    localStorage.setItem(DB_KEYS.PEDIDOS, JSON.stringify(pedidos));
    return newPedido;
  }

  updatePedidoEstado(id: string, estado: DBPedido['estado']): void {
    const pedidos = this.getPedidos();
    const index = pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      pedidos[index].estado = estado;
      localStorage.setItem(DB_KEYS.PEDIDOS, JSON.stringify(pedidos));
    }
  }

  // Mensajes del chat
  getMensajes(): DBMensaje[] {
    const data = localStorage.getItem(DB_KEYS.MENSAJES);
    return data ? JSON.parse(data) : [];
  }

  addMensaje(mensaje: Omit<DBMensaje, 'id' | 'timestamp'>): DBMensaje {
    const mensajes = this.getMensajes();
    const newMensaje: DBMensaje = {
      ...mensaje,
      id: String(Date.now()),
      timestamp: new Date().toISOString()
    };
    mensajes.push(newMensaje);
    localStorage.setItem(DB_KEYS.MENSAJES, JSON.stringify(mensajes));
    return newMensaje;
  }

  // Estadísticas
  getEstadisticas() {
    const canastas = this.getCanastas();
    const registros = this.getRegistros();
    const pedidos = this.getPedidos();
    const users = this.getUsers();

    const totalCanastas = canastas.reduce((sum, c) => sum + c.cantidad, 0);
    const ingresosTotales = totalCanastas * PRECIO_CANASTA_COP;

    return {
      totalCanastas,
      canastasEntregadas: canastas.filter(c => c.estado === 'entregada').reduce((sum, c) => sum + c.cantidad, 0),
      canastasRecogidas: canastas.filter(c => c.estado === 'recogida').reduce((sum, c) => sum + c.cantidad, 0),
      canastasPendientes: canastas.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + c.cantidad, 0),
      totalRegistros: registros.length,
      totalPedidos: pedidos.length,
      totalUsuarios: users.length,
      totalAsociados: users.filter(u => u.role === 'asociado').length,
      totalClientes: users.filter(u => u.role === 'cliente').length,
      ingresosTotales,
      precioCanasta: PRECIO_CANASTA_COP
    };
  }

  // Reset
  reset(): void {
    Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
    this.initialize();
  }
}

export const db = new Database();

// Función para formatear precios en COP
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
