import { Request, Response } from "express";
import { BaseResponseInterface } from "../shared/interface/responseInterface";
import { createEventService, getEventByIdService } from "../services/events";

// Get list of all events
export async function getAllEvents(req: Request, res: Response) {
    // Placeholder logic for fetching all events
    res.status(200).json({ message: "List of all events" });
}

// Get list of similar events
export async function getSimilarEvents(req: Request, res: Response) {
    // Placeholder logic for fetching similar events
    res.status(200).json({ message: "List of similar events" });
}

// Create a new event
export async function createEvent(req: Request, res: Response) {
    let response: BaseResponseInterface;

    const requiredParams = [
        "eventName",
        "eventDate",
        "location",
        "priceEstimate",
        "coverPhoto",
        "description"
    ];

    // Check if all required parameters are present
    const containsRequiredParams = requiredParams.every(param => Object.keys(req.body).includes(param));
    if (!containsRequiredParams) {
        response = {
            status: "failure",
            message: `Request is missing required parameters: ${requiredParams.join(", ")}`
        };
        return res.status(400).send(response);
    }

    try {
        // Prepare event data
        const authPayload = req.body.authPayload;
        const eventData = {
            userId: authPayload.id, // Extract user ID from auth payload
            eventName: req.body.eventName,
            eventDate: new Date(req.body.eventDate),
            location: req.body.location,
            priceEstimate: req.body.priceEstimate,
            coverPhoto: req.body.coverPhoto,
            description: req.body.description,
            attendees: [] // Default to empty array
        };

        // Call the service to create the event
        const savedEvent = await createEventService(eventData);

        // Return success response, including the event ID
        response = {
            status: "success",
            message: `Event '${savedEvent.eventName}' has been successfully created.`,
            id: savedEvent._id // Include event ID here
        };
        return res.status(201).send(response);

    } catch (err: any) {
        // Handle validation errors
        if (err?.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val: any) => val.message);
            response = {
                status: "failure",
                message: `Validation Error: ${messages.join(", ")}`
            };
            return res.status(400).send(response);
        }

        // Handle unexpected errors
        response = {
            status: "failure",
            message: "There was a failure while trying to create the event, please try again"
        };
        console.error("CreateEventController Error:", err);
        return res.status(500).send(response);
    }
}

// Get list of registered events
export async function getRegisteredEvents(req: Request, res: Response) {
    // Placeholder logic for fetching registered events
    res.status(200).json({ message: "List of registered events" });
}

// Register/unregister for an event
export async function registerForEvent(req: Request, res: Response) {
    // Placeholder logic for registering/unregistering for an event
    res.status(200).json({ message: "Registration status updated" });
}

export async function getEventById(req: Request, res: Response) {
    let response: BaseResponseInterface;

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
