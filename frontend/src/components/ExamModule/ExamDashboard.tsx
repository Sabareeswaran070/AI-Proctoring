import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Users, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import api from '../../api';
import './ExamModule.css';

interface ExamDashboardProps {
  onCreateExam: () => void;
  onViewQuestions: () => void;
}

interface ExamStats {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  alerts: number;
}

const ExamDashboard: React.FC<ExamDashboardProps> = ({ onCreateExam, onViewQuestions }) => {
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, examsRes] = await Promise.all([
          api.get('/super-admin/exams/stats'),
          api.get('/super-admin/exams')
        ]);
        setStats(statsRes.data);
        setExams(examsRes.data);
      } catch (err) {
        console.error('Error fetching exam dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="exam-module-container">
      <div className="exam-header">
        <div>
          <h1 className="page-title">Exam Management Module</h1>
          <p className="page-subtitle">Oversee all examination activities, proctoring alerts, and performance metrics.</p>
        </div>
        <div className="header-actions">
          <button className="page-btn" onClick={onViewQuestions}>
            <Layers size={18} />
            Question Bank
          </button>
          <button className="page-btn active" onClick={onCreateExam} style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }}>
            <Plus size={18} />
            Create New Exam
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="exam-stats-grid">
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>Total Exams</h3>
            <div className="stat-value">{stats?.total ?? "-"}</div>
            <p className="stat-change" style={{ color: 'var(--success)' }}>
              {stats?.total !== undefined ? <><ArrowUpRight size={12} /> Dashboard Live</> : "-"}
            </p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#F0F4FF' }}>
            <FileText color="var(--info)" />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>Active Exams</h3>
            <div className="stat-value">{stats?.active ?? "-"}</div>
            <p className="stat-change">{stats?.active !== undefined ? "Live Monitoring" : "-"}</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#ECFDF5' }}>
            <ActivityIcon />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>Upcoming Exams</h3>
            <div className="stat-value">{stats?.upcoming ?? "-"}</div>
            <p className="stat-change">{stats?.upcoming !== undefined ? "Scheduled" : "-"}</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#FFF7ED' }}>
            <Calendar color="var(--accent-color)" />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>AI Proctoring Alerts</h3>
            <div className="stat-value">{stats?.alerts ?? "-"}</div>
            <p className="stat-change" style={{ color: stats?.alerts && stats.alerts > 0 ? 'var(--error)' : 'inherit' }}>
              {stats?.alerts !== undefined ? (stats.alerts > 0 ? <><AlertTriangle size={12} /> Requires review</> : "All clear") : "-"}
            </p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#FFF1F2' }}>
            <AlertTriangle color="var(--error)" />
          </div>
        </div>
      </div>

      {/* Charts & Activity Section */}
      <div className="content-grid">
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Exam Performance Analytics</h2>
              <p className="card-subtitle">Pass rates and average scores across departments</p>
            </div>
            <div className="select-wrapper">
              <select className="filter-select">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>
          </div>
          <div className="chart-placeholder">
             {/* Simple Bar Chart SVG - Keeping visual structure but acknowledging lack of real dynamic chart data yet */}
             <svg width="100%" height="240" viewBox="0 0 600 240">
                {[40, 70, 55, 90, 65, 80, 45].map((h, i) => (
                  <rect key={i} x={40 + i * 80} y={240 - (h * 2)} width="40" height={h * 2} fill={i === 3 ? 'var(--accent-color)' : '#E5E7EB'} rx="4" />
                ))}
                <line x1="0" y1="240" x2="600" y2="240" stroke="#E5E7EB" />
             </svg>
             <div className="chart-legend" style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Departments: CS, ME, EE, IT, CIVIL, ARCH, BIO</span>
             </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Exam Activity</h2>
            <p className="card-subtitle">Latest actions and status changes</p>
          </div>
          <div className="activity-list">
             {exams.length > 0 ? exams.slice(0, 3).map((exam) => (
               <ActivityItem 
                  key={exam.id}
                  title={exam.title ?? "-"} 
                  desc={`Exam for ${exam.department ?? "N/A"}`} 
                  time={new Date(exam.createdAt).toLocaleDateString() ?? "-"} 
                  status={exam.status ?? "Draft"}
               />
             )) : (
               <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>No recent activity found.</div>
             )}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Exams Table */}
      <div className="table-container">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Recent Examinations</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="search-bar" style={{ width: '300px', height: '36px' }}>
              <Search size={16} color="#99A1AF" />
              <input type="text" placeholder="Search exams..." />
            </div>
            <button className="page-btn"><Filter size={16} /> Filter</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Exam Name</th>
              <th>Department</th>
              <th>Date & Time</th>
              <th>Institution</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? exams.map((exam) => (
              <ExamRow 
                key={exam.id}
                name={exam.title ?? "-"} 
                dept={exam.department ?? "-"} 
                date={exam.startTime ? new Date(exam.startTime).toLocaleString() : "-"} 
                institution={exam.institution?.name ?? "-"} 
                type={exam.type ?? "-"} 
                status={exam.status ?? "-"} 
              />
            )) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No exams found in the database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ActivityIcon = () => (
  <div style={{ position: 'relative' }}>
    <FileText color="var(--success)" />
    <div style={{ 
      position: 'absolute', 
      top: -2, 
      right: -2, 
      width: 8, 
      height: 8, 
      backgroundColor: 'var(--success)', 
      borderRadius: '50%',
      border: '2px solid white' 
    }}></div>
  </div>
);

const ActivityItem = ({ title, desc, time, status }: any) => (
  <div className="activity-item">
    <div className="activity-icon" style={{ backgroundColor: status === 'ONGOING' || status === 'COMPLETED' ? '#ECFDF5' : status === 'DRAFT' ? '#F3F4F6' : '#F0F4FF' }}>
      <CheckCircle2 size={16} color={status === 'COMPLETED' ? 'var(--success)' : '#6A7282'} />
    </div>
    <div className="activity-content" style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="activity-title" style={{ fontWeight: 600 }}>{title}</span>
        <span className="activity-time">{time}</span>
      </div>
      <p className="activity-desc">{desc}</p>
    </div>
  </div>
);

const ExamRow = ({ name, dept, date, institution, type, status }: any) => (
  <tr>
    <td>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={16} color="#6A7282" />
        </div>
        <span style={{ fontWeight: 500 }}>{name}</span>
      </div>
    </td>
    <td>{dept}</td>
    <td>{date}</td>
    <td>{institution}</td>
    <td><span style={{ padding: '4px 8px', borderRadius: '6px', background: '#F3F4F6', fontSize: '12px' }}>{type}</span></td>
    <td>
      <span className={`status-badge ${status === 'ONGOING' ? 'status-live' : status === 'SCHEDULED' ? 'status-scheduled' : ''}`} style={{ 
        backgroundColor: status === 'COMPLETED' ? '#F3F4F6' : status === 'DRAFT' ? '#FFFBEB' : undefined,
        color: status === 'COMPLETED' ? '#6A7282' : status === 'DRAFT' ? '#D08700' : undefined
      }}>
        {status}
      </span>
    </td>
    <td><MoreVertical size={16} color="#99A1AF" style={{ cursor: 'pointer' }} /></td>
  </tr>
);

export default ExamDashboard;

