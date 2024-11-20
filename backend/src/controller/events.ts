import { Request, Response } from "express";

import { BaseResponseInterface } from "../shared/interface/responseInterface";
import { createEventService } from "../services/events";
import { register } from "./user";

// Get list of all events
export async function getAllEvents(req: Request, res: Response) {
    // Logic for fetching all events
    res.status(200).json({ message: 'List of all events' });
}

// Get list of similar events
export async function getSimilarEvents(req: Request, res: Response) {
    // Logic for fetching similar events
    res.status(200).json({ message: 'List of similar events' });
}

// Create a new event
export async function createEvent(req: Request, res: Response) {
    let response: BaseResponseInterface;
    try {
        const eventData = req.body;
        const createdEvent = await createEventService(eventData);
        res.status(201).send({
            status: 'success',
            message: 'Event created successfully',
            event: createdEvent,
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({
                status: 'failure',
                message: error.message,
            });
        }
        res.status(500).send({
            status: 'failure',
            message: 'Failed to create event',
        });
    }
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