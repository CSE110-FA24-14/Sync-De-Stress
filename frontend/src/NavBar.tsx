import { Link } from "react-router-dom";
import events_pic from './icons/events_pic.png';
import people_pic from './icons/people_pic.png';
import profile_pic from './icons/profile_pic.png';

const NavBar = () => {
    return (
        <div>
            <nav style={{ backgroundColor:'#f3edf7', padding: '20px', justifyContent:'space-around', display:'flex' }}>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/home" style={{ color: 'black', textDecoration: 'none' }}>
                        <img src={events_pic}/>
                    </Link>
                    <div>Events</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/people" style={{ color: 'black', textDecoration: 'none' }}>
                        <img src={people_pic}/>
                    </Link>
                    <div>People</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/profile">
                        <img src={profile_pic}/>
                    </Link>
                    <div>Profile</div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar;