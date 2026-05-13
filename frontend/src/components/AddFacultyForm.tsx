import React, { useState, useEffect } from 'react';
import api from '../api';
import { ChevronLeft, User, Mail, Lock, Phone, Building2, GraduationCap, BookOpen, Briefcase, Check, Loader2, AlertCircle } from 'lucide-react';
import './CollegeModule/CollegeModule.css';

interface Institution {
  id: string;
  name: string;
  code: string;
}

interface AddFacultyFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const STEPS = [
  { id: 1, label: 'Personal Information', icon: User },
  { id: 2, label: 'Academic Details', icon: Building2 },
];

const AddFacultyForm: React.FC<AddFacultyFormProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '', email: '', password: '', facultyId: '',
    phone: '', gender: '', dob: '',
    institutionId: '', department: '',
    designation: '', specialization: '',
  });

  useEffect(() => {
    api.get('/super-admin/institutions')
      .then(r => setInstitutions(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (form.institutionId) {
      api.get(`/super-admin/institutions/${form.institutionId}/departments`)
        .then(r => setDepartments(r.data))
        .catch(console.error);
    } else {
      setDepartments([]);
      setForm(prev => ({ ...prev, department: '' }));
    }
  }, [form.institutionId]);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (form.email && !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password.trim()) e.password = 'Password is required';
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.facultyId.trim()) e.facultyId = 'Faculty ID is required';
    if (form.phone && form.phone.length > 0 && form.phone.length < 10) e.phone = 'Phone must be at least 10 digits';
    return e;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.institutionId) e.institutionId = 'Institution is required';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = async () => {
    const e2 = validateStep2();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }

    setLoading(true);
    setError(null);
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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create faculty. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const e1 = validateStep1();
    if (Object.keys(e1).length > 0) {
      setErrors(e1);
      return;
    }
    setStep(2);
  };

  const canProceedStep1 = () => {
    return form.name.trim() && form.email.trim() && form.password.trim() && form.facultyId.trim();
  };

  const canProceedStep2 = () => {
    return form.institutionId;
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px', padding: 0 }}
        >
          <ChevronLeft size={16} /> Back to Faculty List
        </button>
        <h1 className="ey-title">Register New Faculty</h1>
        <p className="ey-subtitle">Complete the onboarding steps to add a new faculty member to the platform.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px' }}>
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <React.Fragment key={s.id}>
              <div
                onClick={() => isDone && setStep(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: isDone ? 'pointer' : 'default' }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: isActive ? 'var(--accent-color)' : isDone ? 'var(--accent-color)' : 'var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isActive || isDone ? 'white' : 'var(--text-secondary)',
                  fontSize: '14px', fontWeight: 700,
                  transition: 'all 0.2s ease',
                }}>
                  {isDone ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span style={{
                  fontSize: '13px', fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text-primary)' : isDone ? 'var(--accent-color)' : 'var(--text-secondary)',
                }}>
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: '2px', margin: '0 16px',
                  background: step > s.id ? 'var(--accent-color)' : 'var(--border-color)',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div>
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={18} color="var(--accent-color)" /> Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label className="ey-stat-label">Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)' }} />
                  <input name="name" className="ey-input" value={form.name} onChange={handleChange} placeholder="Name" style={{ paddingLeft: '40px', borderColor: errors.name ? 'var(--error)' : undefined }} />
                </div>
                {errors.name && <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="ey-stat-label">Faculty ID <span style={{ color: 'var(--error)' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <BookOpen size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)' }} />
                  <input name="facultyId" className="ey-input" value={form.facultyId} onChange={handleChange} placeholder="ID" style={{ paddingLeft: '40px', borderColor: errors.facultyId ? 'var(--error)' : undefined }} />
                </div>
                {errors.facultyId && <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errors.facultyId}</span>}
              </div>

              <div className="form-group">
                <label className="ey-stat-label">Email Address <span style={{ color: 'var(--error)' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)' }} />
                  <input name="email" type="email" className="ey-input" value={form.email} onChange={handleChange} placeholder="E-mail" style={{ paddingLeft: '40px', borderColor: errors.email ? 'var(--error)' : undefined }} />
                </div>
                {errors.email && <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="ey-stat-label">Password <span style={{ color: 'var(--error)' }}>*</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)' }} />
                  <input name="password" type="password" className="ey-input" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" style={{ paddingLeft: '40px', borderColor: errors.password ? 'var(--error)' : undefined }} />
                </div>
                {errors.password && <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="ey-stat-label">Phone Number</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)' }} />
                  <input name="phone" className="ey-input" value={form.phone} onChange={handleChange} placeholder="10-digit number" style={{ paddingLeft: '40px', borderColor: errors.phone ? 'var(--error)' : undefined }} />
                </div>
                {errors.phone && <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="ey-stat-label">Gender</label>
                <select name="gender" className="ey-input" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="ey-stat-label">Date of Birth</label>
                <input name="dob" type="date" className="ey-input" value={form.dob} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={18} color="var(--accent-color)" /> Academic Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="ey-stat-label">Institution <span style={{ color: 'var(--error)' }}>*</span></label>
                <select name="institutionId" className="ey-input" value={form.institutionId} onChange={handleChange} style={{ borderColor: errors.institutionId ? 'var(--error)' : undefined }}>
                  <option value="">Select institution</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                  ))}
                </select>
                {errors.institutionId && <span style={{ fontSize: '12px', color: 'var(--error)' }}>{errors.institutionId}</span>}
              </div>

              <div className="form-group">
                <label className="ey-stat-label">Department</label>
                <select name="department" className="ey-input" value={form.department} onChange={handleChange}>
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="ey-stat-label">Designation</label>
                <select name="designation" className="ey-input" value={form.designation} onChange={handleChange}>
                  <option value="">Select designation</option>
                  <option value="Dept. Head">Dept. Head</option>
                  <option value="Professor">Professor</option>
                  <option value="Asst.Professor">Asst.Professor</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="ey-stat-label">Specialization</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <BookOpen size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)' }} />
                  <input name="specialization" className="ey-input" value={form.specialization} onChange={handleChange} placeholder="e.g. Machine Learning" style={{ paddingLeft: '40px' }} />
                </div>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '20px', padding: '14px 18px', background: '#FFF0F1', border: '1px solid #FFD0D3', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--error)', fontSize: '13px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          {step > 1 ? (
            <button className="ey-btn-outline" onClick={() => setStep(step - 1)} style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronLeft size={16} /> Previous
            </button>
          ) : (
            <button className="ey-btn-outline" onClick={onBack} style={{ padding: '12px 28px' }}>
              Cancel
            </button>
          )}

          {step < 2 ? (
            <button
              className="ey-btn-primary"
              onClick={handleNext}
              disabled={!canProceedStep1()}
              style={{ padding: '12px 32px', opacity: canProceedStep1() ? 1 : 0.5 }}
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              className="ey-btn-primary"
              onClick={handleSubmit}
              disabled={!canProceedStep2() || loading}
              style={{ padding: '12px 36px', display: 'flex', alignItems: 'center', gap: '8px', opacity: (!canProceedStep2() || loading) ? 0.5 : 1 }}
            >
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Registering...</> : <><Check size={16} /> Register Faculty</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFacultyForm;
