import EventModel from '../models/events';

export async function createEventService(eventData: any) {
    try {
        // Create a new instance of the Event model with the provided data
        const newEvent = new EventModel(eventData);

        // Save the new event to the database
        const savedEvent = await newEvent.save();

        // Return the saved event
        return savedEvent;
    } catch (error) {
        console.error("Error creating event:", error);
        throw new Error("Failed to create event");
    }
}

