import { createContext, useContext, useState, ReactNode } from 'react';
import { db } from '../services/database';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Inicializar DB si no está inicializada
    db.initialize();
    
    const found = db.getUserByEmail(email);
    if (found && found.password === password) {
      const { password: _, ...userData } = found;
      setUser(userData);
      db.updateUserLastLogin(found.id);
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
