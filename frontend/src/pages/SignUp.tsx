// src/pages/SignUp.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import '../LoginSignUp.css'; 

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await register(email, password);
      console.log(response);
      navigate('/CreateProfile'); // Redirect to create profile page on successful registration
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div>
      <header className="LoginSignUp-header">
        <p>Create an account to engage with the music you love.</p>
      </header>
      <form className="login-form" onSubmit={handleSignUp}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </form>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <p className="form-link">
        <Link to="/login" style={{ textDecoration: 'underLine', color: 'inherit' }}>I already have an account.</Link>
      </p>
    </div>
  );
};

export default SignUp;
