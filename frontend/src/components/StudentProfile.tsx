import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  ChevronLeft, Edit, Lock, Calendar, BookOpen, 
  Trash2, UserX, Award, BarChart3, Clock, 
  Shield, Mail, Phone, MapPin, Building, 
  GraduationCap, User, Hash, History, 
  FileText, Activity, AlertTriangle, ShieldCheck, 
  Download, ExternalLink, MoreVertical, Plus, Eye,
  Bell, BarChart2
} from 'lucide-react';

interface StudentProfileProps {
  studentId: string;
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ studentId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

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

  const handleEditProfile = () => {
    setEditFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      department: student.department || '',
      semester: student.semester || '',
      studentId: student.studentId || '',
      rollNo: student.rollNo || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/super-admin/students/${studentId}`, editFormData);
      setStudent(res.data);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handleResetPassword = async () => {
    const newPassword = window.prompt("Enter new password for student:");
    if (newPassword) {
      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }
      try {
        await api.post(`/super-admin/students/${studentId}/reset-password`, { newPassword });
        alert("Password reset successfully.");
      } catch (err) {
        alert("Failed to reset password.");
      }
    }
  };

  const handleAssignExam = () => {
    alert("Assign Exam functionality will be available in the upcoming exams module update.");
  };

  const handleToggleStatus = async () => {
    const isBlocked = student.status === 'BLOCKED';
    const newStatus = isBlocked ? 'ACTIVE' : 'BLOCKED';
    const action = isBlocked ? 'enable' : 'disable';
    
    if (window.confirm(`Are you sure you want to ${action} this account?`)) {
      try {
        const res = await api.put(`/super-admin/students/${studentId}/status`, { status: newStatus });
        setStudent(res.data);
      } catch (err) {
        alert(`Failed to ${action} account.`);
      }
    }
  };

  const handleDeleteStudent = async () => {
    if (window.confirm("Are you sure you want to permanently delete this student? This action cannot be undone.")) {
      try {
        await api.delete(`/super-admin/students/${studentId}`);
        onBack();
      } catch (err) {
        alert("Failed to delete student.");
      }
    }
  };

  const tabs = [
    'Personal Info', 'Academic Info', 'Account Info', 'Examinations', 
    'Performance', 'AI Proctoring', 'Documents', 'Activity'
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal Info':
        return (
          <div className="info-grid fade-in">
            <InfoItem icon={<User />} label="Full Name" value={student.name || '-'} />
            <InfoItem icon={<User />} label="Gender" value={student.gender || '-'} />
            <InfoItem icon={<Calendar />} label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : '-'} />
            <InfoItem icon={<Mail />} label="Email Address" value={student.email || '-'} />
            <InfoItem icon={<Phone />} label="Phone Number" value={student.phone || '-'} />
            <InfoItem icon={<MapPin />} label="Current Address" value={student.address || '-'} />
            <InfoItem icon={<User />} label="Parent/Guardian" value={student.parentName || '-'} />
            <InfoItem icon={<Phone />} label="Emergency Contact" value={student.emergencyContact || '-'} />
          </div>
        );
      case 'Academic Info':
        return (
          <div className="info-grid fade-in">
            <InfoItem icon={<Building />} label="Institution" value={student.institution?.name || '-'} />
            <InfoItem icon={<GraduationCap />} label="Department" value={student.department || '-'} />
            <InfoItem icon={<BookOpen />} label="Course" value={student.course || '-'} />
            <InfoItem icon={<Hash />} label="Semester" value={student.semester ? `${student.semester}th Semester` : '-'} />
            <InfoItem icon={<Calendar />} label="Batch" value={student.batch || '-'} />
            <InfoItem icon={<Hash />} label="Roll Number" value={student.rollNo || '-'} />
            <InfoItem icon={<Award />} label="Current GPA" value={student.gpa ? `${student.gpa} / 10` : '-'} />
            <InfoItem icon={<Activity />} label="Academic Status" value={student.academicStatus || '-'} />
          </div>
        );
      case 'Account Info':
        return (
          <div className="info-grid fade-in">
            <InfoItem icon={<User />} label="Username" value={student.email ? student.email.split('@')[0] : '-'} />
            <InfoItem icon={<Shield />} label="Role" value={student.role || '-'} />
            <InfoItem icon={<Calendar />} label="Account Created" value={student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'} />
            <InfoItem icon={<Clock />} label="Last Login" value={student.lastLogin ? new Date(student.lastLogin).toLocaleString() : '-'} />
            <InfoItem icon={<Activity />} label="Device Information" value={student.deviceInfo || '-'} />
            <InfoItem icon={<Hash />} label="Login IP Address" value={student.lastIp || '-'} />
            <InfoItem icon={<ShieldCheck />} label="Account Status" value={student.status || '-'} />
            <InfoItem icon={<Mail />} label="Email Verified" value={student.emailVerified ? 'Yes' : 'No'} />
          </div>
        );
      case 'Examinations':
      case 'Performance':
      case 'AI Proctoring':
      case 'Documents':
      case 'Activity':
        return (
          <div className="empty-state fade-in">
            <div className="empty-icon"><FileText size={48} /></div>
            <h3>No Data Available</h3>
            <p>There is currently no {activeTab.toLowerCase()} data available for this student.</p>
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
              <span className="meta-item">{student.department || '-'}</span>
              <span className="meta-separator">•</span>
              <span className="meta-item">Semester {student.semester || '-'}</span>
              <span className="badge-active">{student.status || 'Active'}</span>
            </div>
            
            <div className="header-actions-row">
              <button className="profile-action-btn edit" onClick={handleEditProfile}><Edit size={16} /> Edit Profile</button>
              <button className="profile-action-btn secondary" onClick={handleResetPassword}><Lock size={16} /> Reset Password</button>
              <button className="profile-action-btn secondary" onClick={handleAssignExam}><Plus size={16} /> Assign Exam</button>
              <button className="profile-action-btn outline-warning" onClick={handleToggleStatus}>
                <UserX size={16} /> {student.status === 'BLOCKED' ? 'Enable Account' : 'Disable Account'}
              </button>
              <button className="profile-action-btn outline-danger" onClick={handleDeleteStudent}><Trash2 size={16} /> Delete Student</button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="profile-stats-grid">
        <SummaryCard icon={<FileText size={24} color="#1447E6" />} title={student.totalExams || '-'} subtitle="Total Exams" desc={student.completedExams ? `${student.completedExams} Completed` : '-'} bg="#DBEAFE" />
        <SummaryCard icon={<BarChart3 size={24} color="#008236" />} title={student.averageScore ? `${student.averageScore}%` : '-'} subtitle="Average Score" desc="-" bg="#DCFCE7" />
        <SummaryCard icon={<Clock size={24} color="#9333EA" />} title={student.attendance ? `${student.attendance}%` : '-'} subtitle="Attendance" desc="-" bg="#F3E8FF" />
        <SummaryCard icon={<Award size={24} color="#F59E0B" />} title={student.rank ? `#${student.rank}` : '-'} subtitle="Rank" desc="-" bg="#FEF3C7" />
        <SummaryCard icon={<AlertTriangle size={24} color="#EF4444" />} title={student.violations || '0'} subtitle="Violations" desc="-" bg="#FEE2E2" />
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
        {isEditing ? (
          <div className="fade-in" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600, color: '#111827' }}>Edit Student Profile</h2>
            
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 500, fontSize: '14px', color: '#374151' }}>Full Name</label>
                <input type="text" value={editFormData.name || ''} onChange={e => setEditFormData({...editFormData, name: e.target.value})} required style={{ padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#F59E0B'} onBlur={e => e.target.style.borderColor = '#D1D5DB'} />
              </div>
              
              <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: 500, fontSize: '14px', color: '#374151' }}>Email</label>
                  <input type="email" value={editFormData.email || ''} onChange={e => setEditFormData({...editFormData, email: e.target.value})} required style={{ padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#F59E0B'} onBlur={e => e.target.style.borderColor = '#D1D5DB'} />
                </div>
                <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: 500, fontSize: '14px', color: '#374151' }}>Phone Number</label>
                  <input type="text" value={editFormData.phone || ''} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} style={{ padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#F59E0B'} onBlur={e => e.target.style.borderColor = '#D1D5DB'} />
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: 500, fontSize: '14px', color: '#374151' }}>Department</label>
                  <input type="text" value={editFormData.department || ''} onChange={e => setEditFormData({...editFormData, department: e.target.value})} style={{ padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#F59E0B'} onBlur={e => e.target.style.borderColor = '#D1D5DB'} />
                </div>
                <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: 500, fontSize: '14px', color: '#374151' }}>Semester</label>
                  <input type="text" value={editFormData.semester || ''} onChange={e => setEditFormData({...editFormData, semester: e.target.value})} style={{ padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#F59E0B'} onBlur={e => e.target.style.borderColor = '#D1D5DB'} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
                <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#F59E0B', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2)' }} onMouseEnter={e => e.currentTarget.style.background = '#D97706'} onMouseLeave={e => e.currentTarget.style.background = '#F59E0B'}>Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>Cancel Editing</button>
              </div>
            </form>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .student-profile-wrapper {
          padding: 4px 0 12px 0;
          animation: fadeIn 0.4s ease-out;
        }

        .profile-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          margin-bottom: 10px;
          color: #6B7280;
        }

        .breadcrumb-current {
          color: #111827;
          font-weight: 600;
        }

        .tab-content {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #E5E7EB;
          min-height: 300px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .details-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 500;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .detail-value {
          font-size: 13px;
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
          border-radius: 14px;
          padding: 16px 20px;
          border: 1px solid var(--border-color);
          margin-bottom: 12px;
          box-shadow: 0 2px 4px -1px rgba(0,0,0,0.05);
        }

        .header-left {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .profile-avatar-large {
          width: 60px;
          height: 60px;
          background: #3B82F6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          box-shadow: 0 4px 8px -2px rgba(59, 130, 246, 0.3);
          flex-shrink: 0;
        }

        .student-name-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px 0;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .meta-separator {
          color: var(--text-muted);
        }

        .badge-active {
          background: #DCFCE7;
          color: var(--success);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          margin-left: 4px;
        }

        .header-actions-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .profile-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
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
          gap: 10px;
          margin-bottom: 12px;
        }

        .summary-stat-card {
          background: var(--card-bg);
          border-radius: 10px;
          padding: 12px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .summary-stat-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.05);
          border-color: var(--accent-color);
        }

        .stat-icon-box {
          min-width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-main {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 12px;
          margin-bottom: 1px;
        }

        .stat-desc {
          font-size: 11px;
          color: var(--text-muted);
        }

        .profile-tabs-nav {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 14px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 2px;
        }

        .profile-tabs-nav::-webkit-scrollbar {
          display: none;
        }

        .tab-btn {
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          padding: 8px 0;
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
          height: 2px;
          background: var(--accent-color);
          border-radius: 10px;
        }

        .tab-content-container {
          background: var(--card-bg);
          border-radius: 14px;
          padding: 20px;
          border: 1px solid var(--border-color);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .info-item-card {
          background: var(--bg-light);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #F3F4F6;
        }

        .info-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--card-bg);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .info-details label {
          display: block;
          font-size: 11px;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }

        .info-details p {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .exams-tab-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .exam-group-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        /* Performance Tab Styles */
        .performance-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .perf-card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--border-color);
        }

        .perf-card.success { background: #ECFDF5; border-color: #D1FAE5; }
        .perf-card.info { background: #EFF6FF; border-color: #DBEAFE; }
        .perf-card.purple { background: #F5F3FF; border-color: #EDE9FE; }
        .perf-card.warning { background: #FFFBEB; border-color: #FEF3C7; }

        .perf-icon {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .perf-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .perf-status {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .bar-chart-placeholder {
          height: 240px;
          display: flex;
          align-items: flex-end;
          gap: 40px;
          padding: 32px 40px 16px 40px;
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          position: relative;
          background-image: 
            linear-gradient(var(--border-color) 1px, transparent 1px);
          background-size: 100% 40px;
          background-position: 0 32px;
        }

        .bar-container {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
        }

        .bar {
          width: 80%;
          background: #F59E0B;
          border-radius: 8px 8px 0 0;
          position: relative;
          transition: all 0.3s ease;
        }

        .bar span {
          position: absolute;
          top: -24px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .bar-container .label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Proctoring Tab Styles */
        .config-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .config-box {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: #F0FDF4;
          border-color: #DCFCE7;
        }

        .config-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          color: var(--success);
        }

        .config-label {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .config-status {
          font-size: 14px;
          font-weight: 600;
          color: var(--success);
        }

        .violation-alert-card {
          background: #FEF2F2;
          border: 1px solid #FEE2E2;
          border-radius: 20px;
          padding: 24px;
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .alert-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: #991B1B;
        }

        /* Documents Tab Styles */
        .docs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .doc-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.2s;
        }

        .doc-card:hover {
          border-color: var(--accent-color);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .doc-top {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .doc-icon-box {
          width: 48px;
          height: 48px;
          background: var(--bg-light);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .doc-info h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 700;
        }

        .doc-info p {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .doc-meta {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
        }

        .doc-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .doc-btn {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .doc-btn.primary {
          background: var(--text-primary);
          color: white;
          border: none;
        }

        .doc-preview {
          height: 120px;
          background: var(--bg-light);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 13px;
          color: var(--text-muted);
          border: 1px dashed var(--border-color);
        }

        /* Activity Tab Styles */
        .notif-item {
          display: flex;
          gap: 16px;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 12px;
          border: 1px solid transparent;
        }

        .notif-item.blue { background: #EFF6FF; border-color: #DBEAFE; }
        .notif-item.yellow { background: #FFFBEB; border-color: #FEF3C7; }
        .notif-item.green { background: #ECFDF5; border-color: #D1FAE5; }

        .notif-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-item.blue .notif-icon { color: #3B82F6; }
        .notif-item.yellow .notif-icon { color: #F59E0B; }
        .notif-item.green .notif-icon { color: #10B981; }

        .notif-content h4 { margin: 0 0 4px 0; font-size: 15px; font-weight: 700; }
        .notif-content p { margin: 0 0 8px 0; font-size: 14px; color: var(--text-secondary); }
        .notif-time { font-size: 12px; color: var(--text-muted); }

        /* Timeline Styles */
        .timeline-container {
          padding-left: 20px;
          border-left: 2px solid var(--border-color);
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .timeline-item {
          position: relative;
        }

        .timeline-marker {
          position: absolute;
          left: -31px;
          top: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-marker.success { border-color: #10B981; color: #10B981; }
        .timeline-marker.info { border-color: #3B82F6; color: #3B82F6; }
        .timeline-marker.warning { border-color: #F59E0B; color: #F59E0B; }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .timeline-header h4 { margin: 0; font-size: 15px; font-weight: 700; }
        .timeline-time { font-size: 12px; color: var(--text-muted); }
        .timeline-content p { margin: 0; font-size: 14px; color: var(--text-secondary); }

        /* Last Attempt Card */
        .last-attempt-card {
          background: #F8FAFC;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
        }

        .attempt-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .attempt-item label {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .attempt-item p {
          margin: 0;
          font-weight: 600;
          color: var(--text-primary);
        }

        .status-live {
          background: #DCFCE7;
          color: var(--success);
          padding: 4px 12px;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
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
    case 'Documents': return <FileText size={18} />;
    case 'Activity': return <History size={18} />;
    default: return <User size={18} />;
  }
};

export default StudentProfile;
