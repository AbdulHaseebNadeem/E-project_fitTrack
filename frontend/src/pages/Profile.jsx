import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfileSuccess, logout } from '../store/slices/authSlice';
import axios from 'axios';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handlePencilClick = () => {
    fileInputRef.current.click();
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const submitData = new FormData();
      submitData.append('profilePicture', file);

      const response = await axios.put('http://localhost:5000/api/auth/profile', submitData, config);
      dispatch(updateProfileSuccess(response.data));
      setMessage('Photo updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating photo');
    } finally {
      setLoading(false);
    }
  };

  const defaultAvatar = "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=10b981&color=fff&size=150";
  const avatarUrl = user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : defaultAvatar;

  return (
    <div className="animate-fade-in" style={{ marginTop: '2rem', maxWidth: '400px', margin: '2rem auto' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <img 
            src={avatarUrl} 
            alt="Profile" 
            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} 
          />
          {/* Pencil Icon Button */}
          <button 
            onClick={handlePencilClick}
            disabled={loading}
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              fontSize: '1.2rem',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ✏️
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            style={{ display: 'none' }} 
          />
        </div>

        {message && <p style={{ color: message.includes('success') ? 'var(--primary-color)' : '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{message}</p>}

        <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>{user?.name}</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{user?.email}</p>

        <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <p style={{ marginBottom: '0.5rem' }}><strong style={{color: 'var(--accent-color)'}}>📞 Phone:</strong> {user?.phone || 'Not provided'}</p>
          <p><strong style={{color: '#3b82f6'}}>🌍 Country:</strong> {user?.country || 'Not provided'}</p>
        </div>

        <button onClick={onLogout} className="btn-logout" style={{ width: '100%', padding: '10px', fontSize: '1rem' }}>
          Log Out
        </button>

      </div>
    </div>
  );
};

export default Profile;
