import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Fit<span className="text-primary">Track</span>
        </Link>
        <ul className="navbar-menu">
          {isAuthenticated ? (
            <>
              <li className="nav-item text-muted" style={{marginRight: '1rem', alignSelf: 'center'}}>
                Welcome, {user?.name}
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/progress" className="nav-link">Analytics</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn-primary" style={{textDecoration: 'none'}}>Get Started</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
