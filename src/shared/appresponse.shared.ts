import { HttpStatus } from '@nestjs/common';

export interface AppResponse<T = any> {
  statusCode: HttpStatus;
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export function createResponse<T>(
  statusCode: HttpStatus,
  message: string,
  data: T | null = null,
): AppResponse<T> {
  return {
    statusCode,
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}
