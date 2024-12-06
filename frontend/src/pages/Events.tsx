import React, { useEffect, useState } from 'react';
import { fetchEvents, rsvpEvent, EventResponseInterface } from '../services/authService';
import EventComponent from '../styles/EventComponent';
import '../styles/Events.css';
import { useNavigate } from 'react-router-dom';

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventResponseInterface[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadEvents = async () => {
    try {
      const eventsData = await fetchEvents();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // filter out old events and sort by date
      const filteredEvents = eventsData
        .filter((event) => new Date(event.eventDate) >= today)
        .sort((a, b) => {
          const dateA = new Date(a.eventDate).getTime();
          const dateB = new Date(b.eventDate).getTime();
          return dateA - dateB;
        });

      setEvents(filteredEvents);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load events.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRsvp = async (eventId: string, isRsvped: boolean) => {
    try {
      const updatedEvent = await rsvpEvent(eventId, isRsvped);
      loadEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to update RSVP status.');
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="events-wrapper">
      <div className="header">
        <h1>Current Events</h1>
        <div
          className="create-event-button"
          onClick={() => navigate('/createevent')}
        >
          <button>+</button>
          <span>Create Event</span>
        </div>
      </div>
      {events.length === 0 ? (
        <p>No upcoming events available.</p>
      ) : (
        events.map((event) => (
          <EventComponent
            key={event.id}
            id={event.id}
            title={event.eventName}
            date={event.eventDate}
            location={event.location}
            attendees={event.attendee}
            isRsvped={event.registered}
            onRsvp={handleRsvp}
          />
        ))
      )}
    </div>
  );
};

export default Events;
