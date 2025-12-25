// /src/api/pagos.ts
import {PagoCreateInput, Pago} from '../types';
import {AxiosInstance} from 'axios';

export const createPagosApi = (
  axiosInstance: AxiosInstance,
  token: string | null,
) => {
  const api = {
    /**
     * Create a new payment
     * POST /payments/create
     */
    create: async (input: PagoCreateInput): Promise<Pago> => {
      try {
        // Validate date format
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(input.mes_anio_tmp)) {
          throw new Error('El formato de fecha debe ser YYYY-MM');
        }

        console.log('Creating payment:', input);
        const response = await axiosInstance.post('/payments/create', input, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        console.log('Payment created:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('--- ERROR CREATING PAYMENT ---');
        console.error('Payload sent:', input);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);

        if (error.response?.status === 400) {
          const message = error.response?.data?.message;
          if (message && message.includes('Ya existe un pago')) {
            throw new Error('Ya existe un pago para este mes');
          }
          throw new Error(`Datos inválidos: ${message || 'Error desconocido'}`);
        }

        // Propagate the original error message if possible
        const serverMessage =
          error.response?.data?.message ||
          error.response?.data ||
          error.message;
        throw new Error(
          `Error del servidor (${error.response?.status}): ${serverMessage}`,
        );
      }
    },

    /**
     * Get all payments for a specific asociado
     * GET /payments/get/:id?date=YYYY-MM
     */
    getByAsociado: async (id: number, date?: string): Promise<Pago[]> => {
      try {
        // Validate optional date format
        if (date && !/^\d{4}-(0[1-9]|1[0-2])$/.test(date)) {
          throw new Error('El formato de fecha debe ser YYYY-MM');
        }

        const url = date
          ? `/payments/get/${id}?date=${date}`
          : `/payments/get/${id}/`;

        console.log('Fetching payments for asociado:', id, 'with date:', date);
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        console.log('Payments fetched:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Error fetching payments:', error);
        throw new Error('Error al obtener los pagos');
      }
    },
  };

  return api;
};
