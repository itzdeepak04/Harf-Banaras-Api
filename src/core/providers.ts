import { AppConfigService } from '../config/appconfig.service';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseHandler } from './middleware/response-handler';

/**
 * Get core providers for dependency injection
 */
const getProviders = (): any[] => {
  return [
    AppConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseHandler,
    },
  ];
};

/**
 * Get modules to import
 */
const importProviders = (): any[] => {
  return [ ConfigModule.forRoot({envFilePath:'.env'}),
  ];
};

/**
 * Get providers to export
 */
const exportProviders = (): any[] => {
  return [AppConfigService];
};

export { getProviders, importProviders, exportProviders };
