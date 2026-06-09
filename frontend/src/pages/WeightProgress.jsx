import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProgressLogs } from '../store/slices/progressSlice';
import { getNutritionLogs } from '../store/slices/nutritionSlice';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ProgressForm from '../components/ProgressForm';
import CaloriesChart from '../components/CaloriesChart';

const WeightProgress = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { logs, isLoading } = useSelector((state) => state.progress);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(getProgressLogs());
      dispatch(getNutritionLogs());
    }
  }, [isAuthenticated, navigate, dispatch]);

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [logs]);

  const chartData = sortedLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString(),
    weight: log.weight
  }));

  // Statistics Calculation
  const latestWeight = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].weight : null;
  const firstWeight = sortedLogs.length > 0 ? sortedLogs[0].weight : null;
  const totalChange = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : 0;
  
  const getChangeSince = (daysAgo) => {
    if (sortedLogs.length < 2) return null;
    const now = new Date();
    const targetDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    // Find the log closest to targetDate that is <= targetDate
    const pastLog = [...sortedLogs].reverse().find(log => new Date(log.date) <= targetDate);
    
    if (pastLog && latestWeight) {
      return (latestWeight - pastLog.weight).toFixed(1);
    }
    return null;
  };

  const change7Days = getChangeSince(7);
  const change30Days = getChangeSince(30);

  return (
    <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>📉 Weight Progress Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Current Weight Card */}
        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Current Weight</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
            {latestWeight ? `${latestWeight} kg` : '--'}
          </p>
        </div>

        {/* Total Progress Card */}
        <div className="card" style={{ borderLeft: `4px solid ${totalChange <= 0 ? 'var(--primary-color)' : '#ef4444'}` }}>
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Total Change</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: totalChange <= 0 ? 'var(--primary-color)' : '#ef4444' }}>
            {totalChange > 0 ? '+' : ''}{totalChange} kg
          </p>
          <span className="text-muted" style={{fontSize: '0.8rem'}}>{totalChange <= 0 ? 'Great job tracking your progress!' : 'Weight gained'}</span>
        </div>

        {/* Short Term Progress */}
        <div className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Recent Changes</h3>
          <div style={{ marginTop: '10px' }}>
            <p><strong>Past 7 Days:</strong> {change7Days !== null ? `${change7Days > 0 ? '+' : ''}${change7Days} kg` : 'Not enough data'}</p>
            <p style={{marginTop: '5px'}}><strong>Past 30 Days:</strong> {change30Days !== null ? `${change30Days > 0 ? '+' : ''}${change30Days} kg` : 'Not enough data'}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#3b82f6' }}>Weight Trend</h2>
        {isLoading ? <p className="text-muted">Loading chart...</p> : (
          chartData.length > 1 ? (
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                  <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)'}}
                    itemStyle={{color: '#3b82f6'}}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} dot={{r: 6, fill: '#3b82f6', stroke: 'var(--surface-color)', strokeWidth: 2}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted" style={{ padding: '2rem 0', textAlign: 'center' }}>
              Log your weight at least twice to see your trend graph!
            </p>
          )
        )}
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Calorie Consumption Trend</h2>
        <CaloriesChart />
      </div>

      <div className="card" style={{ maxWidth: '400px' }}>
        <h3 style={{ marginBottom: '1rem' }}>+ Log Today's Weight</h3>
        <ProgressForm />
      </div>

    </div>
  );
};

export default WeightProgress;
