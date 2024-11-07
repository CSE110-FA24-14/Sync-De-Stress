import { Router } from "express";
import { getAllEvents, getSimilarEvents, createEvent, getEventById, getRegisteredEvents, registerForEvent } from "../../controller/events";
const router: Router = Router();
export default (app: Router) => {
    router.get("/events", getAllEvents);                     // Get list of all events
    router.get("/events/similar", getSimilarEvents);         // Get list of similar events
    router.post("/events", createEvent);                     // Create a new event
    router.get("/events/:id", getEventById);                 // Get event details by ID
    router.get("/events/registered", getRegisteredEvents);   // Get list of registered events
    router.post("/events/register", registerForEvent);       // Register/unregister for an event
    app.use("/", router);
};