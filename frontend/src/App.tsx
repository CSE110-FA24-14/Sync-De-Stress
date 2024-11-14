// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateProfile from './pages/CreateProfile';
import Events from './pages/Events';
import People from './pages/People';
import Profile from './pages/Profile';
import NavBar from './NavBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Login />} />
        <Route path="/CreateProfile" element={<CreateProfile />} />
        <Route path="/home" element={<Events />} />
        <Route path="/people" element={<People />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <NavBar />
    </Router>
  );
}

export default App;
