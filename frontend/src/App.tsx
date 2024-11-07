import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { SignUpPage } from "./SignUpPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/SignUpPage" element={<SignUpPage/>}/>
        <Route path="*" element={<LoginPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
