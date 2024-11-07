import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JwtPayloadInterface } from "../shared/interface/authInterface";

export function encryptPassword(password: string) { 

    const saltRound: number = 10;
    return bcrypt.hash(password, saltRound);

};

export async function comparePassword(password: string, hash: string) {

    return bcrypt.compare(password, hash);

};

export async function generateJWT(id: String, email: String){

    const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

    let userObject = {id, email};
    
    if (JWT_SECRET) {
        return jwt.sign(userObject, JWT_SECRET, {expiresIn: "3d"});
    } else {
        throw "JWT Secret not found";
    };
    
}

export async function validateJWT(token: String){

    const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

    if (JWT_SECRET) {

        try{
            let decrypted: JwtPayloadInterface = <any>jwt.verify(token.toString(), JWT_SECRET);
            return decrypted;
        }catch(error){
            return;
        }
        

    }else {
        throw "JWT Secret not found";
    }

}