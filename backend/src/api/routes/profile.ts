import { Router } from "express";
import { getProfile, createProfile, editProfile } from "../../controller/profile";


const router: Router = Router();
export default (app: Router) => {
    router.get("/profile", getProfile);              // Get user profile
    router.post("/profile", createProfile);          // Create a new profile
    router.put("/profile/edit", editProfile);        // Edit profile details
    app.use("/", router);
};