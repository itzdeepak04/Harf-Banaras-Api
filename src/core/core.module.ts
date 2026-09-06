import { Global, Module } from '@nestjs/common';
import { getProviders, importProviders, exportProviders } from './providers';

/**
 * Core Module
 * 
 * Global module that provides core application functionality
 * Includes:
 * - Configuration management
 * - Response handling interceptor
 * - Global providers
 */
@Global()
@Module({
  providers: [...getProviders()],
  imports: [...importProviders()],
  exports: [...exportProviders()],
})
export class CoreModule {}
