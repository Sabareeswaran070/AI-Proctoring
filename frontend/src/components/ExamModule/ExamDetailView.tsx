import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Users, 
  Shield, 
  Building, 
  User, 
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import api from '../../api';
import './ExamModule.css';

const ExamDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/super-admin/exams/${id}`);
        setExam(response.data);
      } catch (err: any) {
        console.error("Error fetching exam detail:", err);
        setError("Failed to load exam details. It may have been deleted or you don't have permission.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExamDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="exam-detail-page loading">
        <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
        <p>Loading examination details...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="exam-detail-page error">
        <AlertCircle size={48} color="var(--error)" />
        <h2>Error</h2>
        <p>{error || "Exam not found"}</p>
        <button onClick={() => window.close()} className="page-btn">Close Tab</button>
      </div>
    );
  }

  return (
    <div className="exam-detail-page">
      <header className="detail-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => window.close()}>
            <ChevronLeft size={20} />
            <span>Close View</span>
          </button>
          <div className="title-section">
            <h1>{exam.title}</h1>
            <div className="badge-row">
              <span className={`status-badge status-${exam.status?.toLowerCase()}`}>{exam.status}</span>
              <span className="type-badge">{exam.type}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-grid">
          {/* Main Info */}
          <div className="detail-card main-info">
            <h2 className="section-title">Examination Overview</h2>
            <p className="exam-description">{exam.description || "No description provided for this examination."}</p>
            
            <div className="info-grid">
              <div className="info-item">
                <Calendar size={18} />
                <div>
                  <label>Start Date & Time</label>
                  <span>{new Date(exam.startTime).toLocaleString()}</span>
                </div>
              </div>
              <div className="info-item">
                <Clock size={18} />
                <div>
                  <label>Duration</label>
                  <span>{exam.duration} Minutes</span>
                </div>
              </div>
              <div className="info-item">
                <Building size={18} />
                <div>
                  <label>Institution</label>
                  <span>{exam.institution?.name || "N/A"}</span>
                </div>
              </div>
              <div className="info-item">
                <User size={18} />
                <div>
                  <label>Assigned Proctor</label>
                  <span>{exam.proctor?.name || "No proctor assigned"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="detail-card settings-info">
            <h2 className="section-title">Proctoring Configuration</h2>
            <div className="settings-list">
              <div className="setting-item">
                <Shield size={16} />
                <span>AI Face Monitoring Enabled</span>
                <CheckCircle2 size={16} color="#008236" />
              </div>
              <div className="setting-item">
                <Shield size={16} />
                <span>Browser Lock Enforcement</span>
                <CheckCircle2 size={16} color="#008236" />
              </div>
              <div className="setting-item">
                <Shield size={16} />
                <span>Multiple Person Detection</span>
                <CheckCircle2 size={16} color="#008236" />
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="detail-card students-info full-width">
            <div className="card-header-row">
              <h2 className="section-title">Assigned Students ({exam.students?.length || 0})</h2>
            </div>
            
            <div className="students-table-wrapper">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Roll Number</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.students && exam.students.length > 0 ? (
                    exam.students.map((se: any) => (
                      <tr key={se.id}>
                        <td>
                          <div className="student-name-cell">
                            <div className="avatar-sm">{se.student.name[0]}</div>
                            <span>{se.student.name}</span>
                          </div>
                        </td>
                        <td>{se.student.email}</td>
                        <td>{se.student.studentId || "N/A"}</td>
                        <td>
                          <span className="participation-badge">Registered</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="empty-cell">No students assigned to this exam.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .exam-detail-page {
          min-height: 100vh;
          background: #F8FAFC;
          font-family: var(--sans);
        }

        .exam-detail-page.loading, .exam-detail-page.error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          text-align: center;
          padding: 40px;
        }

        .detail-header {
          background: white;
          border-bottom: 1px solid #E2E8F0;
          padding: 24px 40px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #64748B;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 16px;
          padding: 0;
        }

        .back-btn:hover {
          color: var(--accent-color);
        }

        .title-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title-section h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #1E293B;
        }

        .badge-row {
          display: flex;
          gap: 12px;
        }

        .type-badge {
          background: #F1F5F9;
          color: #475569;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .detail-content {
          max-width: 1200px;
          margin: 32px auto;
          padding: 0 40px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .detail-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .full-width {
          grid-column: span 2;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1E293B;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F5F9;
        }

        .exam-description {
          color: #475569;
          line-height: 1.6;
          margin-bottom: 24px;
          font-size: 15px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .info-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .info-item svg {
          color: var(--accent-color);
          margin-top: 2px;
        }

        .info-item label {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94A3B8;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .info-item span {
          color: #1E293B;
          font-weight: 600;
          font-size: 15px;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #F8FAFC;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          font-weight: 500;
        }

        .setting-item svg:last-child {
          margin-left: auto;
        }

        .students-table-wrapper {
          margin-top: 16px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
        }

        .students-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .students-table th {
          background: #F8FAFC;
          padding: 12px 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748B;
          border-bottom: 1px solid #E2E8F0;
        }

        .students-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #F1F5F9;
          font-size: 14px;
          color: #475569;
        }

        .student-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          color: #1E293B;
        }

        .avatar-sm {
          width: 32px;
          height: 32px;
          background: #EEF2FF;
          color: #4F46E5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
        }

        .participation-badge {
          background: #ECFDF5;
          color: #059669;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .empty-cell {
          text-align: center;
          padding: 40px !important;
          color: #94A3B8;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default ExamDetailView;
