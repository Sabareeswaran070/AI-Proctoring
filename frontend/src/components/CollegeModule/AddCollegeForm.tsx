import React, { useState } from 'react';
import { Upload, Check, ChevronRight, ChevronLeft, Building2, Globe, Shield } from 'lucide-react';
import api from '../../api';
import './CollegeModule.css';

interface AddCollegeFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddCollegeForm: React.FC<AddCollegeFormProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'UNIVERSITY',
    affiliation: '',
    accreditation: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    plan: 'PREMIUM',
    expiryDate: '',
    status: 'ACTIVE'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/super-admin/institutions', formData);
      onSuccess();
    } catch (err) {
      console.error('Failed to create institution:', err);
      alert('Error creating institution. Please check the details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-college-form-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} className="ey-btn-outline" style={{ border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeft size={16} /> Back to Institution List
        </button>
      </div>

      <div className="ey-card" style={{ maxWidth: '900px', margin: '0 auto', borderTop: '6px solid var(--accent-color)' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="ey-title">Register New Institution</h2>
            <p className="ey-subtitle">Complete the 3-step onboarding process to register a new college or university.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>STEP {step} OF 3</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ width: '20px', height: '4px', background: step >= s ? 'var(--accent-color)' : 'var(--border-color)', borderRadius: '2px' }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-body">
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={18} color="var(--accent-color)" /></div>
                Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="ey-stat-label">Institution Name *</label>
                  <input type="text" name="name" className="ey-input" placeholder="e.g. Stanford University" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="ey-stat-label">Institution Code *</label>
                  <input type="text" name="code" className="ey-input" placeholder="e.g. STAN-001" value={formData.code} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="ey-stat-label">Institution Type</label>
                  <select name="type" className="ey-input" value={formData.type} onChange={handleChange}>
                    <option value="UNIVERSITY">University</option>
                    <option value="ENGINEERING">Engineering College</option>
                    <option value="MEDICAL">Medical College</option>
                    <option value="ARTS_SCIENCE">Arts & Science</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="ey-stat-label">University Affiliation</label>
                  <input type="text" name="affiliation" className="ey-input" placeholder="e.g. Global Tech University" value={formData.affiliation} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="ey-stat-label">Accreditations (NAAC, ABET, etc.)</label>
                  <input type="text" name="accreditation" className="ey-input" placeholder="e.g. NAAC A++, ISO 9001" value={formData.accreditation} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={18} color="var(--accent-color)" /></div>
                Contact & Location
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="ey-stat-label">Official Email</label>
                  <input type="email" name="email" className="ey-input" placeholder="admin@university.edu" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="ey-stat-label">Phone Number</label>
                  <input type="text" name="phone" className="ey-input" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="ey-stat-label">Address</label>
                  <textarea name="address" className="ey-input" rows={3} placeholder="Full campus address..." value={formData.address} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                  <label className="ey-stat-label">City</label>
                  <input type="text" name="city" className="ey-input" value={formData.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="ey-stat-label">Pincode</label>
                  <input type="text" name="pincode" className="ey-input" value={formData.pincode} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={18} color="var(--accent-color)" /></div>
                Subscription & Branding
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="form-group">
                  <label className="ey-stat-label">Subscription Plan</label>
                  <select name="plan" className="ey-input" value={formData.plan} onChange={handleChange}>
                    <option value="BASIC">Standard Enterprise</option>
                    <option value="PREMIUM">Premium University Suite</option>
                    <option value="CUSTOM">Custom Institutional Plan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="ey-stat-label">Contract Expiry Date</label>
                  <input type="date" name="expiryDate" className="ey-input" value={formData.expiryDate} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="ey-stat-label">Institution Logo</label>
                  <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '48px', textAlign: 'center', background: 'var(--bg-main)' }}>
                    <Upload size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>Click to upload or drag and drop</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          {step > 1 ? (
            <button className="ey-btn-outline" onClick={() => setStep(step - 1)} style={{ padding: '12px 24px' }}><ChevronLeft size={18} /> Previous Step</button>
          ) : (
            <button className="ey-btn-outline" onClick={onBack} style={{ padding: '12px 24px' }}>Cancel Registration</button>
          )}
          {step < 3 ? (
            <button className="ey-btn-primary" onClick={() => setStep(step + 1)} style={{ padding: '12px 24px' }}>Next Step <ChevronRight size={18} /></button>
          ) : (
            <button className="ey-btn-primary" onClick={handleSubmit} disabled={loading} style={{ padding: '12px 32px' }}>
              {loading ? 'Processing...' : <><Check size={18} /> Complete Onboarding</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCollegeForm;
