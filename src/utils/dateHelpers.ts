// /src/utils/dateHelpers.ts
import {Pago, CuotasPorAnio} from '../types';

/**
 * Generate an array of months in "YYYY-MM" format between two dates
 * @param fechaAlta - Start date in "YYYY-MM-DD" format
 * @param fechaBaja - End date in "YYYY-MM-DD" format or null (uses current date)
 * @returns Array of month strings in "YYYY-MM" format
 */
export const generateMonthsRange = (
  fechaAlta: string,
  fechaBaja: string | null,
): string[] => {
  // Fix: Parse string dates as UTC to avoid timezone shifts (e.g. 2023-11-01 -> 2023-10-31)
  const parseDate = (d: string | Date | null): Date => {
    if (!d) return new Date();
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) {
      const [y, m, day] = d.split('T')[0].split('-').map(Number);
      return new Date(y, m - 1, day);
    }
    return new Date(d);
  };

  const startDate = parseDate(fechaAlta);
  const endDate = parseDate(fechaBaja);

  const months: string[] = [];
  const current = new Date(startDate);

  // Set to first day of month
  current.setDate(1);

  while (current <= endDate) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}`);

    // Move to next month
    current.setMonth(current.getMonth() + 1);
  }

  return months;
};

/**
 * Convert a Date or ISO string to "YYYY-MM" format
 * @param date - Date object or ISO string
 * @returns String in "YYYY-MM" format
 */
export const formatDateToYYYYMM = (date: Date | string): string => {
  if (typeof date === 'string') {
    // If it's a strict YYYY-MM string, return it as is
    if (/^\d{4}-\d{2}$/.test(date)) {
      return date;
    }
    // For ISO strings (e.g. 2023-09-30T22:00:00.000Z), we MUST parse to Date
    // to allow conversion to Local Time. Using substring would capture the UTC date (Sept 30)
    // instead of Local date (Oct 1).
    // Parse the date
    const d = new Date(date);

    // Add 12 hours to handle timezone offsets safely
    // This moves 'Previous Day 22:00' -> 'Current Day 10:00'
    // And 'Current Day 00:00' -> 'Current Day 12:00'
    // Ensuring we always land on the correct day/month
    d.setHours(d.getHours() + 12);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  const d = date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Parse payments array into CuotasPorAnio structure for PaymentGrid
 * @param pagos - Array of payments from API
 * @param fechaAlta - Member's start date
 * @param fechaBaja - Member's end date or null
 * @returns Array of years with monthly payment status
 */
export const parsePaymentsToCuotas = (
  pagos: Pago[],
  fechaAlta: string,
  fechaBaja: string | null,
): CuotasPorAnio[] => {
  // Generate all months the member should have paid
  const allMonths = generateMonthsRange(fechaAlta, fechaBaja);

  // Create a map of paid months for quick lookup (key: "YYYY-MM")
  const paidMap = new Map<string, {amount: string; id: number}>();

  pagos.forEach(pago => {
    const key = formatDateToYYYYMM(pago.mes_anio_tmp);
    paidMap.set(key, {amount: pago.monto, id: pago.id});
  });

  // Group by year
  const yearMap: {
    [year: number]: {paid: boolean; amount: string | null; id: number | null}[];
  } = {};

  allMonths.forEach(monthStr => {
    const [year, month] = monthStr.split('-').map(Number);

    if (!yearMap[year]) {
      // Initialize with 12 empty months
      yearMap[year] = Array.from({length: 12}, () => ({
        paid: false,
        amount: null,
        id: null,
      }));
    }

    // Check if we have payment data for this month
    const paymentData = paidMap.get(monthStr);
    if (paymentData) {
      yearMap[year][month - 1] = {
        paid: true,
        amount: paymentData.amount,
        id: paymentData.id,
      };
    }
  });

  // Convert to CuotasPorAnio array
  const result: CuotasPorAnio[] = Object.keys(yearMap)
    .map(year => ({
      anio: Number(year),
      meses: yearMap[Number(year)],
    }))
    .sort((a, b) => a.anio - b.anio);

  return result;
};

/**
 * Get the month string for a given year and month index
 * @param year - Year number
 * @param monthIndex - Month index (0-11)
 * @returns String in "YYYY-MM" format
 */
export const getMonthString = (year: number, monthIndex: number): string => {
  const month = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${month}`;
};
