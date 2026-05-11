import React, { useEffect, useState, useCallback } from 'react';
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
  Layers,
  Eye,
  Send,
  Pause,
  Trash2
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, examsRes] = await Promise.all([
        api.get('/super-admin/exams/stats'),
        api.get('/super-admin/exams')
      ]);
      setStats(statsRes.data);
      setExams(examsRes.data);
    } catch (err) {
      console.error('Error fetching exam dashboard data:', err);
      showToast("Failed to fetch latest dashboard data.", 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.action-btn')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleAction = async (id: string, action: string) => {
    try {
      setOpenMenuId(null);
      if (action === 'view') {
        window.open(`/super-admin/exam-detail/${id}`, '_blank');
        showToast("Opening exam details...");
      } else if (action === 'publish') {
        await api.put(`/super-admin/exams/${id}/status`, { status: 'PUBLISHED' });
        showToast("Exam published successfully!");
        fetchDashboardData();
      } else if (action === 'hold') {
        await api.put(`/super-admin/exams/${id}/status`, { status: 'HELD' });
        showToast("Exam placed on hold.");
        fetchDashboardData();
      } else if (action === 'delete') {
        if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
          await api.delete(`/super-admin/exams/${id}`);
          showToast("Exam deleted successfully.");
          fetchDashboardData();
        }
      }
    } catch (err) {
      console.error(`Error performing ${action} on exam ${id}:`, err);
      showToast(`Failed to ${action} exam.`, 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

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
              <ArrowUpRight size={12} /> Live Dashboard
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
            <p className="stat-change">Live Monitoring</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#ECFDF5' }}>
            <ActivityIcon />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>Upcoming Exams</h3>
            <div className="stat-value">{stats?.upcoming ?? "-"}</div>
            <p className="stat-change">Scheduled</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#FFF7ED' }}>
            <Calendar color="var(--accent-color)" />
          </div>
        </div>
        <div className="exam-stat-card">
          <div className="stat-info">
            <h3>Proctoring Alerts</h3>
            <div className="stat-value">{stats?.alerts ?? "-"}</div>
            <p className="stat-change" style={{ color: (stats?.alerts ?? 0) > 0 ? 'var(--error)' : 'inherit' }}>
              {(stats?.alerts ?? 0) > 0 ? <><AlertTriangle size={12} /> Review Required</> : "System Healthy"}
            </p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#FFF1F2' }}>
            <AlertTriangle color="var(--error)" />
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
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px' }}>
                  <div className="loader" style={{ margin: '0 auto' }}></div>
                  <p style={{ marginTop: '10px', color: '#64748B' }}>Loading examinations...</p>
                </td>
              </tr>
            ) : exams.length > 0 ? (
              exams.map((exam) => (
                <ExamRow 
                  key={exam.id}
                  name={exam.title ?? "-"} 
                  dept={exam.department ?? "-"} 
                  date={formatDate(exam.startTime)} 
                  institution={exam.institution?.name ?? "-"} 
                  type={exam.type ?? "-"} 
                  status={exam.status ?? "-"} 
                  onAction={(action: string) => handleAction(exam.id, action)}
                  isOpen={openMenuId === exam.id}
                  onToggleMenu={() => setOpenMenuId(openMenuId === exam.id ? null : exam.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px' }}>
                   <div style={{ color: '#94A3B8' }}>
                      <FileText size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                      <p>No exams found in the database.</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
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

const ExamRow = ({ name, dept, date, institution, type, status, onAction, isOpen, onToggleMenu }: any) => (
  <tr style={{ position: 'relative' }}>
    <td>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={16} color="#6A7282" />
        </div>
        <span style={{ fontWeight: 600, color: '#1E293B' }}>{name}</span>
      </div>
    </td>
    <td>{dept}</td>
    <td>{date}</td>
    <td>{institution}</td>
    <td><span style={{ padding: '4px 8px', borderRadius: '6px', background: '#F1F5F9', fontSize: '12px', fontWeight: 500 }}>{type}</span></td>
    <td>
      <span className={`status-badge ${
        status === 'ONGOING' ? 'status-live' : 
        status === 'PUBLISHED' ? 'status-published' : 
        status === 'HELD' ? 'status-held' : 
        status === 'SCHEDULED' ? 'status-scheduled' :
        status === 'DRAFT' ? 'status-draft' : ''
      }`} style={{ 
        fontWeight: 600
      }}>
        {status}
      </span>
    </td>
    <td style={{ position: 'relative' }}>
      <button 
        className="action-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onToggleMenu();
        }}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s'
        }}
      >
        <MoreVertical size={18} color={isOpen ? 'var(--accent-color)' : "#94A3B8"} />
      </button>
      
      {isOpen && (
        <div className="action-dropdown" style={{ 
          position: 'absolute', 
          right: '24px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          backgroundColor: 'white', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)', 
          borderRadius: '12px', 
          zIndex: 9999, 
          minWidth: '180px',
          border: '1px solid #E2E8F0',
          padding: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <button className="dropdown-item" onClick={() => onAction('view')} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, borderRadius: '8px' }}>
            <Eye size={16} color="#64748B" /> View Details
          </button>
          <button className="dropdown-item" onClick={() => onAction('publish')} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, borderRadius: '8px' }}>
            <Send size={16} color="#64748B" /> Publish Exam
          </button>
          <button className="dropdown-item" onClick={() => onAction('hold')} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, borderRadius: '8px' }}>
            <Pause size={16} color="#64748B" /> Put on Hold
          </button>
          <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 8px' }}></div>
          <button className="dropdown-item" onClick={() => onAction('delete')} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#EF4444', borderRadius: '8px' }}>
            <Trash2 size={16} color="#EF4444" /> Delete Exam
          </button>
        </div>
      )}
    </td>
  </tr>
);

export default ExamDashboard;

