import { Router } from "express";
import { getArtists } from "../../controller/artists";
import { requireAuthorization } from "../../middlewares/user";
const router: Router = Router();
export default (app: Router) => {
    router.get("/", requireAuthorization, getArtists); // Get list of artists from the database
    app.use("/artists", router);
};