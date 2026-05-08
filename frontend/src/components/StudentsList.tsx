import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, Filter, MoreVertical, User, Building2, Mail, Calendar, ArrowRight } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  institution: {
    name: string;
  };
  createdAt: string;
}

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/super-admin/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.institution?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="header-info">
          <h1 className="module-title">Student Management</h1>
          <p className="module-subtitle">Manage and monitor students across all institutions</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn">
            <User size={18} />
            <span>Add New Student</span>
          </button>
        </div>
      </header>

      <div className="module-filters">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, email or institution..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <button className="secondary-btn">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading student data...</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Institution</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-info-cell">
                      <div className="avatar-small">
                        {student.name.charAt(0)}
                      </div>
                      <div className="name-email">
                        <span className="student-name">{student.name}</span>
                        <span className="student-email">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="institution-cell">
                      <Building2 size={16} />
                      <span>{student.institution?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={16} />
                      <span>{new Date(student.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge-success">Active</span>
                  </td>
                  <td>
                    <div className="action-cell">
                      <button className="icon-btn" title="View Profile">
                        <ArrowRight size={18} />
                      </button>
                      <button className="icon-btn" title="More Options">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .module-container {
          padding: 24px;
          animation: fadeIn 0.4s ease-out;
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .module-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1f36;
          margin: 0 0 4px 0;
        }

        .module-subtitle {
          color: #697386;
          margin: 0;
          font-size: 15px;
        }

        .primary-btn {
          background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(255, 165, 0, 0.2);
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 165, 0, 0.3);
        }

        .module-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: #a3acb9;
        }

        .search-box input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1px solid #e3e8ee;
          border-radius: 12px;
          font-size: 15px;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: white;
        }

        .search-box input:focus {
          outline: none;
          border-color: #FFA500;
          box-shadow: 0 0 0 4px rgba(255, 165, 0, 0.1);
        }

        .secondary-btn {
          background: white;
          color: #1a1f36;
          border: 1px solid #e3e8ee;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-btn:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }

        .data-table-container {
          background: white;
          border-radius: 16px;
          border: 1px solid #e3e8ee;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          padding: 16px 20px;
          background: #f8fafc;
          color: #4f566b;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e3e8ee;
        }

        .data-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f4f8;
          color: #1a1f36;
          font-size: 15px;
        }

        .student-info-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-small {
          width: 40px;
          height: 40px;
          background: #FFF5E6;
          color: #FF8C00;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }

        .name-email {
          display: flex;
          flex-direction: column;
        }

        .student-name {
          font-weight: 600;
          color: #1a1f36;
        }

        .student-email {
          font-size: 13px;
          color: #697386;
        }

        .institution-cell, .date-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4f566b;
        }

        .badge-success {
          background: #ecfdf5;
          color: #059669;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .action-cell {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #697386;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-btn:hover {
          background: #f1f4f8;
          color: #FFA500;
        }

        .loading-state {
          padding: 60px;
          text-align: center;
          color: #697386;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f1f4f8;
          border-top-color: #FFA500;
          border-radius: 50%;
          margin: 0 auto 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default StudentsList;
