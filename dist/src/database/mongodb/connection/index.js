"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBConnection = void 0;
const mongodb_1 = require("mongodb");
class MongoDBConnection {
    constructor() {
        this.connected = false;
    }
    async connect(uri) {
        try {
            this.client = new mongodb_1.MongoClient(uri);
            await this.client.connect();
            this.connected = true;
            console.log('✓ Connected to MongoDB');
        }
        catch (error) {
            console.error('✗ MongoDB connection failed:', error);
            throw error;
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.connected = false;
            console.log('✓ Disconnected from MongoDB');
        }
    }
    isConnected() {
        return this.connected;
    }
    getClient() {
        return this.client;
    }
}
exports.MongoDBConnection = MongoDBConnection;
//# sourceMappingURL=index.js.map