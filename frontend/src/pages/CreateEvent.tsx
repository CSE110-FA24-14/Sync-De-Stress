import React, { useState } from 'react';
import '../styles/CreateEvent.css';
import { Link, useNavigate } from 'react-router-dom';
import { createEvent } from '../services/authService';

const CreateEvent: React.FC = () => {
  const [eventName, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setDate] = useState('');
  const [eventTime, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [priceEstimate, setPrice] = useState('');
  const [coverPhoto, setEventImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const fullDate = new Date(`${eventDate}T${eventTime}`);
      const eventData = {
        eventName,
        description: description || undefined, 
        eventDate: fullDate,
        location,
        priceEstimate: priceEstimate ? parseFloat(priceEstimate) : undefined, 
        coverPhoto: coverPhoto ? URL.createObjectURL(coverPhoto) : undefined, 
      };


      const response = await createEvent(eventData);
      console.log('Event created:', response);

      setSuccess('Event successfully created!');
      setTimeout(() => navigate('/events'), 1500); // Redirect after success
    } catch (err: any) {
      console.error('Error during event creation:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create event';
      setError(errorMessage);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="CreateEvent-container">
      <h2 className="CreateEvent-header">Create Event</h2>

      <div className="EventImage-container">
        {previewImage ? (
          <img src={previewImage} alt="Event Preview" className="EventImage-preview" />
        ) : (
          <div className="EventImage-placeholder">
            <span>Event Image</span>
          </div>
        )}

        <label htmlFor="EventImageUpload" className="EventImage-button">
          Upload
        </label>
        <input
          id="EventImageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>

      <form className="Form-section" onSubmit={handleCreateEvent}>
        <label>Event Title <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          placeholder="Untitled"
          value={eventName}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Provide details on admission, parking, requirements, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Date <span style={{ color: 'red' }}>*</span></label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Time <span style={{ color: 'red' }}>*</span></label>
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <label>Location <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          placeholder="Provide an address for your event"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <label>Price (Optional)</label>
        <input
          type="number"
          placeholder="Enter a price estimate"
          value={priceEstimate}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit" className="Next-button">Create Event</button>
      </form>

      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default CreateEvent;
