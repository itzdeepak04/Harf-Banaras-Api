"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponse = createResponse;
function createResponse(statusCode, message, data = null) {
    return {
        statusCode,
        success: statusCode >= 200 && statusCode < 300,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=appresponse.shared.js.map