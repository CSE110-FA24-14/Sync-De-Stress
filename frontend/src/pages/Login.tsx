// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import '../App.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear errors
    setSuccess(''); // clear success messages

    try {
      const response = await login(email, password);
      console.log(response);
      localStorage.setItem('token', response.token); // Store JWT token
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/home'), 1500); // Redirect 
    } catch (err: any) {
      setError(err.message || 'Login failed'); // login failure
    }
  };

  return (
    <div>
      <header className="LoginSignUp-header">
        <p>Engage with the music you love in every way possible.</p>
      </header>
      <form className="login-form" onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </div>
      </form>
      
      {/* Login success messge */}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <p className="form-link">
        <Link to="/signup">I don't have an account.</Link>
      </p>
    </div>
  );
};

export default Login;
