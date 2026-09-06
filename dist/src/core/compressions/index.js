"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompressionConfig = getCompressionConfig;
const compression_1 = require("compression");
function getCompressionConfig() {
    return (0, compression_1.default)({
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression_1.default.filter(req, res);
        },
        level: 6,
    });
}
exports.default = compression_1.default;
//# sourceMappingURL=index.js.map