// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateProfile from './pages/CreateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Login />} />
        <Route path="/CreateProfile" element={<CreateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
