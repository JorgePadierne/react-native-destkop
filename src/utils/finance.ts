import {Integrante} from '../types';

export const calculateDebtStatus = (
  integrante: Integrante,
): 'DEUDA' | 'AL_DIA' => {
  // Use the new API fields for debt calculation
  // The API already provides this information

  // If all payments are up to date
  if (integrante.todosPagados) {
    return 'AL_DIA';
  }

  // If there are any overdue months
  if (integrante.cantidadMesesMorosos > 0) {
    return 'DEUDA';
  }

  // Default to up to date if no debt indicators
  return 'AL_DIA';
};
