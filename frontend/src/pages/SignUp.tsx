// src/pages/SignUp.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const SignUp: React.FC = () => {
  return (
    <div>
      <header className="LoginSignUp-header">
        <p>Create an account to engage with the music you love.</p>
      </header>
      <form className="login-form">
        <div>
          <input placeholder="Email" />
        </div>
        <div>
          <input placeholder="Password" type="password" />
        </div>
        <div>
          <input placeholder="Confirm Password" type="password" />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
      <p className="form-link">
        <Link to="/login">I already have an account.</Link>
      </p>
    </div>
  );
};

export default SignUp;
