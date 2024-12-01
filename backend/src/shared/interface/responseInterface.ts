import { EventInterface } from "./modelInterface";

export interface BaseResponseInterface {
    status: String;
    message: String;
}

export interface CreateEventInterface extends BaseResponseInterface{
    status: String;
    message: String;
    id?: String;
    data?: any;
}

export interface GetEventRegisteredResponseInterface extends BaseResponseInterface{
    status: String;
    message: String;
    id?: String;
    data?: any;
}

export interface LoginResponseInterface extends BaseResponseInterface {
    email?: String;
    token?: String;
}

export interface EventResponseObject {
    id: string;
    eventName: string; // Event name
    description?: string; // Optional event description
    eventDate: Date; //Event Date and Time
    location: string; // Event location
    priceEstimate?: number; // Optional price estimate
    coverPhoto?: string; // Optional cover photo (e.g., URL or binary data)
    attendee: number; // number of userRegistered
    registered: boolean;
}

export interface GetEventResponseInterface extends BaseResponseInterface{
    events: EventResponseObject[];
}

export interface RegisterEventResponseInterface extends BaseResponseInterface{
    unregistered: boolean; // true if successfully unregistered, false if successfully registed after calling this endpoint
}

export interface GetRecommendationResponseInterface extends BaseResponseInterface {
    recommendations: {
      userId: string;
      username: string;
      description?: string;
      dateOfBirth: Date;
      year: string;
      major: string;
      college: string;
      classes: string;
      hobby: string;
      musicPreference: string;
      favArtists: string;
      friend: string[];
      event_registered: EventResponseObject[];
    }[];
  }
