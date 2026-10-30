// Base de datos simulada usando localStorage para persistencia

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'asociado' | 'cliente';
  createdAt: string;
  lastLogin?: string;
}

export interface DBCanasta {
  id: string;
  fecha: string;
  productorId: string;
  productorNombre: string;
  cantidad: number;
  tipo: string;
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

const DB_KEYS = {
  USERS: 'asomanpesc_users',
  CANASTAS: 'asomanpesc_canastas',
  REGISTROS: 'asomanpesc_registros',
  PEDIDOS: 'asomanpesc_pedidos',
  MENSAJES: 'asomanpesc_mensajes',
  INITIALIZED: 'asomanpesc_initialized'
};

// Datos iniciales
const initialUsers: DBUser[] = [
  { id: '1', name: 'Admin Principal', email: 'admin@asomanpesc.com', password: 'admin123', role: 'admin', createdAt: '2024-01-01' },
  { id: '2', name: 'José Martínez', email: 'jose@asomanpesc.com', password: 'asociado123', role: 'asociado', createdAt: '2024-01-05' },
  { id: '3', name: 'María López', email: 'maria@asomanpesc.com', password: 'asociado123', role: 'asociado', createdAt: '2024-01-05' },
  { id: '4', name: 'Carlos Rodríguez', email: 'carlos@cliente.com', password: 'cliente123', role: 'cliente', createdAt: '2024-01-10' },
  { id: '5', name: 'Ana García', email: 'ana@cliente.com', password: 'cliente123', role: 'cliente', createdAt: '2024-01-10' },
];

const initialCanastas: DBCanasta[] = [
  { id: '1', fecha: '2024-01-15', productorId: '2', productorNombre: 'José Martínez', cantidad: 25, tipo: 'Tommy Atkins', estado: 'entregada', createdAt: '2024-01-15T08:00:00' },
  { id: '2', fecha: '2024-01-15', productorId: '3', productorNombre: 'María López', cantidad: 18, tipo: 'Ataulfo', estado: 'entregada', createdAt: '2024-01-15T09:00:00' },
  { id: '3', fecha: '2024-01-16', productorId: '2', productorNombre: 'José Martínez', cantidad: 30, tipo: 'Kent', estado: 'entregada', createdAt: '2024-01-16T08:00:00' },
  { id: '4', fecha: '2024-01-16', productorId: '2', productorNombre: 'José Martínez', cantidad: 22, tipo: 'Haden', estado: 'recogida', createdAt: '2024-01-16T10:00:00' },
  { id: '5', fecha: '2024-01-17', productorId: '3', productorNombre: 'María López', cantidad: 15, tipo: 'Manila', estado: 'pendiente', createdAt: '2024-01-17T08:00:00' },
  { id: '6', fecha: '2024-01-17', productorId: '2', productorNombre: 'José Martínez', cantidad: 28, tipo: 'Tommy Atkins', estado: 'recogida', createdAt: '2024-01-17T09:00:00' },
  { id: '7', fecha: '2024-01-18', productorId: '3', productorNombre: 'María López', cantidad: 20, tipo: 'Keitt', estado: 'pendiente', createdAt: '2024-01-18T08:00:00' },
  { id: '8', fecha: '2024-01-18', productorId: '3', productorNombre: 'María López', cantidad: 35, tipo: 'Ataulfo', estado: 'recogida', createdAt: '2024-01-18T10:00:00' },
];

const initialRegistros: DBRegistro[] = [
  { id: '1', asociadoId: '2', asociadoNombre: 'José Martínez', fecha: '2024-01-15', producto: 'Tommy Atkins', cantidadCajas: 50, cantidadCanastas: 25, notas: 'Cosecha excelente', createdAt: '2024-01-15T08:00:00' },
  { id: '2', asociadoId: '3', asociadoNombre: 'María López', fecha: '2024-01-15', producto: 'Ataulfo', cantidadCajas: 36, cantidadCanastas: 18, notas: 'Fruta madura lista', createdAt: '2024-01-15T09:00:00' },
  { id: '3', asociadoId: '2', asociadoNombre: 'José Martínez', fecha: '2024-01-16', producto: 'Kent', cantidadCajas: 60, cantidadCanastas: 30, notas: 'Gran producción', createdAt: '2024-01-16T08:00:00' },
];

const initialPedidos: DBPedido[] = [
  { id: '1', clienteId: '4', clienteNombre: 'Carlos Rodríguez', producto: 'Mango Ataulfo', cantidad: 10, notas: 'Para mi restaurante', estado: 'confirmado', createdAt: '2024-01-17T10:00:00' },
  { id: '2', clienteId: '5', clienteNombre: 'Ana García', producto: 'Mango Tommy Atkins', cantidad: 5, notas: '', estado: 'pendiente', createdAt: '2024-01-18T14:00:00' },
];

// Clase Database
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

  addCanasta(canasta: Omit<DBCanasta, 'id' | 'createdAt'>): DBCanasta {
    const canastas = this.getCanastas();
    const newCanasta: DBCanasta = {
      ...canasta,
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

  addPedido(pedido: Omit<DBPedido, 'id' | 'createdAt'>): DBPedido {
    const pedidos = this.getPedidos();
    const newPedido: DBPedido = {
      ...pedido,
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

    return {
      totalCanastas: canastas.reduce((sum, c) => sum + c.cantidad, 0),
      canastasEntregadas: canastas.filter(c => c.estado === 'entregada').reduce((sum, c) => sum + c.cantidad, 0),
      canastasRecogidas: canastas.filter(c => c.estado === 'recogida').reduce((sum, c) => sum + c.cantidad, 0),
      canastasPendientes: canastas.filter(c => c.estado === 'pendiente').reduce((sum, c) => sum + c.cantidad, 0),
      totalRegistros: registros.length,
      totalPedidos: pedidos.length,
      totalUsuarios: users.length,
      totalAsociados: users.filter(u => u.role === 'asociado').length,
      totalClientes: users.filter(u => u.role === 'cliente').length,
    };
  }

  // Reset (para desarrollo)
  reset(): void {
    Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
    this.initialize();
  }
}

export const db = new Database();
