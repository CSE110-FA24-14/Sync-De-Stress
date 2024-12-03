import React, { useEffect, useState } from 'react';
import { fetchEvents, rsvpEvent, EventResponseInterface } from '../services/authService';
import EventComponent from '../styles/EventComponent';
import { useNavigate } from 'react-router-dom'; 

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventResponseInterface[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
    <div className="events-wrapper" style={{ padding: '20px' }}>
      <div
        className="header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ margin: 0, paddingRight: '16px' }}>Events Page</h1>
        <div
          className="create-event-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
          onClick={() => navigate('/createevent')}
        >
          <button
            style={{
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              fontSize: '20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
            }}
          >
            +
          </button>
          <span style={{ color: '#888', fontSize: '14px' }}>Create Event</span>
        </div>
      </div>
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
