import NotificationModel from '../models/notifications';
import ProfileModel from '../models/profile';

export async function getUserNotifications(userId: string) {
    // Fetch notifications for the user and sort by date in descending order
    const notifications = await NotificationModel.find({ userId }).sort({ date: -1 });

    // Map and format notifications for the response
    const formattedNotifications = await Promise.all(
        notifications.map(async (notification) => {
            // Fetch the target user profile based on `targetId`
            const targetUser = await ProfileModel.findOne({ userId: notification.targetId });

            let title = '';
            if (targetUser) {
                // Generate title based on notification type
                switch (notification.type) {
                    case 0: // Friend Request
                        title = `${targetUser.username} sent you a friend request`;
                        break;
                    case 1: // Match Notification
                        title = `You matched with ${targetUser.username}`;
                        break;
                    case 2: // Friend Request Rejected
                        title = `${targetUser.username} rejected your friend request`;
                        break;
                    default:
                        title = 'Unknown notification type';
                        break;
                }
            } else {
                title = 'User not found';
            }

            // Return formatted notification
            return {
                title,
                type: notification.type,
                targetId: notification.targetId,
                date: notification.date,
            };
        })
    );

    return formattedNotifications;
}