import UserModel from "../models/user";
import { Request, Response } from "express";
import { BaseResponseInterface, LoginResponseInterface } from "../shared/interface/responseInterface"
import { UserInterface } from "../shared/interface/modelInterface";
import { 
    encryptPassword, 
    comparePassword, 
    generateJWT
} from "../services/user";


export async function register(req: Request, res: Response) {

    // Declare necessary variables
    let response: BaseResponseInterface;
    let requiredParams = ["email", "password"];
    let containsRequiredParams = requiredParams.every(param => Object.keys(req.body).includes(param));

    if (!containsRequiredParams) {

        // Construct a fail response when missing parameters
        response = {
            status: "failure",
            message: `request missing key params ${requiredParams}`
        };

        res.status(400).send(response);
        return;

    } else {

        try {

            // Check if password meets standard
            if (req.body.password.length < 8 || req.body.password.length > 50) {

                // Construct a fail response when password didn't meets standard
                response = {
                    status: "failure",
                    message: "password must contain at least 8 characters and less than 50 characters"
                };

                res.status(400).send(response);
                return;

            };

            // Await for password to finish hashing
            let encrypetedPassword: String = await encryptPassword(req.body.password);

            // Get necessary user data from request
            let userData = (({ email, password }) => ({ email, password }))(req.body)
            userData.password = encrypetedPassword;

            // Save the value to the database
            let userModel: UserInterface = await new UserModel(userData).save();

            // Construct a success response when registration is successful
            response = {
                status: "success",
                message: `User with email ${userModel.email} has been successfully saved to our database`
            };

            res.status(200).send(response);
            return;

        } catch (err:any) {

            if(err?.code === 11000){
                response = {
                    status: "failure",
                    message: "the email provided was already used"
                };

                res.status(409).send(response);
                return;
            }

            // Construct a fail response when something went wrong
            response = {
                status: "failure",
                message: "there was a failure while trying to register, please try again"
            };
            console.log(err);

            res.status(500).send(response);
            return;
        };

    };

};

export async function login(req: Request, res: Response) {

    try{

        // Declare necessary variables
        let response: LoginResponseInterface;
        let requiredParams = ["email", "password"];
        let containsRequiredParams = requiredParams.every(param => Object.keys(req.body).includes(param));

        if(!containsRequiredParams){

            // Construct a fail response when missing parameters
            response = {
                status: "failure",
                message: `request missing key params ${requiredParams}`
            };

            res.status(400).send(response);
            return;

        } else {

            let selectedUser: UserInterface | null = await UserModel.findOne({"email": req.body.email});
            if(selectedUser){
                // Check if password is correct
                let doesPasswordMatch: boolean = await comparePassword(req.body.password, selectedUser.password.valueOf());
                if(doesPasswordMatch){

                    // Create JWT Token
                    let jwtTokenPromise: Promise<string> = generateJWT(selectedUser._id.toString(), selectedUser.email);

                    let jwtToken: string = await jwtTokenPromise;

                        // Construct a success response when login is successful
                        response = {
                            status: "success",
                            message: "login successful",
                            email: selectedUser.email,
                            token: jwtToken
                        };

                        res.send(response);
                        return;
                } else {

                    // Construct a failure response when login has failed
                    response = {
                        status: "failure",
                        message: "login unsuccessful due to incorrect email or password",
                    };

                    res.send(response);
                    return;

                };
            } else{
                
                // Construct a failure response when login has failed
                response = {
                    status: "failure",
                    message: "login unsuccessful due to incorrect email or password",
                };

                res.send(response);
                return;

            }
        };
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        return;
    };

};