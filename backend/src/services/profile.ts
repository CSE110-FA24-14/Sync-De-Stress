import ProfileModel from "../models/profile";
import { ProfileInterface } from "../shared/interface/modelInterface";

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
    console.log('Updated Profile:', updatedProfile);
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