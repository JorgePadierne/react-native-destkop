import {Integrante} from '../types';

export const calculateDebtStatus = (
  integrante: Integrante,
): 'DEUDA' | 'AL_DIA' => {
  // Simple logic: check if there are any unpaid months in the current year (or all years)
  // For this example, let's assume we check all recorded years.
  // If any month is false (unpaid) and it is a past month, they are in debt.

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11

  for (const anioData of integrante.cuotasPorAnio) {
    if (anioData.anio < currentYear) {
      // Past year: all months should be paid
      if (anioData.meses.some(pagado => !pagado)) {
        return 'DEUDA';
      }
    } else if (anioData.anio === currentYear) {
      // Current year: check months up to current month
      for (let i = 0; i <= currentMonth; i++) {
        if (!anioData.meses[i]) {
          return 'DEUDA';
        }
      }
    }
  }

  return 'AL_DIA';
};
