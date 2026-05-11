import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Lock, Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TabType = 'personal' | 'academic' | 'credentials' | 'proctoring';

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<{ id: string, name: string }[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    studentId: '',
    institutionId: '',
    department: '',
    course: '',
    semester: '',
    batch: '',
    password: '',
    confirmPassword: '',
    browserLock: true,
  });

  useEffect(() => {
    if (isOpen) {
      const fetchInstitutions = async () => {
        try {
          const response = await api.get('/super-admin/institutions');
          setInstitutions(response.data);
        } catch (err) {
          console.error("Failed to fetch institutions", err);
          // Fallback for demo
          setInstitutions([{ id: 'demo-inst', name: 'Standard University' }]);
        }
      };
      fetchInstitutions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setActiveTab('credentials');
      return;
    }

    setLoading(true);
    setError(null);

    // Clean data: convert empty strings to null ONLY for optional fields
    const requiredFields = ['name', 'email', 'password', 'studentId', 'institutionId'];
    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        (value === '' && !requiredFields.includes(key)) ? null : value
      ])
    );

    try {
      await api.post('/super-admin/students', cleanedData);
      onSuccess();
      onClose();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', '));
      } else if (typeof detail === 'object' && detail !== null) {
        setError(JSON.stringify(detail));
      } else {
        setError(typeof detail === 'string' ? detail : "Failed to create student");
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'credentials', label: 'Security', icon: Lock },
    { id: 'proctoring', label: 'AI Setup', icon: Shield },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2>Add New Student</h2>
            <p>Create a secure student account for examination</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <nav className="modal-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="tab-content">
            {activeTab === 'personal' && (
              <div className="form-grid">
                <div className="form-group full">
                  <label>Full Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange} required placeholder="Name" />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email" />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 " />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input name="dob" type="date" value={formData.dob} onChange={handleChange} />
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="form-grid">
                <div className="form-group full">
                  <label>Institution *</label>
                  <select name="institutionId" value={formData.institutionId} onChange={handleChange} required>
                    <option value="">Select Institution</option>
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Student ID / Reg No *</label>
                  <input name="studentId" value={formData.studentId} onChange={handleChange} required placeholder="ID" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input name="department" value={formData.department} onChange={handleChange} placeholder="Computer Science" />
                </div>
                <div className="form-group">
                  <label>Course / Program</label>
                  <input name="course" value={formData.course} onChange={handleChange} placeholder="B.Tech" />
                </div>
                <div className="form-group">
                  <label>Batch</label>
                  <input name="batch" value={formData.batch} onChange={handleChange} placeholder="2021-2025" />
                </div>
              </div>
            )}

            {activeTab === 'credentials' && (
              <div className="form-grid">
                <div className="form-group full">
                  <label>Password *</label>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                </div>
                <div className="form-group full">
                  <label>Confirm Password *</label>
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" />
                </div>
                <div className="form-group full info-box">
                  <CheckCircle2 size={16} />
                  <span>Student will receive a welcome email with these credentials.</span>
                </div>
              </div>
            )}

            {activeTab === 'proctoring' && (
              <div className="form-grid">
                <div className="form-group full checkbox-group">
                  <input type="checkbox" id="browserLock" name="browserLock" checked={formData.browserLock} onChange={handleChange} />
                  <label htmlFor="browserLock">Enable Secure Browser Lock</label>
                  <p className="help-text">Forces the student to remain in fullscreen mode during exams.</p>
                </div>
                <div className="form-group full info-box warning">
                  <Shield size={16} />
                  <span>Face registration will be required upon first login.</span>
                </div>
              </div>
            )}
          </div>

          <footer className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Student'}
            </button>
          </footer>
        </form>

        <style dangerouslySetInnerHTML={{
          __html: `
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(8, 6, 13, 0.4);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
          }

          .modal-content {
            background: white;
            width: 100%;
            max-width: 600px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            animation: slideUp 0.3s ease-out;
          }

          .modal-header {
            padding: 24px;
            background: #f8fafc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e3e8ee;
          }

          .modal-header h2 {
            margin: 0;
            font-size: 20px;
            color: #1a1f36;
          }

          .modal-header p {
            margin: 4px 0 0;
            font-size: 14px;
            color: #697386;
          }

          .close-btn {
            background: transparent;
            border: none;
            color: #a3acb9;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background 0.2s;
          }

          .close-btn:hover {
            background: #f1f4f8;
            color: #1a1f36;
          }

          .modal-tabs {
            display: flex;
            padding: 0 12px;
            background: var(--bg-light);
            border-bottom: 1px solid var(--border-color);
          }

          .tab-btn {
            padding: 14px 20px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .tab-btn.active {
            color: var(--accent-color);
            border-bottom-color: var(--accent-color);
          }

          .modal-form {
            padding: 24px;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .form-group.full {
            grid-column: span 2;
          }

          .form-group label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 8px;
          }

          .form-group input, .form-group select {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid var(--border-color);
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.2s;
            box-sizing: border-box;
          }

          .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 4px rgba(255, 165, 0, 0.1);
          }

          .checkbox-group {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
          }

          .checkbox-group input {
            width: 20px;
            height: 20px;
            accent-color: #FF8C00;
          }

          .checkbox-group label {
            margin: 0;
            cursor: pointer;
          }

          .help-text {
            width: 100%;
            margin: 4px 0 0 32px;
            font-size: 12px;
            color: #697386;
          }

          .info-box {
            background: #f0f9ff;
            padding: 12px 16px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #0369a1;
            font-size: 14px;
          }

          .info-box.warning {
            background: #fff7ed;
            color: #9a3412;
          }

          .error-alert {
            background: #fef2f2;
            color: #b91c1c;
            padding: 12px 16px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            border: 1px solid #fee2e2;
          }

          .modal-footer {
            margin-top: 32px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding-top: 24px;
            border-top: 1px solid #f1f4f8;
          }

          .cancel-btn {
            background: white;
            border: 1px solid var(--border-color);
            padding: 10px 24px;
            border-radius: 10px;
            font-weight: 600;
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s;
          }

          .cancel-btn:hover {
            background: var(--bg-light);
            border-color: #cbd5e0;
          }

          .submit-btn {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 10px 32px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 140px;
          }

          .submit-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
          }

          .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .animate-spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />
      </div>
    </div>
  );
};

export default AddStudentModal;
