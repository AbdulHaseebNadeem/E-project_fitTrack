import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';

const CaloriesChart = () => {
  const { logs } = useSelector((state) => state.nutrition);

  if (!logs || logs.length === 0) return <p className="text-muted" style={{marginTop: '1rem'}}>No nutrition data available for chart.</p>;

  // Group logs by date
  const dataMap = {};
  logs.forEach(log => {
    const dateStr = new Date(log.date).toLocaleDateString();
    if (dataMap[dateStr]) {
      dataMap[dateStr] += log.calories;
    } else {
      dataMap[dateStr] = log.calories;
    }
  });

  const data = Object.keys(dataMap).map(date => ({
    date,
    calories: dataMap[date]
  })).reverse(); // Oldest to newest

  return (
    <div style={{ width: '100%', height: 250, marginTop: '2rem' }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="date" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
          <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
          <Tooltip cursor={{fill: 'var(--border-color)'}} contentStyle={{backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)'}} />
          <Bar dataKey="calories" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CaloriesChart;
