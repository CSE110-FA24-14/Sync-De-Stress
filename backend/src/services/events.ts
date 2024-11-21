import EventModel from '../models/events';

export async function createEventService(eventData: any) {
    try {
        const newEvent = new EventModel(eventData);
        return await newEvent.save();
    } catch (error) {
        console.error("Error creating event:", error);
        throw new Error("Failed to create event");
    }
}

export async function getEventByIdService(eventId: string) {
    try {
        // Fetch the event by its ID
        const event = await EventModel.findById(eventId);
        return event; // Return the event document or null if not found
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        throw new Error("Failed to fetch event by ID");
    }
}

