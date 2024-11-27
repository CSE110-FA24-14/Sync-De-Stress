import React, { useState } from 'react';
import '../CreateProfile.css';
import { Link, useNavigate } from 'react-router-dom';
import { create_profile } from '../services/authService';

const CreateProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [classes, setClasses] = useState('');
  const [hobby, setHobby] = useState('');
  const [contact, setContact] = useState('');
  const [songs, setSongs] = useState('');
  const [singers, setSingers] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null); 
  const [previewImage, setPreviewImage] = useState<string | null>(null); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(''); 
    setSuccess(''); 

    try {
        const response = await create_profile(name, bio, classes, hobby, contact, songs, singers);
        console.log(response);
        setSuccess('profile successfully created');
        navigate('/Profile');
      } catch (err: any) {
        console.error('Error during profile creation:', err); // Log the full error
        const errorMessage = err.response?.data?.message || 'Failed to create a profile';
        setError(errorMessage);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  return (
    <div className="CreateProfile-container">
      <h2 className="CreateProfile-header">Create Profile</h2>

      {/* Profile Picture Section */}
      <div className="ProfileImage-container">

        
        {previewImage ? (
          <img src={previewImage} alt="Profile Preview" className="ProfileImage-preview" />
        ) : (

        <div className="ProfileImage-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      )}

       <label htmlFor="profileImageUpload" className="ProfileImage-button"> + </label>
        <input
          id="profileImageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>

      <label><span style={{ color: "red", fontSize: "12px"}}>*Required</span></label>

      <form className="Form-section" onSubmit={handleCreateProfile}>

        {/* Name Field */}
        <label><span style={{ color: "red"}}>*</span>Name</label>
        <div>
            <input
                type = "text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
        </div>

        {/* Description Field */}
        <label>Describe yourself (Bio)</label>
        <div>
            <input 
                type = "textarea"
                placeholder="What do you want others to know about you?"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
        </div>

        {/* Birthdate Field */}
        <div className="Form-section">
          <label>Birthdate</label>
          <input 
              type="date" 
          />
        </div>

        {/* Year Dropdown */}
        <div className="Form-section">         
          <label><span style={{ color: "red" }}>*</span>Year</label>
          <select>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        {/* Major Dropdown */}
        <div className="Form-section">
          <label><span style={{ color: "red" }}>*</span>Major</label>
          <select>
            <option value="Astronomy & Astrophysics">Astronomy & Astrophysics</option>  
            <option value="Anthropology">Anthropology</option>
            <option value="Bioengineering (BE)">Bioengineering (BE)</option>
            <option value="Biological Sciences">Biological Sciences</option>
            <option value="Black Diaspora and African American Studies">Black Diaspora and African American Studies</option>
            <option value="Chemistry and Biochemistry">Chemistry and Biochemistry</option>
            <option value="Chinese Studies">Chinese Studies</option>
            <option value="Cinematic Arts">Cinematic Arts</option>
            <option value="Classical Studies">Classical Studies</option>
            <option value="Cognitive Science (B.A./B.S.)">Cognitive Science (B.A./B.S.)</option>
            <option value="Communication">Communication</option>
            <option value="Computer Science and Engineering (CSE)">Computer Science and Engineering (CSE)</option>
            <option value="Critical Gender Studies">Critical Gender Studies</option>
            <option value="Dance">Dance</option>
            <option value="Data Science">Data Science</option>
            <option value="Economics">Economics</option>
            <option value="Education Studies">Education Studies</option>
            <option value="Electrical and Computer Engineering (ECE)">Electrical and Computer Engineering (ECE)</option>
            <option value="Mechanical and Aerospace Engineering">Mechanical and Aerospace Engineering</option>
            <option value="NanoEngineering">NanoEngineering</option>
            <option value="Structural Engineering">Structural Engineering</option>
            <option value="Environmental Systems Program">Environmental Systems Program</option>
            <option value="Ethnic Studies">Ethnic Studies</option>
            <option value="German Studies">German Studies</option>
            <option value="Global Health">Global Health</option>
            <option value="Global South Studies">Global South Studies</option>
            <option value="Herbert Wertheim School of Public Health and Human Longevity Science">Herbert Wertheim School of Public Health and Human Longevity Science</option>
            <option value="History">History</option>
            <option value="Human Developmental Sciences">Human Developmental Sciences</option>
            <option value="International Studies (B.A.)">International Studies (B.A.)</option>
            <option value="Italian Studies">Italian Studies</option>
            <option value="Japanese Studies">Japanese Studies</option>
            <option value="Jewish Studies">Jewish Studies</option>
            <option value="Latin American Studies">Latin American Studies</option>
            <option value="Linguistics">Linguistics</option>
            <option value="Literature">Literature</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Mechanical and Aerospace Engineering (MAE)">Mechanical and Aerospace Engineering (MAE)</option>
            <option value="Music">Music</option>
            <option value="NanoEngineering">NanoEngineering</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Physics">Physics</option>
            <option value="Political Science">Political Science</option>
            <option value="Psychology">Psychology</option>
            <option value="Religion, Program for the Study Of">Religion, Program for the Study Of</option>
            <option value="Russian and Soviet Studies">Russian and Soviet Studies</option>
            <option value="Scripps Institution of Oceanography">Scripps Institution of Oceanography</option>
            <option value="Sociology">Sociology</option>
            <option value="Structural Engineering (SE)">Structural Engineering (SE)</option>
            <option value="Theatre and Dance">Theatre and Dance</option>
            <option value="Undeclared">Undeclared</option>
            <option value="Urban Studies and Planning">Urban Studies and Planning</option>
            <option value="Visual Arts">Visual Arts</option>
          </select>
        </div>

        {/* College Dropdown */}
        <div className="Form-section">
          <label><span style={{ color: "red" }}>*</span>College</label>
          <select>
            <option value="Revelle">Revelle</option>
            <option value="Muir">Muir</option>
            <option value="Marshall">Marshall</option>
            <option value="Warren">Warren</option>
            <option value="Roosevelt">Roosevelt</option>
            <option value="Sixth">Sixth</option>
            <option value="Seventh">Seventh</option>
            <option value="Eighth">Eighth</option>
          </select>
        </div>

        {/* Classes Field */}
        <label><span style={{ color: "red" }}>*</span>Classes</label>
        <div>
          <input 
              type = "text"
              placeholder="Enter your current classes"
              value={classes}
              onChange={(e) => setClasses(e.target.value)}
              required
           />
        </div>

        {/* Hobby Field */}
        <label><span style={{ color: "red" }}>*</span>Hobby</label>
        <div>
          <input 
              type = "text"
              placeholder="Enter your hobby"
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              required
          />
        </div>

        {/* Contact Field */}
        <label><span style={{ color: "red" }}>*</span>Contact (Phone # or Instagram ID)</label>
        <div>
          <input 
              type = "text"
              placeholder="Enter your contact information"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
          />
        </div>
    
      {/* Musical Preferences Section */}
      <h3 className="MusicalPreference-header">Musical Preference</h3>

      {/* Genre Dropdown */}
      <div className="Form-section">
        <label><span style={{ color: "red" }}>*</span>Genre</label>
        <select>
          <option value="Pop music">Pop music</option>
          <option value="Rock">Rock</option>
          <option value="Rhythm and blues">Rhythm and blues</option>
          <option value="Jazz">Jazz</option>
          <option value="Popular music">Popular music</option>
          <option value="Blues">Blues</option>
          <option value="Electronic music">Electronic music</option>
          <option value="Hip hop music">Hip hop music</option>
          <option value="Country music">Country music</option>
          <option value="Classical music">Classical music</option>
          <option value="Heavy metal">Heavy metal</option>
          <option value="Alternative rock">Alternative rock</option>
          <option value="Funk">Funk</option>
          <option value="Dance music">Dance music</option>
          <option value="Indie rock">Indie rock</option>
          <option value="Punk rock">Punk rock</option>
          <option value="Soul music">Soul music</option>
          <option value="Reggae">Reggae</option>
          <option value="World music">World music</option>
          <option value="New-age music">New-age music</option>
          <option value="Folk music">Folk music</option>
          <option value="Disco">Disco</option>
          <option value="Hip hop">Hip hop</option>
          <option value="Music of Latin America">Music of Latin America</option>
          <option value="Electronic dance music">Electronic dance music</option>
          <option value="Ska">Ska</option>
          <option value="Progressive rock">Progressive rock</option>
          <option value="Synth-pop">Synth-pop</option>
          <option value="Experimental music">Experimental music</option>
          <option value="Singing">Singing</option>
          <option value="Grunge">Grunge</option>
          <option value="New wave">New wave</option>
          <option value="Easy listening">Easy listening</option>
          <option value="Christian music">Christian music</option>
          <option value="Techno">Techno</option>
          <option value="Electronica">Electronica</option>
          <option value="Jazz fusion">Jazz fusion</option>
          <option value="Ambient music">Ambient music</option>
          <option value="Dubstep">Dubstep</option>
          <option value="Flamenco">Flamenco</option>
          <option value="House music">House music</option>
          <option value="Hardcore punk">Hardcore punk</option>
          <option value="Emo">Emo</option>
          <option value="K-pop">K-pop</option>
          <option value="Indian classical music">Indian classical music</option>
          <option value="Gospel music">Gospel music</option>
          <option value="Hard rock">Hard rock</option>
        </select>
      </div>

      {/* Favorite Songs Field */}
      <label><span style={{ color: "red" }}>*</span>Favorite Songs</label>
      <div>
        <input
            type = "text"
            placeholder="Enter your favorite songs"
            value={songs}
            onChange={(e) => setSongs(e.target.value)}
            required
        />
      </div>

      {/* Favorite Artists Field */}
      <label><span style={{ color: "red" }}>*</span>Favorite Singers/Artists</label>
      <div>
        <input
            type = "text"
            placeholder="Enter your favorite singers/artists"
            value={singers}
            onChange={(e) => setSingers(e.target.value)}
            required
        />
      </div>

      {/* Next Button */}
      <button className="Next-button">Next</button>

      </form>

      {/* Profile creation success messge */}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

    </div>
  );
};

export default CreateProfile;


