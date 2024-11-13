import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { SignUpPage } from "./SignUpPage";

import CreateProfile from './pages/CreateProfile';

function App() {
  return (
    <div>
      <Routes>
<<<<<<< Updated upstream
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/SignUpPage" element={<SignUpPage/>}/>
        <Route path="*" element={<LoginPage/>}/>
=======
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Login />} />

        <Route path="/CreateProfile" element={<CreateProfile />} />

>>>>>>> Stashed changes
      </Routes>
    </div>
  );
}

export default App;

