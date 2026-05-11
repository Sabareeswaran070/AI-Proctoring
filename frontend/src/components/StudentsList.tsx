import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Search, Filter, MoreVertical, User, Building2, Mail, Calendar, ArrowRight, ShieldAlert, Trash2, CheckSquare, Square, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import AddStudentModal from './AddStudentModal';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  suspiciousCount: number;
  institution: {
    name: string;
  };
  createdAt: string;
}

interface StudentsListProps {
  onViewProfile?: (id: string) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ onViewProfile }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Bulk import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importValidationErrors, setImportValidationErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/super-admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.institution?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} students? This action cannot be undone.`)) return;

    setDeleting(true);
    try {
      await api.delete('/super-admin/students/bulk', { data: { ids: selectedIds } });
      setStudents(prev => prev.filter(s => !selectedIds.includes(s.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting students:', error);
      alert("Failed to delete students. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls') && !selectedFile.name.endsWith('.csv')) {
        setImportError("Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file.");
        setImportFile(null);
        return;
      }
      setImportFile(selectedFile);
      setImportError(null);
      setImportValidationErrors([]);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const response = await api.get('/super-admin/students/bulk-import/sample', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample_students.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Error downloading sample:", err);
    }
  };

  const handleUpload = async () => {
    if (!importFile) {
      setImportError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', importFile);

    setImportLoading(true);
    setImportError(null);
    setImportValidationErrors([]);
    setImportSuccess(false);

    try {
      await api.post('/super-admin/students/bulk-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setImportSuccess(true);
      fetchStudents();
      setTimeout(() => {
        handleCloseImport();
      }, 3000);
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.error_file) {
        setImportError(err.response.data.message || "Validation failed.");
        setImportValidationErrors(err.response.data.errors || []);
        
        // Trigger download of error file
        const base64str = err.response.data.error_file;
        const binaryString = window.atob(base64str);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'import_errors.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        setImportError(err.response?.data?.detail || "An error occurred during file upload.");
      }
    } finally {
      setImportLoading(false);
    }
  };

  const handleCloseImport = () => {
    setImportFile(null);
    setImportError(null);
    setImportValidationErrors([]);
    setImportSuccess(false);
    setShowBulkImport(false);
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="header-info">
          <h1 className="module-title">Student Management</h1>
          <p className="module-subtitle">Manage and monitor students across all institutions</p>
        </div>
        <div className="header-actions">
          <div className="dropdown-container" ref={menuRef}>
            <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MoreVertical size={20} />
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    setShowBulkImport(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <Upload size={16} />
                  <span>Bulk Import</span>
                </button>
                <button className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>
          <button className="primary-btn" onClick={() => setIsAddModalOpen(true)}>
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
          {selectedIds.length > 0 && (
            <button className="danger-btn" onClick={handleBulkDelete} disabled={deleting}>
              <Trash2 size={18} />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}
          <button className="secondary-btn">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {showBulkImport && (
        <div className="inline-bulk-import">
          <div className="inline-import-header">
            <div>
              <h3>Bulk Import Students</h3>
              <p>Upload an Excel sheet to add multiple students at once.</p>
            </div>
            <button className="icon-btn" onClick={handleCloseImport}><X size={20} /></button>
          </div>

          {importSuccess ? (
            <div className="success-state">
              <CheckCircle size={40} className="success-icon" />
              <div>
                <h4>Import Successful!</h4>
                <p>Students have been successfully added to the system.</p>
              </div>
            </div>
          ) : (
            <div className="inline-import-content">
              <div className="import-left-panel">
                <div className="download-sample-container">
                  <div className="sample-info">
                    <FileSpreadsheet size={20} className="sample-icon" />
                    <div>
                      <h4>Sample File Template</h4>
                      <p>Use this template to ensure correct formatting.</p>
                    </div>
                  </div>
                  <button className="secondary-btn" onClick={handleDownloadSample}>
                    <Download size={16} />
                    Download
                  </button>
                </div>

                <div 
                  className="upload-area" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImportFileChange} 
                    accept=".xlsx, .xls, .csv" 
                    style={{ display: 'none' }} 
                  />
                  <Upload size={32} className="upload-icon" />
                  {importFile ? (
                    <div className="selected-file">
                      <span className="file-name">{importFile.name}</span>
                      <span className="file-size">{(importFile.size / 1024).toFixed(2)} KB</span>
                    </div>
                  ) : (
                    <>
                      <p className="upload-text"><strong>Click to upload</strong> or drag and drop</p>
                      <p className="upload-hint">Excel or CSV files only</p>
                    </>
                  )}
                </div>
              </div>

              <div className="import-right-panel">
                {importError ? (
                  <div className="validation-panel">
                    <div className="error-message">
                      <AlertCircle size={16} />
                      <span>{importError}</span>
                    </div>
                    {importValidationErrors.length > 0 && (
                      <div className="validation-errors">
                        <p><strong>Common Errors:</strong></p>
                        <ul>
                          {importValidationErrors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                        <p className="downloaded-note">An error report has been automatically downloaded.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="import-instructions">
                    <h4>Instructions</h4>
                    <ul>
                      <li>Ensure all required columns are present (Name, Email, StudentID, Password, InstitutionID).</li>
                      <li>Emails and Student IDs must be unique.</li>
                      <li>Check for valid email formatting.</li>
                    </ul>
                  </div>
                )}
                
                <div className="import-actions">
                  <button className="cancel-btn" onClick={handleCloseImport}>Cancel</button>
                  <button 
                    className="primary-btn submit-btn" 
                    onClick={handleUpload} 
                    disabled={!importFile || importLoading}
                  >
                    {importLoading ? 'Importing...' : 'Import Data'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0} 
                  />
                </th>
                <th>Student</th>
                <th>Institution</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className={selectedIds.includes(student.id) ? 'selected-row' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(student.id)} 
                      onChange={() => handleSelectStudent(student.id)} 
                    />
                  </td>
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
                    {student.suspiciousCount > 0 ? (
                      <span className="badge-danger">Suspicious ({student.suspiciousCount})</span>
                    ) : (
                      <span className={`badge-${student.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                        {student.status?.toLowerCase() || 'active'}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-cell">
                      <button 
                        className="icon-btn" 
                        title="View Profile"
                        onClick={() => onViewProfile && onViewProfile(student.id)}
                      >
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

      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchStudents} 
      />

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

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
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

        .dropdown-container {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          width: 160px;
          z-index: 50;
          overflow: hidden;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border: none;
          background: none;
          color: #334155;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .dropdown-item:hover {
          background: #f8fafc;
          color: #FFA500;
        }

        .inline-bulk-import {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          padding: 24px;
          margin-bottom: 24px;
          animation: slideDown 0.3s ease-out;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .inline-import-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f4f8;
        }

        .inline-import-header h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          color: #1a1f36;
        }

        .inline-import-header p {
          margin: 0;
          font-size: 14px;
          color: #697386;
        }

        .inline-import-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .download-sample-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          border: 1px solid #e2e8f0;
        }

        .sample-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sample-icon {
          color: #FFA500;
        }

        .sample-info h4 {
          margin: 0;
          font-size: 14px;
          color: #1a1f36;
        }

        .sample-info p {
          margin: 4px 0 0 0;
          font-size: 12px;
          color: #697386;
        }

        .upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
        }

        .upload-area:hover {
          border-color: #FFA500;
          background: #fff9f0;
        }

        .upload-icon {
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .upload-area:hover .upload-icon {
          color: #FFA500;
        }

        .upload-text {
          margin: 0 0 8px 0;
          color: #334155;
          font-size: 14px;
        }

        .upload-hint {
          margin: 0;
          font-size: 13px;
          color: #94a3b8;
        }

        .selected-file {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .file-name {
          font-weight: 600;
          color: #1a1f36;
          font-size: 14px;
        }

        .file-size {
          font-size: 12px;
          color: #697386;
        }

        .import-right-panel {
          display: flex;
          flex-direction: column;
        }

        .import-instructions {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          flex: 1;
        }

        .import-instructions h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #334155;
        }

        .import-instructions ul {
          margin: 0;
          padding-left: 20px;
          color: #475569;
          font-size: 13px;
        }

        .import-instructions li {
          margin-bottom: 8px;
        }

        .validation-panel {
          flex: 1;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .validation-errors {
          background: #fffbeb;
          border: 1px solid #fde68a;
          padding: 16px;
          border-radius: 8px;
          font-size: 13px;
          color: #92400e;
        }

        .validation-errors p {
          margin: 0 0 8px 0;
        }

        .validation-errors ul {
          margin: 0 0 12px 0;
          padding-left: 20px;
        }

        .downloaded-note {
          font-weight: 600;
          color: #d97706 !important;
        }

        .import-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }

        .cancel-btn {
          background: white;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #f8fafc;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success-state {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: #ecfdf5;
          border-radius: 12px;
          border: 1px solid #a7f3d0;
        }

        .success-icon {
          color: #10b981;
        }

        .success-state h4 {
          margin: 0 0 4px 0;
          color: #065f46;
          font-size: 16px;
        }

        .success-state p {
          margin: 0;
          color: #047857;
          font-size: 14px;
        }

        .module-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          align-items: stretch;
        }

        .filter-actions {
          display: flex;
          gap: 12px;
          align-items: center;
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
          color: var(--text-primary);
          border: 1px solid var(--border-color);
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
          background: var(--bg-light);
          border-color: #cbd5e0;
        }

        .danger-btn {
          background: #FEF2F2;
          color: var(--error);
          border: 1px solid #FEE2E2;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .danger-btn:hover:not(:disabled) {
          background: #FEE2E2;
          border-color: #FECACA;
          transform: translateY(-1px);
        }

        .danger-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .selected-row {
          background-color: #FFF9F0 !important;
        }

        .data-table input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #FF8C00;
        }

        .data-table-container {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--border-color);
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
          background: var(--bg-light);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border-color);
        }

        .data-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f4f8;
          color: var(--text-primary);
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
          color: var(--accent-color);
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
          color: var(--text-primary);
        }

        .student-email {
          font-size: 13px;
          color: var(--text-muted);
        }

        .institution-cell, .date-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }

        .badge-success {
          background: #ecfdf5;
          color: var(--success);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .badge-warning {
          background: #fffbeb;
          color: var(--warning);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .badge-danger {
          background: #fef2f2;
          color: var(--error);
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
