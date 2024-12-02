import { Request, Response } from "express";
import { BaseResponseInterface, GetRecommendationResponseInterface } from '../shared/interface/responseInterface';
import { getRecommendedProfiles } from '../services/profile';
import { respondToFriendRequest, sendFriendRequest, getProfileByIdService } from "../services/people";

// Get list of recommended people
export async function getRecommendations(req: Request, res: Response) {
    try {
        // Fetch userId from req.body.authPayload.id
        const userId = req.body.authPayload.id;

        // Call service function to get recommendations
        const recommendedProfiles = await getRecommendedProfiles(userId);

        // Construct success response
        const response: GetRecommendationResponseInterface = {
            status: "success",
            message: "Recommendations fetched successfully.",
            recommendations: recommendedProfiles,
        };
        res.status(200).send(response);
    } catch (err: any) {
        let response: GetRecommendationResponseInterface;
        if (err.message === 'ProfileNotFound') {
            response = {
                status: "failure",
                message: "User profile not found.",
                recommendations: [],
            };
            res.status(404).send(response);
            return;
        }

        // Handle general errors
        response = {
            status: "failure",
            message: "An error occurred while fetching recommendations.",
            recommendations: [],
        };
        console.error(err);
        res.status(500).send(response);
    }
}

// Send a match request
export async function matchPeople(req: Request, res: Response) {
    let response: BaseResponseInterface;

    const requiredParams = ["targetUserId"];
    const containsRequiredParams = requiredParams.every(param => Object.keys(req.body).includes(param));

    if (!containsRequiredParams) {
        response = {
            status: "failure",
            message: `Request is missing key parameters: ${requiredParams.join(", ")}`
        };
        res.status(400).send(response);
        return;
    }

    try {
        const userId = req.body.authPayload.id;
        const targetUserId = req.body.targetUserId;

        // Call the service function to send friend request
        await sendFriendRequest(userId, targetUserId);

        // Construct success response
        response = {
            status: "success",
            message: "Friend request sent successfully."
        };
        res.status(200).send(response);
    } catch (err: any) {
        if (err.message === 'FriendRequestAlreadyMade') {
            response = {
                status: "failure",
                message: "Friend request was already made."
            };
            res.status(400).send(response);
        } else if (err.message === 'ProfileNotFound') {
            response = {
                status: "failure",
                message: "User profile not found."
            };
            res.status(404).send(response);
        } else if (err.message === 'TargetProfileNotFound') {
            response = {
                status: "failure",
                message: "Target user profile not found."
            };
            res.status(404).send(response);
        } else {
            response = {
                status: "failure",
                message: "An error occurred while processing the request."
            };
            console.error(err);
            res.status(500).send(response);
        }
    }
}

export async function respondToMatchRequest(req: Request, res: Response) {
    let response: BaseResponseInterface;

    const requiredParams = ["requesterUserId", "accept"];
    const containsRequiredParams = requiredParams.every(param => Object.keys(req.body).includes(param));

    if (!containsRequiredParams) {
        response = {
            status: "failure",
            message: `Request is missing key parameters: ${requiredParams.join(", ")}`
        };
        res.status(400).send(response);
        return;
    }

    try {
        const recipientUserId = req.body.authPayload.id; // The user responding to the friend request
        const requesterUserId = req.body.requesterUserId; // The user who sent the friend request
        const accept = req.body.accept; // Boolean value representing accepting or rejecting

        // Call the service function to respond to the friend request
        await respondToFriendRequest(recipientUserId, requesterUserId, accept);

        // Construct success response
        response = {
            status: "success",
            message: accept ? "Friend request accepted." : "Friend request rejected."
        };
        res.status(200).send(response);
    } catch (err: any) {
        if (err.message === 'FriendRequestNotFound') {
            response = {
                status: "failure",
                message: "Friend request not found."
            };
            res.status(404).send(response);
        } else if (err.message === 'ProfileNotFound') {
            response = {
                status: "failure",
                message: "User profile not found."
            };
            res.status(404).send(response);
        } else if (err.message === 'RequesterProfileNotFound') {
            response = {
                status: "failure",
                message: "Requester user profile not found."
            };
            res.status(404).send(response);
        } else {
            response = {
                status: "failure",
                message: "An error occurred while processing the request."
            };
            console.error(err);
            res.status(500).send(response);
        }
    }
}

// Get list of friend/match requests
export async function getMatches(req: Request, res: Response) {
    // Logic for fetching matches
    res.status(200).json({ message: 'List of matches' });
}



export async function viewProfile(req: Request, res: Response) {
    try {
        const profileId = req.params.id;
        const requesterId = req.body.authPayload.id;

        const profile = await getProfileByIdService(profileId, requesterId);

        if (!profile) {
            return res.status(404).send({
                status: "failure",
                message: `Profile with ID '${profileId}' not found.`,
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Profile fetched successfully.",
            data: profile,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).send({
            status: "failure",
            message: "An error occurred while fetching the profile.",
        });
    }
}