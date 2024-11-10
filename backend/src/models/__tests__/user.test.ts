// src/tests/userModel.test.ts
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from '../user';
import { UserInterface } from '../../shared/interface/modelInterface';

describe('User Model Test', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect mongoose to the in-memory database
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    // Disconnect mongoose and stop the server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clear all collections after each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it('should create & save a user successfully', async () => {
    const userData: Partial<UserInterface> = {
      email: 'test@example.com',
      password: 'Password123!',
      is_superuser: true,
    };

    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();

    // Assertions
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.is_superuser).toBe(true);
  });

  it('should default is_superuser to false if not provided', async () => {
    const userData: Partial<UserInterface> = {
      email: 'user2@example.com',
      password: 'Password123!',
    };

    const userWithoutSuperuser = new UserModel(userData);
    const savedUser = await userWithoutSuperuser.save();

    // Assertions
    expect(savedUser._id).toBeDefined();
    expect(savedUser.is_superuser).toBe(false);
  });

  it('should fail to create a user without required fields', async () => {
    const userData: Partial<UserInterface> = {
      email: 'user3@example.com',
    };

    const userWithoutPassword = new UserModel(userData);
    let err: mongoose.Error.ValidationError | undefined = undefined;

    try {
      await userWithoutPassword.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    // Assertions
    expect(err).toBeDefined();
    expect(err?.errors).toHaveProperty('password');
  });

  it('should fail when email is not provided', async () => {
    const userData: Partial<UserInterface> = {
      password: 'Password123!',
    };

    const userWithoutEmail = new UserModel(userData);
    let err: mongoose.Error.ValidationError | undefined = undefined;

    try {
      await userWithoutEmail.save();
    } catch (error) {
      err = error as mongoose.Error.ValidationError;
    }

    // Assertions
    expect(err).toBeDefined();
    expect(err?.errors).toHaveProperty('email');
  });
});
