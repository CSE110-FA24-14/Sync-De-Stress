// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3202';


//SIGN-UP
export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { email, password });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

//LOGIN
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

//CREATE-SUCCESS
export const create_profile = async (
  name: string, bio: string | undefined, dob: Date, year: string, major: string, college: string, classes: string, hobby: string, contact: string, genre: string, songs: string, singers: string) => {
  try {
    const token = await localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/profile`, {
      username: name,
      description: bio,
      dateOfBirth: dob,
      year,
      major,
      college,
      classes,
      hobby,
      musicPreference: genre,
      favArtists: singers,
      contact
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// CREATE EVENT
export const createEvent = async (eventData: {
  eventName: string; // Matches "Event Title"
  eventDate: string; // Matches "Date"
  time?: string;
  location: string; // Matches "Location"
  attendees?: number; // Default value provided
  description?: string;
  priceEstimate?: number; // Matches "Price"
  coverPhoto?: string; // Optional, placeholder for the event image
}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/events`,
      {
        eventName: eventData.eventName,
        eventDate: eventData.eventDate,
        time: eventData.time,
        location: eventData.location,
        attendees: eventData.attendees || 0,
        description: eventData.description || '',
        priceEstimate: eventData.priceEstimate || 0,
        coverPhoto: eventData.coverPhoto || '',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'An unknown error occurred';
  }
};


export interface EventResponseInterface {
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


export const fetchEvents = async (): Promise<EventResponseInterface[]> => {
  try {
    const token = await localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    if(response.status != 200 || response.data.status != 'success'){
      throw new Error(response.data?.message || response.status);
    }
    return response.data.events;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// RSVP TO AN EVENT (mock implementation)
export const rsvpEvent = async (eventId: string, isRsvped: boolean): Promise<boolean> => {
  try {
    const token = await localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/events/register`, {
      eventId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if(response.status != 200 || response.data.status != 'success'){
      throw new Error(response.data?.message || response.status);
    }
    return response.data.unregistered;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/* People Page */

// Define the RecommendationInterface
export interface RecommendationInterface {
  userId: string;
  username: string;
  description: string;
  dateOfBirth: string;
  year: string;
  major: string;
  college: string;
  classes: string;
  hobby: string;
  musicPreference: string;
  favArtists: string;
  friend: string[];
  friend_requested: string[];
  event_registered: EventResponseInterface[];
}

// Function to fetch recommendations
export const fetchRecommenders = async (): Promise<RecommendationInterface[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`${API_BASE_URL}/people/recommendations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 200 || response.data.status !== 'success') {
      throw new Error(response.data?.message || `Error: ${response.status}`);
    }

    return response.data.recommendations;
  } catch (error: any) {
    throw error.response?.data || error.message || 'An unknown error occurred';
  }
};

// send a match request
export const sendFriendRequest = async (targetUserId: string): Promise<boolean> => {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found.');
    }

    // Make the POST request to the /people/match endpoint
    const response = await axios.post(
      `${API_BASE_URL}/people/match`,
      { targetUserId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Check if the response indicates success
    if (response.status !== 200 || response.data.status !== 'success') {
      throw new Error(response.data?.message || `Error: ${response.status}`);
    }

    // Return the response data
    return true;
  } catch (error: any) {
    // Handle and throw errors appropriately
    throw error.response?.data || error.message || 'An unknown error occurred';
  }
};