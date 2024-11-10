import { Router } from "express";
import { getNotifications } from "../../controller/notifications";
const router: Router = Router();
export default (app: Router) => {
    router.get("/notifications", getNotifications); // Get notifications
    app.use("/", router);
};