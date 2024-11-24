import ProfileModel from "../models/profile";
import EventModel from '../models/events';
import { ProfileInterface } from "../shared/interface/modelInterface";
import { EventResponseObject } from "../shared/interface/responseInterface";

/**
 * Creates and saves a new profile to the database.
 * @param profileData - Partial profile data excluding userId, friend, and friend_requested.
 * @returns The saved Profile document.
 * @throws Error if the profile cannot be saved.
 */
export async function createProfileService(profileData: Partial<ProfileInterface>): Promise<ProfileInterface> {
    // Initialize a new Profile instance
    const profile = new ProfileModel(profileData);

    // Save the profile to the database
    const savedProfile = await profile.save();

    return savedProfile;
}


export async function updateProfileService(userId: string, updatedData: Partial<ProfileInterface>): Promise<ProfileInterface | null> {

    const updatedProfile = await ProfileModel.findOneAndUpdate(
        { userId: userId },
        { $set: updatedData },
        { new: true } // Return the updated document

    )
    return updatedProfile;
}

export async function getProfileService(userId: string): Promise<ProfileInterface | null> {
    try {
        // Find the profile based on the provided userId
        const profile = await ProfileModel.findOne({ userId: userId });
        return profile;
    } catch (error) {
        console.error("Error retrieving profile:", error);
        throw new Error("Failed to retrieve profile");
    }
    
}

export async function getRecommendedProfiles(userId: string) {
    // Fetch current user's profile
    const currentUserProfile = await ProfileModel.findOne({ userId: userId }).lean();
    if (!currentUserProfile) {
      throw new Error('ProfileNotFound');
    }
  
    // Get the list of event IDs the user is registered for
    const currentUserEvents: string[] = currentUserProfile.event_registered || [];
  
    // Get list of userIds already in friend_requested and friend
    const friendRequestedIds: string[] = currentUserProfile.friend_requested || [];
    const friendIds: string[] = currentUserProfile.friend || [];
  
    // Create a set of userIds to exclude
    const excludeUserIds = new Set<string>([userId, ...friendRequestedIds, ...friendIds]);
  
    // Fetch all other profiles, excluding the current user and users already requested or friends
    const otherProfiles = await ProfileModel.find({
      userId: { $nin: Array.from(excludeUserIds) },
    }).lean();
  
    // Compute similarity scores
    const recommendationsWithScores = otherProfiles.map(profile => {
      // Compute similarity score
      const otherUserEvents: string[] = profile.event_registered || [];
      const intersectionSize = currentUserEvents.filter(eventId => otherUserEvents.includes(eventId)).length;
      const unionSize = new Set([...currentUserEvents, ...otherUserEvents]).size;
      const similarityScore = unionSize > 0 ? intersectionSize / unionSize : 0;
  
      return {
        profile: profile,
        similarityScore: similarityScore
      };
    });
  
    // Sort recommendations by similarity score in descending order
    recommendationsWithScores.sort((a, b) => b.similarityScore - a.similarityScore);
  
    // Limit to top 100
    const topRecommendations = recommendationsWithScores.slice(0, 100);
  
    // Collect all unique event IDs from the recommended profiles
    const eventIdsSet = new Set<string>();
    topRecommendations.forEach(rec => {
      (rec.profile.event_registered || []).forEach(eventId => {
        eventIdsSet.add(eventId);
      });
    });
    const eventIds = Array.from(eventIdsSet);
  
    // Fetch event information for all event IDs
    const events = await EventModel.find({ _id: { $in: eventIds } }).lean();
    const eventMap = new Map<string, any>();
    events.forEach(event => {
      eventMap.set(event._id.toString(), event);
    });
  
    // Now, for each profile, construct the expected data
    const profilesWithEvents = topRecommendations.map(rec => {
      const profile = rec.profile;
  
      // Replace event_registered with event information, mapping to EventResponseObject[]
      const eventRegistered: EventResponseObject[] = (profile.event_registered || []).map((eventId: string) => {
        const event = eventMap.get(eventId);
        if (!event) {
          return null; // Event not found
        }
  
        const attendee = event.userRegistered.length;
        const registered = currentUserEvents.includes(eventId);
  
        const eventResponse: EventResponseObject = {
          id: event._id.toString(),
          eventName: event.eventName,
          description: event.description,
          eventDate: event.eventDate,
          location: event.location,
          priceEstimate: event.priceEstimate,
          coverPhoto: event.coverPhoto,
          attendee: attendee,
          registered: registered,
        };
        return eventResponse;
      }).filter(event => event !== null) as EventResponseObject[];
  
      // Now construct the profile object matching the required fields
      const profileResponse = {
        userId: profile.userId,
        username: profile.username,
        description: profile.description,
        dateOfBirth: profile.dateOfBirth,
        year: profile.year,
        major: profile.major,
        college: profile.college,
        classes: profile.classes,
        hobby: profile.hobby,
        musicPreference: profile.musicPreference,
        favArtists: profile.favArtists,
        friend: profile.friend,
        friend_requested: profile.friend_requested,
        event_registered: eventRegistered,
      };
  
      return profileResponse;
    });
  
    return profilesWithEvents;
  }
  