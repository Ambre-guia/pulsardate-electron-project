"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
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
//# sourceMappingURL=event.js.map