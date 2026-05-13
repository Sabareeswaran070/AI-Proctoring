import React, { useState } from 'react';
import { X, Building2, AlertCircle, Loader2, Check } from 'lucide-react';
import api from '../../api';
import './CollegeModule.css';

interface Department {
  id: string;
  name: string;
  code: string | null;
  institutionId: string;
  hodId: string | null;
  hod?: { id: string; name: string } | null;
  studentsCount: number;
  facultyCount: number;
  createdAt: string;
}

interface AddDepartmentFormProps {
  institutionId: string;
  onSuccess: (dept: Department) => void;
  onClose: () => void;
}

const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({ institutionId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({ name: '', code: '', hodId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const getErrorMessage = (err: unknown): string => {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const response = err as { response?: { data?: { detail?: unknown } } };
      if (typeof response.response?.data?.detail === 'string') {
        return response.response.data.detail;
      }
    }
    return 'Failed to create department. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Department name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload: Record<string, string> = { name: formData.name.trim() };
    if (formData.code.trim()) payload.code = formData.code.trim();
    if (formData.hodId.trim()) payload.hodId = formData.hodId.trim();

    try {
      const response = await api.post(`/super-admin/institutions/${institutionId}/departments`, payload);
      onSuccess(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = formData.name.trim().length > 0 && !loading;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="ey-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          animation: 'fadeIn 0.25s ease',
          transform: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', background: '#FFFBEB',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--accent-color)',
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', margin: 0 }}>
                Add New Department
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Create a department for this institution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '6px' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Department Name */}
            <div className="form-group">
              <label className="ey-stat-label" style={{ display: 'block', marginBottom: '6px' }}>
                Department Name <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                className="ey-input"
                placeholder="e.g. Computer Science & Engineering"
                value={formData.name}
                onChange={handle}
                autoFocus
                disabled={loading}
              />
            </div>

            {/* Department Code */}
            <div className="form-group">
              <label className="ey-stat-label" style={{ display: 'block', marginBottom: '6px' }}>
                Department Code <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="text"
                name="code"
                className="ey-input"
                placeholder="e.g. CSE, MECH, ECE"
                value={formData.code}
                onChange={handle}
                disabled={loading}
              />
            </div>

            {/* HOD (by User ID) */}
            <div className="form-group">
              <label className="ey-stat-label" style={{ display: 'block', marginBottom: '6px' }}>
                Head of Department (HOD) User ID <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="text"
                name="hodId"
                className="ey-input"
                placeholder="Paste faculty user ID"
                value={formData.hodId}
                onChange={handle}
                disabled={loading}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Leave blank to assign an HOD later.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div style={{
                padding: '12px 16px',
                background: '#FFF0F1',
                border: '1px solid #FFD0D3',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--error)',
                fontSize: '13px',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border-color)', margin: '28px 0 24px' }} />

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="ey-btn-outline"
              onClick={onClose}
              disabled={loading}
              style={{ padding: '11px 24px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ey-btn-primary"
              disabled={!canSubmit}
              style={{ padding: '11px 28px', opacity: canSubmit ? 1 : 0.6 }}
            >
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating…</>
              ) : (
                <><Check size={16} /> Create Department</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentForm;
