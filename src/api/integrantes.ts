// /src/api/integrantes.ts
import {Integrante, IntegranteCreateInput} from '../types';
import {AxiosInstance} from 'axios';

export const createIntegrantesApi = (
  axiosInstance: AxiosInstance,
  token: string | null,
) => {
  const api = {
    /**
     * Get all asociados
     * GET /asociated/getall
     */
    getAll: async (): Promise<Integrante[]> => {
      try {
        console.log('Calling GET /asociated/getall...');
        console.log('Token available:', token ? 'YES' : 'NO');

        const response = await axiosInstance.get('/asociated/getall', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        console.log('API Response:', response.data);
        console.log('Response type:', typeof response.data);
        console.log('Is array:', Array.isArray(response.data));
        return response.data;
      } catch (error: any) {
        console.error('Error fetching asociados:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw new Error('Error al obtener los asociados');
      }
    },

    /**
     * Create a new asociado
     * POST /asociated/create
     */
    create: async (input: IntegranteCreateInput): Promise<Integrante> => {
      try {
        const response = await axiosInstance.post('/asociated/create', input, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        return response.data;
      } catch (error: any) {
        console.error('Error creating asociado:', error);
        throw new Error('Error al crear el asociado');
      }
    },

    /**
     * Delete an asociado by ID
     * DELETE /asociated/delete/{id}
     */
    deleteById: async (id: number): Promise<void> => {
      try {
        await axiosInstance.delete(`/asociated/delete/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
      } catch (error: any) {
        console.error('Error deleting asociado:', error);
        throw new Error('Error al eliminar el asociado');
      }
    },

    /**
     * Get a single asociado by ID (helper method)
     * This might not have a specific endpoint, so we get all and filter
     */
    getById: async (id: number): Promise<Integrante | null> => {
      try {
        const all = await api.getAll();
        return all.find(i => i.id_asociado === id) || null;
      } catch (error) {
        console.error('Error fetching asociado by ID:', error);
        return null;
      }
    },
  };

  return api;
};
