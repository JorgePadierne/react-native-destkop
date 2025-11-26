// /src/api/integrantes.ts
// API mock en memoria para Integrantes

import {
  Integrante,
  IntegranteCreateInput,
  IntegranteUpdateInput,
  CuotasPorAnio,
} from '../types';

let integrantesDB: Integrante[] = [
  {
    id: '1',
    nombre: 'Juan Perez',
    alta: '2022-01-10',
    baja: null,
    cuotasPorAnio: [
      {anio: 2024, meses: Array(12).fill(false)},
    ],
  },
  {
    id: '2',
    nombre: 'María López',
    alta: '2021-06-05',
    baja: null,
    cuotasPorAnio: [
      {anio: 2024, meses: Array(12).fill(false)},
    ],
  },
  {
    id: '3',
    nombre: 'Carlos Sánchez',
    alta: '2020-09-15',
    baja: '2023-03-01',
    cuotasPorAnio: [
      {anio: 2024, meses: Array(12).fill(false)},
    ],
  },
];

const simulateDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const getIntegrantes = async (): Promise<Integrante[]> => {
  await simulateDelay(400);
  return [...integrantesDB];
};

export const addIntegrante = async (
  data: IntegranteCreateInput,
): Promise<Integrante> => {
  await simulateDelay(300);
  const nuevo: Integrante = {
    id: Date.now().toString(),
    cuotasPorAnio: [
      {anio: 2024, meses: Array(12).fill(false)},
    ],
    ...data,
  };
  integrantesDB = [...integrantesDB, nuevo];
  return nuevo;
};

export const updateIntegrante = async (
  id: string,
  data: IntegranteUpdateInput,
): Promise<Integrante | null> => {
  await simulateDelay(300);
  let updated: Integrante | null = null;
  integrantesDB = integrantesDB.map(i => {
    if (i.id === id) {
      const nuevo = {...i, ...data};
      updated = nuevo;
      return nuevo;
    }
    return i;
  });
  return updated;
};

export const deleteIntegrante = async (id: string): Promise<void> => {
  await simulateDelay(200);
  integrantesDB = integrantesDB.filter(i => i.id !== id);
};

export const updateCuotas = async (
  id: string,
  anio: number,
  meses: boolean[],
): Promise<Integrante | null> => {
  await simulateDelay(250);
  let updated: Integrante | null = null;
  integrantesDB = integrantesDB.map(i => {
    if (i.id === id) {
      const existentes = i.cuotasPorAnio || [];
      const idx = existentes.findIndex(c => c.anio === anio);
      let nuevasCuotasPorAnio: CuotasPorAnio[];
      if (idx >= 0) {
        nuevasCuotasPorAnio = existentes.map(c =>
          c.anio === anio ? {...c, meses: meses} : c,
        );
      } else {
        nuevasCuotasPorAnio = [...existentes, {anio, meses}];
      }
      const nuevo = {...i, cuotasPorAnio: nuevasCuotasPorAnio};
      updated = nuevo;
      return nuevo;
    }
    return i;
  });
  return updated;
};
