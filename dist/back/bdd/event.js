"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.createEvent = exports.getAll = void 0;
const log_js_1 = require("./log.js");
function getAll() {
    return new Promise((res, reject) => {
        log_js_1.default.query("SELECT * from event", (err, result) => {
            if (err)
                reject(err);
            else
                res(result);
        });
    });
}
exports.getAll = getAll;
// CREATE
async function createEvent(event) {
    return new Promise((resolve, reject) => {
        log_js_1.default.query("INSERT INTO event SET ?", event, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.insertId);
            }
        });
    });
}
exports.createEvent = createEvent;
// READ
async function getEventById(eventId) {
    return new Promise((resolve, reject) => {
        log_js_1.default.query("SELECT * FROM event WHERE id = ?", [eventId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                if (result.length === 0) {
                    resolve(null);
                }
                else {
                    resolve(result[0]);
                }
            }
        });
    });
}
exports.getEventById = getEventById;
// UPDATE
async function updateEvent(eventId, updatedEvent) {
    return new Promise((resolve, reject) => {
        log_js_1.default.query("UPDATE event SET ? WHERE id = ?", [updatedEvent, eventId], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.updateEvent = updateEvent;
// DELETE
async function deleteEvent(eventId) {
    return new Promise((resolve, reject) => {
        log_js_1.default.query("DELETE FROM event WHERE id = ?", [eventId], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=event.js.map