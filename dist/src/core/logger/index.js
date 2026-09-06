"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = void 0;
const common_1 = require("@nestjs/common");
class AppLogger extends common_1.Logger {
    log(message, context) {
        super.log(message, context || 'APP');
    }
    error(message, trace, context) {
        super.error(message, trace, context || 'APP');
    }
    warn(message, context) {
        super.warn(message, context || 'APP');
    }
    debug(message, context) {
        super.debug(message, context || 'APP');
    }
    verbose(message, context) {
        super.verbose(message, context || 'APP');
    }
}
exports.AppLogger = AppLogger;
exports.default = AppLogger;
//# sourceMappingURL=index.js.map