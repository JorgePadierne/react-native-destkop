// /src/api/integrantes.ts
import {
  Integrante,
  IntegranteCreateInput,
  IntegranteUpdateInput,
} from '../types';
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
    getAll: async (activo: boolean = true): Promise<Integrante[]> => {
      try {
        const response = await axiosInstance.get(
          `/asociated/getall/${activo}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          },
        );
        return response.data;
      } catch (error: any) {
        console.error(
          `Error fetching asociados (activo=${activo}):`,
          error.response?.data || error.message,
        );
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
        console.error('--- ERROR CREATING INTEGRANTE ---');
        console.error('Payload sent:', input);
        console.error('Status:', error.response?.status);
        console.error('Server Message:', error.response?.data);

        throw new Error(
          error.response?.data?.message ||
            `Error al crear el asociado (${error.response?.status})`,
        );
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
        throw new Error('Error al eliminar el asociado:');
      }
    },

    /**
     * Update an asociado by ID
     * PATCH /asociated/update/:id
     */
    update: async (
      id: number,
      input: IntegranteUpdateInput,
    ): Promise<Integrante> => {
      try {
        console.log('Updating asociado:', id, input);
        const response = await axiosInstance.patch(
          `/asociated/update/${id}`,
          input,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          },
        );
        console.log('Asociado updated:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Error updating asociado:', error);
        if (error.response?.status === 404) {
          throw new Error('Asociado no encontrado');
        }
        if (error.response?.status === 400) {
          const message = error.response?.data?.message;
          throw new Error(message || 'Datos inválidos');
        }
        throw new Error('Error al actualizar el asociado');
      }
    },

    /**
     * Get a single asociado by ID (helper method)
     * This might not have a specific endpoint, so we get all and filter
     */
    getById: async (id: number): Promise<Integrante | null> => {
      try {
        const [active, inactive] = await Promise.all([
          api.getAll(true),
          api.getAll(false),
        ]);
        const all = [...active, ...inactive];
        return all.find(i => i.id_asociado === id) || null;
      } catch (error) {
        console.error('Error fetching asociado by ID:', error);
        return null;
      }
    },
  };

  return api;
};
