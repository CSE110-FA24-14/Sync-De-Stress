
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import path from 'path';
import fs from 'fs';
import UserModel from '../models/user';
import { generateJWT } from '../services/user';
import { connectDb } from '../config/db';

describe('Upload Image Integration Test', () => {
    let defaultUser: any;
    let userObject: any;
    let token: string;

    beforeAll(async () => {
        await connectDb();

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        defaultUser = {
            email: `defaultuser_${uniqueSuffix}@example.com`,
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
        await UserModel.deleteMany({});
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

    it('should upload an image correctly', async () => {
        // Path to the sample image
        const sampleImagePath = path.join(__dirname, 'fixtures', 'sample-image.png');

        // Perform the upload request with authentication
        const response = await request(app)
            .post('/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('image', sampleImagePath);

        // Assertions for the upload response
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'File uploaded successfully');
        expect(response.body).toHaveProperty('fileUrl');

        // Extract the filename from the returned URL
        const fileUrl = response.body.fileUrl;
        const filename = path.basename(fileUrl);
        const filePath = path.join(__dirname, '..', '..', 'public', filename);

        // Check that the file exists in the public directory
        expect(fs.existsSync(filePath)).toBe(true);

        // Optionally, verify that the file is accessible via URL
        const fileResponse = await request(app).get(`/${filename}`);
        expect(fileResponse.status).toBe(200);
        expect(fileResponse.headers['content-type']).toMatch(/image\/(png|jpeg|jpg)/);

        // Clean up: delete the uploaded file after the test
        fs.unlinkSync(filePath);
    })

    it('should return 403 without token', async () => {
        // Path to the sample image
        const sampleImagePath = path.join(__dirname, 'fixtures', 'sample-image.png');

        // Perform the upload request without authentication
        const response = await request(app)
            .post('/upload')
            .attach('image', sampleImagePath);

        // Assertions for the unauthorized response
        expect(response.status).toBe(403);
    });

    it('should return 400 when no file is uploaded', async () => {
        // Perform the upload request with authentication but without attaching a file
        const response = await request(app)
            .post('/upload')
            .set('Authorization', `Bearer ${token}`);

        // Assertions for the bad request response
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'No file uploaded');
    });

});