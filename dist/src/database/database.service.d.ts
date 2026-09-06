export declare class DatabaseService {
    constructor();
    healthCheck(): Promise<{
        status: string;
    }>;
}
