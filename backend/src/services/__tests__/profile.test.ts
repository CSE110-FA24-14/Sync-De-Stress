// src/services/__tests__/profile.test.ts

import { createProfileService, getProfileService, updateProfileService } from '../profile';
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


describe('updateProfileService', () => {
  it('should update and return the updated profile', async () => {
    const mockUpdatedProfile = {
      userId: 'user123',
      username: 'updatedUser',
      dateOfBirth: '1995-05-05',
    };

    (ProfileModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedProfile);

    const result = await updateProfileService('user123', { username: 'updatedUser' });

    expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'user123' },
      { $set: { username: 'updatedUser' } },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedProfile);
  });

  it('should return null if no profile is found to update', async () => {
    (ProfileModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    const result = await updateProfileService('user123', { username: 'updatedUser' });

    expect(ProfileModel.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'user123' },
      { $set: { username: 'updatedUser' } },
      { new: true }
    );
    expect(result).toBeNull();
  });

  it('should throw an error if there is a database issue', async () => {
    const mockError = new Error('Database error');
    (ProfileModel.findOneAndUpdate as jest.Mock).mockRejectedValue(mockError);

    await expect(updateProfileService('user123', { username: 'updatedUser' })).rejects.toThrow('Database error');
  });
});

describe('getProfileService', () => {
  it('should retrieve a profile successfully for a given userId', async () => {
    const mockUserId = 'user123';
    const mockProfile = {
      userId: 'user123',
      username: 'testUser',
      dateOfBirth: '2000-01-01',
      // Other profile fields as needed
    };

    (ProfileModel.findOne as jest.Mock).mockResolvedValue(mockProfile);

    const result = await getProfileService(mockUserId);

    expect(ProfileModel.findOne).toHaveBeenCalledWith({ userId: mockUserId });
    expect(result).toEqual(mockProfile);
  });

  it('should return null if no profile is found', async () => {
    const mockUserId = 'user123';

    (ProfileModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getProfileService(mockUserId);

    expect(ProfileModel.findOne).toHaveBeenCalledWith({ userId: mockUserId });
    expect(result).toBeNull();
  });

  it('should throw an error if an unexpected error occurs', async () => {
    const mockUserId = 'user123';
    const mockError = new Error('Database error');
  
    (ProfileModel.findOne as jest.Mock).mockRejectedValue(mockError);
  
    await expect(getProfileService(mockUserId)).rejects.toThrow('Failed to retrieve profile');
    expect(ProfileModel.findOne).toHaveBeenCalledWith({ userId: mockUserId });
  });
});