import { IEvent } from "../../interfaces/event.js";
import log from "./log.js";

export function getAll() {
  return new Promise((res, reject) => {
    log.query("SELECT * from event", (err: any, result: any) => {
      if (err) reject(err);
      else res(result);
    });
  });
}

// CREATE
export async function createEvent(event: IEvent): Promise<number | null> {
  return new Promise((resolve, reject) => {
    log.query("INSERT INTO event SET ?", event, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
}

// READ
export async function getEventById(eventId: number): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    log.query("SELECT * FROM event WHERE id = ?", [eventId], (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        if (result.length === 0) {
          resolve(null); 
        } else {
          resolve(result[0]);
        }
      }
    });
  });
}

// UPDATE
export async function updateEvent(eventId: number, updatedEvent: IEvent): Promise<boolean> {
  return new Promise((resolve, reject) => {
    log.query("UPDATE event SET ? WHERE id = ?", [updatedEvent, eventId], (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(true); 
      }
    });
  });
}

// DELETE
export async function deleteEvent(eventId: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    log.query("DELETE FROM event WHERE id = ?", [eventId], (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(true); 
      }
    });
  });
}
