import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const onLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Fit<span className="text-primary">Track</span>
        </Link>

        <button 
          className={`navbar-toggle ${isOpen ? 'open' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <li className="nav-item text-muted welcome-msg" style={{marginRight: '1rem', alignSelf: 'center'}}>
                Welcome, {user?.name}
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/progress" className="nav-link" onClick={closeMenu}>Analytics</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={closeMenu}>Profile</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn-primary" style={{textDecoration: 'none'}} onClick={closeMenu}>Get Started</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
