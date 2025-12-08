// /src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {createAuthApi} from '../api/auth';
import {LoginResponse} from '../types';
import {useAxios} from './AxiosContext';

interface AuthContextValue {
  user: LoginResponse['user'] | null;
  token: string | null;
  loading: boolean;
  login: (nombreAdmin: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const {axiosInstance, setAuthToken, clearAuthToken, isTokenLoaded} =
    useAxios();
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const authApi = createAuthApi(axiosInstance);

  // Check if user is already authenticated on mount
  useEffect(() => {
    if (isTokenLoaded && token) {
      // Token exists, user is authenticated
      // You might want to validate the token or fetch user data here
    }
  }, [isTokenLoaded, token]);

  const login = async (nombreAdmin: string, password: string) => {
    setLoading(true);
    try {
      console.log('AUTH: Starting login...');
      const res = await authApi.login(nombreAdmin, password);
      console.log('AUTH: Login successful, token:', res.token);
      setUser(res.user);
      setToken(res.token);
      console.log('AUTH: Saving token to AsyncStorage...');
      await setAuthToken(res.token);
      console.log('AUTH: Token saved successfully');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuthToken();
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
