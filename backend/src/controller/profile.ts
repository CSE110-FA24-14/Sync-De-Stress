import { Request, Response } from "express";
import { BaseResponseInterface } from "../shared/interface/responseInterface";
import { ProfileInterface } from "../shared/interface/modelInterface";
import { createProfileService } from "../services/profile";

// Get user profile
export async function getProfile(req: Request, res: Response) {
    // Logic for fetching user profile
    res.status(200).json({ message: 'User profile data' });
}

// Create a new profile
export async function createProfile(req: Request, res: Response) {
    // Declare necessary variables
    let response: BaseResponseInterface;
    const requiredParams = [
        "username",
        "dateOfBirth",
        "year",
        "major",
        "college",
        "classes",
        "hobby",
        "musicPreference",
        "favArtists",
        "contact"
    ];

    // Check if all required parameters are present in req.body
    const containsRequiredParams = requiredParams.every(param => Object.keys(req.body).includes(param));

    if (!containsRequiredParams) {
        // Construct a failure response when missing parameters
        response = {
            status: "failure",
            message: `Request is missing required parameters: ${requiredParams.join(", ")}`
        };

        return res.status(400).send(response);
    }

    try {
        // Extract userId from authPayload
        const authPayload = req.body.authPayload;
        const userId = authPayload.id;

        // Prepare profile data
        const profileData: Partial<ProfileInterface> = {
            userId: userId, // Derived from authPayload.id
            username: req.body.username,
            dateOfBirth: new Date(req.body.dateOfBirth),
            year: req.body.year,
            major: req.body.major,
            college: req.body.college,
            classes: req.body.classes,
            hobby: req.body.hobby,
            musicPreference: req.body.musicPreference,
            favArtists: req.body.favArtists,
            contact: req.body.contact,
            // Optional fields with defaults
            description: req.body.description || "",
            friend: [], // Default to empty array
            friend_requested: [] // Default to empty array
        };

        // Call the service to create the profile
        const savedProfile = await createProfileService(profileData);

        // Construct a success response when profile creation is successful
        response = {
            status: "success",
            message: `Profile for userId ${savedProfile.userId} has been successfully created`
        };

        return res.status(201).send(response);

    } catch (err: any) {
        // Handle duplicate profile (unique userId) error
        if (err?.code === 11000) {
            response = {
                status: "failure",
                message: "A profile for this user already exists"
            };

            return res.status(409).send(response);
        }

        // Handle validation errors
        if (err?.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val: any) => val.message);
            response = {
                status: "failure",
                message: `Validation Error: ${messages.join(", ")}`
            };

            return res.status(400).send(response);
        }

        // Handle other unexpected errors
        response = {
            status: "failure",
            message: "There was a failure while trying to create the profile, please try again"
        };
        console.error("CreateProfileController Error:", err);

        return res.status(500).send(response);
    }
}

// Edit profile details
export async function editProfile(req: Request, res: Response) {
    // Logic for editing profile details
    res.status(200).json({ message: 'Profile updated successfully' });
}