import { IEvent } from "../interfaces/event";

export { };

declare global {
  interface Window {
    electron: {
      // Functions related to events
      getAll: () => Promise<IEvent[]>;
      createEvent: (event: IEvent) => Promise<number | null>;
      deleteEvent: (eventId: number) => void;
      updateEvent: (eventId: number, updatedEvent: IEvent) => Promise<any>;
      getEventById: (eventId: number) => Promise<any>;
      onUpdateEvent: (cb: any) => void;
      onUpdateImport: (cb: any) => void;

      // Functions related to windows
      createUpdateWindowEvent: (eventId: number) => Promise<any>;
      createUpdateWindow: (eventId: number) => Promise<any>;
      createImportWindow: (event: IEvent) => Promise<any>;
      closeWindow: () => void;
      closeUpdateWindow: () => void;
      closeImportWindow: () => void;
      reloadWindow: () => void;
      reloadUpdateWindow: (eventId: number) => Promise<any>;

      // Functions related to dates
      getCurrentMonth: () => Promise<any>;
      getCurrentYear: () => Promise<any>;
      getFirstDayOfMonth: (month: number, year: number) => Promise<any>;
      getLastDayOfMonth: (month: number, year: number) => Promise<any>;

      // Other utility functions
      generateICS: (event: IEvent) => Promise<any>;
    };
  }
}
