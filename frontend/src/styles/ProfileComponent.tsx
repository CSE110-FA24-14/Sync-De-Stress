import React from 'react';
import './ProfileComponent.css';

interface ProfileProps {
  profilePic: string;
  userId: string;
  username: string;
  description: string;
  dateOfBirth: Date;
  year: string;
  major: string;
  college: string;
  classes: string;
  hobby: string;
  musicPreference: string;
  favArtists: string;
}

const ProfileComponent: React.FC<ProfileProps> = ({
  profilePic,
  userId,
  username,
  description,
  dateOfBirth,
  year,
  major,
  college,
  classes,
  hobby,
  musicPreference,
  favArtists,
}) => {

  return (
    <>
        <div className="profile-container">
            <h1>{username}</h1>
            <img src={profilePic} style={{ display: 'block', margin: '0 auto', width: '150px', height: '150px' }} />
            <p><strong>Description</strong></p>
            {description}
            <p><strong>Age:</strong> {dateOfBirth.toDateString()}</p>
            <p><strong>Year:</strong> {year}</p>
            <p><strong>Major:</strong> {major}</p>
            <p><strong>College:</strong> {college}</p>
            <p><strong>Classes:</strong> {classes}</p>
            <p><strong>Hobby:</strong> {hobby}</p>
            <p><strong>Music Preference:</strong> {musicPreference}</p>
            <p><strong>Favorite Artists:</strong> {favArtists}</p>
        </div>
    </>
  );
};

export default ProfileComponent;