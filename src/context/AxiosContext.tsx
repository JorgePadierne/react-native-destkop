import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import axios, {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

interface AxiosContextValue {
  axiosInstance: AxiosInstance;
  setAuthToken: (token: string) => Promise<void>;
  clearAuthToken: () => Promise<void>;
  isTokenLoaded: boolean;
  token: string | null;
}

const AxiosContext = createContext<AxiosContextValue | undefined>(undefined);

export function AxiosProvider({children}: {children: React.ReactNode}) {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: 'https://pleochroitic-multifid-gilberte.ngrok-free.dev',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return instance;
  }, []);

  // Update axios default headers when token changes
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }, [token, axiosInstance]);

  // Load token from AsyncStorage on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setIsTokenLoaded(true);
      }
    };
    loadToken();
  }, []);

  const setAuthToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  };

  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  return (
    <AxiosContext.Provider
      value={{
        axiosInstance,
        setAuthToken,
        clearAuthToken,
        isTokenLoaded,
        token,
      }}>
      {children}
    </AxiosContext.Provider>
  );
}

export function useAxios() {
  const context = useContext(AxiosContext);
  if (context === undefined) {
    throw new Error('useAxios must be used within an AxiosProvider');
  }
  return context;
}
