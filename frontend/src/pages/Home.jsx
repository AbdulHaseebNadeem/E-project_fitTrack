import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const handleGetStarted = () => {
    if (user?.token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
    <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Track Your Fitness Journey with <span style={{ color: 'var(--primary-color)' }}>Precision</span>
      </h1>
      <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        Log your workouts, track your meals, and achieve your goals faster with our comprehensive fitness management platform.
      </p>
      <div>
        <button onClick={handleGetStarted} className="btn-primary" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '12px 24px', marginRight: '1rem', cursor: 'pointer' }}>
          Start for Free
        </button>
        <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500' }}>
          I already have an account
        </Link>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem', textAlign: 'left' }}>
        <div className="card">
          <h3 style={{ color: 'var(--primary-color)' }}>🏋️ Workout Tracking</h3>
          <p className="text-muted">Log your sets, reps, and weights easily. Monitor your strength gains over time.</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--accent-color)' }}>🍔 Nutrition Logging</h3>
          <p className="text-muted">Keep track of your daily meals and calories to ensure you're hitting your macros.</p>
        </div>
        <div className="card">
          <h3 style={{ color: '#3b82f6' }}>📈 Progress Charts</h3>
          <p className="text-muted">Visualize your weight loss or muscle gain with beautiful, interactive charts.</p>
        </div>
      </div>
    </div>

};

export default Home;
