import { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  var __MONGOINSTANCE: MongoMemoryServer;

  namespace NodeJS {
    interface Global {
      __MONGOINSTANCE: MongoMemoryServer;
    }
  }
}