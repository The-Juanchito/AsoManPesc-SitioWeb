import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, DBCanasta, DBRegistro, DBPedido, DBUser } from '../services/database';

export interface Canasta {
  id: string;
  fecha: string;
  productor: string;
  cantidad: number;
  tipo: string;
  estado: 'recogida' | 'pendiente' | 'entregada';
}

export interface RegistroAsociado {
  id: string;
  asociadoId: string;
  asociadoNombre: string;
  fecha: string;
  producto: string;
  cantidadCajas: number;
  cantidadCanastas: number;
  notas: string;
}

export interface UsuarioNuevo {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fechaRegistro: string;
}

export interface Pedido {
  id: string;
  clienteId: string;
  clienteNombre: string;
  producto: string;
  cantidad: number;
  notas: string;
  estado: 'pendiente' | 'confirmado' | 'entregado';
  createdAt: string;
}

interface DataContextType {
  canastas: Canasta[];
  registros: RegistroAsociado[];
  usuariosNuevos: UsuarioNuevo[];
  pedidos: Pedido[];
  allUsers: DBUser[];
  addCanasta: (canasta: Omit<DBCanasta, 'id' | 'createdAt'>) => void;
  addRegistro: (registro: Omit<DBRegistro, 'id' | 'createdAt'>) => void;
  addPedido: (pedido: Omit<DBPedido, 'id' | 'createdAt'>) => void;
  addUsuarioNuevo: (usuario: Omit<UsuarioNuevo, 'id'>) => void;
  refreshData: () => void;
  updateCanastaEstado: (id: string, estado: Canasta['estado']) => void;
  updatePedidoEstado: (id: string, estado: Pedido['estado']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [canastas, setCanastas] = useState<Canasta[]>([]);
  const [registros, setRegistros] = useState<RegistroAsociado[]>([]);
  const [usuariosNuevos, setUsuariosNuevos] = useState<UsuarioNuevo[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [allUsers, setAllUsers] = useState<DBUser[]>([]);

  const refreshData = () => {
    // Cargar canastas desde DB
    const dbCanastas = db.getCanastas();
    setCanastas(dbCanastas.map(c => ({
      id: c.id,
      fecha: c.fecha,
      productor: c.productorNombre,
      cantidad: c.cantidad,
      tipo: c.tipo,
      estado: c.estado
    })));

    // Cargar registros desde DB
    const dbRegistros = db.getRegistros();
    setRegistros(dbRegistros.map(r => ({
      id: r.id,
      asociadoId: r.asociadoId,
      asociadoNombre: r.asociadoNombre,
      fecha: r.fecha,
      producto: r.producto,
      cantidadCajas: r.cantidadCajas,
      cantidadCanastas: r.cantidadCanastas,
      notas: r.notas
    })));

    // Cargar pedidos desde DB
    const dbPedidos = db.getPedidos();
    setPedidos(dbPedidos.map(p => ({
      id: p.id,
      clienteId: p.clienteId,
      clienteNombre: p.clienteNombre,
      producto: p.producto,
      cantidad: p.cantidad,
      notas: p.notas,
      estado: p.estado,
      createdAt: p.createdAt
    })));

    // Cargar usuarios
    const dbUsers = db.getUsers();
    setAllUsers(dbUsers);

    // Usuarios nuevos (últimos 5 registrados)
    const recentUsers = dbUsers
      .filter(u => u.role !== 'admin')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(u => ({
        id: u.id,
        nombre: u.name,
        email: u.email,
        rol: u.role,
        fechaRegistro: u.createdAt
      }));
    setUsuariosNuevos(recentUsers);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addCanasta = (canasta: Omit<DBCanasta, 'id' | 'createdAt'>) => {
    db.addCanasta(canasta);
    refreshData();
  };

  const addRegistro = (registro: Omit<DBRegistro, 'id' | 'createdAt'>) => {
    db.addRegistro(registro);
    refreshData();
  };

  const addPedido = (pedido: Omit<DBPedido, 'id' | 'createdAt'>) => {
    db.addPedido(pedido);
    refreshData();
  };

  const addUsuarioNuevo = (usuario: Omit<UsuarioNuevo, 'id'>) => {
    db.addUser({
      name: usuario.nombre,
      email: usuario.email,
      password: 'default123',
      role: usuario.rol as 'cliente' | 'asociado'
    });
    refreshData();
  };

  const updateCanastaEstado = (id: string, estado: Canasta['estado']) => {
    db.updateCanastaEstado(id, estado);
    refreshData();
  };

  const updatePedidoEstado = (id: string, estado: Pedido['estado']) => {
    db.updatePedidoEstado(id, estado);
    refreshData();
  };

  return (
    <DataContext.Provider value={{
      canastas,
      registros,
      usuariosNuevos,
      pedidos,
      allUsers,
      addCanasta,
      addRegistro,
      addPedido,
      addUsuarioNuevo,
      refreshData,
      updateCanastaEstado,
      updatePedidoEstado
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
