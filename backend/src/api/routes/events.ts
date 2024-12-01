import { Router } from "express";
import { getAllEvents, getSimilarEvents, createEvent, getEventById, getRegisteredEvents, registerForEvent } from "../../controller/events";
import { requireAuthorization } from "../../middlewares/user";

const router: Router = Router();
export default (app: Router) => {
    router.get("/", requireAuthorization, getAllEvents);                     // Get list of all events
    router.get("/similar", requireAuthorization, getSimilarEvents);         // Get list of similar events
    router.get("/registered", requireAuthorization, getRegisteredEvents);   // Get list of registered events
    router.post("/", requireAuthorization, createEvent);                     // Create a new event
    router.get("/:id", requireAuthorization, getEventById);                 // Get event details by ID
    
    router.post("/register", requireAuthorization, registerForEvent);       // Register/unregister for an event
    app.use("/events", router);
};