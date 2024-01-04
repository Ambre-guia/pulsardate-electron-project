import { IEvent } from "../interfaces/event";

export {};

declare global {
  interface Window {
    electron: {
      // Fonctions liées aux événements
      getAll: () => Promise<IEvent[]>;
      createEvent: (event: IEvent) => Promise<number | null>;
      deleteEvent: (eventId: number) => void;
      updateEvent: (eventId: number, updatedEvent: IEvent) => Promise<any>;
      getEventById: (eventId: number) => Promise<any>;
      onUpdateEvent: (cb: any) => void;
      onUpdateImport: (cb: any) => void;
      
      // Fonctions liées aux fenêtres
      createUpdateWindowEvent:(eventId: number) => Promise<any>;
      createUpdateWindow: (eventId: number) => Promise<any>;
      createImportWindow: (event: IEvent) => Promise<any>;
      closeWindow: () => void;
      closeUpdateWindow: () => void;
      closeImportWindow: () => void;
      reloadWindow: () => void;
      reloadUpdateWindow: (eventId: number) => Promise<any>;

      // Fonctions liées aux dates
      getCurrentMonth: () => Promise<any>;
      getCurrentYear: () => Promise<any>;
      getFirstDayOfMonth: (month: number, year: number) => Promise<any>;
      getLastDayOfMonth: (month: number, year: number) => Promise<any>;

      // Autres fonctions utilitaires
      generateICS: (event: IEvent) => Promise<any>;
    };
  }
}

