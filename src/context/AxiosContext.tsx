import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import axios, {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

interface AxiosContextValue {
  axiosInstance: AxiosInstance;
  setAuthToken: (token: string) => Promise<void>;
  clearAuthToken: () => Promise<void>;
  isTokenLoaded: boolean;
}

const AxiosContext = createContext<AxiosContextValue | undefined>(undefined);

export function AxiosProvider({children}: {children: React.ReactNode}) {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);
  const tokenRef = useRef<string | null>(null);

  // Update ref whenever token changes
  useEffect(() => {
    tokenRef.current = token;
    console.log('Token updated:', token ? 'Token exists' : 'No token');
  }, [token]);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: 'https://pleochroitic-multifid-gilberte.ngrok-free.dev',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Requiredfor ngrok
      },
    });

    // Request interceptor: Add Bearer token to all requests
    instance.interceptors.request.use(
      config => {
        const currentToken = tokenRef.current;
        console.log('INTERCEPTOR: Request interceptor called for:', config.url);
        console.log(
          'INTERCEPTOR: Current token in ref:',
          currentToken ? `${currentToken.substring(0, 20)}...` : 'null',
        );

        if (currentToken) {
          console.log('INTERCEPTOR: Adding Authorization header');
          // Set the Authorization header using axios syntax
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${currentToken}`;
          console.log('INTERCEPTOR: Authorization header set');
        } else {
          console.log('INTERCEPTOR: No token available for request');
        }
        return config;
      },
      error => {
        console.error('INTERCEPTOR: Request interceptor error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor: Handle 401 errors (token expiration)
    instance.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          console.log('Received 401, clearing token');
          // Token expired or invalid, clear it
          await clearAuthToken();
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, []); // Empty dependency array - instance created only once

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
      console.log(
        'AXIOS: Saving token to AsyncStorage, length:',
        newToken.length,
      );
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      console.log('AXIOS: Token saved and state updated');
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
      value={{axiosInstance, setAuthToken, clearAuthToken, isTokenLoaded}}>
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
