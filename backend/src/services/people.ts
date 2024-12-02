import ProfileModel from '../models/profile';
import EventModel from "../models/events";
import NotificationModel from '../models/notifications';
import { NOTIFICATION_MATCH_DENIED, NOTIFICATION_MATCH_REQUEST, NOTIFICATION_MATCHED, NotificationInterface } from '../shared/interface/modelInterface';

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

export async function respondToFriendRequest(recipientUserId: string, requesterUserId: string, accept: boolean) {
    // Fetch the recipient's profile
    const recipientProfile = await ProfileModel.findOne({ userId: recipientUserId });
    if (!recipientProfile) {
        throw new Error('ProfileNotFound');
    }

    // Fetch the requester's profile
    const requesterProfile = await ProfileModel.findOne({ userId: requesterUserId });
    if (!requesterProfile) {
        throw new Error('RequesterProfileNotFound');
    }

    // Check if the requesterUserId is in the recipient's friend_requested list
    if (!requesterProfile.friend_requested.includes(recipientUserId)) {
        throw new Error('FriendRequestNotFound');
    }

    // Remove requesterUserId from recipient's friend_requested list
    requesterProfile.friend_requested = requesterProfile.friend_requested.filter(id => id !== recipientUserId);

    if (accept) {
        // Add each other to friend lists
        recipientProfile.friend.push(requesterUserId);
        requesterProfile.friend.push(recipientUserId);

        // Create matched notifications
        const recipientNotification: Partial<NotificationInterface> = {
            userId: recipientUserId,
            type: NOTIFICATION_MATCHED,
            targetId: requesterUserId,
            date: new Date()
        };

        const requesterNotification: Partial<NotificationInterface> = {
            userId: requesterUserId,
            type: NOTIFICATION_MATCHED,
            targetId: recipientUserId,
            date: new Date()
        };

        // Remove friend request notification from recipient
        await NotificationModel.deleteOne({
            userId: recipientUserId,
            type: NOTIFICATION_MATCH_REQUEST,
            targetId: requesterUserId
        });

        // Save notifications
        await NotificationModel.insertMany([recipientNotification, requesterNotification]);
    } else {

        const rejectionNotification = new NotificationModel({
            userId: requesterUserId,
            type: NOTIFICATION_MATCH_DENIED,
            targetId: recipientUserId,
            date: new Date()
        });

        await rejectionNotification.save();

        // If rejected, remove friend request notification from recipient
        await NotificationModel.deleteOne({
            userId: recipientUserId,
            type: NOTIFICATION_MATCH_REQUEST,
            targetId: requesterUserId
        });
    }

    // Save profiles
    await recipientProfile.save();
    await requesterProfile.save();
}

export async function getProfileByIdService(profileId: string, requesterId: string) {
    try {
        // Find the profile by ID
        const profile = await ProfileModel.findOne({ userId: profileId }).lean();

        if (!profile) {
            return null; // Return null if the profile does not exist
        }

        // Exclude the `friend_requested` field
        const { friend_requested, ...filteredProfile } = profile;

        // Check if the requester is a friend
        const isFriend = profile.friend.includes(requesterId);
        if (!isFriend) {
            delete (filteredProfile as any).contact; // Cast to `any` to bypass the TypeScript restriction
        }

        // Fetch detailed event information
        const eventDetails = await EventModel.find({
            _id: { $in: profile.event_registered },
        });

        // Add event details without modifying `event_registered`
        return {
            ...filteredProfile,
            event_details: eventDetails,
        };
    } catch (error) {
        console.error("Error fetching profile by ID:", error);
        throw new Error("Failed to fetch profile by ID.");
    }
}

