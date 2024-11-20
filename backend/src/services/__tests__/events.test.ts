// src/services/__tests__/events.test.ts

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

  it('should throw an error when saving fails', async () => {
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
