// /src/api/integrantes.ts
// API mock en memoria para Integrantes

import {Integrante} from '../types';

let integrantesDB: Integrante[] = [
  {
    id: '1',
    nombre: 'Juan Perez',
    alta: '2022-01-10',
    baja: null,
    cuotasPorAnio: [{anio: 2024, meses: Array(12).fill(false)}],
  },
  {
    id: '2',
    nombre: 'María López',
    alta: '2021-06-05',
    baja: null,
    cuotasPorAnio: [{anio: 2024, meses: Array(12).fill(false)}],
  },
  {
    id: '3',
    nombre: 'Carlos Sánchez',
    alta: '2020-09-15',
    baja: '2023-03-01',
    cuotasPorAnio: [{anio: 2024, meses: Array(12).fill(false)}],
  },
];

const simulateDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const getIntegrantes = async (): Promise<Integrante[]> => {
  await simulateDelay(400);
  return [...integrantesDB];
};
