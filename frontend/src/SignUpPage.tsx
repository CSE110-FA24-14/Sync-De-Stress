import './App.css';
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signupHandler = (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        // send to backend
        console.log('email, password', email, password)
        // if email is already registered
    };

    return (
        <div className="App">
            <header className="LoginSignUp-header">
                <p>Engage with the music you love in every way possible.</p>
            </header>
            <div>
                <form className="signup-form" onSubmit={signupHandler}>
                    <div>
                        <span className="error-message" id="emailError"></span>
                        <input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} required
                        >
                        </input>
                    </div>
    
                    <div>
                        <span className="error-message" id="passwordError"></span>
                        <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} required
                    >
                    </input>
                    </div>
      
                    <div><button type="submit">Sign Up</button></div>
                </form>
            </div>
            <Link to={`/`} style={{ textDecoration: 'underLine', color: 'inherit' }}>I already have an account.</Link>
        </div>
    );
}
