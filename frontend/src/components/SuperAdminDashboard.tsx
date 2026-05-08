import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  User,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  Activity,
  Globe,
  MoreVertical
} from 'lucide-react';
import api from '../api';
import './SuperAdminDashboard.css';
import logo from '../assets/logo-icon.svg';

interface DashboardData {
  total_students: number;
  active_exams: number;
  suspicious_alerts: number;
  precision: string;
  avg_response_time: string;
  institutions: number;
  recent_activity: Array<{
    id: number;
    title: string;
    desc: string;
    time: string;
    type: string;
  }>;
}

const SuperAdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/super-admin/stats');
        setData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner">Loading Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center', color: 'red' }}>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>
          <div className="logo-text">
            <span className="logo-title">AI Proctoring</span>
            <span className="logo-subtitle">Super Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <div className="nav-item">
            <Users size={18} />
            <span>Students</span>
          </div>
          <div className="nav-item">
            <User size={18} />
            <span>Faculty</span>
          </div>
          <div className="nav-item">
            <FileText size={18} />
            <span>Exams</span>
          </div>
          <div className="nav-item">
            <Shield size={18} />
            <span>Question Bank</span>
          </div>
          <div className="nav-item">
            <Eye size={18} />
            <span>AI Proctoring</span>
          </div>
          <div className="nav-item">
            <Activity size={18} />
            <span>Live Monitoring</span>
          </div>
          <div className="nav-item">
            <TrendingUp size={18} />
            <span>Results</span>
          </div>
          <div className="nav-item">
            <Globe size={18} />
            <span>Reports & Analytics</span>
          </div>
          <div className="nav-item">
            <Bell size={18} />
            <span>Notifications</span>
          </div>
          <div className="nav-item">
            <Shield size={18} />
            <span>Security</span>
          </div>
          <div className="nav-item">
            <Clock size={18} />
            <span>Audit Logs</span>
          </div>
          <div className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </div>
          <div className="nav-item">
            <Search size={18} />
            <span>Support</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          © 2026 AI Proctoring System
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="search-bar">
            <Search size={18} color="#99A1AF" />
            <input type="text" placeholder="Search for Institutions, Exams, or Students..." />
          </div>

          <div className="header-right">
            <div className="notification-bell">
              <Bell size={20} />
              <div className="notification-dot"></div>
            </div>
            
            <div className="profile-section">
              <div className="profile-info">
                <span className="profile-name">Alex Rodriguez</span>
                <span className="profile-role">Master Administrator</span>
              </div>
              <div className="avatar">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-body">
          <div className="page-title-section">
            <h1 className="page-title">Global Overview Dashboard</h1>
            <p className="page-subtitle">Real-time monitoring across 12 institutions and 1,452 active sessions.</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <StatCard 
              title="Total Registered Students" 
              value={data?.total_students.toLocaleString()} 
              change="+12% from last month" 
              icon={<Users color="#9810FA" />} 
              iconBg="#F5EBFF" 
            />
            <StatCard 
              title="Active Examinations" 
              value={data?.active_exams.toString()} 
              change="Live across all zones" 
              icon={<FileText color="#1447E6" />} 
              iconBg="#EBF0FF" 
            />
            <StatCard 
              title="AI Suspicious Alerts" 
              value={data?.suspicious_alerts.toLocaleString()} 
              change="+42 high risk flagged" 
              icon={<AlertTriangle color="#FB2C36" />} 
              iconBg="#FFF0F1" 
            />
            <StatCard 
              title="Proctoring Precision" 
              value={data?.precision} 
              change="Model v4.2 Deployment" 
              icon={<TrendingUp color="#00A63E" />} 
              iconBg="#EBF9F0" 
            />
            <StatCard 
              title="Avg. Incident Response" 
              value={data?.avg_response_time} 
              change="-15s from yesterday" 
              icon={<Clock color="#D08700" />} 
              iconBg="#FFF8EB" 
            />
            <StatCard 
              title="Institution Partners" 
              value={data?.institutions.toString()} 
              change="2 pending verification" 
              icon={<Globe color="#111111" />} 
              iconBg="#F5F6FA" 
            />
          </div>

          {/* Charts Section */}
          <div className="content-grid">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Examination Traffic Analysis</h2>
                <p className="card-subtitle">Global concurrent student activity (Last 24 Hours)</p>
              </div>
              <div className="chart-placeholder">
                <svg width="100%" height="280" viewBox="0 0 800 280">
                  <path d="M0 240 Q 100 220 200 180 T 400 120 T 600 100 T 800 40" fill="none" stroke="#1447E6" strokeWidth="3" />
                  <path d="M0 240 Q 100 220 200 180 T 400 120 T 600 100 T 800 40 L 800 280 L 0 280 Z" fill="url(#gradient)" opacity="0.1" />
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#1447E6" />
                      <stop offset="100%" stopColor="#1447E6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="0" y1={i * 60 + 40} x2="800" y2={i * 60 + 40} stroke="#F3F4F6" strokeWidth="1" />
                  ))}
                </svg>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ background: '#1447E6' }}></div>
                    <span>Concurrent Users</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ background: '#9810FA' }}></div>
                    <span>AI Flagged Events</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Critical Activity</h2>
                <p className="card-subtitle">Global security & system logs</p>
              </div>
              <div className="activity-list">
                {data?.recent_activity.map((activity) => (
                  <ActivityItem 
                    key={activity.id}
                    title={activity.title} 
                    desc={activity.desc} 
                    time={activity.time} 
                    icon={activity.type === 'ALERT' ? <AlertTriangle size={16} color="#FB2C36" /> : <Shield size={16} color="#00A63E" />} 
                    iconBg={activity.type === 'ALERT' ? "#FFF0F1" : "#EBF9F0"} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Live Monitoring Section */}
          <div className="monitor-section">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 className="card-title">Live High-Risk Monitor</h2>
                <p className="card-subtitle">Automatic tracking of students with {'>'}70% risk score</p>
              </div>
              <button className="page-btn">View All 42 Alerts</button>
            </div>
            
            <div className="monitor-grid">
              <p className="card-subtitle">Searching for high-risk activity...</p>
              {/* This section will be populated via WebSockets or real-time polling in the next phase */}
            </div>
          </div>

          {/* Active Exams Table */}
          <div className="table-container">
            <div className="table-header">
              <h2 className="card-title">Ongoing Examinations</h2>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Examination Name</th>
                  <th>Institution</th>
                  <th>Students</th>
                  <th>Security Level</th>
                  <th>Time Elapsed</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6A7282' }}>
                    No active examinations found across regions.
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="pagination">
              <span className="page-subtitle">Showing 1-4 of 156 active exams</span>
              <div className="pagination-buttons">
                <button className="page-btn"><ChevronLeft size={16} /></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">...</button>
                <button className="page-btn">14</button>
                <button className="page-btn"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* Sub-components */

const StatCard = ({ title, value, change, icon, iconBg }: any) => (
  <div className="stat-card">
    <div className="stat-info">
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
      <div className="stat-change">{change}</div>
    </div>
    <div className="stat-icon" style={{ background: iconBg }}>
      {icon}
    </div>
  </div>
);

const ActivityItem = ({ title, desc, time, icon, iconBg }: any) => (
  <div className="activity-item">
    <div className="activity-icon" style={{ background: iconBg }}>
      {icon}
    </div>
    <div className="activity-content">
      <span className="activity-title">{title}</span>
      <span className="activity-desc">{desc}</span>
      <span className="activity-time">{time}</span>
    </div>
  </div>
);

const StudentRiskCard = ({ name, id, exam, risk, violations }: any) => (
  <div className="student-card">
    <div className="student-card-header">
      <div>
        <span className="student-name">{name}</span>
        <span className="student-id">{id}</span>
      </div>
      <div className="risk-badge" style={{ background: risk > 85 ? '#FFF0F1' : '#FFF8EB' }}>
        <Eye size={16} color={risk > 85 ? '#FB2C36' : '#D08700'} />
      </div>
    </div>
    <div className="exam-tag">{exam}</div>
    <div className="face-status">
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00A63E' }}></div>
      <span>Camera Active • Face Tracked</span>
    </div>
    <div className="risk-score-section">
      <div className="risk-label-row">
        <span>Risk Score</span>
        <span style={{ color: risk > 85 ? '#FB2C36' : '#D08700', fontWeight: 'bold' }}>{risk}%</span>
      </div>
      <div className="progress-bg">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${risk}%`, 
            background: risk > 85 ? '#FB2C36' : '#D08700' 
          }}
        ></div>
      </div>
    </div>
    <div className="violation-list">
      {violations.map((v: string, i: number) => (
        <div key={i} className="violation-item">
          <AlertTriangle size={12} color="#FB2C36" />
          <span style={{ color: '#FB2C36' }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

const TableRow = ({ name, inst, students, level, time, status }: any) => (
  <tr>
    <td>
      <div style={{ fontWeight: 500 }}>{name}</div>
      <div style={{ fontSize: 12, color: '#6A7282' }}>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
    </td>
    <td>{inst}</td>
    <td>{students}</td>
    <td>{level}</td>
    <td>{time}</td>
    <td>
      <span className={`status-badge status-${status.toLowerCase()}`}>
        {status}
      </span>
    </td>
    <td>
      <MoreVertical size={16} color="#99A1AF" style={{ cursor: 'pointer' }} />
    </td>
  </tr>
);

export default SuperAdminDashboard;
