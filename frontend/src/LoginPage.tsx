import './App.css';
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const loginHandler = async (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        console.log('email, password', email, password)
        
        // UserInterface
        try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
      
            if (response.ok) {
              //
            }
            else {
              const data = await response.json();
              setError(data.message || 'Login failed');
            }
        }
        catch (error) {
            setError('Login Error');
        }
    };

    return (
        <div className="App">
            <header className="LoginSignUp-header">
                <p>Engage with the music you love in every way possible.</p>
            </header>
            <div>
                <form className="login-form" onSubmit={loginHandler}>
                <span className="error-message" id="emailError">{error}</span>
                    <div>
                        <input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} required
                        >
                        </input>
                    </div>

                    <div>
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
