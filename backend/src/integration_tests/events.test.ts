import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import EventModel from '../models/events';
import UserModel from '../models/user';
import ProfileModel from '../models/profile';
import { generateJWT } from '../services/user';
import { connectDb } from '../config/db';

describe('Events Integration Test', () => {
    let defaultUser: any;
    let userObject: any;
    let token: string;
    let eventIds: string[] = [];

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

        await new ProfileModel({
            userId: userId,
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
        }).save();

        const events = [
            {
                eventName: 'Event 1',
                description: 'First event',
                eventDate: new Date('2023-01-01'),
                location: 'Location 1',
                priceEstimate: 10,
                coverPhoto: 'cover1.jpg',
                userRegistered: [userId, 'test', 'test2']
            },
            {
                eventName: 'Event 2',
                description: 'Second event',
                eventDate: new Date('2023-01-03'),
                location: 'Location 2',
                priceEstimate: 20,
                coverPhoto: 'cover2.jpg',
                userRegistered: []
            },
            {
                eventName: 'Event 3',
                description: 'Third event',
                eventDate: new Date('2023-01-02'),
                location: 'Location 3',
                priceEstimate: 30,
                coverPhoto: 'cover3.jpg',
                userRegistered: []
            }
        ];

        const insertedEvents = await EventModel.insertMany(events);
        eventIds = insertedEvents.map(event => event._id.toString());
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ProfileModel.deleteMany({});
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
        await ProfileModel.deleteMany({});

        const user = new UserModel(defaultUser);
        userObject = await user.save();
        const userId = userObject._id.toString();
        const email = user.email;
        token = await generateJWT(userId, email);

        await new ProfileModel({
            userId: userId,
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
        }).save();
    });

    describe("get all event tests", () => {
        it('should return all events sorted by date ascending when no parameters are provided', async () => {

            const response = await request(app)
                .get('/events')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            // Assert
            expect(response.body.status).toBe('success');
            expect(response.body.events).toHaveLength(3);

            const returnedEventNames = response.body.events.map((event: any) => event.eventName);
            expect(returnedEventNames).toEqual(['Event 1', 'Event 3', 'Event 2']);

            expect(response.body.events[0].attendee).toEqual(3);
            expect(response.body.events[0].registered).toBe(true);
            expect(response.body.events[1].attendee).toEqual(0);
            expect(response.body.events[1].registered).toBe(false);
            expect(response.body.events[2].attendee).toEqual(0);
            expect(response.body.events[2].registered).toBe(false);
        });

        it('should return events sorted by date descending when sort=dsc is provided', async () => {
            const response = await request(app)
                .get('/events?sort=dsc')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            // Assert
            expect(response.body.status).toBe('success');
            expect(response.body.events).toHaveLength(3);

            const returnedEventNames = response.body.events.map((event: any) => event.eventName);
            expect(returnedEventNames).toEqual(['Event 2', 'Event 3', 'Event 1']);
        });

        it('should return limited number of events when max parameter is provided', async () => {

            // Act
            const response = await request(app)
                .get('/events?max=2')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            // Assert
            expect(response.body.status).toBe('success');
            expect(response.body.events).toHaveLength(2);

            const returnedEventNames = response.body.events.map((event: any) => event.eventName);
            expect(returnedEventNames).toEqual(['Event 1', 'Event 3']);
        });

        it('should return error when invalid sort parameter is provided', async () => {
            // Act
            const response = await request(app)
                .get('/events?sort=invalid')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);

            // Assert
            expect(response.body.status).toBe('failure');
            expect(response.body.message).toBe("Invalid sort parameter. Allowed values are 'asc' or 'dsc'.");
        });

        it('should return error when invalid max parameter is provided', async () => {
            // Act
            const response = await request(app)
                .get('/events?max=-1')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);

            // Assert
            expect(response.body.status).toBe('failure');
            expect(response.body.message).toBe("Invalid max parameter. It must be a positive integer.");
        });

        it('should return unauthorized when no token is provided', async () => {
            // Act
            const response = await request(app)
                .get('/events')
                .expect(403);
        });
    });

    describe("register for event tests", () => {
        it('should successfully register for an event when not already registered', async () => {
            // Arrange
            const userId = userObject._id.toString();
            const eventIdToRegister = eventIds[1]; // Event 2, user is not registered

            // Act
            const response = await request(app)
                .post('/events/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ eventId: eventIdToRegister })
                .expect(200);

            console.log(response.body);

            // Assert
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Successfully registered for the event.');
            expect(response.body.unregistered).toBe(false);

            // Verify user's profile
            const updatedProfile = await ProfileModel.findOne({ userId });
            expect(updatedProfile!.event_registered).toContain(eventIdToRegister);

            // Verify event's userRegistered
            const updatedEvent = await EventModel.findById(eventIdToRegister);
            expect(updatedEvent!.userRegistered).toContain(userId);
        });

        it('should successfully unregister from an event when already registered', async () => {
            // Arrange
            const userId = userObject._id.toString();
            const eventIdToRegister = eventIds[1]; // Event 2

            // First, register the user for the event
            await request(app)
                .post('/events/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ eventId: eventIdToRegister })
                .expect(200);

            // Act
            const response = await request(app)
                .post('/events/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ eventId: eventIdToRegister })
                .expect(200);

            // Assert
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Successfully unregistered from the event.');
            expect(response.body.unregistered).toBe(true);

            // Verify user's profile
            const updatedProfile = await ProfileModel.findOne({ userId });
            expect(updatedProfile!.event_registered).not.toContain(eventIdToRegister);

            // Verify event's userRegistered
            const updatedEvent = await EventModel.findById(eventIdToRegister);
            expect(updatedEvent!.userRegistered).not.toContain(userId);
        });

        it('should return 404 when trying to register for a non-existent event', async () => {
            // Arrange
            const nonExistentEventId = mongoose.Types.ObjectId().toString();

            // Act
            const response = await request(app)
                .post('/events/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ eventId: nonExistentEventId })
                .expect(404);

            // Assert
            expect(response.body.status).toBe('failure');
            expect(response.body.message).toBe('Event not found.');
        });

        it('should return 400 when missing eventId in request body', async () => {
            // Act
            const response = await request(app)
                .post('/events/register')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .expect(400);

            // Assert
            expect(response.body.status).toBe('failure');
            expect(response.body.message).toContain('Request is missing key parameters');
        });

        it('should return unauthorized when no token is provided', async () => {
            // Arrange
            const eventIdToRegister = eventIds[1]; // Event 2

            // Act
            const response = await request(app)
                .post('/events/register')
                .send({ eventId: eventIdToRegister })
                .expect(403);
        });
    });

});