// db.test.js

import mongoose from 'mongoose';
import { connectDb } from '../db';

describe('connectDb', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call mongoose.connect with correct arguments', () => {

    process.env.DATABASE_USER = 'testuser';
    process.env.DATABASE_PASSWORD = 'testpassword';
    process.env.NODE_ENV = '';

    const connectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValue(mongoose);

    connectDb();

    const expectedUri = `mongodb+srv://testuser:testpassword@mongocluster.erslo.mongodb.net/?retryWrites=true&w=majority&appName=CSE110project`;
    const expectedOptions = { useNewUrlParser: true };

    expect(connectSpy).toHaveBeenCalledWith(expectedUri, expectedOptions, expect.any(Function));

    connectSpy.mockRestore();
  });

});
