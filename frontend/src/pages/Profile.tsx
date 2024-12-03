import React from "react";
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    return (
        <>
            <p>Profile Page</p>
            <Link to='/login' style={{ color: 'red' }}>Sign Out</Link>
        </>
    )
}

export default Profile;