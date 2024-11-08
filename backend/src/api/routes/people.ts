import { Router } from "express";
import { getRecommendations, matchPeople, getMatches, viewProfile } from "../../controller/people";
const router: Router = Router();
export default (app: Router) => {
    router.get("/people/recommendations", getRecommendations); // Get recommendations for people
    router.post("/people/match", matchPeople);                 // Send a match request
    router.get("/people/match", getMatches);                   // Get list of matches
    router.get("/people/view/:id", viewProfile);               // View matched profile
    app.use("/", router);
};