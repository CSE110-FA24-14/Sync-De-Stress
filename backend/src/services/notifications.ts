import NotificationModel from "../models/notifications";

/**
 * Fetches notifications for a specific user.
 * @param userId - The ID of the user whose notifications are to be fetched.
 */
export async function getNotificationsService(userId: string) {
  try {
      // Query to find notifications for the given user ID
      const notifications = await NotificationModel.find({ userId }).sort({ date: -1 });

      // Map and format notifications for the response
      return notifications.map((notification) => ({
          userId: notification.userId,   // User ID associated with the notification
          type: notification.type,       // Notification type (number)
          targetId: notification.targetId, // Optional target ID
          date: notification.date,       // Notification timestamp
      }));
  }catch (error) {
    if (error instanceof Error) {
        console.error("Error fetching notifications:", error);
        throw new Error(`Failed to fetch notifications: ${error.message}`);
    } else {
        console.error("Unknown error:", error);
        throw new Error("An unknown error occurred while fetching notifications.");
    }
  }
}