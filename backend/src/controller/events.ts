import { Request, Response } from "express";
import { BaseResponseInterface, GetEventResponseInterface } from "../shared/interface/responseInterface";
import { getEvents } from "../services/events";
import { register } from "./user";

// Get list of all events
export async function getAllEvents(req: Request, res: Response) {
    let response: BaseResponseInterface;

    // Extract query parameters with default values
    const sortParam = (req.query.sort as string) || 'asc';
    const maxParam = req.query.max as string;

    // Validate 'sort' parameter
    if (sortParam !== 'asc' && sortParam !== 'dsc') {
        response = {
            status: "failure",
            message: "Invalid sort parameter. Allowed values are 'asc' or 'dsc'."
        };
        res.status(400).send(response);
        return;
    }

    // Validate 'max' parameter if provided
    let max: number | undefined;
    if (maxParam !== undefined) {
        max = parseInt(maxParam, 10);
        if (isNaN(max) || max <= 0) {
            response = {
                status: "failure",
                message: "Invalid max parameter. It must be a positive integer."
            };
            res.status(400).send(response);
            return;
        }
    }

    try {
        // Fetch events using the service function
        const events = await getEvents(sortParam, max);

        // Map events to the response interface
        const eventResponses = events.map(event => ({
            id: event._id,
            eventName: event.eventName,
            description: event.description,
            eventDate: event.eventDate,
            location: event.location,
            priceEstimate: event.priceEstimate,
            coverPhoto: event.coverPhoto,
            attendee: event.userRegistered.length,
            registered: event.userRegistered.includes(req.body.authPayload.id)
        }));

        // Construct a success response
        const successResponse: GetEventResponseInterface = {
            status: "success",
            message: "Events fetched successfully.",
            events: eventResponses
        };

        res.status(200).send(successResponse);
    } catch (err: any) {
        // Handle unexpected errors
        response = {
            status: "failure",
            message: "An error occurred while fetching events."
        };
        console.error(err);
        res.status(500).send(response);
    }
}


// Get list of similar events
export async function getSimilarEvents(req: Request, res: Response) {
    // Logic for fetching similar events
    res.status(200).json({ message: 'List of similar events' });
}

// Create a new event
export async function createEvent(req: Request, res: Response) {
    // Logic for creating a new event
    res.status(201).json({ message: 'Event created successfully' });
}

// Get event details by ID
export async function getEventById(req: Request, res: Response) {
    // Logic for fetching event details by ID
    const eventId = req.params.id;
    res.status(200).json({ message: `Details for event ID: ${eventId}` });
}

// Get list of registered events
export async function getRegisteredEvents(req: Request, res: Response) {
    // Logic for fetching registered events
    res.status(200).json({ message: 'List of registered events' });
}

// Register/unregister for an event
export async function registerForEvent(req: Request, res: Response) {
    // Logic for registering/unregistering for an event
    res.status(200).json({ message: 'Registration status updated' });
}