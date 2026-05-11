import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Search, Filter, MoreVertical, GraduationCap, Building2, Calendar, ArrowRight, Trash2, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, Briefcase } from 'lucide-react';
import AddFacultyModal from './AddFacultyModal';

interface Faculty {
  id: string;
  name: string;
  email: string;
  status: string;
  studentId: string;
  department: string | null;
  course: string | null;     // designation
  semester: string | null;   // specialization
  institution: { name: string } | null;
  createdAt: string;
}

interface FacultyListProps {
  onViewProfile?: (id: string) => void;
}

const FacultyList: React.FC<FacultyListProps> = ({ onViewProfile }) => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importValidationErrors, setImportValidationErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/faculty');
      setFaculty(res.data);
    } catch (e) {
      console.error('Error fetching faculty:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.institution?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedIds(e.target.checked ? filtered.map(f => f.id) : []);

  const handleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} faculty members? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete('/super-admin/faculty/bulk', { data: { ids: selectedIds } });
      setFaculty(prev => prev.filter(f => !selectedIds.includes(f.id)));
      setSelectedIds([]);
    } catch (e) {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.match(/\.(xlsx|xls|csv)$/)) {
      setImportError('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file.');
      return;
    }
    setImportFile(f); setImportError(null); setImportValidationErrors([]);
  };

  const handleDownloadSample = async () => {
    try {
      const res = await api.get('/super-admin/faculty/bulk-import/sample', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url;
      a.setAttribute('download', 'sample_faculty.xlsx');
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { console.error(e); }
  };

  const handleUpload = async () => {
    if (!importFile) { setImportError('Please select a file.'); return; }
    const formData = new FormData(); formData.append('file', importFile);
    setImportLoading(true); setImportError(null); setImportValidationErrors([]); setImportSuccess(false);
    try {
      await api.post('/super-admin/faculty/bulk-import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImportSuccess(true); fetchFaculty();
      setTimeout(() => handleCloseImport(), 3000);
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.error_file) {
        setImportError(err.response.data.message || 'Validation failed.');
        setImportValidationErrors(err.response.data.errors || []);
        const b64 = err.response.data.error_file;
        const bytes = new Uint8Array([...window.atob(b64)].map(c => c.charCodeAt(0)));
        const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.setAttribute('download', 'faculty_import_errors.xlsx');
        document.body.appendChild(a); a.click(); a.remove();
      } else {
        setImportError(err.response?.data?.detail || 'An error occurred during upload.');
      }
    } finally { setImportLoading(false); }
  };

  const handleCloseImport = () => {
    setImportFile(null); setImportError(null);
    setImportValidationErrors([]); setImportSuccess(false); setShowBulkImport(false);
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div className="header-info">
          <h1 className="module-title">Faculty Management</h1>
          <p className="module-subtitle">Manage and monitor faculty members across all institutions</p>
        </div>
        <div className="header-actions">
          <div className="dropdown-container" ref={menuRef}>
            <button className="icon-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MoreVertical size={20} />
            </button>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setShowBulkImport(true); setIsMenuOpen(false); }}>
                  <Upload size={16} /><span>Bulk Import</span>
                </button>
                <button className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                  <Download size={16} /><span>Export</span>
                </button>
              </div>
            )}
          </div>
          <button className="primary-btn" onClick={() => setIsAddModalOpen(true)}>
            <GraduationCap size={18} /><span>Add New Faculty</span>
          </button>
        </div>
      </header>

      <div className="module-filters">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search by name, email, department or institution..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-actions">
          {selectedIds.length > 0 && (
            <button className="danger-btn" onClick={handleBulkDelete} disabled={deleting}>
              <Trash2 size={18} /><span>Delete ({selectedIds.length})</span>
            </button>
          )}
          <button className="secondary-btn"><Filter size={18} /><span>Filter</span></button>
        </div>
      </div>

      {showBulkImport && (
        <div className="inline-bulk-import">
          <div className="inline-import-header">
            <div>
              <h3>Bulk Import Faculty</h3>
              <p>Upload an Excel sheet to add multiple faculty members at once.</p>
            </div>
            <button className="icon-btn" onClick={handleCloseImport}><X size={20} /></button>
          </div>

          {importSuccess ? (
            <div className="success-state">
              <CheckCircle size={40} className="success-icon" />
              <div>
                <h4>Import Successful!</h4>
                <p>Faculty members have been successfully added to the system.</p>
              </div>
            </div>
          ) : (
            <div className="inline-import-content">
              <div className="import-left-panel">
                <div className="download-sample-container">
                  <div className="sample-info">
                    <FileSpreadsheet size={20} className="sample-icon" />
                    <div><h4>Sample File Template</h4><p>Use this template to ensure correct formatting.</p></div>
                  </div>
                  <button className="secondary-btn" onClick={handleDownloadSample}><Download size={16} />Download</button>
                </div>
                <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.xls,.csv" style={{ display: 'none' }} />
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
                    <div className="error-message"><AlertCircle size={16} /><span>{importError}</span></div>
                    {importValidationErrors.length > 0 && (
                      <div className="validation-errors">
                        <p><strong>Common Errors:</strong></p>
                        <ul>{importValidationErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                        <p className="downloaded-note">An error report has been automatically downloaded.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="import-instructions">
                    <h4>Instructions</h4>
                    <ul>
                      <li>Required columns: <strong>name, email, password, facultyId, institutionId</strong></li>
                      <li>Use institution code (CEG, TCE, PSG) or the institution UUID.</li>
                      <li>Emails and Faculty IDs must be unique across all users.</li>
                      <li>Optional: phone, gender, dob, department, designation, specialization</li>
                    </ul>
                  </div>
                )}
                <div className="import-actions">
                  <button className="cancel-btn" onClick={handleCloseImport}>Cancel</button>
                  <button className="primary-btn submit-btn" onClick={handleUpload} disabled={!importFile || importLoading}>
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
          <div className="loading-state"><div className="spinner" /><p>Loading faculty data...</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" onChange={handleSelectAll}
                    checked={selectedIds.length === filtered.length && filtered.length > 0} />
                </th>
                <th>Faculty</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Institution</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#697386' }}>No faculty members found.</td></tr>
              ) : filtered.map(f => (
                <tr key={f.id} className={selectedIds.includes(f.id) ? 'selected-row' : ''}>
                  <td><input type="checkbox" checked={selectedIds.includes(f.id)} onChange={() => handleSelect(f.id)} /></td>
                  <td>
                    <div className="student-info-cell">
                      <div className="avatar-small" style={{ background: '#f0f4ff', color: '#4f6ef7' }}>{f.name.charAt(0)}</div>
                      <div className="name-email">
                        <span className="student-name">{f.name}</span>
                        <span className="student-email">{f.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="institution-cell">
                      <Briefcase size={15} />
                      <span>{f.course || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="institution-cell">
                      <GraduationCap size={15} />
                      <span>{f.department || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="institution-cell">
                      <Building2 size={15} />
                      <span>{f.institution?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={15} />
                      <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-${f.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                      {f.status?.toLowerCase() || 'active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-cell">
                      <button className="icon-btn" title="View Profile" onClick={() => onViewProfile && onViewProfile(f.id)}>
                        <ArrowRight size={18} />
                      </button>
                      <button className="icon-btn" title="More"><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddFacultyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchFaculty} />

      <style dangerouslySetInnerHTML={{ __html: `
        .module-container { padding: 24px; animation: fadeIn 0.4s ease-out; }
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .module-title { font-size: 28px; font-weight: 700; color: #1a1f36; margin: 0 0 4px 0; }
        .module-subtitle { color: #697386; margin: 0; font-size: 15px; }
        .header-actions { display: flex; align-items: center; gap: 12px; }
        .primary-btn { background: linear-gradient(135deg,#FFA500,#FF8C00); color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(255,165,0,0.2); }
        .primary-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,165,0,0.3); }
        .primary-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .dropdown-container { position: relative; }
        .dropdown-menu { position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 160px; z-index: 50; overflow: hidden; }
        .dropdown-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border: none; background: none; color: #334155; font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .dropdown-item:hover { background: #f8fafc; color: #FFA500; }
        .module-filters { display: flex; gap: 16px; margin-bottom: 24px; align-items: stretch; }
        .filter-actions { display: flex; gap: 12px; align-items: center; }
        .search-box { flex: 1; position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 14px; color: #a3acb9; }
        .search-box input { width: 100%; padding: 12px 12px 12px 44px; border: 1px solid #e3e8ee; border-radius: 12px; font-size: 15px; background: white; transition: all 0.2s; }
        .search-box input:focus { outline: none; border-color: #FFA500; box-shadow: 0 0 0 4px rgba(255,165,0,0.1); }
        .secondary-btn { background: white; color: #374151; border: 1px solid #e2e8f0; padding: 10px 18px; border-radius: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
        .secondary-btn:hover { background: #f8fafc; }
        .danger-btn { background: #FEF2F2; color: #dc2626; border: 1px solid #FEE2E2; padding: 10px 18px; border-radius: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
        .danger-btn:hover:not(:disabled) { background: #FEE2E2; transform: translateY(-1px); }
        .danger-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .inline-bulk-import { background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 24px; animation: slideDown 0.3s ease-out; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .inline-import-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f4f8; }
        .inline-import-header h3 { margin: 0 0 4px 0; font-size: 18px; color: #1a1f36; }
        .inline-import-header p { margin: 0; font-size: 14px; color: #697386; }
        .inline-import-content { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .download-sample-container { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; padding: 16px; border-radius: 12px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
        .sample-info { display: flex; align-items: center; gap: 12px; }
        .sample-icon { color: #FFA500; }
        .sample-info h4 { margin: 0; font-size: 14px; color: #1a1f36; }
        .sample-info p { margin: 4px 0 0 0; font-size: 12px; color: #697386; }
        .upload-area { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 32px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: #fafafa; }
        .upload-area:hover { border-color: #FFA500; background: #fff9f0; }
        .upload-icon { color: #94a3b8; margin-bottom: 12px; }
        .upload-area:hover .upload-icon { color: #FFA500; }
        .upload-text { margin: 0 0 8px 0; color: #334155; font-size: 14px; }
        .upload-hint { margin: 0; font-size: 13px; color: #94a3b8; }
        .selected-file { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .file-name { font-weight: 600; color: #1a1f36; font-size: 14px; }
        .file-size { font-size: 12px; color: #697386; }
        .import-right-panel { display: flex; flex-direction: column; }
        .import-instructions { background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; flex: 1; }
        .import-instructions h4 { margin: 0 0 12px 0; font-size: 14px; color: #334155; }
        .import-instructions ul { margin: 0; padding-left: 20px; color: #475569; font-size: 13px; }
        .import-instructions li { margin-bottom: 8px; }
        .validation-panel { flex: 1; }
        .error-message { display: flex; align-items: center; gap: 8px; background: #fef2f2; color: #dc2626; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
        .validation-errors { background: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; font-size: 13px; color: #92400e; }
        .validation-errors p { margin: 0 0 8px 0; }
        .validation-errors ul { margin: 0 0 12px 0; padding-left: 20px; }
        .downloaded-note { font-weight: 600; color: #d97706 !important; }
        .import-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
        .cancel-btn { background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .success-state { display: flex; align-items: center; gap: 16px; padding: 24px; background: #ecfdf5; border-radius: 12px; border: 1px solid #a7f3d0; }
        .success-icon { color: #10b981; }
        .success-state h4 { margin: 0 0 4px 0; color: #065f46; font-size: 16px; }
        .success-state p { margin: 0; color: #047857; font-size: 14px; }
        .data-table-container { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 20px; background: #f8fafc; color: #697386; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; }
        .data-table td { padding: 16px 20px; border-bottom: 1px solid #f1f4f8; color: #1a1f36; font-size: 15px; }
        .data-table input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: #FF8C00; }
        .selected-row { background-color: #FFF9F0 !important; }
        .student-info-cell { display: flex; align-items: center; gap: 12px; }
        .avatar-small { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
        .name-email { display: flex; flex-direction: column; }
        .student-name { font-weight: 600; color: #1a1f36; }
        .student-email { font-size: 13px; color: #697386; }
        .institution-cell, .date-cell { display: flex; align-items: center; gap: 8px; color: #697386; font-size: 14px; }
        .badge-success { background: #ecfdf5; color: #059669; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .badge-warning { background: #fffbeb; color: #d97706; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
        .action-cell { display: flex; gap: 8px; }
        .icon-btn { width: 36px; height: 36px; border-radius: 8px; border: none; background: transparent; color: #697386; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .icon-btn:hover { background: #f1f4f8; color: #FFA500; }
        .loading-state { padding: 60px; text-align: center; color: #697386; }
        .spinner { width: 40px; height: 40px; border: 3px solid #f1f4f8; border-top-color: #FFA500; border-radius: 50%; margin: 0 auto 16px; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default FacultyList;
