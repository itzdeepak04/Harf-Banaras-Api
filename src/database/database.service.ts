import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  constructor() {}

  async healthCheck(): Promise<{ status: string }> {
    return { status: 'Database connection is healthy' };
  }
}
