import { MongoClient } from 'mongodb';

/**
 * MongoDB Connection Manager
 */
export class MongoDBConnection {
  private client: MongoClient;
  private connected: boolean = false;

  async connect(uri: string) {
    try {
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.connected = true;
      console.log('✓ Connected to MongoDB');
    } catch (error) {
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

  isConnected(): boolean {
    return this.connected;
  }

  getClient(): MongoClient {
    return this.client;
  }
}
