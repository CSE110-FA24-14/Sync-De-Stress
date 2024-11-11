// src/controller/__tests__/profile.test.ts

import { Request, Response } from 'express';
import { createProfile } from '../profile';
import { createProfileService } from '../../services/profile';
import { ProfileInterface } from '../../shared/interface/modelInterface';

jest.mock('../../services/profile');

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe('CreateProfile Controller', () => {
  describe('createProfileController', () => {
    it('should create a profile successfully', async () => {
      const req = {
        body: {
          authPayload: {
            id: 'user123',
            email: 'user@example.com',
            iat: 1234567890,
            exp: 1234567890 + 3600,
          },
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
        },
      } as Request;

      const res = mockResponse();

      const savedProfile: Partial<ProfileInterface> = {
        _id: 'profile123',
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
        description: 'This is a test user.',
        friend: [],
        friend_requested: [],
      };

      (createProfileService as jest.Mock).mockResolvedValue(savedProfile);

      await createProfile(req, res);

      expect(createProfileService).toHaveBeenCalledWith({
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
        description: 'This is a test user.',
        friend: [],
        friend_requested: [],
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        status: 'success',
        message: `Profile for userId user123 has been successfully created`,
      });
    });

    it('should fail when required parameters are missing', async () => {
      const req = {
        body: {
          authPayload: {
            id: 'user123',
            email: 'user@example.com',
            iat: 1234567890,
            exp: 1234567890 + 3600,
          },
          // Missing required fields
          username: 'testuser',
          // Other required fields are missing
        },
      } as Request;

      const res = mockResponse();

      await createProfile(req, res);

      expect(createProfileService).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'Request is missing required parameters: username, dateOfBirth, year, major, college, classes, hobby, musicPreference, favArtists, contact',
      });
    });

    it('should handle duplicate profile error', async () => {
      const req = {
        body: {
          authPayload: {
            id: 'user123',
            email: 'user@example.com',
            iat: 1234567890,
            exp: 1234567890 + 3600,
          },
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
        },
      } as Request;

      const res = mockResponse();

      const duplicateError = { code: 11000 };
      (createProfileService as jest.Mock).mockRejectedValue(duplicateError);

      await createProfile(req, res);

      expect(createProfileService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'A profile for this user already exists',
      });
    });

    it('should handle validation errors', async () => {
      const req = {
        body: {
          authPayload: {
            id: 'user123',
            email: 'user@example.com',
            iat: 1234567890,
            exp: 1234567890 + 3600,
          },
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
        },
      } as Request;

      const res = mockResponse();

      const validationError = {
        name: 'ValidationError',
        errors: {
          dateOfBirth: { message: 'Invalid date format' },
          contact: { message: 'Invalid email format' },
        },
      };
      (createProfileService as jest.Mock).mockRejectedValue(validationError);

      await createProfile(req, res);

      expect(createProfileService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'Validation Error: Invalid date format, Invalid email format',
      });
    });

    it('should handle unexpected errors', async () => {
      const req = {
        body: {
          authPayload: {
            id: 'user123',
            email: 'user@example.com',
            iat: 1234567890,
            exp: 1234567890 + 3600,
          },
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
        },
      } as Request;

      const res = mockResponse();

      const unexpectedError = new Error('Unexpected server error');
      (createProfileService as jest.Mock).mockRejectedValue(unexpectedError);

      await createProfile(req, res);

      expect(createProfileService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        status: 'failure',
        message: 'There was a failure while trying to create the profile, please try again',
      });
    });
  });
});
