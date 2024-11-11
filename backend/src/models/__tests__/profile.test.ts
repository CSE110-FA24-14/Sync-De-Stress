import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ProfileModel from '../profile';
import { ProfileInterface } from '../../shared/interface/modelInterface';

describe('Profile Model Test', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        // Initialize MongoMemoryServer
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        // Connect mongoose to the in-memory database
        await mongoose.connect(uri);
        await ProfileModel.init();
    });

    afterAll(async () => {
        // Disconnect mongoose and stop MongoMemoryServer
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

    it('should create & save a profile successfully', async () => {
        const profileData: Partial<ProfileInterface> = {
            userId: 'user123',
            username: 'testuser',
            dateOfBirth: new Date('1990-01-01'),
            year: 'Senior',
            major: 'Computer Science',
            college: 'Engineering',
            classes: 'CS101, CS102',
            hobby: 'Reading',
            musicPreference: 'Rock',
            favArtists: 'Artist1, Artist2',
            contact: 'testuser@example.com',
            // Optional fields
            description: 'This is a test user.',
            friend: ['friend1', 'friend2'],
            friend_requested: ['friend3'],
        };

        const validProfile = new ProfileModel(profileData);
        const savedProfile = await validProfile.save();

        // Assertions
        expect(savedProfile._id).toBeDefined();
        expect(savedProfile.userId).toBe(profileData.userId);
        expect(savedProfile.username).toBe(profileData.username);
        expect(savedProfile.description).toBe(profileData.description);
        expect(savedProfile.dateOfBirth).toEqual(profileData.dateOfBirth);
        expect(savedProfile.year).toBe(profileData.year);
        expect(savedProfile.major).toBe(profileData.major);
        expect(savedProfile.college).toBe(profileData.college);
        expect(savedProfile.classes).toBe(profileData.classes);
        expect(savedProfile.hobby).toBe(profileData.hobby);
        expect(savedProfile.musicPreference).toBe(profileData.musicPreference);
        expect(savedProfile.favArtists).toBe(profileData.favArtists);
        expect(savedProfile.contact).toBe(profileData.contact);
        expect(Array.from(savedProfile.friend)).toEqual(profileData.friend);
        expect(Array.from(savedProfile.friend_requested)).toEqual(profileData.friend_requested);
    });

    it('should set default values for optional fields if not provided', async () => {
        const profileData: Partial<ProfileInterface> = {
            userId: 'user456',
            username: 'anotheruser',
            dateOfBirth: new Date('1992-02-02'),
            year: 'Junior',
            major: 'Mathematics',
            college: 'Science',
            classes: 'MATH201, MATH202',
            hobby: 'Painting',
            musicPreference: 'Jazz',
            favArtists: 'Artist3, Artist4',
            contact: 'anotheruser@example.com',
            // Optional fields are omitted
        };

        const profile = new ProfileModel(profileData);
        const savedProfile = await profile.save();

        // Assertions
        expect(savedProfile.description).toBe('');
        expect(Array.from(savedProfile.friend)).toEqual([]);
        expect(Array.from(savedProfile.friend_requested)).toEqual([]);
    });

    it('should fail to create a profile without required fields', async () => {
        const profileData: Partial<ProfileInterface> = {
            // Missing required fields like userId, username, dateOfBirth, etc.
            username: 'incompleteuser',
            // Only one required field provided
        };

        const incompleteProfile = new ProfileModel(profileData);
        let err: mongoose.Error.ValidationError | undefined = undefined;

        try {
            await incompleteProfile.save();
        } catch (error) {
            err = error as mongoose.Error.ValidationError;
        }

        // Assertions
        expect(err).toBeDefined();
        expect(err?.errors).toHaveProperty('userId');
        expect(err?.errors).toHaveProperty('dateOfBirth');
        expect(err?.errors).toHaveProperty('year');
        expect(err?.errors).toHaveProperty('major');
        expect(err?.errors).toHaveProperty('college');
        expect(err?.errors).toHaveProperty('classes');
        expect(err?.errors).toHaveProperty('hobby');
        expect(err?.errors).toHaveProperty('musicPreference');
        expect(err?.errors).toHaveProperty('favArtists');
        expect(err?.errors).toHaveProperty('contact');
    });

    it('should enforce unique userId', async () => {
        const profileData: Partial<ProfileInterface> = {
            userId: 'uniqueUser',
            username: 'uniqueuser1',
            dateOfBirth: new Date('1991-03-03'),
            year: 'Sophomore',
            major: 'Physics',
            college: 'Science',
            classes: 'PHYS101, PHYS102',
            hobby: 'Cycling',
            musicPreference: 'Classical',
            favArtists: 'Artist5, Artist6',
            contact: 'uniqueuser1@example.com',
        };

        const profile1 = new ProfileModel(profileData);
        await profile1.save();

        const profile2 = new ProfileModel({
            ...profileData,
            username: 'uniqueuser2',
            contact: 'uniqueuser2@example.com',
        });

        let err: mongoose.Error | undefined = undefined;

        try {
            await profile2.save();
        } catch (error) {
            err = error as mongoose.Error;
        }

        // Assertions
        expect(err).toBeDefined();
        // Depending on Mongoose version and configuration, the error might be a MongoServerError
        // with code 11000 for duplicate key
        expect((err as any).code).toBe(11000);
    });

});
