// src/pages/Login.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';


const Login: React.FC = () => {
  return (
    <div>
      <header className="LoginSignUp-header">
        <p>Engage with the music you love in every way possible.</p>
      </header>
      <form className="login-form">
        <div>
          <input placeholder="Email" />
        </div>
        <div>
          <input placeholder="Password" type="password" />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <p className="form-link">
        <Link to="/signup">I don't have an account.</Link>
      </p>
    </div>
  );
};

export default Login;
