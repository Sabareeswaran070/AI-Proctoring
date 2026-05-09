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
  MoreVertical,
  Mail,
  Building,
  Key,
  Lock,
  X,
  ShieldCheck,
  Monitor,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../api';
import './SuperAdminDashboard.css';
import logo from '../assets/logo-icon.svg';
import StudentsList from './StudentsList';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

interface DashboardData {
  total_students: number;
  active_exams: number;
  suspicious_alerts: number;
  precision: string;
  avg_response_time: string;
  institutions: number;
  recent_activity: Array<{
    id: any;
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'students' | 'profile'>('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/super-admin/stats');
        setData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        if (err.response?.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/';
          return;
        }
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


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
          <div 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${currentView === 'students' ? 'active' : ''}`}
            onClick={() => setCurrentView('students')}
          >
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
            
            <div 
              className="profile-section" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              ref={profileRef}
            >
              <div className="profile-info">
                <span className="profile-name">{user?.name || 'Alex Rodriguez'}</span>
                <span className="profile-role">{user?.role === 'SUPER_ADMIN' ? 'Master Administrator' : 'Administrator'}</span>
              </div>
              <div className="avatar">
                <User size={20} />
              </div>

              {showProfileMenu && (
                <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-item" onClick={() => { setCurrentView('profile'); setShowProfileMenu(false); }}>
                    <User size={16} />
                    <span>My Profile</span>
                  </div>
                  <div className="dropdown-item">
                    <Settings size={16} />
                    <span>Account Settings</span>
                  </div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-body">
          {currentView === 'dashboard' ? (
            <>
          <div className="page-title-section">
            <h1 className="page-title">Global Overview Dashboard</h1>
            <p className="page-subtitle">
              {loading ? (
                <span className="skeleton-text" style={{ width: '300px' }}></span>
              ) : (
                `Real-time monitoring across ${data?.institutions} institutions and ${data?.active_exams} active sessions.`
              )}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div onClick={() => setCurrentView('students')} style={{ cursor: 'pointer' }}>
              <StatCard 
                title="Total Registered Students" 
                value={data?.total_students.toLocaleString()} 
                change="Updated just now" 
                icon={<Users color="#9810FA" />} 
                iconBg="#F5EBFF" 
                loading={loading}
              />
            </div>
            <StatCard 
              title="Active Examinations" 
              value={data?.active_exams.toString()} 
              change="Live across all zones" 
              icon={<FileText color="#1447E6" />} 
              iconBg="#EBF0FF" 
              loading={loading}
            />
            <StatCard 
              title="AI Suspicious Alerts" 
              value={data?.suspicious_alerts.toLocaleString()} 
              change="System monitored" 
              icon={<AlertTriangle color="#FB2C36" />} 
              iconBg="#FFF0F1" 
              loading={loading}
            />
            <StatCard 
              title="Proctoring Precision" 
              value={data?.precision} 
              change="Model v4.2 Deployment" 
              icon={<TrendingUp color="#00A63E" />} 
              iconBg="#EBF9F0" 
              loading={loading}
            />
            <StatCard 
              title="Avg. Incident Response" 
              value={data?.avg_response_time} 
              change="Live tracking" 
              icon={<Clock color="#D08700" />} 
              iconBg="#FFF8EB" 
              loading={loading}
            />
            <StatCard 
              title="Institution Partners" 
              value={data?.institutions.toString()} 
              change="Verified partners" 
              icon={<Globe color="#111111" />} 
              iconBg="#F5F6FA" 
              loading={loading}
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
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="activity-item loading">
                      <div className="activity-icon skeleton"></div>
                      <div className="activity-content">
                        <div className="skeleton-text" style={{ width: '120px', height: '14px' }}></div>
                        <div className="skeleton-text" style={{ width: '180px', height: '12px' }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  data?.recent_activity.map((activity) => (
                    <ActivityItem 
                      key={activity.id}
                      title={activity.title} 
                      desc={activity.desc} 
                      time={activity.time} 
                      icon={activity.type === 'ALERT' ? <AlertTriangle size={16} color="#FB2C36" /> : <Shield size={16} color="#00A63E" />} 
                      iconBg={activity.type === 'ALERT' ? "#FFF0F1" : "#EBF9F0"} 
                    />
                  ))
                )}
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
          </>
          ) : currentView === 'students' ? (
            <StudentsList />
          ) : (
            <ProfileSection user={user} data={data} />
          )}
        </div>
      </main>
    </div>
  );
};

/* Sub-components */

const countryCodes = [
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+61', country: 'Australia' },
  { code: '+81', country: 'Japan' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'Singapore' },
  { code: '+49', country: 'Germany' },
];

const ProfileSection = ({ user, data }: any) => {
  const updateUser = useAuthStore(state => state.updateUser);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    countryCode: '+91',
    phone: user?.phone?.includes(' ') ? user.phone.split(' ')[1] : user?.phone || '',
    dob: user?.dob ? user.dob.split('T')[0] : '',
    gender: user?.gender || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

  useEffect(() => {
    if (user?.phone?.includes(' ')) {
      const parts = user.phone.split(' ');
      setFormData(prev => ({ ...prev, countryCode: parts[0], phone: parts[1] }));
    }
    if (user?.address) {
      setFormData(prev => ({ ...prev, address: user.address || '' }));
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        dob: formData.dob || null,
        gender: formData.gender || null,
        address: formData.address || null
      };
      const response = await api.put('/auth/profile', payload);
      updateUser(response.data);
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="profile-container">
    <div className="breadcrumb">
      Dashboard <ChevronRight size={14} /> <span>My Profile</span>
    </div>

    <div className="profile-header-main">
      <div className="profile-title-group">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your administrator account and security settings.</p>
      </div>
    </div>

    {/* Top Summary Card */}
    <div className="profile-card summary-card">
      <div className="summary-left">
        <div className="avatar-sa">{user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'SA'}</div>
        <div className="summary-info">
          <h2>{user?.name || 'Super Admin'}</h2>
          <span className="badge-master">Master Administrator</span>
          <div className="info-meta">
            <div className="meta-item"><Mail size={16} /> {user?.email || 'admin@aiproctoring.edu'}</div>
            <div className="meta-item"><Building size={16} /> AI Proctoring System - Central Administration</div>
            <div className="meta-item"><Clock size={16} /> Last login: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <div className="summary-right">
        <button className="change-pass-btn" onClick={() => setIsChangePassModalOpen(true)}><Lock size={16} /> Change Password</button>
      </div>

      <ChangePasswordModal 
        isOpen={isChangePassModalOpen} 
        onClose={() => setIsChangePassModalOpen(false)} 
      />
    </div>

    <div className="profile-layout-grid">
      {/* Left Column: Personal Info */}
      <div className="profile-column">
        <div className="profile-card">
          <h3 className="card-title">Personal Information</h3>
          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Enter full name" 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                placeholder="Enter email" 
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <div className="phone-input-group" style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="country-code-select" 
                  value={formData.countryCode}
                  onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                >
                  {countryCodes.map(c => (
                    <option key={c.code + c.country} value={c.code}>{c.code} ({c.country})</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="Phone number"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input 
                type="date" 
                value={formData.dob} 
                onChange={(e) => setFormData({...formData, dob: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select 
                value={formData.gender} 
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="gender-select"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                placeholder="Enter your full address" 
              />
            </div>
            {saveMessage && (
              <div className={`save-message ${saveMessage.type}`} style={{ 
                padding: '10px', 
                borderRadius: '6px', 
                marginBottom: '15px',
                fontSize: '14px',
                backgroundColor: saveMessage.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                color: saveMessage.type === 'success' ? '#059669' : '#DC2626',
                border: `1px solid ${saveMessage.type === 'success' ? '#10B981' : '#EF4444'}`
              }}>
                {saveMessage.text}
              </div>
            )}
            <button 
              className="save-btn-large" 
              onClick={handleSave} 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Account & Security */}
      <div className="profile-column">
        <div className="profile-card status-card">
          <div className="status-header">
            <div className="status-icon-box">
              <ShieldCheck size={24} color="#008236" />
            </div>
            <div className="status-text">
              <h4>Account Status</h4>
              <p>Full system access enabled</p>
            </div>
            <span className="badge-status-green">Verified</span>
          </div>
        </div>

        <div className="security-section">
          <h3 className="card-title">Account & Security</h3>
          <div className="security-cards-list">
            <SecurityCard 
              icon={<Shield size={20} />} 
              title="Two-Factor Authentication" 
              subtitle="Add an extra layer of security"
              status="Active"
              statusType="green"
            />
            <SecurityCard 
              icon={<Activity size={20} />} 
              title="Login Activity" 
              subtitle="Recent sign-in locations"
              status="Monitored"
              statusType="blue"
            />
            <SecurityCard 
              icon={<Monitor size={20} />} 
              title="Active Sessions" 
              subtitle="2 devices currently logged in"
              status="2 Active"
              statusType="purple"
            />
            <SecurityCard 
              icon={<Key size={20} />} 
              title="Password Strength" 
              subtitle="Last changed 30 days ago"
              status="Strong"
              statusType="green"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Admin Statistics */}
    <div className="admin-stats-section">
      <h3 className="section-title">Admin Statistics</h3>
      <div className="stats-grid-row">
        <StatMiniCard icon={<Building size={20} color="#1447E6" />} value={data?.institutions?.toString() || '0'} label="Total Institutions Managed" iconBg="#DBEAFE" />
        <StatMiniCard icon={<FileText size={20} color="#008236" />} value={data?.active_exams?.toString() || '0'} label="Active Exams" iconBg="#DCFCE7" />
        <StatMiniCard icon={<AlertTriangle size={20} color="#FB2C36" />} value={data?.suspicious_alerts?.toLocaleString() || '0'} label="Suspicious Alerts Reviewed" iconBg="#FFF0F1" />
        <StatMiniCard icon={<ShieldCheck size={20} color="#9333EA" />} value="Full" label="System Access Level" iconBg="#F3E8FF" />
      </div>
    </div>

    {/* Recent Activity */}
    <div className="profile-card recent-activity-full">
      <h3 className="card-title">Recent Activity</h3>
      <div className="activity-timeline-enhanced">
        {data?.recent_activity && data.recent_activity.length > 0 ? (
          data.recent_activity.map((activity: any) => (
            <TimelineItem 
              key={activity.id}
              icon={activity.type === 'ALERT' ? <AlertTriangle size={16} /> : <Shield size={16} />} 
              title={activity.title} 
              desc={activity.desc} 
              time={activity.time} 
              color={activity.type === 'ALERT' ? "#FB2C36" : "#00A63E"}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: '20px', color: '#6A7282' }}>No recent activity logs found.</p>
        )}
      </div>
    </div>
  </div>
);
}

const SecurityCard = ({ icon, title, subtitle, status, statusType }: any) => (
  <div className="security-mini-card">
    <div className="security-mini-icon">{icon}</div>
    <div className="security-mini-content">
      <h4>{title}</h4>
      <p>{subtitle}</p>
    </div>
    <span className={`badge-mini ${statusType}`}>{status}</span>
  </div>
);

const StatMiniCard = ({ icon, value, label, iconBg }: any) => (
  <div className="stat-mini-card">
    <div className="stat-mini-icon" style={{ backgroundColor: iconBg }}>{icon}</div>
    <div className="stat-mini-values">
      <div className="stat-mini-value">{value}</div>
      <div className="stat-mini-label">{label}</div>
    </div>
  </div>
);

const TimelineItem = ({ icon, title, desc, time, color }: any) => (
  <div className="timeline-enhanced-item">
    <div className="timeline-enhanced-line"></div>
    <div className="timeline-enhanced-icon" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div className="timeline-enhanced-content">
      <h4>{title}</h4>
      <p>{desc}</p>
      <span className="timeline-time">{time}</span>
    </div>
  </div>
);

/* Sub-components */

const StatCard = ({ title, value, change, icon, iconBg, loading }: any) => (
  <div className="stat-card">
    <div className="stat-info">
      <h3>{title}</h3>
      {loading ? (
        <div className="skeleton-text" style={{ width: '80px', height: '28px', margin: '8px 0' }}></div>
      ) : (
        <div className="stat-value">{value}</div>
      )}
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

const ChangePasswordModal = ({ isOpen, onClose }: any) => {
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/change-password', {
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <header className="modal-header">
          <div>
            <h2>Change Password</h2>
            <p>Update your account security credentials</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="info-box" style={{ background: '#ecfdf5', color: '#047857', marginBottom: '20px', border: '1px solid #d1fae5' }}>
              <ShieldCheck size={18} />
              <span>Password updated successfully! Closing...</span>
            </div>
          )}
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Current Password *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                required 
                value={passData.oldPassword}
                onChange={e => setPassData({...passData, oldPassword: e.target.value})}
                placeholder="Enter current password"
                style={{ paddingLeft: '40px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#99A1AF' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>New Password *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                required 
                value={passData.newPassword}
                onChange={e => setPassData({...passData, newPassword: e.target.value})}
                placeholder="Minimum 6 characters"
                style={{ paddingLeft: '40px' }}
              />
              <Key size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#99A1AF' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label>Confirm New Password *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                required 
                value={passData.confirmPassword}
                onChange={e => setPassData({...passData, confirmPassword: e.target.value})}
                placeholder="Repeat new password"
                style={{ paddingLeft: '40px' }}
              />
              <ShieldCheck size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#99A1AF' }} />
            </div>
          </div>

          <footer className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading || success}>
              {loading ? <Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} /> : null}
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
