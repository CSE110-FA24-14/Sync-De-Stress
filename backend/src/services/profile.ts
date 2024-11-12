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
