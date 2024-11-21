import { createEvent, getAllEvents, getEventById, registerForEvent } from "../events";
import { Request, Response } from "express";
import { createEventService, getEventByIdService, getEvents, registerOrUnregisterEvent } from "../../services/events";

jest.mock("../../services/events");

describe("Events Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    describe("createEvent", () => {
        it("should create an event and respond with success", async () => {
            const mockEventData = {
                eventName: "Test Event",
                eventDate: "2024-12-12T10:00:00.000Z",
                location: "Test Location",
                priceEstimate: 100,
                coverPhoto: "https://example.com/image.jpg",
                description: "A test event",
            };

            mockReq = {
                body: {
                    ...mockEventData,
                    authPayload: { id: "testUserId" },
                },
            };

            const savedEvent = { _id: "testEventId", eventName: "Test Event" };
            (createEventService as jest.Mock).mockResolvedValue(savedEvent);

            await createEvent(mockReq as Request, mockRes as Response);

            expect(createEventService).toHaveBeenCalledWith({
                userId: "testUserId",
                ...mockEventData,
                eventDate: new Date(mockEventData.eventDate),
                attendees: [],
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: "success",
                message: `Event 'Test Event' has been successfully created.`,
                id: "testEventId",
            });
        });

        it("should respond with 400 for missing required parameters", async () => {
            mockReq = {
                body: { authPayload: { id: "testUserId" } },
            };

            await createEvent(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: "failure",
                message: expect.stringContaining("Request is missing required parameters"),
            });
        });

        it("should handle unexpected errors and respond with 500", async () => {
            mockReq = {
                body: {
                    eventName: "Test Event",
                    eventDate: "2024-12-12T10:00:00.000Z",
                    location: "Test Location",
                    priceEstimate: 100,
                    coverPhoto: "https://example.com/image.jpg",
                    description: "A test event",
                    authPayload: { id: "testUserId" },
                },
            };

            (createEventService as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

            await createEvent(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: "failure",
                message: "There was a failure while trying to create the event, please try again",
            });
        });
    });

  
    describe("getEventById", () => {
        it("should fetch an event by ID and respond with success", async () => {
            const mockEvent = {
                _id: "testEventId",
                eventName: "Test Event",
                description: "A test event",
                eventDate: new Date("2024-12-12T10:00:00.000Z"),
                location: "Test Location",
                priceEstimate: 100,
                coverPhoto: "https://example.com/image.jpg",
            };

            mockReq = { params: { id: "testEventId" } };
            (getEventByIdService as jest.Mock).mockResolvedValue(mockEvent);

            await getEventById(mockReq as Request, mockRes as Response);

            expect(getEventByIdService).toHaveBeenCalledWith("testEventId");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: "success",
                message: "Event details fetched successfully.",
                data: mockEvent,
            });
        });

        it("should respond with 404 if the event is not found", async () => {
            mockReq = { params: { id: "testEventId" } };
            (getEventByIdService as jest.Mock).mockResolvedValue(null);

            await getEventById(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: "failure",
                message: `Event with ID 'testEventId' not found.`,
            });
        });

        it("should respond with 500 for errors while fetching event by ID", async () => {
            mockReq = { params: { id: "testEventId" } };
            (getEventByIdService as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

            await getEventById(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                status: "failure",
                message: "An error occurred while fetching the event details.",
            });
        });
    });
});
