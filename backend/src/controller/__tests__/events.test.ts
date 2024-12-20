import { Request, Response } from "express";
import { createEvent, getAllEvents, getEventById } from "../events";
import { createEventService, getEvents, getEventByIdService } from "../../services/events";

jest.mock("../../services/events");

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};

describe("Event Controllers", () => {
    describe("createEvent", () => {
        it("should create an event successfully", async () => {
            const req = {
                body: {
                    authPayload: { id: "user123" },
                    eventName: "Test Event",
                    eventDate: "2024-12-01T00:00:00Z",
                    location: "Test Location",
                    priceEstimate: 50,
                    coverPhoto: "test.jpg",
                    description: "Test event description.",
                },
            } as unknown as Request;
    
            const res = mockResponse();
    
            const savedEvent = {
                _id: "event123",
                eventName: "Test Event",
                eventDate: new Date("2024-12-01T00:00:00Z"),
                location: "Test Location",
                priceEstimate: 50,
                coverPhoto: "test.jpg",
                description: "Test event description.",
                attendees: [],
            };
    
            (createEventService as jest.Mock).mockResolvedValue(savedEvent);
    
            await createEvent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                status: "success",
                message: "Event 'Test Event' has been successfully created.",
                id: "event123",
            });
        });
    
        it("should return a validation error for missing parameters", async () => {
            const req = {
                body: {
                    authPayload: { id: "user123" },
                    // Missing eventName
                    eventDate: "2024-12-01T00:00:00Z",
                    location: "San Diego Convention Center",
                    priceEstimate: 100,
                    coverPhoto: "https://example.com/sample.jpg",
                    description: "An amazing event to attend.",
                },
            } as unknown as Request;
        
            const res = mockResponse();
        
            await createEvent(req, res);
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                status: "failure",
                message: "Validation Error: Missing required parameters: eventName.",
            });
        });
        
    
        it("should handle unexpected errors gracefully", async () => {
            const req = {
                body: {
                    authPayload: { id: "user123" },
                    eventName: "Test Event",
                    eventDate: "2024-12-01T00:00:00Z",
                    location: "Test Location",
                    priceEstimate: 50,
                    coverPhoto: "test.jpg",
                    description: "Test event description.",
                },
            } as unknown as Request;
    
            const res = mockResponse();
    
            (createEventService as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
    
            await createEvent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                status: "failure",
                message: "There was a failure while trying to create the event, please try again",
            });
        });
    });

    describe("getAllEvents", () => {
        it("should fetch all events successfully", async () => {
            const req = {
                query: { sort: "asc" },
                body: { authPayload: { id: "user123" } },
            } as unknown as Request;

            const res = mockResponse();

            (getEvents as jest.Mock).mockResolvedValue([
                { _id: "1", eventName: "Event A", userRegistered: ["user123"] },
                { _id: "2", eventName: "Event B", userRegistered: [] },
            ]);

            await getAllEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                status: "success",
                message: "Events fetched successfully.",
                events: expect.any(Array),
            });
        });

        it("should return an empty array if no events are found", async () => {
            const req = {
                query: { sort: "asc" },
                body: { authPayload: { id: "user123" } },
            } as unknown as Request;

            const res = mockResponse();

            (getEvents as jest.Mock).mockResolvedValue([]);

            await getAllEvents(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                status: "success",
                message: "Events fetched successfully.",
                events: [],
            });
        });
    });

    describe("getEventById", () => {
        it("should fetch an event by ID successfully", async () => {
            const req = { params: { id: "event123" } } as unknown as Request;
            const res = mockResponse();

            (getEventByIdService as jest.Mock).mockResolvedValue({
                _id: "event123",
                eventName: "Event A",
            });

            await getEventById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                status: "success",
                message: "Event details fetched successfully.",
                data: expect.any(Object),
            });
        });

        it("should return a 404 if event not found", async () => {
            const req = { params: { id: "event999" } } as unknown as Request;
            const res = mockResponse();

            (getEventByIdService as jest.Mock).mockResolvedValue(null);

            await getEventById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                status: "failure",
                message: "Event with ID 'event999' not found.",
            });
        });

        it("should handle unexpected errors gracefully", async () => {
            const req = { params: { id: "event123" } } as unknown as Request;
            const res = mockResponse();

            (getEventByIdService as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

            await getEventById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                status: "failure",
                message: "An error occurred while fetching the event details.",
            });
        });
    });
});
