import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'asociado' | 'cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios simulados
const users = [
  { id: '1', name: 'Admin Principal', email: 'admin@asomanpesc.com', password: 'admin123', role: 'admin' as UserRole },
  { id: '2', name: 'José Martínez', email: 'jose@asomanpesc.com', password: 'asociado123', role: 'asociado' as UserRole },
  { id: '3', name: 'María López', email: 'maria@asomanpesc.com', password: 'asociado123', role: 'asociado' as UserRole },
  { id: '4', name: 'Carlos Rodríguez', email: 'carlos@cliente.com', password: 'cliente123', role: 'cliente' as UserRole },
  { id: '5', name: 'Ana García', email: 'ana@cliente.com', password: 'cliente123', role: 'cliente' as UserRole },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
