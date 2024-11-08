import { Router } from "express";
import { getArtists } from "../../controller/artists";
const router: Router = Router();
export default (app: Router) => {
    router.get("/artists", getArtists); // Get list of artists from the database
    app.use("/", router);
};