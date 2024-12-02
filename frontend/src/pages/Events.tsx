import React, { useEffect, useState } from 'react';
import { fetchEvents, rsvpEvent, EventResponseInterface } from '../services/authService'; // DummyEventInterface
import EventComponent from '../styles/EventComponent';

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventResponseInterface[]>([]);
  const [error, setError] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(true); // loading

  const loadEvents = async () => {
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData); 
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
        <h1>Events Page</h1>
        {events.map((event) => (
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
        ))}
    </div>
);

};

export default Events;
