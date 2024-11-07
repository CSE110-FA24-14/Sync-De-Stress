import React from 'react';
import { Link } from "react-router-dom";

export const LoginSignupNavbar = () => {
    return (
        <div>
            <nav /*style={{ display: "flex", justifyContent: "space-around" }}*/>
                <Link to="/signuppage">I don't have an account.</Link>
            </nav>
        </div>
    );
};