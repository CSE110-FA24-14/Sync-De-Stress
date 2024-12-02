// src/services/authService.ts
import axios from 'axios';

import default_svg from '../icons/default_svg.svg';

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

//CREATE EVENTS
export const createEvent = async (eventData: {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/events`, eventData);
    return response.data; // Return the created event
  } catch (error: any) {
    throw error.response?.data || error.message;
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

// Dummy events data using the DummyEventInterface
// const dummyEvents: EventInterface[] = [
//   {
//     id: '1',
//     title: "John Doe's Concert",
//     date: '2024-12-01',
//     time: '18:00',
//     location: 'Epstein Family Amphitheater',
//     attendees: 1,
//     isRsvped: false,
//   },
//   {
//     id: '2',
//     title: "Jane Doe's Concert",
//     date: '2024-12-05',
//     time: '19:00',
//     location: 'Central Park Stage',
//     attendees: 0,
//     isRsvped: true,
//   },
//   {
//     id: '3',
//     title: 'Rock the Night Festival',
//     date: '2024-12-10',
//     time: '20:00',
//     location: 'Downtown Arena',
//     attendees: 0,
//     isRsvped: false,
//   },
// ];

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

/*
// FETCH ALL EVENTS (for events list)
export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/events`); // Fetch events list
    return response.data; // Return the list of events
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// RSVP TO AN EVENT
export const rsvpEvent = async (eventId: string, isRsvped: boolean) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/events/${eventId}/rsvp`, {
      isRsvped, 
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
*/

// dummy profile interface
// export interface DummyProfileInterface {
//   profilePic: string;
//   userId: string;
//   username: string;
//   description: string;
//   dateOfBirth: Date;
//   year: string;
//   major: string;
//   college: string;
//   classes: string;
//   hobby: string;
//   musicPreference: string;
//   favArtists: string;
// }

// dummy profiles using dummy profile interface
// const dummyProfiles: DummyProfileInterface[] = [
//   {
//     profilePic: default_svg,
//     userId: "1",
//     username: "johndoe",
//     description: "concert goer addict. trying to find a buddy to go to sun god with!",
//     dateOfBirth: new Date('December 5, 2003'),
//     year: "4th Year",
//     major: "Biology",
//     college: "Sixth College",
//     classes: "Chemistry, Anatomy",
//     hobby: "attending concerts, finding new music",
//     musicPreference: "Pop",
//     favArtists: "Ariana Grande, Post Malone"
//   },

//   {
//     profilePic: default_svg,
//     userId: "2",
//     username: "janedoe",
//     description: "looking for a study buddy with an amazing study playlist",
//     dateOfBirth: new Date('April 12, 2005'),
//     year: "2nd Year",
//     major: "Political Science",
//     college: "Muir",
//     classes: "Anthropology",
//     hobby: "visiting all cafes in the city!",
//     musicPreference: "Rock",
//     favArtists: "Green Day, The Beatles"
//   },

//   {
//     profilePic: default_svg,
//     userId: "3",
//     username: "jdoe",
//     description: "i love and play all kinds of instruments: guitar, piano, drums, bass, ukelele, flute, violin, cello, trombone, triangle, harmonica, accordion, trumpet, etc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     dateOfBirth: new Date('September 13, 2004'),
//     year: "3rd Year",
//     major: "Mechanical Engineering",
//     college: "Marshall",
//     classes: "MAE 119",
//     hobby: "playing musical instruments, practicing instruments, did i mention using instruments",
//     musicPreference: "Live Music",
//     favArtists: "Myself"
//   },
// ];

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


// get list of recommenders
// export const fetchRecommenders = async (): Promise<DummyProfileInterface[]> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(dummyProfiles);
//     }, 1000);
//   });
// };

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