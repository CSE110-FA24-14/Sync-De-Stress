// src/services/__tests__/profile.test.ts

import { createProfileService } from '../profile';
import ProfileModel from '../../models/profile';
import { ProfileInterface } from '../../shared/interface/modelInterface';

jest.mock('../../models/profile');

describe('CreateProfile Service', () => {
  describe('createProfile', () => {
    it('should successfully create and return a profile', async () => {
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
        description: 'This is a test user.',
        friend: [],
        friend_requested: [],
      };

      const savedProfile: ProfileInterface = {
        _id: 'profile123',
        ...profileData,
      } as ProfileInterface;

      (ProfileModel.prototype.save as jest.Mock).mockResolvedValue(savedProfile);

      const result = await createProfileService(profileData);

      expect(ProfileModel).toHaveBeenCalledWith(profileData);
      expect(ProfileModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(savedProfile);
    });

    it('should throw a duplicate key error when userId already exists', async () => {
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
        description: 'This is a test user.',
        friend: [],
        friend_requested: [],
      };

      const duplicateError = { code: 11000 };

      (ProfileModel.prototype.save as jest.Mock).mockRejectedValue(duplicateError);

      await expect(createProfileService(profileData)).rejects.toEqual(duplicateError);

      expect(ProfileModel).toHaveBeenCalledWith(profileData);
      expect(ProfileModel.prototype.save).toHaveBeenCalled();
    });

    it('should throw a validation error for invalid data', async () => {
      const profileData: Partial<ProfileInterface> = {
        userId: 'user123',
        // Missing required fields like username, dateOfBirth, etc.
      };

      const validationError = {
        name: 'ValidationError',
        errors: {
          username: { message: 'Username is required' },
          dateOfBirth: { message: 'Date of birth is required' },
          // ... other validation errors
        },
      };

      (ProfileModel.prototype.save as jest.Mock).mockRejectedValue(validationError);

      await expect(createProfileService(profileData)).rejects.toEqual(validationError);

      expect(ProfileModel).toHaveBeenCalledWith(profileData);
      expect(ProfileModel.prototype.save).toHaveBeenCalled();
    });

    it('should throw an unexpected error', async () => {
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
        description: 'This is a test user.',
        friend: [],
        friend_requested: [],
      };

      const unexpectedError = new Error('Unexpected server error');

      (ProfileModel.prototype.save as jest.Mock).mockRejectedValue(unexpectedError);

      await expect(createProfileService(profileData)).rejects.toThrow('Unexpected server error');

      expect(ProfileModel).toHaveBeenCalledWith(profileData);
      expect(ProfileModel.prototype.save).toHaveBeenCalled();
    });
  });
});
