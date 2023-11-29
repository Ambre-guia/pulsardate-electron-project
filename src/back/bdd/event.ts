import log from "./log.js";

export function getAll() {
  return new Promise((res, reject) => {
    log.query("SELECT * from event", (err: any, result: any) => {
      if (err) reject(err);
      else res(result);
    });
  });
}
