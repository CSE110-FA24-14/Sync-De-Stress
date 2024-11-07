import './App.css';
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        // want to replace browser error messages with custom ones
        // send to backend
        console.log('email, password', email, password)
    };

    return (
        <div className="App">
            <header className="LoginSignUp-header">
                <p>Engage with the music you love in every way possible.</p>
            </header>
            <div>
                <form className="login-form" onSubmit={loginHandler}>
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
      
                    <div><button type="submit">Login</button></div>
                </form>
            </div>
            <Link to={`/SignUpPage`} style={{ textDecoration: 'underLine', color: 'inherit' }}>I don't have an account.</Link>
        </div>
    );
}
