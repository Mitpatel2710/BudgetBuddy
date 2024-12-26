import { format, isThisMonth, parseISO } from 'date-fns';

export function getMonthName(date: Date): string {
  return format(date, 'MMMM');
}

export function getLastTwelveMonths(): { month: string; year: number; date: Date }[] {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      month: getMonthName(date),
      year: date.getFullYear(),
      date: date
    });
  }
  
  return months;
}

export function isCurrentMonth(date: string): boolean {
  return isThisMonth(parseISO(date));
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'MM/dd/yyyy');
}

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}