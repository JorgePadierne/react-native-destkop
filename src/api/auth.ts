// /src/api/auth.ts
// API mock en memoria para autenticación

import {LoginResponse} from '../types';

const simulateDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const login = async (
  usuario: string,
  contraseña: string,
): Promise<LoginResponse> => {
  await simulateDelay(400);

  // Mock muy simple: acepta cualquier usuario/contraseña no vacíos
  if (!usuario || !contraseña) {
    throw new Error('Usuario o contraseña inválidos');
  }

  return {
    token: 'mock-token-' + Date.now().toString(),
    user: {
      id: '1',
      username: usuario,
    },
  };
};
