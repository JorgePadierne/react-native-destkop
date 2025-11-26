// /src/types/index.ts
export interface CuotasPorAnio {
  anio: number;
  meses: boolean[]; // 12 posiciones, de Enero a Diciembre
}

export interface Integrante {
  id: string;
  nombre: string;
  alta: string;
  baja?: string | null;
  cuotasPorAnio: CuotasPorAnio[];
}

// Datos necesarios para crear un integrante (la API generará el id y las cuotas)
export interface IntegranteCreateInput {
  nombre: string;
  alta: string;
  baja?: string | null;
}

// Datos que se pueden actualizar de un integrante existente
export interface IntegranteUpdateInput {
  nombre?: string;
  alta?: string;
  baja?: string | null;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}
