import { Router, Request, Response } from "express";
import { register, login } from "../../controller/user";

import { validateJWT } from "../../services/user";

const router: Router = Router();

export default (app: Router) => {

    router.post("/register", register);
    router.post("/login", login);

    app.use("/", router);

};