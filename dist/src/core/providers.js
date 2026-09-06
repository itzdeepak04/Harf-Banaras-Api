"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportProviders = exports.importProviders = exports.getProviders = void 0;
const appconfig_service_1 = require("../config/appconfig.service");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const response_handler_1 = require("./middleware/response-handler");
const getProviders = () => {
    return [
        appconfig_service_1.AppConfigService,
        {
            provide: core_1.APP_INTERCEPTOR,
            useClass: response_handler_1.ResponseHandler,
        },
    ];
};
exports.getProviders = getProviders;
const importProviders = () => {
    return [config_1.ConfigModule.forRoot({ envFilePath: '.env' }),
    ];
};
exports.importProviders = importProviders;
const exportProviders = () => {
    return [appconfig_service_1.AppConfigService];
};
exports.exportProviders = exportProviders;
//# sourceMappingURL=providers.js.map