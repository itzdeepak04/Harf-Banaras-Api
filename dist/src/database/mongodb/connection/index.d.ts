import { MongoClient } from 'mongodb';
export declare class MongoDBConnection {
    private client;
    private connected;
    connect(uri: string): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getClient(): MongoClient;
}
