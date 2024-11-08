import { Router } from "express";
import user from "./routes/user";
import events from "./routes/events";
import profile from "./routes/profile";
import notifications from "./routes/notifications";
import people from "./routes/people";
import artists from "./routes/artists";


export default () => {

    const router: Router = Router();
    user(router);
    events(router);
    profile(router);
    notifications(router);
    people(router);
    artists(router);

    return router;
}


