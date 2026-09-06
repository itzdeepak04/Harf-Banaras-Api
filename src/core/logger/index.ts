import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  log(message: string, context?: string) {
    super.log(message, context || 'APP');
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context || 'APP');
  }

  warn(message: string, context?: string) {
    super.warn(message, context || 'APP');
  }

  debug(message: string, context?: string) {
    super.debug(message, context || 'APP');
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context || 'APP');
  }
}

export default AppLogger;
