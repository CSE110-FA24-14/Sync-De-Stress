import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateProfile from './pages/CreateProfile';
import Events from './pages/Events';
import People from './pages/People';
import Profile from './pages/Profile';
import NavBar from './NavBar';
import CreateEvent from './pages/CreateEvent';
import './App.css';

function App() {
  return (
      <Router>
      <div className='content'>
        <NavBarState />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Login />} />
          <Route path="/CreateProfile" element={<CreateProfile />} />
          <Route path="/home" element={<Events />} />
          <Route path="/people" element={<People />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

const NavBarState = () => {
  const location = useLocation();
  const navBarPaths = ['/home', '/people', '/profile'];
  return navBarPaths.includes(location.pathname) ? <NavBar /> : null;
};

export default App;
