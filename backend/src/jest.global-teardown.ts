import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalTeardown() {
    process.env.MONGO_URI = undefined;
    const mongoServer: MongoMemoryServer = (global).__MONGOINSTANCE;
    await mongoServer.stop();
}