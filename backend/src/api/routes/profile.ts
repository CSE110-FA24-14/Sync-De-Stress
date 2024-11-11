import { Router } from "express";
import { getProfile, createProfile, editProfile } from "../../controller/profile";
import { requireAuthorization } from "../../middlewares/user";


const router: Router = Router();
export default (app: Router) => {
    router.get("/", requireAuthorization, getProfile);              // Get user profile
    router.post("/", requireAuthorization, createProfile);          // Create a new profile
    router.put("/edit", requireAuthorization, editProfile);        // Edit profile details
    app.use("/profile", router);
};