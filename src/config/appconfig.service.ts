import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get('PORT')) || 3000;
  }

  get mongoUri(): string {
    return this.configService.get<string>('MONGO_URI');
  }
}
