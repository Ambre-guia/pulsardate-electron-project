export function getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }
  
  export function getCurrentYear(): number {
    return new Date().getFullYear();
  }
  
  export function getFirstDayOfMonth(month: number, year: number): Date {
    return new Date(year, month - 1, 1);
  }
  
  export function getLastDayOfMonth(month: number, year: number): Date {
    return new Date(year, month, 0);
  }
  