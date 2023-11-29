"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastDayOfMonth = exports.getFirstDayOfMonth = exports.getCurrentYear = exports.getCurrentMonth = void 0;
function getCurrentMonth() {
    return new Date().getMonth() + 1;
}
exports.getCurrentMonth = getCurrentMonth;
function getCurrentYear() {
    return new Date().getFullYear();
}
exports.getCurrentYear = getCurrentYear;
function getFirstDayOfMonth(month, year) {
    return new Date(year, month - 1, 1);
}
exports.getFirstDayOfMonth = getFirstDayOfMonth;
function getLastDayOfMonth(month, year) {
    return new Date(year, month, 0);
}
exports.getLastDayOfMonth = getLastDayOfMonth;
//# sourceMappingURL=date.js.map