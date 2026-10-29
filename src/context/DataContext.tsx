import { createContext, useContext, useState, ReactNode } from 'react';

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

interface DataContextType {
  canastas: Canasta[];
  registros: RegistroAsociado[];
  usuariosNuevos: UsuarioNuevo[];
  addCanasta: (canasta: Omit<Canasta, 'id'>) => void;
  addRegistro: (registro: Omit<RegistroAsociado, 'id'>) => void;
  addUsuarioNuevo: (usuario: Omit<UsuarioNuevo, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialCanastas: Canasta[] = [
  { id: '1', fecha: '2024-01-15', productor: 'José Martínez', cantidad: 25, tipo: 'Tommy Atkins', estado: 'entregada' },
  { id: '2', fecha: '2024-01-15', productor: 'María López', cantidad: 18, tipo: 'Ataulfo', estado: 'entregada' },
  { id: '3', fecha: '2024-01-16', productor: 'José Martínez', cantidad: 30, tipo: 'Kent', estado: 'entregada' },
  { id: '4', fecha: '2024-01-16', productor: 'Pedro Sánchez', cantidad: 22, tipo: 'Haden', estado: 'recogida' },
  { id: '5', fecha: '2024-01-17', productor: 'María López', cantidad: 15, tipo: 'Manila', estado: 'pendiente' },
  { id: '6', fecha: '2024-01-17', productor: 'José Martínez', cantidad: 28, tipo: 'Tommy Atkins', estado: 'recogida' },
  { id: '7', fecha: '2024-01-18', productor: 'Pedro Sánchez', cantidad: 20, tipo: 'Keitt', estado: 'pendiente' },
  { id: '8', fecha: '2024-01-18', productor: 'María López', cantidad: 35, tipo: 'Ataulfo', estado: 'recogida' },
];

const initialRegistros: RegistroAsociado[] = [
  { id: '1', asociadoId: '2', asociadoNombre: 'José Martínez', fecha: '2024-01-15', producto: 'Tommy Atkins', cantidadCajas: 50, cantidadCanastas: 25, notas: 'Cosecha excelente' },
  { id: '2', asociadoId: '3', asociadoNombre: 'María López', fecha: '2024-01-15', producto: 'Ataulfo', cantidadCajas: 36, cantidadCanastas: 18, notas: 'Fruta madura lista' },
  { id: '3', asociadoId: '2', asociadoNombre: 'José Martínez', fecha: '2024-01-16', producto: 'Kent', cantidadCajas: 60, cantidadCanastas: 30, notas: 'Gran producción' },
];

const initialUsuarios: UsuarioNuevo[] = [
  { id: '1', nombre: 'Roberto Díaz', email: 'roberto@email.com', rol: 'cliente', fechaRegistro: '2024-01-18' },
  { id: '2', nombre: 'Laura Fernández', email: 'laura@email.com', rol: 'cliente', fechaRegistro: '2024-01-17' },
  { id: '3', nombre: 'Miguel Torres', email: 'miguel@email.com', rol: 'asociado', fechaRegistro: '2024-01-16' },
  { id: '4', nombre: 'Sofía Vargas', email: 'sofia@email.com', rol: 'cliente', fechaRegistro: '2024-01-15' },
  { id: '5', nombre: 'Andrés Morales', email: 'andres@email.com', rol: 'cliente', fechaRegistro: '2024-01-14' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [canastas, setCanastas] = useState<Canasta[]>(initialCanastas);
  const [registros, setRegistros] = useState<RegistroAsociado[]>(initialRegistros);
  const [usuariosNuevos, setUsuariosNuevos] = useState<UsuarioNuevo[]>(initialUsuarios);

  const addCanasta = (canasta: Omit<Canasta, 'id'>) => {
    setCanastas(prev => [...prev, { ...canasta, id: String(Date.now()) }]);
  };

  const addRegistro = (registro: Omit<RegistroAsociado, 'id'>) => {
    setRegistros(prev => [...prev, { ...registro, id: String(Date.now()) }]);
  };

  const addUsuarioNuevo = (usuario: Omit<UsuarioNuevo, 'id'>) => {
    setUsuariosNuevos(prev => [...prev, { ...usuario, id: String(Date.now()) }]);
  };

  return (
    <DataContext.Provider value={{ canastas, registros, usuariosNuevos, addCanasta, addRegistro, addUsuarioNuevo }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
