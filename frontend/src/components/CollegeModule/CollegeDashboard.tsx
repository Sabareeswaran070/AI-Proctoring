import React from 'react';
import { 
  Building2, 
  Users, 
  UserCheck, 
  FileText, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Activity,
  ArrowUpRight,
  LayoutDashboard
} from 'lucide-react';
import './CollegeModule.css';

const CollegeDashboard: React.FC = () => {
  return (
    <div className="college-dashboard">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="ey-title">Institutional Overview</h1>
        <p className="ey-subtitle">Aggregated performance analytics across all registered institutions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <StatCard title="Total Colleges" value="42" change="+3 this month" icon={<Building2 size={24} />} />
        <StatCard title="Total Students" value="12,850" change="+12% YoY" icon={<Users size={24} />} />
        <StatCard title="Active Exams" value="184" change="Live sessions" icon={<FileText size={24} />} />
        <StatCard title="Proctoring Alerts" value="26" change="Critical level" icon={<AlertCircle size={24} color="var(--error)" />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="ey-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '13px', color: 'var(--text-secondary)' }}>Institution Performance Overview</h3>
            <select className="ey-input" style={{ width: '150px', padding: '8px' }}>
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '20px 0' }}>
            {/* Mock Chart Bars */}
            {[65, 40, 85, 55, 90, 70, 45, 80].map((h, i) => (
              <div key={i} style={{ flex: 1, position: 'relative' }}>
                <div style={{ 
                  height: `${h}%`, 
                  background: i === 4 ? 'var(--accent-color)' : 'var(--text-primary)', 
                  width: '100%',
                  borderRadius: '4px 4px 0 0'
                }}></div>
                <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '8px', fontWeight: 600, color: 'var(--text-secondary)' }}>M{i+1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ey-card">
          <h3 style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Recent Critical Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ActivityItem 
              title="New Institution Registered" 
              desc="MIT University - Boston Campus" 
              time="2h ago" 
              type="NEW" 
            />
            <ActivityItem 
              title="High Risk Alert" 
              desc="Exam ID: 892 - Stanford College" 
              time="4h ago" 
              type="ALERT" 
            />
            <ActivityItem 
              title="Contract Expiring" 
              desc="Oxford Global - 15 Days left" 
              time="1d ago" 
              type="EXPIRY" 
            />
            <ActivityItem 
              title="Bulk Data Import" 
              desc="2,400 Students - IIT Bombay" 
              time="2d ago" 
              type="INFO" 
            />
          </div>
          <button className="ey-btn-outline" style={{ width: '100%', marginTop: '20px' }}>View All Activity</button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon }: any) => (
  <div className="ey-card ey-stat-card">
    <div>
      <div className="ey-stat-label">{title}</div>
      <div className="ey-stat-value">{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <TrendingUp size={12} /> {change}
      </div>
    </div>
    <div className="ey-stat-icon">
      {icon}
    </div>
  </div>
);

const ActivityItem = ({ title, desc, time, type }: any) => (
  <div style={{ display: 'flex', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ 
      width: '4px', 
      height: '40px', 
      background: type === 'ALERT' ? 'var(--error)' : type === 'NEW' ? 'var(--accent-color)' : 'var(--text-primary)',
      flexShrink: 0,
      borderRadius: '2px'
    }}></div>
    <div>
      <div style={{ fontWeight: 600, fontSize: '14px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{time}</div>
    </div>
  </div>
);

export default CollegeDashboard;
