import { Request, Response, NextFunction } from "express";
import { validateJWT } from "../services/user";
import { JwtPayloadInterface } from "../shared/interface/authInterface";

export async function requireAuthorization(req: Request, res: Response, next: NextFunction) {
    if(req.headers.authorization){
        let token: String = req.headers.authorization.split(' ')[1];
        let authPayload: JwtPayloadInterface | undefined = await validateJWT(token);

        if(authPayload){
            req.body.authPayload = authPayload;
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }

}