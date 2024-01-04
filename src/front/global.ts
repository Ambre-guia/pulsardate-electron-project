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
      closeUpdateWindow: () => void;
      reloadWindow: () => void;
      deleteEvent: (eventId:number)=> void;
      reloadUpdateWindow: (eventId: number) => Promise<any>;
      getEventById: (eventId: number) => Promise<any>;
      createUpdateWindowEvent:(eventId: number) => Promise<any>;
      onUpdateEvent: (cb: any) => void;
      updateEvent:(eventId: number, updatedEvent: IEvent)=> Promise<any>;
      generateICS:(event: IEvent) => Promise<any>;
    };
  }
}
