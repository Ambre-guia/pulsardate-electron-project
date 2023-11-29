import { IEvent } from "../interfaces/event";

export {};
declare global {
  interface Window {
    electron: {
      getEvents: () => Promise<any>;
      getCurrentMonth: () => Promise<any>;
      getCurrentYear: () => Promise<any>;
      getFirstDayOfMonth: (month: number, year: number) => Promise<any>;
      getLastDayOfMonth: (month: number, year: number) => Promise<any>;
    };
  }
}
