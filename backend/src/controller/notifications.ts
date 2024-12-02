import { Request, Response } from "express";
import { getNotificationsService } from "../services/notifications";

export async function getNotifications(req: Request, res: Response) {
    try {
        const userId = req.body.authPayload.id; // Get user ID from token
        const notifications = await getNotificationsService(userId);

        res.status(200).json({
            status: "success",
            message: "List of notifications",
            data: notifications, // Include actual notifications here
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            status: "failure",
            message: "Failed to fetch notifications.",
        });
    }
}