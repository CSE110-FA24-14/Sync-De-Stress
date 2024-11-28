import { Request, Response } from "express";
import { BaseResponseInterface, GetEventResponseInterface, RegisterEventResponseInterface } from "../shared/interface/responseInterface";
import { getEvents, registerOrUnregisterEvent } from "../services/events";
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
    res.status(200).json({ message: 'Event created successfully' });
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
    // Declare necessary variables
    let response: BaseResponseInterface;
    let requiredParams = ["eventId"];
    let containsRequiredParams = requiredParams.every(param => Object.keys(req.body).includes(param));

    if (!containsRequiredParams) {
        // Construct a failure response when missing parameters
        response = {
            status: "failure",
            message: `Request is missing key parameters: ${requiredParams.join(", ")}`
        };
        res.status(400).send(response);
    } else {
        try {
            const userId = req.body.authPayload.id;
            const eventId = req.body.eventId;

            // Call service function to register or unregister the event
            const unregistered = await registerOrUnregisterEvent(userId, eventId);

            // Construct a success response
            const successResponse: RegisterEventResponseInterface = {
                status: "success",
                message: unregistered
                    ? "Successfully unregistered from the event."
                    : "Successfully registered for the event.",
                unregistered: unregistered
            };
            res.status(200).send(successResponse);
        } catch (err: any) {
            // Handle specific errors if necessary
            if (err.message === 'EventNotFound') {
                response = {
                    status: "failure",
                    message: "Event not found."
                };
                res.status(404).send(response);
                return;
            } else if (err.message === 'ProfileNotFound') {
                response = {
                    status: "failure",
                    message: "User profile not found."
                };
                res.status(404).send(response);
                return;
            }

            // Construct a failure response for general errors
            response = {
                status: "failure",
                message: "An error occurred while processing the request."
            };
            console.error(err);
            res.status(500).send(response);
        }
    }
}