import React, { useState } from 'react';
import './EventComponent.css';


interface EventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  isRsvped: boolean; 
  onRsvp: (id: string, rsvpStatus: boolean) => void; //RSVP status retrivl
}


const EventComponent: React.FC<EventProps> = ({
  id,
  title,
  date,
  location,
  attendees,
  isRsvped,
  onRsvp,
}) => {

  const [rsvpStatus, setRsvpStatus] = useState(isRsvped);


  const handleRsvpClick = () => {
    const newStatus = !rsvpStatus;
    setRsvpStatus(newStatus);
    onRsvp(id, newStatus); // make API call
  };

  return (
    <div className="event-bubble">
      <div className="event-image">
        {/* image */}
        <div className="image-placeholder">[Image]</div>
      </div>
      <div className="event-info">
        <h3 className="event-title">{title}</h3>
        <p className="event-details">
          <span role="img" aria-label="calendar">📅</span> {date}
        </p>
        <p className="event-details">
          <span role="img" aria-label="location">📍</span>{location}</p>
        <p className="event-details">
          <span role="img" aria-label="attendees">👥</span> {attendees} Attending</p>
      </div>
      <div className="event-actions">
        <button
          className={`rsvp-button ${rsvpStatus ? 'checked' : 'unchecked'}`}
          onClick={handleRsvpClick}
        >
          {rsvpStatus ? '✔' : '+'}
        </button>
      </div>
    </div>
  );
};
export default EventComponent;












