import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Building2, Loader2, CheckCircle2, AlertCircle, Users, BookOpen, ChevronDown } from 'lucide-react';
import api from '../../api';
import AddDepartmentForm from './AddDepartmentForm';
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

interface Institution {
  id: string;
  name: string;
  code: string;
}

interface DepartmentManagementProps {
  institutionId?: string;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ institutionId: propInstitutionId }) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>(propInstitutionId ?? '');
  const [loadingInstitutions, setLoadingInstitutions] = useState(!propInstitutionId);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const activeInstitutionId = propInstitutionId ?? selectedInstitutionId;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Fetch institution list when no institutionId is given as prop
  useEffect(() => {
    if (propInstitutionId) return;
    const fetchInstitutions = async () => {
      setLoadingInstitutions(true);
      try {
        const response = await api.get('/super-admin/institutions/');
        setInstitutions(response.data);
        if (response.data.length > 0) {
          setSelectedInstitutionId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch institutions:', err);
      } finally {
        setLoadingInstitutions(false);
      }
    };
    fetchInstitutions();
  }, [propInstitutionId]);

  const fetchDepartments = useCallback(async (instId: string) => {
    setLoading(true);
    setDepartments([]);
    try {
      const response = await api.get(`/super-admin/institutions/${instId}/departments`);
      setDepartments(response.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      showToast('Could not load departments. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeInstitutionId) {
      fetchDepartments(activeInstitutionId);
    }
  }, [activeInstitutionId, fetchDepartments]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const handleAddSuccess = (newDept: Department) => {
    setDepartments((prev) => [...prev, newDept]);
    setShowForm(false);
    showToast(`"${newDept.name}" department created successfully.`);
  };

  const handleDelete = async (dept: Department) => {
    if (!window.confirm(`Delete department "${dept.name}"? This action cannot be undone.`)) return;
    setDeletingId(dept.id);
    try {
      await api.delete(`/super-admin/institutions/${activeInstitutionId}/departments/${dept.id}`);
      setDepartments((prev) => prev.filter((d) => d.id !== dept.id));
      showToast(`"${dept.name}" deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete department:', err);
      showToast('Failed to delete department. Please try again.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const selectedInstitution = institutions.find((i) => i.id === activeInstitutionId);

  return (
    <div className="dept-management">
      {/* Toast */}
      {toast && (
        <div
          className="college-toast"
          role="status"
          aria-live="polite"
          style={toast.type === 'error' ? {
            background: '#FFF0F1',
            color: 'var(--error)',
            border: '1px solid #FFD0D3',
            boxShadow: '0 12px 32px rgba(251, 44, 54, 0.12)',
          } : {}}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="ey-title">Department Management</h2>
          <p className="ey-subtitle">Organize and manage academic departments and their administrative leads.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Institution Selector (only when no prop institutionId) */}
          {!propInstitutionId && (
            <div style={{ position: 'relative' }}>
              {loadingInstitutions ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-secondary)', background: 'var(--bg-light)' }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading institutions…
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <select
                    className="ey-input"
                    style={{ paddingRight: '36px', minWidth: '220px', appearance: 'none', cursor: 'pointer' }}
                    value={selectedInstitutionId}
                    onChange={(e) => setSelectedInstitutionId(e.target.value)}
                    aria-label="Select institution"
                  >
                    {institutions.length === 0 && (
                      <option value="">No institutions available</option>
                    )}
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}
                  />
                </div>
              )}
            </div>
          )}
          <button
            className="ey-btn-primary"
            onClick={() => setShowForm(true)}
            disabled={!activeInstitutionId}
          >
            <Plus size={16} /> Add New Department
          </button>
        </div>
      </div>

      {/* Institution context label */}
      {!propInstitutionId && selectedInstitution && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '10px 16px', background: 'var(--bg-light)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Building2 size={15} color="var(--accent-color)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedInstitution.name}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>— {selectedInstitution.code}</span>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>{departments.length} department{departments.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* No institution selected */}
      {!activeInstitutionId && !loadingInstitutions && (
        <div className="ey-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <Building2 size={48} style={{ opacity: 0.1, marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px', color: 'var(--text-primary)' }}>No Institution Available</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Please register an institution first before managing departments.
          </p>
        </div>
      )}

      {/* Loading departments */}
      {activeInstitutionId && loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '80px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading departments…
        </div>
      )}

      {/* Empty State */}
      {activeInstitutionId && !loading && departments.length === 0 && (
        <div className="ey-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <Building2 size={48} style={{ opacity: 0.1, marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px', color: 'var(--text-primary)' }}>No Departments Yet</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Add your first department to start organizing faculty and students.
          </p>
          <button className="ey-btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add First Department
          </button>
        </div>
      )}

      {/* Department Grid */}
      {activeInstitutionId && !loading && departments.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              deleting={deletingId === dept.id}
              onDelete={() => handleDelete(dept)}
            />
          ))}
        </div>
      )}

      {/* Add Department Form Modal */}
      {showForm && activeInstitutionId && (
        <AddDepartmentForm
          institutionId={activeInstitutionId}
          onSuccess={handleAddSuccess}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

interface DepartmentCardProps {
  dept: Department;
  deleting: boolean;
  onDelete: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ dept, deleting, onDelete }) => {
  const initials = dept.hod?.name
    ? dept.hod.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="ey-card">
      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{
          width: '48px', height: '48px',
          background: 'var(--accent-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '12px', color: 'white',
        }}>
          <Building2 size={24} />
        </div>
        <button
          onClick={onDelete}
          disabled={deleting}
          aria-label={`Delete ${dept.name}`}
          style={{
            background: 'none', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer',
            color: 'var(--error)', padding: '4px', borderRadius: '6px',
            opacity: deleting ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {deleting
            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            : <Trash2 size={16} />
          }
        </button>
      </div>

      {/* Name & Code */}
      <h4 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '2px', color: 'var(--text-primary)' }}>
        {dept.name}
      </h4>
      {dept.code ? (
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          CODE: {dept.code}
        </p>
      ) : (
        <div style={{ marginBottom: '20px' }} />
      )}

      {/* HOD */}
      <div style={{ background: 'var(--bg-main)', padding: '14px 16px', marginBottom: '20px', borderRadius: '8px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '10px' }}>
          Head of Department
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: dept.hod ? 'var(--accent-color)' : 'var(--border-color)',
            color: dept.hod ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '12px', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ fontWeight: 600, fontSize: '13px', color: dept.hod ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {dept.hod?.name || 'Not Assigned'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <StatChip icon={<Users size={14} />} label="Students" value={dept.studentsCount} />
        <StatChip icon={<BookOpen size={14} />} label="Faculty" value={dept.facultyCount} />
      </div>
    </div>
  );
};

const StatChip: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div style={{ flex: 1, background: 'var(--bg-light)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '4px' }}>
      {icon} {label}
    </div>
    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

export default DepartmentManagement;
