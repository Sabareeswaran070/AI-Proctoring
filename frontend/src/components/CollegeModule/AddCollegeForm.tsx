import React, { useState } from 'react';
import {
  ChevronLeft,
  Building2,
  Globe,
  Shield,
  Check,
  Upload,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../../api';
import './CollegeModule.css';

interface AddCollegeFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const STEPS = [
  { id: 1, label: 'Basic Information',      icon: Building2 },
  { id: 2, label: 'Contact & Location',     icon: Globe     },
  { id: 3, label: 'Subscription & Branding', icon: Shield   },
];

const AddCollegeForm: React.FC<AddCollegeFormProps> = ({ onBack, onSuccess }) => {
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', code: '', type: 'UNIVERSITY', affiliation: '', accreditation: '',
    email: '', phone: '', website: '', address: '', city: '', state: '',
    country: 'India', pincode: '', plan: 'PREMIUM', expiryDate: '', status: 'ACTIVE',
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getCreateErrorMessage = (err: unknown) => {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const response = err as { response?: { data?: { detail?: unknown } } };
      if (typeof response.response?.data?.detail === 'string') {
        return response.response.data.detail;
      }
    }

    return 'Error creating institution. Please check the details.';
  };

  const buildPayload = () => {
    const payload: Record<string, string> = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      type: formData.type,
      plan: formData.plan,
    };

    const optionalFields: Array<keyof typeof formData> = [
      'affiliation',
      'accreditation',
      'email',
      'phone',
      'website',
      'address',
      'city',
      'state',
      'country',
      'pincode',
      'expiryDate',
    ];

    optionalFields.forEach((field) => {
      const value = formData[field].trim();
      if (value) {
        payload[field] = value;
      }
    });

    return payload;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/super-admin/institutions/', buildPayload());
      onSuccess();
    } catch (err) {
      setError(getCreateErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.name.trim() && formData.code.trim();
    return true;
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px', padding: 0 }}
        >
          <ChevronLeft size={16} /> Back to Institutions
        </button>
        <h1 className="ey-title">Register New Institution</h1>
        <p className="ey-subtitle">Complete the 3-step onboarding to add a new college or university to the platform.</p>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px' }}>
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone   = step > s.id;
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

      {/* Form Content */}
      <div>

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={18} color="var(--accent-color)" /> Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label className="ey-stat-label">Institution Name <span style={{ color: 'var(--error)' }}>*</span></label>
                <input type="text" name="name" className="ey-input" placeholder="e.g. Anna University" value={formData.name} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="ey-stat-label">Institution Code <span style={{ color: 'var(--error)' }}>*</span></label>
                <input type="text" name="code" className="ey-input" placeholder="e.g. AU-CEG-001" value={formData.code} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="ey-stat-label">Institution Type</label>
                <select name="type" className="ey-input" value={formData.type} onChange={handle}>
                  <option value="UNIVERSITY">University</option>
                  <option value="ENGINEERING">Engineering College</option>
                  <option value="MEDICAL">Medical College</option>
                  <option value="ARTS_SCIENCE">Arts &amp; Science</option>
                  <option value="POLYTECHNIC">Polytechnic</option>
                </select>
              </div>
              <div className="form-group">
                <label className="ey-stat-label">University Affiliation</label>
                <input type="text" name="affiliation" className="ey-input" placeholder="e.g. Anna University" value={formData.affiliation} onChange={handle} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="ey-stat-label">Accreditations</label>
                <input type="text" name="accreditation" className="ey-input" placeholder="e.g. NAAC A++, NBA, ISO 9001" value={formData.accreditation} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="ey-stat-label">Initial Status</label>
                <select name="status" className="ey-input" value={formData.status} onChange={handle}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label className="ey-stat-label">Website</label>
                <input type="url" name="website" className="ey-input" placeholder="https://university.edu" value={formData.website} onChange={handle} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={18} color="var(--accent-color)" /> Contact &amp; Location
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label className="ey-stat-label">Official Email</label>
                <input type="email" name="email" className="ey-input" placeholder="admin@university.edu" value={formData.email} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="ey-stat-label">Phone Number</label>
                <input type="text" name="phone" className="ey-input" placeholder="+91 98765 43210" value={formData.phone} onChange={handle} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="ey-stat-label">Full Campus Address</label>
                <textarea name="address" className="ey-input" rows={3} placeholder="Street, Area, Campus name..." value={formData.address} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="ey-stat-label">City</label>
                <input type="text" name="city" className="ey-input" value={formData.city} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="ey-stat-label">State</label>
                <input type="text" name="state" className="ey-input" value={formData.state} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="ey-stat-label">Country</label>
                <input type="text" name="country" className="ey-input" value={formData.country} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="ey-stat-label">Pincode</label>
                <input type="text" name="pincode" className="ey-input" value={formData.pincode} onChange={handle} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={18} color="var(--accent-color)" /> Subscription &amp; Branding
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label className="ey-stat-label">Subscription Plan</label>
                <select name="plan" className="ey-input" value={formData.plan} onChange={handle}>
                  <option value="BASIC">Standard Enterprise</option>
                  <option value="PREMIUM">Premium University Suite</option>
                  <option value="CUSTOM">Custom Institutional Plan</option>
                </select>
              </div>
              <div className="form-group">
                <label className="ey-stat-label">Contract Expiry Date</label>
                <input type="date" name="expiryDate" className="ey-input" value={formData.expiryDate} onChange={handle} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="ey-stat-label">Institution Logo</label>
                <div style={{
                  border: '2px dashed var(--border-color)', borderRadius: '12px',
                  padding: '48px', textAlign: 'center', background: 'var(--bg-main)', cursor: 'pointer',
                }}>
                  <Upload size={28} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>
                    Click to upload or drag and drop
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PNG, JPG up to 2MB</p>
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

        {/* Navigation */}
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

          {step < 3 ? (
            <button
              className="ey-btn-primary"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              style={{ padding: '12px 32px', opacity: canProceed() ? 1 : 0.5 }}
            >
              Continue →
            </button>
          ) : (
            <button
              className="ey-btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ padding: '12px 36px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Registering…</>
                : <><Check size={16} /> Complete Registration</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCollegeForm;
