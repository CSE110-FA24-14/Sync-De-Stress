import EventModel from '../models/events';
import ProfileModel from '../models/profile';
import mongoose from 'mongoose';


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

export async function getRegisteredEventsService(userId: string) {
    // Fetch the user's profile
    const userProfile = await ProfileModel.findOne({ userId });
    if (!userProfile) {
        throw new Error("ProfileNotFound");
    }

    const registeredEventIds = (userProfile.event_registered || []).filter(id => typeof id === "string");
return registeredEventIds;
}

export async function getSimilarEventsService(userId: string): Promise<any[]> {
    try {
        // Fetch the user's profile to get registered events
        const userProfile = await ProfileModel.findOne({ userId }).lean();
        if (!userProfile) {
            throw new Error("ProfileNotFound");
        }

        const registeredEventIds = userProfile.event_registered;

        // Fetch all events
        const allEvents = await EventModel.find({}).lean();

        if (allEvents.length === 0) {
            return []; // Return an empty array if no events exist
        }

        // Identify unregistered events
        const unregisteredEvents = allEvents.filter(
            (event) => !registeredEventIds.includes(event._id.toString())
        );

        if (registeredEventIds.length === 0 || unregisteredEvents.length === 0) {
            // If user hasn't registered for any events or no unregistered events are available
            return unregisteredEvents.slice(0, 3); // Return up to 3 random unregistered events
        }

        // Choose the first registered event as the base for similarity comparison
        const baseEventId = registeredEventIds[0];
        const baseEvent = allEvents.find((event) => event._id.toString() === baseEventId);

        if (!baseEvent) {
            throw new Error("BaseEventNotFound");
        }

        // Find similar events from unregistered events (based on date ±3 days)
        const baseDate = new Date(baseEvent.eventDate);

        const similarEvents = unregisteredEvents.filter((event) => {
            const eventDate = new Date(event.eventDate);
            return (
                eventDate >= new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000) &&
                eventDate <= new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000)
            );
        });

        // If no similar events, return up to 3 random unregistered events
        if (similarEvents.length === 0) {
            const randomUnregisteredEvents = unregisteredEvents
                .sort(() => Math.random() - 0.5) // Shuffle the unregistered events
                .slice(0, 3); // Select up to 3 random events
            return randomUnregisteredEvents;
        }

        // Return up to 3 similar events
        return similarEvents.slice(0, 3);
    } catch (error) {
        console.error("Error fetching similar unregistered events:", error);
        throw new Error("Failed to fetch similar unregistered events.");
    }
}