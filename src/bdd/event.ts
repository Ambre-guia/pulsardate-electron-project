const log = require("./log.js");

function getAll() {
  return new Promise((res, reject) => {
    log.query("SELECT * from event", (err: any, result: any) => {
      if (err) reject(err);
      else res(result);
    });
  });
}

module.exports = {
  getAll,
};
