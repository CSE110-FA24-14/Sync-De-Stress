// src/services/authService.ts
import axios from 'axios';
import { EventInterface } from '../../../backend/src/shared/interface/modelInterface';

const API_BASE_URL = 'http://localhost:3203'; 


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

//CREATE EVENTS
export const createEvent = async (eventData: {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/events/create`, eventData);
    return response.data; // Return the created event
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export interface DummyEventInterface {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  isRsvped: boolean;
}

// Dummy events data using the DummyEventInterface
const dummyEvents: DummyEventInterface[] = [
  {
    id: '1',
    title: "John Doe's Concert",
    date: '2024-12-01',
    time: '18:00',
    location: 'Epstein Family Amphitheater',
    attendees: 1,
    isRsvped: false,
  },
  {
    id: '2',
    title: "Jane Doe's Concert",
    date: '2024-12-05',
    time: '19:00',
    location: 'Central Park Stage',
    attendees: 0,
    isRsvped: true,
  },
  {
    id: '3',
    title: 'Rock the Night Festival',
    date: '2024-12-10',
    time: '20:00',
    location: 'Downtown Arena',
    attendees: 0,
    isRsvped: false,
  },
];

// FETCH ALL EVENTS (mock implementation)
export const fetchEvents = async (): Promise<DummyEventInterface[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyEvents);
    }, 1000);
  });
};

// RSVP TO AN EVENT (mock implementation)
export const rsvpEvent = async (eventId: string, isRsvped: boolean): Promise<DummyEventInterface> => {
  return new Promise((resolve, reject) => {
    const eventIndex = dummyEvents.findIndex((event) => event.id === eventId);
    if (eventIndex !== -1) {
      const updatedEvent = { ...dummyEvents[eventIndex], isRsvped };
      dummyEvents[eventIndex] = updatedEvent; // Update mock data
      resolve(updatedEvent);
    } else {
      reject(new Error('Event not found'));
    }
  });
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