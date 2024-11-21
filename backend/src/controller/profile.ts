import { Request, Response } from "express";
import { BaseResponseInterface } from "../shared/interface/responseInterface";
import { ProfileInterface } from "../shared/interface/modelInterface";

import { createProfileService, updateProfileService, getProfileService} from "../services/profile";

// Get user profile
export async function getProfile(req: Request, res: Response) {
    try {
        // Extract user ID from the request (assuming user ID is set in req.body.authPayload)
        const authPayload = req.body.authPayload;
        const userId = authPayload.id;

        // Call the service to get the profile
        const profileData = await getProfileService(userId);

        // Handle the case where no profile was found
        if (!profileData) {
            return res.status(404).send({
                status: 'failure',
                message: 'Profile not found',
            });
        }

        // Success response
        return res.status(200).send({
            status: 'success',
            data: profileData,
        });
    } catch (err: any) {
        // Error response
        console.error('GetProfileController Error:', err);
        return res.status(500).send({
            status: 'failure',
            message: 'There was a failure while trying to retrieve the profile, please try again',
        });
    }
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
    let response: BaseResponseInterface;

    try {
        // Extract authenticated user ID from request
        const authPayload = req.body.authPayload;
        const userId = authPayload.id;

        // Prepare the updated profile data from the request body
        const updatedProfileData: Partial<ProfileInterface> = {
            username: req.body.username,
            dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
            year: req.body.year,
            major: req.body.major,
            college: req.body.college,
            classes: req.body.classes,
            hobby: req.body.hobby,
            musicPreference: req.body.musicPreference,
            favArtists: req.body.favArtists,
            contact: req.body.contact,
            description: req.body.description,
        };

        if (!userId || typeof userId !== 'string' || !updatedProfileData.username) {
            response = {
                status: "failure",
                message: "Validation Error: Missing or invalid input",
            };
            return res.status(400).send(response);
        }

        // Call the service to update the profile
        const updatedProfile = await updateProfileService(userId, updatedProfileData);

        // Handle the case where no profile was found
        if (!updatedProfile) {
            response = {
                status: "failure",
                message: "Profile not found",
            };
            return res.status(404).send(response);
        }

        // Success response
        response = {
            status: "success",
            message: `Profile for userId ${userId} has been successfully updated`,

        };
        return res.status(200).send(response);

    } catch (err: any) {
        // Check for validation error from the service
        if (err.name === 'ValidationError') {
            response = {
                status: "failure",
                message: `Validation Error: ${err.errors?.dateOfBirth?.message || 'Invalid input'}`,
            };
            return res.status(400).send(response);
        }

        // Error response for other exceptions
        response = {
            status: "failure",
            message: "There was a failure while trying to update the profile, please try again",
        };
        console.error("EditProfileController Error:", err);
        return res.status(500).send(response);
    }
}