// /src/context/AuthContext.tsx
import React, {createContext, useContext, useState, ReactNode} from 'react';
import {login as loginApi} from '../api/auth';
import {LoginResponse} from '../types';

interface AuthContextValue {
  user: LoginResponse['user'] | null;
  token: string | null;
  loading: boolean;
  login: (usuario: string, contraseña: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (usuario: string, contraseña: string) => {
    setLoading(true);
    try {
      const res = await loginApi(usuario, contraseña);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{user, token, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
};
