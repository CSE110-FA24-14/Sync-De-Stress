import { createEvent } from '../events'; 
import { createEventService } from '../../services/events';
import { Request, Response } from 'express';
import { EventInterface } from '../../shared/interface/modelInterface';


jest.mock('../../services/events');

describe('createEvent Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        req = {
            body: {
                eventName: 'Test Event',
                eventDate: new Date('2024-12-12T10:00:00Z'),
                location: 'Test Location',
                description: 'This is a test event',
                priceEstimate: 100,
                coverPhoto: 'https://example.com/image.jpg',
                userRegistered: [],
            },
        };

        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({
            send: mockJson,
        }));

        res = {
            status: mockStatus,
        } as Partial<Response>;

        jest.clearAllMocks();
    });

    it('should create an event and respond with success', async () => {
        const mockEvent = {
            _id: 'event123',
            ...req.body,
        };

        (createEventService as jest.Mock).mockResolvedValue(mockEvent);

        await createEvent(req as Request, res as Response);

        expect(createEventService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            status: 'success',
            message: 'Event created successfully',
            event: mockEvent,
        });
    });

    it('should handle validation errors and respond with 400', async () => {
        const validationError = new Error('Validation failed');
        (validationError as any).name = 'ValidationError';

        (createEventService as jest.Mock).mockRejectedValue(validationError);

        await createEvent(req as Request, res as Response);

        expect(createEventService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            status: 'failure',
            message: 'Validation failed',
        });
    });

    it('should handle unexpected errors and respond with 500', async () => {
        const unexpectedError = new Error('Unexpected server error');
        (createEventService as jest.Mock).mockRejectedValue(unexpectedError);

        await createEvent(req as Request, res as Response);

        expect(createEventService).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            status: 'failure',
            message: 'Failed to create event',
        });
    });
});
