import { useState, useEffect, SetStateAction } from 'react';
import { Link, useLocation } from "react-router-dom";

import events_svg from './icons/events_svg.svg';
import people_svg from './icons/people_svg.svg';
import profile_svg from './icons/profile_svg.svg';
import notification_svg from './icons/notification_svg.svg';

import './NavBar.css';


const NavBar = () => {
    const location = useLocation();
    const [selectedPage, setSelectedPage] = useState(location.pathname);

    useEffect(() => {
        setSelectedPage(location.pathname);
    }, [location]);

    const handleLinkClick = (path: SetStateAction<string>) => {
        setSelectedPage(path);
    };

    const isSelected = (path: string) => selectedPage === path;

    return (
        <div className='navbar'>
            <nav style={{ backgroundColor:'#f3edf7', padding: '20px', justifyContent:'space-around', display:'flex', alignItems:'center', overflow:'hidden' }}>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/home" onClick={() => handleLinkClick('/home')}>
                        <div className={`events_wrapper ${isSelected('/home') ? 'selected' : ''}`}>
                            <img src={events_svg} className='events_svg'/>
                        </div>
                    </Link>
                    <div style={{ fontWeight: 'bold' }}>Events</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/people" onClick={() => handleLinkClick('/people')}>
                        <div className={`events_wrapper ${isSelected('/people') ? 'selected' : ''}`}>
                            <img src={people_svg} className='people_svg'/>
                        </div>
                    </Link>
                    <div style={{ fontWeight: 'bold' }}>People</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/profile" onClick={() => handleLinkClick('/profile')}>
                        <div className={`events_wrapper ${isSelected('/profile') ? 'selected' : ''}`}>
                            <img src={profile_svg} className='profile_svg'/>
                        </div>
                    </Link>
                    <div style={{ fontWeight: 'bold' }}>Profile</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/notification" onClick={() => handleLinkClick('/notification')}>
                        <div className={`events_wrapper ${isSelected('/notification') ? 'selected' : ''}`}>
                            <img src={notification_svg} className='notification_svg'/>
                        </div>
                    </Link>
                    <div style={{ fontWeight: 'bold' }}>Notification</div>
                </div>

            </nav>
        </div>
    )
}

export default NavBar;