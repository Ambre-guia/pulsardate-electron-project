import { IEvent } from "../interfaces/event";

export {};
declare global {
  interface Window {
    electron: {
      getAll: () => Promise<IEvent[]>;
      getCurrentMonth: () => Promise<any>;
      getCurrentYear: () => Promise<any>;
      getFirstDayOfMonth: (month: number, year: number) => Promise<any>;
      getLastDayOfMonth: (month: number, year: number) => Promise<any>;
      createEvent: (event: IEvent) => Promise<number | null>;
      closeWindow: () => void; 
      reloadWindow: () => void;
    };
  }
}
