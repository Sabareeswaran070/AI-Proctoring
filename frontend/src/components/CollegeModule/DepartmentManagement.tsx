import React, { useState } from 'react';
import { Plus, Users, User, Trash2, Edit, Building2 } from 'lucide-react';
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
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Alan Turing', students: 450, faculty: 24 },
    { id: '2', name: 'Mechanical Engineering', code: 'MECH', hod: 'Dr. James Watt', students: 320, faculty: 18 },
    { id: '3', name: 'Electrical & Electronics', code: 'EEE', hod: 'Dr. Nikola Tesla', students: 280, faculty: 15 }
  ]);

  return (
    <div className="dept-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 className="ey-title">Department Management</h2>
          <p className="ey-subtitle">Organize and manage academic departments and their administrative leads.</p>
        </div>
        <button className="ey-btn-primary"><Plus size={16} /> Add New Department</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {departments.map(dept => (
          <div key={dept.id} className="ey-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', color: 'white' }}>
                <Building2 size={24} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit size={16} /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 style={{ fontWeight: 600, fontSize: '18px', marginBottom: '4px', color: 'var(--text-primary)' }}>{dept.name}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>DEPT CODE: {dept.code}</p>
            
            <div style={{ background: 'var(--bg-main)', padding: '16px', marginBottom: '20px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '8px' }}>Head of Department</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px' }}>
                  {dept.hod.split(' ').pop()?.charAt(0)}
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{dept.hod}</div>
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
    </div>
  );
};

export default DepartmentManagement;
