import ProfileModel from '../models/profile';
import NotificationModel from '../models/notifications';
import { NOTIFICATION_MATCH_REQUEST, NotificationInterface } from '../shared/interface/modelInterface';

export async function sendFriendRequest(userId: string, targetUserId: string) {
  // Fetch the requester's profile
  const requesterProfile = await ProfileModel.findOne({ userId: userId });
  if (!requesterProfile) {
    throw new Error('ProfileNotFound');
  }

  // Fetch the target user's profile
  const targetProfile = await ProfileModel.findOne({ userId: targetUserId });
  if (!targetProfile) {
    throw new Error('TargetProfileNotFound');
  }

  // Check if the friend request was already made
  if (requesterProfile.friend_requested.includes(targetUserId)) {
    throw new Error('FriendRequestAlreadyMade');
  }

  // Add targetUserId to friend_requested array in requester's profile
  requesterProfile.friend_requested.push(targetUserId);
  await requesterProfile.save();

  // Create a notification for the recipient
  const notification: Partial<NotificationInterface> = {
    userId: targetUserId,  // The recipient of the notification
    type: NOTIFICATION_MATCH_REQUEST, // Assuming type 1 corresponds to friend request notifications
    targetId: userId, // The ID of the user who sent the friend request
    date: new Date()
  };

  const newNotification = new NotificationModel(notification);
  await newNotification.save();
}
