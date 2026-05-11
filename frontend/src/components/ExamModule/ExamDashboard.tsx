import React from 'react';
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
import './ExamModule.css';

interface ExamDashboardProps {
  onCreateExam: () => void;
  onViewQuestions: () => void;
}

const ExamDashboard: React.FC<ExamDashboardProps> = ({ onCreateExam, onViewQuestions }) => {
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
            <div className="stat-value">124</div>
            <p className="stat-change" style={{ color: 'var(--success)' }}><ArrowUpRight size={12} /> 12% from last month</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#F0F4FF' }}>
            <FileText color="var(--info)" />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>Active Exams</h3>
            <div className="stat-value">12</div>
            <p className="stat-change">Live Monitoring</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#ECFDF5' }}>
            <ActivityIcon />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>Upcoming Exams</h3>
            <div className="stat-value">28</div>
            <p className="stat-change">Next 7 days</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#FFF7ED' }}>
            <Calendar color="var(--accent-color)" />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>AI Proctoring Alerts</h3>
            <div className="stat-value">42</div>
            <p className="stat-change" style={{ color: 'var(--error)' }}><AlertTriangle size={12} /> Requires review</p>
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
            <select className="page-btn" style={{ fontSize: '12px' }}>
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="chart-placeholder">
             {/* Simple Bar Chart SVG */}
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
             <ActivityItem 
                title="Final Term Physics" 
                desc="Exam published for 120 students" 
                time="10 mins ago" 
                status="Published"
             />
             <ActivityItem 
                title="Python Programming" 
                desc="Draft updated by Dr. Sarah" 
                time="1 hour ago" 
                status="Draft"
             />
             <ActivityItem 
                title="Database Systems" 
                desc="Completed. Generating results..." 
                time="3 hours ago" 
                status="Completed"
             />
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
              <th>Students</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <ExamRow 
              name="Data Structures & Algorithms" 
              dept="Computer Science" 
              date="May 12, 2026 | 10:00 AM" 
              students="145" 
              type="MCQ" 
              status="Upcoming" 
            />
            <ExamRow 
              name="Micro-Electronics Quiz" 
              dept="Electrical Engineering" 
              date="May 11, 2026 | 02:30 PM" 
              students="82" 
              type="MCQ" 
              status="Live" 
            />
            <ExamRow 
              name="Advanced Java Coding" 
              dept="Information Technology" 
              date="May 10, 2026 | 09:00 AM" 
              students="210" 
              type="Coding" 
              status="Completed" 
            />
            <ExamRow 
              name="Architecture History" 
              dept="Architecture" 
              date="Drafted" 
              students="--" 
              type="Descriptive" 
              status="Draft" 
            />
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
    <div className="activity-icon" style={{ backgroundColor: status === 'Published' ? '#ECFDF5' : status === 'Draft' ? '#F3F4F6' : '#F0F4FF' }}>
      <CheckCircle2 size={16} color={status === 'Published' ? 'var(--success)' : '#6A7282'} />
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

const ExamRow = ({ name, dept, date, students, type, status }: any) => (
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
    <td>{students}</td>
    <td><span style={{ padding: '4px 8px', borderRadius: '6px', background: '#F3F4F6', fontSize: '12px' }}>{type}</span></td>
    <td>
      <span className={`status-badge ${status === 'Live' ? 'status-live' : status === 'Upcoming' ? 'status-scheduled' : ''}`} style={{ 
        backgroundColor: status === 'Completed' ? '#F3F4F6' : status === 'Draft' ? '#FFFBEB' : undefined,
        color: status === 'Completed' ? '#6A7282' : status === 'Draft' ? '#D08700' : undefined
      }}>
        {status}
      </span>
    </td>
    <td><MoreVertical size={16} color="#99A1AF" style={{ cursor: 'pointer' }} /></td>
  </tr>
);

export default ExamDashboard;
