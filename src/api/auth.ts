// /src/api/auth.ts
import {LoginResponse} from '../types';
import {AxiosInstance} from 'axios';

export const createAuthApi = (axiosInstance: AxiosInstance) => ({
  login: async (
    nombreAdmin: string,
    password: string,
  ): Promise<LoginResponse> => {
    try {
      console.log('LOGIN: Calling /auth/login with:', nombreAdmin);
      const response = await axiosInstance.post('/auth/login', {
        nombre_admin: nombreAdmin,
        password: password,
      });
      console.log('LOGIN: Response received:', response.data);
      console.log('LOGIN: Access token:', response.data.access_token);

      // The API returns { access_token: string }
      // Map it to our LoginResponse format
      const loginResponse = {
        token: response.data.access_token,
        user: {
          id: nombreAdmin, // Using nombre_admin as ID for now
          username: nombreAdmin,
        },
      };
      console.log('LOGIN: Returning token:', loginResponse.token);
      return loginResponse;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas');
      }
      throw new Error('Error al iniciar sesión');
    }
  },
});
