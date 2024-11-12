import { Router } from "express";
import { getRecommendations, matchPeople, getMatches, viewProfile } from "../../controller/people";
import { requireAuthorization } from "../../middlewares/user";
const router: Router = Router();
export default (app: Router) => {
    router.get("/recommendations", requireAuthorization, getRecommendations); // Get recommendations for people
    router.post("/match", requireAuthorization, matchPeople);                 // Send a match request
    router.get("/match", requireAuthorization, getMatches);                   // Get list of matches
    router.get("/view/:id", requireAuthorization, viewProfile);               // View matched profile
    app.use("/people", router);
};