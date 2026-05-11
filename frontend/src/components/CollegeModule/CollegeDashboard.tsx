import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  AlertCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import api from '../../api';
import './CollegeModule.css';

interface DashboardStats {
  institutions: number;
  total_students: number;
  active_exams: number;
  suspicious_alerts: number;
  recent_activity: {
    id: string | number;
    title: string;
    desc: string;
    time: string;
    type: string;
  }[];
}

const CollegeDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/super-admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch institution dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fmtNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <div className="college-dashboard">
      <div style={{ marginBottom: '32px' }}>
        <h1 className="ey-title">Institutional Overview</h1>
        <p className="ey-subtitle">Aggregated performance analytics across all registered institutions.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <StatCard
          title="Total Colleges"
          value={loading ? '—' : fmtNum(stats?.institutions ?? 0)}
          change="Registered institutions"
          icon={<Building2 size={24} />}
          loading={loading}
        />
        <StatCard
          title="Total Students"
          value={loading ? '—' : fmtNum(stats?.total_students ?? 0)}
          change="Enrolled across all institutes"
          icon={<Users size={24} />}
          loading={loading}
        />
        <StatCard
          title="Active Exams"
          value={loading ? '—' : fmtNum(stats?.active_exams ?? 0)}
          change="Live sessions right now"
          icon={<FileText size={24} />}
          loading={loading}
        />
        <StatCard
          title="Proctoring Alerts"
          value={loading ? '—' : fmtNum(stats?.suspicious_alerts ?? 0)}
          change="Flagged events total"
          icon={<AlertCircle size={24} color={stats && stats.suspicious_alerts > 0 ? 'var(--error)' : undefined} />}
          loading={loading}
        />
      </div>

      {/* Activity Feed */}
      <div className="ey-card" style={{ maxWidth: '680px' }}>
        <h3 style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Recent System Activity
        </h3>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', padding: '20px 0' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Loading activity...</span>
          </div>
        ) : stats?.recent_activity && stats.recent_activity.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.recent_activity.map((item) => (
              <ActivityItem
                key={item.id}
                title={item.title}
                desc={item.desc}
                time={item.time}
                type={item.type}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
            <AlertCircle size={36} style={{ opacity: 0.15, marginBottom: '12px' }} />
            <p style={{ fontSize: '14px' }}>No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, loading }: any) => (
  <div className="ey-card ey-stat-card">
    <div>
      <div className="ey-stat-label">{title}</div>
      <div className="ey-stat-value">
        {loading
          ? <span style={{ opacity: 0.3, fontSize: '18px' }}>Loading…</span>
          : value}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <TrendingUp size={12} /> {change}
      </div>
    </div>
    <div className="ey-stat-icon">{icon}</div>
  </div>
);

const ActivityItem = ({ title, desc, time, type }: any) => {
  const barColor =
    type === 'ALERT' ? 'var(--error)' :
    type === 'NEW'   ? 'var(--accent-color)' :
    type === 'SUCCESS' ? '#22c55e' :
    'var(--text-primary)';

  return (
    <div style={{ display: 'flex', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ width: '4px', height: '40px', background: barColor, flexShrink: 0, borderRadius: '2px' }} />
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{time}</div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
