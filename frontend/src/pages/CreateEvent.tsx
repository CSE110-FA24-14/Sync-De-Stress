import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateForm.css';
import { createEvent } from '../services/authService';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [priceDescription, setPriceDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setError('');
    setSuccess('');
  
    if (!title || !date || !location) {
      setError('Event Title, Date, and Location are required fields.');
      return;
    }
  
    try {
      const eventData = {
        eventName: title,
        eventDate: date,
        time: time || '',
        location: location,
        attendees: 0,
        description: description || 'Description',
        priceEstimate: price || 0,
        coverPhoto: 'default.jpg', // edit later
      };
  
      await createEvent(eventData);
      setSuccess('Event created successfully!');
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to create event.');
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhoto(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="CreateForm-container">
      <div className="CreateForm-header-container">
        <button
          className="Back-button"
          onClick={() => navigate('/home')}
        >
          ←
        </button>
        <h2 className="CreateForm-header">Create Event</h2>
      </div>

      <form className="Form-section" onSubmit={handleCreateEvent}>
        <div className="Form-section">
          <label>
            <span style={{ color: 'red' }}>*</span>Event Title
          </label>
          <input
            type="text"
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="Form-section">
          <label>Description</label>
          <textarea
            placeholder="Provide details on admission, parking, requirements, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="Form-section">
          <label>
            <span style={{ color: 'red' }}>*</span>Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="Form-section">
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="Form-section">
          <label>
            <span style={{ color: 'red' }}>*</span>Location
          </label>
          <input
            type="text"
            placeholder="Enter the location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="Form-section">
          <label>Price</label>
          <input
            type="number"
            placeholder="Enter the price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || '')}
          />
        </div>

        <div className="Form-section">
          <label>Event Cover Photo</label>
          <div className="EventImage-container">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Event Preview"
                className="EventImage-preview"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '10px',
                }}
              />
            ) : (
              <div className="EventImage-placeholder">
                <span>Event Image</span>
                <button type="button" className="EventImage-button">+</button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="coverPhotoUpload"
            />

          </div>
        </div>

        <button type="submit" className="Next-button">
          Create Event
        </button>

        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{success}</p>}
      </form>
    </div>
  );
};

export default CreateEvent;
