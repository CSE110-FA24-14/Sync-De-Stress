import { Request, Response } from "express";

import { BaseResponseInterface, CreateEventInterface, GetEventResponseInterface, RegisterEventResponseInterface, GetEventRegisteredResponseInterface } from "../shared/interface/responseInterface";
import { createEventService, getEventByIdService, getRegisteredEventsService, getSimilarEventsService} from "../services/events";
import EventModel from "../models/events";
import ProfileModel from "../models/profile";


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
    try {
        const userId = req.body.authPayload.id; // Extract user ID from request

        // Call the service to fetch similar unregistered events
        const similarEvents = await getSimilarEventsService(userId);

        // Construct the response
        const response = {
            status: "success",
            message: "Similar unregistered events fetched successfully.",
            data: similarEvents,
        };

        return res.status(200).send(response);
    } catch (error) {
        console.error("Error fetching similar unregistered events:", error);

        const response = {
            status: "failure",
            message: "An error occurred while fetching similar unregistered events.",
        };

        return res.status(500).send(response);
    }
    
}

export async function createEvent(req: Request, res: Response) {
    let response: CreateEventInterface;

    // Define required parameters
    const requiredParams = ["eventName", "eventDate", "location", "priceEstimate", "coverPhoto", "description"];

    // Check for missing parameters
    const missingParams = requiredParams.filter(param => !req.body[param]);

    if (missingParams.length > 0) {
        response = {
            status: "failure",
            message: `Validation Error: Missing required parameters: ${missingParams.join(", ")}.`,
        };
        return res.status(400).send(response);
    }

    try {
        // Validate the eventDate
        const eventDate = new Date(req.body.eventDate);
        if (isNaN(eventDate.getTime())) {
            return res.status(400).send({
                status: "failure",
                message: "Validation Error: Invalid event date provided.",
            });
        }

        // Extract the authenticated user ID
        const authPayload = req.body.authPayload;
        const eventData = {
            userId: authPayload.id,
            eventName: req.body.eventName,
            eventDate: eventDate, // Use validated date
            location: req.body.location,
            priceEstimate: req.body.priceEstimate,
            coverPhoto: req.body.coverPhoto,
            description: req.body.description,
            attendees: [],
        };

        // Create the event via the service
        const savedEvent = await createEventService(eventData);

        // Return a success response
        response = {
            status: "success",
            message: `Event '${savedEvent.eventName}' has been successfully created.`,
            id: savedEvent._id,
        };
        return res.status(201).send(response);

    } catch (err: any) {
        // Handle validation errors (e.g., database-level validation)
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val: any) => val.message);
            response = {
                status: "failure",
                message: `Validation Error: ${messages.join(", ")}`,
            };
            return res.status(400).send(response);
        }

        // Handle unexpected errors
        response = {
            status: "failure",
            message: "There was a failure while trying to create the event, please try again",
        };
        console.error("CreateEventController Error:", err);
        return res.status(500).send(response);
    }
}

export async function getRegisteredEvents(req: Request, res: Response) {
    try {
        const userId = req.body.authPayload.id;

        // Fetch registered event IDs
        const registeredEventIds = await getRegisteredEventsService(userId);

        // Prepare the response
        const response = {
            status: 'success',
            message: 'Registered events fetched successfully.',
            data: registeredEventIds, // These are now strings
        };

        return res.status(200).send(response);
    } catch (error) {
        console.error('Error fetching registered events:', error);
        const response = {
            status: 'failure',
            message: 'An error occurred while fetching registered events.',
        };
        return res.status(500).send(response);
    }
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


export async function getEventById(req: Request, res: Response) {
    let response: CreateEventInterface;

    try {
        const { id } = req.params; // Extract event ID from route parameters

        // Fetch event by ID using the service
        const event = await getEventByIdService(id);

        if (!event) {
            response = {
                status: "failure",
                message: `Event with ID '${id}' not found.`,
            };
            return res.status(404).send(response);
        }

        // Success response
        response = {
            status: "success",
            message: "Event details fetched successfully.",
            data: event, // Return event details
        };
        return res.status(200).send(response);

    } catch (err: any) {
        response = {
            status: "failure",
            message: "An error occurred while fetching the event details.",
        };
        console.error("GetEventByIdController Error:", err);
        return res.status(500).send(response);
    }
}

