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

export const addIntegrante = async (
  input: Omit<Integrante, 'id' | 'cuotasPorAnio'>,
): Promise<Integrante> => {
  await simulateDelay(400);
  const newId = (integrantesDB.length + 1).toString();
  const newIntegrante: Integrante = {
    ...input,
    id: newId,
    cuotasPorAnio: [
      {
        anio: new Date().getFullYear(),
        meses: Array(12).fill(false),
      },
    ],
  };
  integrantesDB.push(newIntegrante);
  return newIntegrante;
};

export const updateIntegrante = async (
  id: string,
  updates: Partial<Integrante>,
): Promise<Integrante> => {
  await simulateDelay(400);
  const index = integrantesDB.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Integrante no encontrado');

  integrantesDB[index] = {...integrantesDB[index], ...updates};
  return integrantesDB[index];
};

export const deleteIntegrante = async (id: string): Promise<void> => {
  await simulateDelay(400);
  // Soft delete logic if needed, or hard delete.
  // Requirement says "dar de baja", which usually means setting a date.
  // But if we want to remove from list or mark as inactive:
  const index = integrantesDB.findIndex(i => i.id === id);
  if (index !== -1) {
    // Here we could just remove it, or update 'baja' date if not handled by update.
    // Let's assume this is a hard delete for now or we use update for soft delete.
    // Re-reading requirements: "dar de baja" -> likely setting the baja date.
    // So this function might not be strictly necessary if we use update,
    // but good to have for "removing" completely if that's the intent.
    // Let's implement as hard delete for "removing" and use update for "baja".
    integrantesDB.splice(index, 1);
  }
};
