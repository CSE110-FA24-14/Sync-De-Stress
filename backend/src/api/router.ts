import { Router } from "express";
import user from "./routes/user";

export default () => {

    const router: Router = Router();
    user(router);

    return router;

}