"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = require("mysql2");
exports.default = (0, mysql2_1.createConnection)({
    host: "localhost",
    user: "root",
    port: 3306,
    database: "pulsardate",
});
//# sourceMappingURL=log.js.map