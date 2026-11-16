import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { DBCanasta, DBRegistro, DBPedido, DBUser, PRECIO_CANASTA_COP } from '../services/database';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

export interface Canasta {
  id: string;
  fecha: string;
  productor: string;
  cantidad: number;
  tipo: string;
  precioUnitario: number;
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
  precioTotal: number;
  notas: string;
  estado: 'pendiente' | 'confirmado' | 'entregado';
  createdAt: string;
}

export type Resultado = { ok: true } | { ok: false; error: string };

interface DataContextType {
  canastas: Canasta[];
  registros: RegistroAsociado[];
  usuariosNuevos: UsuarioNuevo[];
  pedidos: Pedido[];
  allUsers: DBUser[];
  precioCanasta: number;
  loadError: string | null;
  addCanasta: (canasta: Omit<DBCanasta, 'id' | 'createdAt' | 'precioUnitario'>) => Promise<void>;
  addRegistro: (registro: Omit<DBRegistro, 'id' | 'createdAt'>) => Promise<void>;
  addPedido: (pedido: Omit<DBPedido, 'id' | 'createdAt' | 'precioTotal'>) => Promise<void>;
  refreshData: () => Promise<void>;
  updateCanastaEstado: (id: string, estado: Canasta['estado']) => Promise<void>;
  updatePedidoEstado: (id: string, estado: Pedido['estado']) => Promise<void>;
  addUser: (user: Partial<DBUser>) => Promise<Resultado>;
  updateUser: (id: string, changes: Partial<DBUser>) => Promise<Resultado>;
  deleteUser: (id: string) => Promise<Resultado>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mensaje = (e: unknown) => (e instanceof Error ? e.message : 'Ocurrió un error inesperado');

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [canastas, setCanastas] = useState<Canasta[]>([]);
  const [registros, setRegistros] = useState<RegistroAsociado[]>([]);
  const [usuariosNuevos, setUsuariosNuevos] = useState<UsuarioNuevo[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [allUsers, setAllUsers] = useState<DBUser[]>([]);
  const [precioCanasta, setPrecioCanasta] = useState(PRECIO_CANASTA_COP);
  const [loadError, setLoadError] = useState<string | null>(null);

  const clearData = () => {
    setCanastas([]); setRegistros([]); setPedidos([]); setAllUsers([]); setUsuariosNuevos([]);
  };

  // Trae los datos desde MySQL (el servidor ya filtra según el rol de quien entró)
  const refreshData = useCallback(async () => {
    if (!user) return;
    try {
      const [dbCanastas, dbRegistros, dbPedidos, dbUsers, precio] = await Promise.all([
        api.getCanastas(),
        api.getRegistros(),
        api.getPedidos(),
        user.role === 'admin' ? api.getUsuarios() : Promise.resolve([] as DBUser[]),
        api.getPrecio().catch(() => PRECIO_CANASTA_COP),
      ]);

      setCanastas(dbCanastas.map(c => ({
        id: c.id,
        fecha: c.fecha,
        productor: c.productorNombre,
        cantidad: c.cantidad,
        tipo: c.tipo,
        precioUnitario: c.precioUnitario,
        estado: c.estado,
      })));

      setRegistros(dbRegistros.map(r => ({
        id: r.id,
        asociadoId: r.asociadoId,
        asociadoNombre: r.asociadoNombre,
        fecha: r.fecha,
        producto: r.producto,
        cantidadCajas: r.cantidadCajas,
        cantidadCanastas: r.cantidadCanastas,
        notas: r.notas,
      })));

      setPedidos(dbPedidos.map(p => ({
        id: p.id,
        clienteId: p.clienteId,
        clienteNombre: p.clienteNombre,
        producto: p.producto,
        cantidad: p.cantidad,
        precioTotal: p.precioTotal,
        notas: p.notas,
        estado: p.estado,
        createdAt: p.createdAt,
      })));

      setAllUsers(dbUsers);
      // El servidor entrega los usuarios del más nuevo al más antiguo
      setUsuariosNuevos(
        dbUsers
          .filter(u => u.role !== 'admin')
          .slice(0, 5)
          .map(u => ({
            id: u.id,
            nombre: u.name,
            email: u.email,
            rol: u.role,
            fechaRegistro: u.createdAt,
          }))
      );

      setPrecioCanasta(precio);
      setLoadError(null);
    } catch (e) {
      setLoadError(mensaje(e));
    }
  }, [user]);

  // Al entrar (o salir) un usuario se cargan (o se limpian) los datos
  useEffect(() => {
    if (user) refreshData();
    else { clearData(); setLoadError(null); }
  }, [user, refreshData]);

  // Acciones de canastas / registros / pedidos: guardan en MySQL y recargan.
  // Si algo falla se avisa al usuario.
  const accion = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await refreshData();
    } catch (e) {
      window.alert(mensaje(e));
    }
  };

  const addCanasta = (c: Omit<DBCanasta, 'id' | 'createdAt' | 'precioUnitario'>) =>
    accion(() => api.addCanasta(c));

  const addRegistro = (r: Omit<DBRegistro, 'id' | 'createdAt'>) =>
    accion(() => api.addRegistro(r));

  const addPedido = (p: Omit<DBPedido, 'id' | 'createdAt' | 'precioTotal'>) =>
    accion(() => api.addPedido(p));

  const updateCanastaEstado = (id: string, estado: Canasta['estado']) =>
    accion(() => api.updateCanastaEstado(id, estado));

  const updatePedidoEstado = (id: string, estado: Pedido['estado']) =>
    accion(() => api.updatePedidoEstado(id, estado));

  // Acciones de usuarios: devuelven el resultado para mostrar el mensaje en la pantalla
  const resultado = async (fn: () => Promise<unknown>): Promise<Resultado> => {
    try {
      await fn();
      await refreshData();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: mensaje(e) };
    }
  };

  const addUser = (u: Partial<DBUser>) => resultado(() => api.addUsuario(u));
  const updateUser = (id: string, changes: Partial<DBUser>) => resultado(() => api.updateUsuario(id, changes));
  const deleteUser = (id: string) => resultado(() => api.deleteUsuario(id));

  return (
    <DataContext.Provider value={{
      canastas,
      registros,
      usuariosNuevos,
      pedidos,
      allUsers,
      precioCanasta,
      loadError,
      addCanasta,
      addRegistro,
      addPedido,
      refreshData,
      updateCanastaEstado,
      updatePedidoEstado,
      addUser,
      updateUser,
      deleteUser,
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
