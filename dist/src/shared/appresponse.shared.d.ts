import { HttpStatus } from '@nestjs/common';
export interface AppResponse<T = any> {
    statusCode: HttpStatus;
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}
export declare function createResponse<T>(statusCode: HttpStatus, message: string, data?: T | null): AppResponse<T>;
