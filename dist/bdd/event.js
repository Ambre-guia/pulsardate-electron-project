var log = require("./log.js");
function getAll() {
    return new Promise(function (res, reject) {
        log.query("SELECT * from event", function (err, result) {
            if (err)
                reject(err);
            else
                res(result);
        });
    });
}
module.exports = {
    getAll: getAll,
};
//# sourceMappingURL=event.js.map