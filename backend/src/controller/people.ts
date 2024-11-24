import { Request, Response } from "express";
import { GetRecommendationResponseInterface } from '../shared/interface/responseInterface';
import { getRecommendedProfiles } from '../services/profile';

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
    // Logic for sending a match request
    res.status(200).json({ message: 'Match request sent' });
}

// Get list of friend/match requests
export async function getMatches(req: Request, res: Response) {
    // Logic for fetching matches
    res.status(200).json({ message: 'List of matches' });
}

// View matched profile
export async function viewProfile(req: Request, res: Response) {
    const userId = req.params.id;
    // Logic for viewing a matched profile
    res.status(200).json({ message: `Profile details for user ID: ${userId}` });
}