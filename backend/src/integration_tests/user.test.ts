import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../server';
import UserModel from '../models/user';
import { connectDb } from '../config/db';

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'testsecret';

    await connectDb();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clear the database after each test
    await UserModel.deleteMany({});
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toContain('User with email test@example.com has been successfully saved');

    // Verify user is in the database
    const user = await UserModel.findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
    expect(user!.email).toBe('test@example.com');
  });

  it('should fail when there is duplicate emails', async () => {
    let response = await request(app).post('/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toContain('User with email test@example.com has been successfully saved');

    response = await request(app).post('/register').send({
        email: 'test@example.com',
        password: 'password123',
    });

    const user = await UserModel.find({ email: 'test@example.com' })
    expect(response.status).toBe(409);
    expect(response.body.status).toBe('failure');
    expect(response.body.message).toContain('the email provided was already used');
    expect(user.length).toBe(1);

  });

  it('should not register a user with missing password', async () => {
    const response = await request(app).post('/register').send({
      email: 'test2@example.com',
      // password is missing
    });

    expect(response.status).toBe(400); // Adjust if your API returns different status codes
    expect(response.body.status).toBe('failure');
    expect(response.body.message).toContain('request missing key params');

    // Verify user is not in the database
    const user = await UserModel.findOne({ email: 'test2@example.com' });
    expect(user).toBeNull();
  });

  it('should login an existing user', async () => {
    // Register a user first
    await request(app).post('/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('login successful');
    expect(response.body.email).toBe('test@example.com');
    expect(response.body.token).toBeDefined();

    const token = response.body.token;
    const JWT_SECRET = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    expect(decoded).toBeDefined();
    console.log(decoded)
    expect(decoded.id).toBeDefined();
    expect(decoded.email).toBe('test@example.com');

    // Optionally, verify token expiration, etc.
    expect(decoded.exp).toBeGreaterThan(decoded.iat!);
  });

  it('should not login with incorrect password', async () => {
    // Register a user first
    await request(app).post('/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('failure');
    expect(response.body.message).toContain('login unsuccessful due to incorrect email or password');
  });

  it('should not login non-existent user', async () => {
    const response = await request(app).post('/login').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('failure');
    expect(response.body.message).toContain('login unsuccessful due to incorrect email or password');
  });
});
