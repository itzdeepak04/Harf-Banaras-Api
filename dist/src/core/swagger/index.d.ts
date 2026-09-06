import { OpenAPIObject } from '@nestjs/swagger';
export declare function getSwaggerConfig(): Omit<OpenAPIObject, 'paths'>;
