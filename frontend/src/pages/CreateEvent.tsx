import React from 'react';
import '../styles/CreateForm.css';

const CreateEvent: React.FC = () => {
  return (
    <div className="CreateForm-container">
      <h2 className="CreateForm-header">Create Event</h2>

      {/* Title Field */}
      <div className="Form-section">
        <label>Event Title</label>
        <input type="text" placeholder="Untitled" />
      </div>

      {/* Description Field */}
      <div className="Form-section">
        <label>Description</label>
        <textarea placeholder="Provide details on admission, parking, requirements, etc."></textarea>
      </div>

      {/* Date Field */}
      <div className="Form-section">
        <label>Date</label>
        <input type="date" />
      </div>

      {/* Time Field */}
      <div className="Form-section">
        <label>Time</label>
        <input type="time" />
      </div>

      {/* Location Field */}
      <div className="Form-section">
        <label>Location</label>
        <input type="text" />
      </div>

      {/* Price Field */}
      <div className="Form-section">
        <label>Price</label>
        <input type="number" />
      </div>

      {/* Price Description */}
      <div className="Form-section">
        <label>Price Description</label>
        <textarea placeholder="Enter pricing details"></textarea>
      </div>


       {/* Event Picture Section */}
       <div className="EventImage-container">
        <div className="EventImage-placeholder">
          <span>Event Image</span>
          <button className="EventImage-button">+</button>
        </div>
      </div>

      {/* Next Button */}
      <button className="Next-button">Next</button>
    </div>
  );
};

export default CreateEvent;