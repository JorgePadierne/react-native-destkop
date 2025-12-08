// /src/types/index.ts

// Payment structure from API
export interface Pago {
  id: number;
  id_persona: number;
  mes_anio_tmp: string; // ISO timestamp string
  monto: string; // String representation of decimal
}

// Main member/asociado interface matching API response
export interface Integrante {
  id_asociado: number;
  nombre_apellidos: string;
  fecha_alta_tmp: string; // ISO timestamp string
  fecha_baja_tmp: string | null; // ISO timestamp string or null
  todosPagados: boolean;
  cantidadMesesMorosos: number;
  mesesMorosos: string[]; // Array of "YYYY-MM" strings
  totalMeses: number;
  pagosRealizados: number;
  pagos: Pago[];
}

// Input for creating a new asociado (POST /asociated/create)
export interface IntegranteCreateInput {
  nombre_apellidos: string;
  fecha_alta_tmp: string; // Format: "YYYY-MM-DD" or ISO timestamp
  fecha_baja_tmp: string | null;
}

// Input for updating an asociado (if needed in the future)
export interface IntegranteUpdateInput {
  nombre_apellidos?: string;
  fecha_alta_tmp?: string;
  fecha_baja_tmp?: string | null;
}

// Login response from auth API
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}
