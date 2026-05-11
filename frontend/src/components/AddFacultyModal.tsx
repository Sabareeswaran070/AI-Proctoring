import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, User, Mail, Lock, Phone, Building2, GraduationCap, BookOpen, Briefcase } from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  code: string;
}

interface AddFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddFacultyModal: React.FC<AddFacultyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '', email: '', password: '', facultyId: '',
    phone: '', gender: '', dob: '',
    institutionId: '', department: '',
    designation: '', specialization: '',
  });

  useEffect(() => {
    if (isOpen) {
      api.get('/super-admin/institutions')
        .then(r => setInstitutions(r.data))
        .catch(console.error);
    }
  }, [isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())          e.name          = 'Name is required';
    if (!form.email.trim())         e.email         = 'Email is required';
    if (form.email && !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password.trim())      e.password      = 'Password is required';
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.facultyId.trim())     e.facultyId     = 'Faculty ID is required';
    if (!form.institutionId)        e.institutionId = 'Institution is required';
    if (form.phone && form.phone.length < 10) e.phone = 'Phone must be at least 10 digits';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const payload: any = { ...form };
      if (!payload.phone) delete payload.phone;
      if (!payload.gender) delete payload.gender;
      if (!payload.dob) delete payload.dob;
      if (!payload.department) delete payload.department;
      if (!payload.designation) delete payload.designation;
      if (!payload.specialization) delete payload.specialization;

      await api.post('/super-admin/faculty', payload);
      onSuccess();
      onClose();
      setForm({ name: '', email: '', password: '', facultyId: '', phone: '', gender: '', dob: '', institutionId: '', department: '', designation: '', specialization: '' });
    } catch (err: any) {
      setErrors({ submit: err.response?.data?.detail || 'Failed to create faculty. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon"><GraduationCap size={22} /></div>
            <div>
              <h2>Add New Faculty</h2>
              <p>Fill in the details below to register a faculty member</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {errors.submit && (
            <div className="form-error-banner">{errors.submit}</div>
          )}

          {/* ── Section 1: Personal Info ── */}
          <div className="form-section">
            <div className="section-title">
              <User size={15} /> Personal Information
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. Jane Smith" className={errors.name ? 'error' : ''} />
                </div>
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Faculty ID <span className="required">*</span></label>
                <div className="input-wrapper">
                  <BookOpen size={16} className="input-icon" />
                  <input name="facultyId" value={form.facultyId} onChange={handleChange} placeholder="FAC001" className={errors.facultyId ? 'error' : ''} />
                </div>
                {errors.facultyId && <span className="field-error">{errors.facultyId}</span>}
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@college.edu" className={errors.email ? 'error' : ''} />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className={errors.password ? 'error' : ''} />
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label>Phone</label>
                <div className="input-wrapper">
                  <Phone size={16} className="input-icon" />
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" className={errors.phone ? 'error' : ''} />
                </div>
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input name="dob" type="date" value={form.dob} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ── Section 2: Academic Info ── */}
          <div className="form-section">
            <div className="section-title">
              <Building2 size={15} /> Academic Information
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Institution <span className="required">*</span></label>
                <select name="institutionId" value={form.institutionId} onChange={handleChange} className={errors.institutionId ? 'error' : ''}>
                  <option value="">Select institution</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                  ))}
                </select>
                {errors.institutionId && <span className="field-error">{errors.institutionId}</span>}
              </div>
              <div className="form-group">
                <label>Department</label>
                <div className="input-wrapper">
                  <GraduationCap size={16} className="input-icon" />
                  <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science" />
                </div>
              </div>
              <div className="form-group">
                <label>Designation</label>
                <div className="input-wrapper">
                  <Briefcase size={16} className="input-icon" />
                  <input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Associate Professor" />
                </div>
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <div className="input-wrapper">
                  <BookOpen size={16} className="input-icon" />
                  <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Machine Learning" />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Adding Faculty...' : 'Add Faculty'}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
          animation: fadeInOverlay 0.2s ease;
        }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }

        .modal-container {
          background: white; border-radius: 20px;
          width: 100%; max-width: 720px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 24px 80px rgba(0,0,0,0.15);
          animation: slideUpModal 0.3s ease;
        }
        @keyframes slideUpModal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 28px; border-bottom: 1px solid #f1f4f8;
          position: sticky; top: 0; background: white; z-index: 1;
        }
        .modal-header-info { display: flex; align-items: center; gap: 14px; }
        .modal-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #FFA500, #FF8C00);
          display: flex; align-items: center; justify-content: center;
          color: white; box-shadow: 0 4px 12px rgba(255,165,0,0.3);
        }
        .modal-header-info h2 { margin: 0 0 2px 0; font-size: 20px; color: #1a1f36; font-weight: 700; }
        .modal-header-info p  { margin: 0; font-size: 13px; color: #697386; }
        .modal-close-btn { background: #f8fafc; border: none; width: 36px; height: 36px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #697386; transition: all 0.2s; }
        .modal-close-btn:hover { background: #fee2e2; color: #dc2626; }

        .modal-form { padding: 24px 28px; }
        .form-error-banner { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; }

        .form-section { margin-bottom: 24px; }
        .section-title { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #FFA500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #fff5e6; }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #374151; }
        .required { color: #dc2626; }

        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 12px; color: #9ca3af; pointer-events: none; }
        .input-wrapper input { padding-left: 38px !important; }

        .form-group input, .form-group select {
          width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb;
          border-radius: 10px; font-size: 14px; color: #1a1f36;
          background: white; transition: all 0.2s; box-sizing: border-box;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none; border-color: #FFA500;
          box-shadow: 0 0 0 3px rgba(255,165,0,0.1);
        }
        .form-group input.error, .form-group select.error { border-color: #dc2626; }
        .field-error { font-size: 12px; color: #dc2626; }

        .modal-footer {
          display: flex; justify-content: flex-end; gap: 12px;
          padding: 20px 28px; border-top: 1px solid #f1f4f8;
          position: sticky; bottom: 0; background: white;
        }
        .cancel-btn { background: white; border: 1px solid #e5e7eb; color: #6b7280; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .cancel-btn:hover { background: #f9fafb; }
        .primary-btn { background: linear-gradient(135deg, #FFA500, #FF8C00); color: white; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(255,165,0,0.25); }
        .primary-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,165,0,0.35); }
        .primary-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
      `}} />
    </div>
  );
};

export default AddFacultyModal;
