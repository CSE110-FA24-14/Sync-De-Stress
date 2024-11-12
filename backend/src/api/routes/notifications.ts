import { Router } from "express";
import { getNotifications } from "../../controller/notifications";
import { requireAuthorization } from "../../middlewares/user";
const router: Router = Router();
export default (app: Router) => {
    router.get("/", requireAuthorization, getNotifications); // Get notifications
    app.use("/notifications", router);
};