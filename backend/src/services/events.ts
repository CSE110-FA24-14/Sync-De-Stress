import EventModel from '../models/events';
import ProfileModel from '../models/profile';


export async function createEventService(eventData: any) {
    try {
        const newEvent = new EventModel(eventData);
        return await newEvent.save();
    } catch (error: any) {
        console.error("Error creating event:", error);

        // Check if error is a validation error and rethrow it
        if (error.name === "ValidationError") {
            throw error;
        }

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


export async function getEvents(sort: string, max?: number) {
    // Determine the sort order
    const sortOrder = sort === 'asc' ? 1 : -1;

    // Build the query with sorting
    let query = EventModel.find().sort({ eventDate: sortOrder });

    // Apply the max limit if provided
    if (max !== undefined) {
        query = query.limit(max);
    }

    // Execute the query and return the events
    const events = await query.exec();
    return events;
}

export async function registerOrUnregisterEvent(userId: string, eventId: string): Promise<boolean> {
    // Returns true if unregistered, false if registered
    // Fetch the user's profile
    const userProfile = await ProfileModel.findOne({ userId: userId });
    if (!userProfile) {
        throw new Error('ProfileNotFound');
    }

    // Fetch the event
    const event = await EventModel.findById(eventId);
    if (!event) {
        throw new Error('EventNotFound');
    }

    const isRegistered = userProfile.event_registered.includes(eventId);

    if (!isRegistered) {
        // User is not registered, so register them
        userProfile.event_registered.push(eventId);
        event.userRegistered.push(userId);
        await userProfile.save();
        await event.save();
        return false; // Successfully registered
    } else {
        // User is already registered, so unregister them
        userProfile.event_registered = userProfile.event_registered.filter(id => id !== eventId);
        event.userRegistered = event.userRegistered.filter(id => id !== userId);
        await userProfile.save();
        await event.save();
        return true; // Successfully unregistered
    }
}
