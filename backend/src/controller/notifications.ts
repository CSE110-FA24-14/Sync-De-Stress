import { Request, Response } from 'express';
import { getUserNotifications } from '../services/notifications';

export async function getNotifications(req: Request, res: Response) {
    try {
        const userId = req.body.authPayload.id; // Extract user ID from request
        const notifications = await getUserNotifications(userId);

        return res.status(200).send({
            status: 'success',
            message: 'Notifications fetched successfully.',
            data: notifications,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);

        return res.status(500).send({
            status: 'failure',
            message: 'An error occurred while fetching notifications.',
        });
    }
}
