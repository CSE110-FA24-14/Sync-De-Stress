import { createEventService } from '../events';
import EventModel from '../../models/events';

jest.mock('../../models/events');

describe('createEventService', () => {
  let mockSave: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSave = EventModel.prototype.save as jest.Mock;
  });

  it('should successfully create and return a new event', async () => {
    const eventData = {
      eventName: 'Test Event',
      description: 'This is a test event',
      eventDate: new Date('2024-12-12T10:00:00Z'),
      location: 'Test Location',
      priceEstimate: 100,
      coverPhoto: 'https://example.com/image.jpg',
      userRegistered: [],
    };

    const savedEvent = {
      _id: 'event123',
      ...eventData,
    };

    mockSave.mockResolvedValue(savedEvent);

    const result = await createEventService(eventData);

    expect(EventModel).toHaveBeenCalledWith(eventData);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(savedEvent);
  });

  it('should throw a validation error if required fields are missing', async () => {
    const eventData = {
      // Missing required fields such as eventName, eventDate, and location
      description: 'This is a test event',
      priceEstimate: 100,
      coverPhoto: 'https://example.com/image.jpg',
      userRegistered: [],
    };

    const validationError = {
      name: 'ValidationError',
      errors: {
        eventName: { message: 'Event name is required' },
        eventDate: { message: 'Event date is required' },
        location: { message: 'Event location is required' },
      },
    };

    mockSave.mockRejectedValue(validationError);

    await expect(createEventService(eventData)).rejects.toEqual(validationError);
    expect(EventModel).toHaveBeenCalledWith(eventData);
    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw a validation error if data entry is invalid', async () => {
    const eventData = {
      eventName: 'Test Event',
      description: 'This is a test event',
      eventDate: 'invalid-date', // Invalid date format
      location: 'Test Location',
      priceEstimate: 'not-a-number', // Invalid priceEstimate (should be a number)
      coverPhoto: 'https://example.com/image.jpg',
      userRegistered: [],
    };

    const validationError = {
      name: 'ValidationError',
      errors: {
        eventDate: { message: 'Invalid date format' },
        priceEstimate: { message: 'Price estimate must be a number' },
      },
    };

    mockSave.mockRejectedValue(validationError);

    await expect(createEventService(eventData)).rejects.toEqual(validationError);
    expect(EventModel).toHaveBeenCalledWith(eventData);
    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw an error when saving fails due to unexpected reasons', async () => {
    const eventData = {
      eventName: 'Test Event',
      description: 'This is a test event',
      eventDate: new Date('2024-12-12T10:00:00Z'),
      location: 'Test Location',
      priceEstimate: 100,
      coverPhoto: 'https://example.com/image.jpg',
      userRegistered: [],
    };

    const mockError = new Error('Failed to create event');

    mockSave.mockRejectedValue(mockError);

    await expect(createEventService(eventData)).rejects.toThrow('Failed to create event');
    expect(mockSave).toHaveBeenCalled();
  });
});