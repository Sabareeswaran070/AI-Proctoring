import React, { useState } from 'react';
import { Plus, Trash2, Edit, Building2 } from 'lucide-react';
import './CollegeModule.css';

interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  students: number;
  faculty: number;
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  return (
    <div className="dept-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 className="ey-title">Department Management</h2>
          <p className="ey-subtitle">Organize and manage academic departments and their administrative leads.</p>
        </div>
        <button className="ey-btn-primary"><Plus size={16} /> Add New Department</button>
      </div>

      {departments.length === 0 ? (
        <div className="ey-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <Building2 size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
          <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>No Departments Yet</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Add your first department to start organizing faculty and students.
          </p>
          <button className="ey-btn-primary"><Plus size={16} /> Add First Department</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {departments.map(dept => (
            <div key={dept.id} className="ey-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', color: 'white' }}>
                  <Building2 size={24} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit size={16} /></button>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}
                    onClick={() => setDepartments(prev => prev.filter(d => d.id !== dept.id))}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 style={{ fontWeight: 600, fontSize: '18px', marginBottom: '4px', color: 'var(--text-primary)' }}>{dept.name}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>DEPT CODE: {dept.code}</p>

              <div style={{ background: 'var(--bg-main)', padding: '16px', marginBottom: '20px', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '8px' }}>Head of Department</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px' }}>
                    {dept.hod ? dept.hod.split(' ').pop()?.charAt(0) : '?'}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{dept.hod || 'Not Assigned'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Students</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{dept.students}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Faculty</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{dept.faculty}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
