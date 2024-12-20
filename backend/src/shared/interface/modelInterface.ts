import { Document, ObjectId, Types } from "mongoose"

export interface UserInterface extends Document {
  email: String
  password: String,
  is_superuser: Boolean
}

export interface AuthInterface extends Document {
  user_id: Types.ObjectId,
  auth1: String,
  auth2: String,
  created: Date,
  expired: Date
}

export interface ProfileInterface extends Document {
    userId: string;
    username: string; // Field for username
    description?: string; // Optional field for a description
    dateOfBirth: Date; // Date
    year: string; // e.g., "1st Year", "2nd Year"
    major: string; // e.g., "Computer Science"
    college: string; // e.g., "Revelle", "Muir"
    classes: string; // e.g. "CSE 110"
    hobby: string; // e.g. "hiking"
    musicPreference: string; // e.g., "Classical", "Rock"
    favArtists: string; // e.g. "Taylor Swift", "Billie Eilish"
    contact: string; // Phone number, instagram, email
    friend: string[]; // Array of friend IDs as strings
    friend_requested: string[]; // Array of requested friend IDs as strings
    event_registered: string[];
}

export interface EventInterface extends Document {
  eventId: string;
  eventName: string; // Event name
  description?: string; // Optional event description
  eventDate: Date; //Event Date and Time
  location: string; // Event location
  priceEstimate?: number; // Optional price estimate
  coverPhoto?: string; // Optional cover photo (e.g., URL or binary data)
  userRegistered: string[];
}

export const NOTIFICATION_MATCH_REQUEST = 0;
export const NOTIFICATION_MATCHED = 1;
export const NOTIFICATION_MATCH_DENIED = 2;

export interface NotificationInterface extends Document {
  userId: string; // userId of the user that this notification belongs to
  type: number; // Type of notification (e.g., "friend_request", "event_update", "match")
  date: Date; // Date time for notification creation
  targetId: string; // userId of the user that is a potential match.
}
