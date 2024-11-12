// src/integration_tests/profile.test.ts

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from '../models/user';
import ProfileModel from '../models/profile';
import { generateJWT } from '../services/user';
import { connectDb } from '../config/db';

describe('CreateProfile Integration Test', () => {
    let defaultUser: any;
    let userObject: any;
    let token: string;

    beforeAll(async () => {
        await connectDb();

        // Create a default user
        defaultUser = {
            email: 'defaultuser@example.com',
            password: 'Password123!', // Assuming password is hashed in the UserModel pre-save hook
        };

        const user = new UserModel(defaultUser);
        userObject = await user.save();

        // Generate JWT token expiring tomorrow (1 day)
        const userId = user._id.toString();
        const email = user.email;
        token = await generateJWT(userId, email);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await UserModel.deleteMany({});

        const user = new UserModel(defaultUser);
        userObject = await user.save();
        const userId = userObject._id.toString();
        const email = user.email;
        token = await generateJWT(userId, email);
    });

    it('should create a new profile successfully', async () => {
        const profileData = {
            username: 'testuser',
            dateOfBirth: '1990-01-01',
            year: 'Senior',
            major: 'Computer Science',
            college: 'Engineering',
            classes: 'CS101, CS102',
            hobby: 'Reading',
            musicPreference: 'Rock',
            favArtists: 'Artist1, Artist2',
            contact: 'testuser@example.com',
            description: 'This is a test user.', // Optional
        };

        const response = await request(app)
            .put('/profile')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(profileData);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe(`Profile for userId ${userObject._id.toString()} has been successfully created`);

        // Verify profile is in the database
        const profileInDb = await ProfileModel.findOne({ userId: userObject._id.toString() }).lean();
        expect(profileInDb).toBeDefined();
        expect(profileInDb?.username).toBe(profileData.username);
        expect(profileInDb?.friend).toEqual([]);
        expect(profileInDb?.friend_requested).toEqual([]);
    });

    it('should fail when required parameters are missing', async () => {
        const incompleteProfileData = {
            username: 'incompleteuser',
            // Missing other required fields
        };

        const response = await request(app)
            .put('/profile')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(incompleteProfileData);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('failure');
        expect(response.body.message).toContain('Request is missing required parameters: username, dateOfBirth, year, major, college, classes, hobby, musicPreference, favArtists, contact');

        // Verify profile is not in the database
        const profileInDb = await ProfileModel.findOne({ userId: userObject._id.toString() });
        expect(profileInDb).toBeNull();
    });

    it('should fail when creating a duplicate profile', async () => {
        const profileData = {
            username: 'testuser',
            dateOfBirth: '1990-01-01',
            year: 'Senior',
            major: 'Computer Science',
            college: 'Engineering',
            classes: 'CS101, CS102',
            hobby: 'Reading',
            musicPreference: 'Rock',
            favArtists: 'Artist1, Artist2',
            contact: 'testuser@example.com',
            description: 'This is a test user.',
        };

        // First creation
        await request(app)
            .put('/profile')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(profileData);

        // Attempt duplicate creation
        const response = await request(app)
            .put('/profile')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(profileData);

        expect(response.status).toBe(409);
        expect(response.body.status).toBe('failure');
        expect(response.body.message).toBe('A profile for this user already exists');

        // Verify only one profile exists in the database
        const profilesInDb = await ProfileModel.find({ userId: userObject._id.toString() });
        expect(profilesInDb.length).toBe(1);
    });

    it('should handle validation errors', async () => {
        const invalidProfileData = {
            username: 'testuser',
            dateOfBirth: 'invalid-date',
            year: 'Senior',
            major: 'Computer Science',
            college: 'Engineering',
            classes: 'CS101, CS102',
            hobby: 'Reading',
            musicPreference: 'Rock',
            favArtists: 'Artist1, Artist2',
            contact: 'invalid-email-format',
            description: 'This is a test user.',
        };

        const response = await request(app)
            .put('/profile')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(invalidProfileData);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('failure');
        expect(response.body.message).toContain('Validation Error: Cast to date failed for value \"Invalid Date\" (type Date) at path \"dateOfBirth\"');

        // Verify profile is not in the database
        const profileInDb = await ProfileModel.findOne({ userId: userObject._id.toString() });
        expect(profileInDb).toBeNull();
    });

    it('should handle unexpected server errors', async () => {
        const profileData = {
            username: 'testuser',
            dateOfBirth: '1990-01-01',
            year: 'Senior',
            major: 'Computer Science',
            college: 'Engineering',
            classes: 'CS101, CS102',
            hobby: 'Reading',
            musicPreference: 'Rock',
            favArtists: 'Artist1, Artist2',
            contact: 'testuser@example.com',
            description: 'This is a test user.',
        };

        // Mock ProfileModel to throw an unexpected error
        jest.spyOn(ProfileModel.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Unexpected server error');
        });

        const response = await request(app)
            .put('/profile')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(profileData);

        expect(response.status).toBe(500);
        expect(response.body.status).toBe('failure');
        expect(response.body.message).toBe('There was a failure while trying to create the profile, please try again');

        // Restore the original implementation
        jest.restoreAllMocks();
    });

    it('should fail when JWT token is missing', async () => {
        const profileData = {
            username: 'testuser',
            dateOfBirth: '1990-01-01',
            year: 'Senior',
            major: 'Computer Science',
            college: 'Engineering',
            classes: 'CS101, CS102',
            hobby: 'Reading',
            musicPreference: 'Rock',
            favArtists: 'Artist1, Artist2',
            contact: 'testuser@example.com',
            description: 'This is a test user.',
        };

        const response = await request(app)
            .put('/profile')
            .set('Accept', 'application/json')
            // No Authorization header
            .send(profileData);

        expect(response.status).toBe(403); // Updated to 403 as per middleware

        // Verify profile is not in the database
        const profileInDb = await ProfileModel.findOne({ userId: userObject._id.toString() });
        expect(profileInDb).toBeNull();
    });

    it('should fail when JWT token is invalid', async () => {
        const profileData = {
            username: 'testuser',
            dateOfBirth: '1990-01-01',
            year: 'Senior',
            major: 'Computer Science',
            college: 'Engineering',
            classes: 'CS101, CS102',
            hobby: 'Reading',
            musicPreference: 'Rock',
            favArtists: 'Artist1, Artist2',
            contact: 'testuser@example.com',
            description: 'This is a test user.',
        };

        const invalidToken = 'invalid.jwt.token';

        const response = await request(app)
            .put('/profile')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send(profileData);

        expect(response.status).toBe(403);
        // Verify profile is not in the database
        const profileInDb = await ProfileModel.findOne({ userId: userObject._id.toString() });
        expect(profileInDb).toBeNull();
    });
});
