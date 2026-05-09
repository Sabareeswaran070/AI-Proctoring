import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  ChevronLeft, Edit, Lock, Calendar, BookOpen, 
  Trash2, UserX, Award, BarChart3, Clock, 
  Shield, Mail, Phone, MapPin, Building, 
  GraduationCap, User, Hash, History, 
  FileText, Activity, AlertTriangle, ShieldCheck, 
  Download, ExternalLink, MoreVertical, Plus
} from 'lucide-react';

interface StudentProfileProps {
  studentId: string;
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ studentId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/super-admin/students/${studentId}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [studentId]);

  if (loading) return null; // Removed obstructive loading animation

  if (!student) {
    return (
      <div className="profile-error">
        <AlertTriangle size={48} />
        <h2>Student Not Found</h2>
        <p>The student profile you are looking for does not exist or has been removed.</p>
        <button onClick={onBack} className="secondary-btn">Go Back</button>
      </div>
    );
  }

  const tabs = [
    'Personal Info', 'Academic Info', 'Account Info', 'Examinations', 
    'Performance', 'AI Proctoring', 'Documents', 'Activity'
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal Info':
        return (
          <div className="info-grid fade-in">
            <InfoItem icon={<User />} label="Full Name" value={student.name} />
            <InfoItem icon={<User />} label="Gender" value={student.gender || 'Male'} />
            <InfoItem icon={<Calendar />} label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : '12 May 2002'} />
            <InfoItem icon={<Mail />} label="Email Address" value={student.email} />
            <InfoItem icon={<Phone />} label="Phone Number" value={student.phone || '+91 98765 43210'} />
            <InfoItem icon={<MapPin />} label="Current Address" value="123 University Road, Block B, Coimbatore, TN" />
            <InfoItem icon={<User />} label="Parent/Guardian" value="Dr. Robert Chen" />
            <InfoItem icon={<Phone />} label="Emergency Contact" value="+91 87654 32109" />
          </div>
        );
      case 'Academic Info':
        return (
          <div className="info-grid fade-in">
            <InfoItem icon={<Building />} label="Institution" value={student.institution?.name || 'Vellore Institute of Technology'} />
            <InfoItem icon={<GraduationCap />} label="Department" value={student.department || 'Computer Science Engineering'} />
            <InfoItem icon={<BookOpen />} label="Course" value={student.course || 'B.Tech CSE'} />
            <InfoItem icon={<Hash />} label="Semester" value={`${student.semester || '6'}th Semester`} />
            <InfoItem icon={<Calendar />} label="Batch" value={student.batch || '2021-2025'} />
            <InfoItem icon={<Hash />} label="Roll Number" value="CSE21B042" />
            <InfoItem icon={<Award />} label="Current GPA" value="8.92 / 10" />
            <InfoItem icon={<Activity />} label="Academic Status" value="Active" />
          </div>
        );
      case 'Account Info':
        return (
          <div className="info-grid fade-in">
            <InfoItem icon={<User />} label="Username" value={student.email.split('@')[0]} />
            <InfoItem icon={<Shield />} label="Role" value="Student" />
            <InfoItem icon={<Calendar />} label="Account Created" value={new Date(student.createdAt).toLocaleDateString()} />
            <InfoItem icon={<Clock />} label="Last Login" value="May 8, 2026 at 3:45 PM" />
            <InfoItem icon={<Activity />} label="Device Information" value="MacBook Pro - Chrome Browser" />
            <InfoItem icon={<Hash />} label="Login IP Address" value="192.168.1.45 (Boston, MA)" />
            <InfoItem icon={<ShieldCheck />} label="Account Status" value="Active & Verified" />
            <InfoItem icon={<Mail />} label="Email Verified" value="Yes - March 20, 2021" />
          </div>
        );
      case 'Examinations':
        return (
          <div className="exams-tab-content fade-in">
            <div className="exam-group">
              <h3 className="exam-group-title"><Calendar size={18} /> Upcoming Exams <span className="count-badge">2</span></h3>
              <div className="exam-list">
                <div className="exam-item-card">
                  <div className="exam-details">
                    <h4>Advanced Mathematics</h4>
                    <p>May 15, 2026 • 10:00 AM • 120 min</p>
                  </div>
                  <span className="badge-scheduled">Scheduled</span>
                </div>
                <div className="exam-item-card">
                  <div className="exam-details">
                    <h4>Data Structures</h4>
                    <p>May 18, 2026 • 2:00 PM • 90 min</p>
                  </div>
                  <span className="badge-scheduled">Scheduled</span>
                </div>
              </div>
            </div>
            
            <div className="exam-group" style={{ marginTop: '32px' }}>
              <h3 className="exam-group-title"><ShieldCheck size={18} /> Recent Results <span className="count-badge">3</span></h3>
              <table className="exam-mini-table">
                <thead>
                  <tr>
                    <th>EXAM NAME</th>
                    <th>DATE</th>
                    <th>SCORE</th>
                    <th>GRADE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Database Management</td>
                    <td>May 5, 2026</td>
                    <td className="score-text">92%</td>
                    <td><span className="badge-grade">A</span></td>
                  </tr>
                  <tr>
                    <td>Operating Systems</td>
                    <td>May 2, 2026</td>
                    <td className="score-text">85%</td>
                    <td><span className="badge-grade secondary">B+</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="empty-state fade-in">
            <div className="empty-icon"><FileText size={48} /></div>
            <h3>{activeTab} Content</h3>
            <p>We are currently migrating the detailed {activeTab.toLowerCase()} for this student.</p>
          </div>
        );
    }
  };

  return (
    <div className="student-profile-wrapper">
      {/* Breadcrumb */}
      <div className="profile-breadcrumb">
        <span onClick={onBack} style={{ cursor: 'pointer', color: '#697386' }}>Dashboard</span>
        <ChevronLeft size={14} />
        <span onClick={onBack} style={{ cursor: 'pointer', color: '#697386' }}>Students</span>
        <ChevronLeft size={14} />
        <span className="active-breadcrumb">Student Profile</span>
      </div>

      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="header-left">
          <div className="profile-avatar-large">
            {student.name.charAt(0)}
          </div>
          <div className="student-meta">
            <h1 className="student-name-title">{student.name}</h1>
            <div className="meta-row">
              <span className="meta-item">Student ID: <strong>{student.studentId || 'N/A'}</strong></span>
              <span className="meta-separator">•</span>
              <span className="meta-item">Roll No: <strong>{student.rollNo || student.studentId || 'N/A'}</strong></span>
            </div>
            <div className="meta-row">
              <span className="meta-item">{student.department || 'Computer Science Engineering'}</span>
              <span className="meta-separator">•</span>
              <span className="meta-item">Semester {student.semester || '6'}</span>
              <span className="badge-active">Active</span>
            </div>
            
            <div className="header-actions-row">
              <button className="profile-action-btn edit"><Edit size={16} /> Edit Profile</button>
              <button className="profile-action-btn secondary"><Lock size={16} /> Reset Password</button>
              <button className="profile-action-btn secondary"><Plus size={16} /> Assign Exam</button>
              <button className="profile-action-btn outline-warning"><UserX size={16} /> Disable Account</button>
              <button className="profile-action-btn outline-danger"><Trash2 size={16} /> Delete Student</button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="profile-stats-grid">
        <SummaryCard icon={<FileText size={24} color="#1447E6" />} title="24" subtitle="Total Exams" desc="18 Completed" bg="#DBEAFE" />
        <SummaryCard icon={<BarChart3 size={24} color="#008236" />} title="87.5%" subtitle="Average Score" desc="+4.2% from last sem" bg="#DCFCE7" />
        <SummaryCard icon={<Clock size={24} color="#9333EA" />} title="92%" subtitle="Attendance" desc="165/180 days" bg="#F3E8FF" />
        <SummaryCard icon={<Award size={24} color="#F59E0B" />} title="#12" subtitle="Rank" desc="Out of 158 students" bg="#FEF3C7" />
        <SummaryCard icon={<AlertTriangle size={24} color="#EF4444" />} title="3" subtitle="Violations" desc="2 Tab switch, 1 Face" bg="#FEE2E2" />
      </div>

      {/* Tabs Navigation */}
      <div className="profile-tabs-nav">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {getTabIcon(tab)}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="tab-content-container">
        {renderTabContent()}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .student-profile-wrapper {
          padding: 8px 0 24px 0;
          animation: fadeIn 0.4s ease-out;
        }

        .profile-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          color: #6B7280;
        }

        .breadcrumb-current {
          color: #111827;
          font-weight: 600;
        }

        .tab-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #E5E7EB;
          min-height: 400px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .details-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 13px;
          font-weight: 500;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .detail-value {
          font-size: 15px;
          color: #111827;
          font-weight: 500;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          color: var(--text-secondary);
          text-align: center;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: var(--bg-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: var(--text-muted);
        }

        .empty-state h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        @media (max-width: 1024px) {
          .info-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .profile-header-card {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 32px;
          border: 1px solid var(--border-color);
          margin-bottom: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .header-left {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          background: #3B82F6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 700;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }

        .student-name-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 12px 0;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        .meta-separator {
          color: var(--text-muted);
        }

        .badge-active {
          background: #DCFCE7;
          color: var(--success);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 8px;
        }

        .header-actions-row {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .profile-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-action-btn.edit {
          background: var(--accent-color);
          color: white;
          border: none;
        }

        .profile-action-btn.secondary {
          background: white;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .profile-action-btn.outline-warning {
          background: transparent;
          color: var(--warning);
          border: 1px solid #FCD34D;
        }

        .profile-action-btn.outline-danger {
          background: transparent;
          color: var(--error);
          border: 1px solid #FECACA;
        }

        .profile-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        .profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .summary-stat-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 20px 16px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .summary-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          border-color: var(--accent-color);
        }

        .stat-icon-box {
          min-width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-main {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 2px;
        }

        .stat-desc {
          font-size: 12px;
          color: var(--text-muted);
        }

        .profile-tabs-nav {
          display: flex;
          gap: 32px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 4px;
        }

        .profile-tabs-nav::-webkit-scrollbar {
          display: none;
        }

        .tab-btn {
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--accent-color);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--accent-color);
          border-radius: 10px;
        }

        .tab-content-container {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 32px;
          border: 1px solid var(--border-color);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .info-item-card {
          background: var(--bg-light);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #F3F4F6;
        }

        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--card-bg);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }

        .info-details label {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .info-details p {
          margin: 0;
          font-weight: 600;
          color: var(--text-primary);
        }

        .exams-tab-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .exam-group-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .count-badge {
          background: #DBEAFE;
          color: var(--info);
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 12px;
        }

        .count-badge.danger {
          background: #FEE2E2;
          color: var(--error);
        }

        .exam-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .exam-item-card {
          background: #EFF6FF;
          border: 1px solid #DBEAFE;
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .exam-item-card.missed {
          background: #FEF2F2;
          border-color: #FEE2E2;
        }

        .exam-details h4 {
          margin: 0 0 4px 0;
          font-weight: 700;
          color: var(--text-primary);
        }

        .exam-details p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .badge-scheduled {
          background: #3B82F6;
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge-missed {
          background: #FEF2F2;
          color: var(--error);
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .exam-mini-table {
          width: 100%;
          border-collapse: collapse;
        }

        .exam-mini-table th {
          text-align: left;
          padding: 12px;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          border-bottom: 1px solid var(--border-color);
        }

        .exam-mini-table td {
          padding: 16px 12px;
          border-bottom: 1px solid var(--bg-light);
          font-size: 14px;
          color: var(--text-primary);
        }

        .score-text {
          font-weight: 700;
          color: var(--success);
        }

        .badge-grade {
          background: #ECFDF5;
          color: var(--success);
          padding: 4px 12px;
          border-radius: 8px;
          font-weight: 700;
        }

        .badge-grade.secondary {
          background: #F0FDF4;
          color: #16A34A;
        }

        .exam-summary-row {
          display: flex;
          justify-content: space-around;
          padding: 24px;
          background: var(--bg-light);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          margin-top: 12px;
        }

        .summary-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .summary-stat strong {
          font-size: 24px;
          color: var(--text-primary);
        }

        .summary-stat span {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .summary-stat.danger strong {
          color: var(--error);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f4f8;
          border-top-color: var(--accent-color);
          border-radius: 50%;
          margin: 0 auto 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .profile-loading {
          padding: 100px;
          text-align: center;
          color: var(--text-secondary);
        }
      `}} />
    </div>
  );
};

const SummaryCard = ({ icon, title, subtitle, desc, bg }: any) => (
  <div className="summary-stat-card">
    <div className="stat-icon-box" style={{ backgroundColor: bg }}>
      {icon}
    </div>
    <div className="stat-content">
      <div className="stat-label">{subtitle}</div>
      <div className="stat-main">{title}</div>
      <div className="stat-desc">{desc}</div>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }: any) => (
  <div className="info-item-card">
    <div className="info-icon">{icon}</div>
    <div className="info-details">
      <label>{label}</label>
      <p>{value}</p>
    </div>
  </div>
);

const getTabIcon = (tab: string) => {
  switch (tab) {
    case 'Personal Info': return <User size={18} />;
    case 'Academic Info': return <GraduationCap size={18} />;
    case 'Account Info': return <Shield size={18} />;
    case 'Examinations': return <FileText size={18} />;
    case 'Performance': return <BarChart3 size={18} />;
    case 'AI Proctoring': return <Shield size={18} />;
    case 'Documents': return <Plus size={18} />;
    case 'Activity': return <History size={18} />;
    default: return <User size={18} />;
  }
};

export default StudentProfile;
