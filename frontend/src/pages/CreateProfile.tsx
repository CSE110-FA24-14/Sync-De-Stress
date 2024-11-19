import React from 'react';
import '../CreateProfile.css';

const CreateProfile: React.FC = () => {
  return (
    <div className="CreateProfile-container">
      <h2 className="CreateProfile-header">Create Profile</h2>

      {/* Profile Picture Section */}
      <div className="ProfileImage-container">
        <div className="ProfileImage-placeholder">
          <span>Profile Image</span>
          <button className="ProfileImage-button">+</button>
        </div>
      </div>

      {/* Name Field */}
      <div className="Form-section">
        <label>Name</label>
        <textarea placeholder="Enter your full name"></textarea>
      </div>

      {/* Description Field */}
      <div className="Form-section">
        <label>Describe yourself (Bio)</label>
        <textarea placeholder="What do you want others to know about you?Showcase who you are."></textarea>
      </div>

      {/* Birthdate Field */}
      <div className="Form-section">
        <label>Birthdate</label>
        <input type="date" />
      </div>

      {/* Year Dropdown */}
      <div className="Form-section">
        <label>Year</label>
        <select>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      {/* Major Dropdown */}
      <div className="Form-section">
        <label>Major</label>
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
        <label>College</label>
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
      <div className="Form-section">
        <label>Classes</label>
        <textarea placeholder="Enter your current classes"></textarea>
      </div>

      {/* Hobby Field */}
      <div className="Form-section">
        <label>Hobby</label>
        <textarea placeholder="Enter your hobby"></textarea>
      </div>

      {/* Contact Field */}
      <div className="Form-section">
        <label>Contact</label>
        <textarea placeholder="Enter your contact information"></textarea>
      </div>

      {/* Musical Preferences Section */}
      <h3 className="MusicalPreference-header">Musical Preference</h3>

      {/* Genre Dropdown */}
      <div className="Form-section">
        <label>Genre</label>
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
      <div className="Form-section">
        <label>Favorite Songs</label>
        <textarea placeholder="Enter your favorite songs"></textarea>
      </div>

      {/* Favorite Artists Field */}
      <div className="Form-section">
        <label>Favorite Singers/Artists</label>
        <textarea placeholder="Enter your favorite singers/artists"></textarea>
      </div>

      {/* Next Button */}
      <button className="Next-button">Next</button>
    </div>
  );
};

export default CreateProfile;