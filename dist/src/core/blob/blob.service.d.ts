import { ConfigService } from '@nestjs/config';
export declare class BlobService {
    private readonly config;
    private readonly client?;
    private readonly containerName;
    private readonly accountName;
    private readonly accountKey;
    constructor(config: ConfigService);
    createSasUrl(path: string, contentType: string, mode: 'upload' | 'read'): Promise<{
        path: string;
        url: string;
        expiresOn: Date;
    }>;
}
