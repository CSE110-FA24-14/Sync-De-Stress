import { createEventService, getEventByIdService } from "../events";
import EventModel from "../../models/events";

jest.mock("../../models/events");

describe("Event Service Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createEventService", () => {
    it("should create an event successfully", async () => {
      const eventData = {
        eventName: "Sample Event",
        eventDate: new Date("2023-12-01T10:00:00.000Z"),
        location: "New York",
        priceEstimate: 100,
        coverPhoto: "photo.jpg",
        description: "This is a sample event",
        attendees: [],
      };

      const mockEvent = {
        ...eventData,
        _id: "63e2d2f123456789abcdef01",
      };

      (EventModel.prototype.save as jest.Mock).mockResolvedValue(mockEvent);

      const result = await createEventService(eventData);

      expect(EventModel).toHaveBeenCalledWith(eventData);
      expect(result).toEqual(mockEvent);
    });

    it("should throw a validation error when required fields are missing", async () => {
      const invalidEventData = {
        location: "New York",
      };

      const validationError = {
        name: "ValidationError",
        errors: {
          eventName: { message: "Event name is required" },
          eventDate: { message: "Event date is required" },
        },
      };

      (EventModel.prototype.save as jest.Mock).mockRejectedValue(validationError);

      await expect(createEventService(invalidEventData)).rejects.toEqual(validationError);
    });
  });

  describe("getEventByIdService", () => {
    it("should return the event for a valid ID", async () => {
      const mockEvent = {
        _id: "63e2d2f123456789abcdef01",
        eventName: "Sample Event",
        eventDate: new Date("2023-12-01T10:00:00.000Z"),
        location: "New York",
        priceEstimate: 100,
        coverPhoto: "photo.jpg",
        description: "This is a sample event",
        attendees: [],
      };

      (EventModel.findById as jest.Mock).mockResolvedValue(mockEvent);

      const result = await getEventByIdService("63e2d2f123456789abcdef01");

      expect(EventModel.findById).toHaveBeenCalledWith("63e2d2f123456789abcdef01");
      expect(result).toEqual(mockEvent);
    });

    it("should return null for a non-existent ID", async () => {
      (EventModel.findById as jest.Mock).mockResolvedValue(null);

      const result = await getEventByIdService("nonexistent-id");

      expect(EventModel.findById).toHaveBeenCalledWith("nonexistent-id");
      expect(result).toBeNull();
    });
  });
});
