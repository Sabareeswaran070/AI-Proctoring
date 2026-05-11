import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Building, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Plus,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import api from '../../api';
import './ExamModule.css';

const StudentAssignmentModule: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/super-admin/students');
        setStudents(response.data);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="exam-module-container">
      <div className="exam-header">
        <div>
          <h1 className="page-title">Bulk Student Assignment</h1>
          <p className="page-subtitle">Assign examinations to institutions, departments, or specific student groups.</p>
        </div>
        <div className="header-actions">
           <button className="page-btn active" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }}>
             <UserPlus size={18} />
             Assign Exam
           </button>
        </div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 350px' }}>
         <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 className="card-title">Select Targeted Students</h2>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="search-bar" style={{ width: '250px', height: '36px' }}>
                    <Search size={16} color="#99A1AF" />
                    <input type="text" placeholder="Search by name or ID..." />
                  </div>
               </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
               <FilterCard icon={<Building />} title="By Institution" desc="Assign to all students in a college." />
               <FilterCard icon={<Users />} title="By Department" desc="Assign to a specific academic branch." />
               <FilterCard icon={<CheckCircle2 />} title="By Section" desc="Target specific classroom sections." />
            </div>

            <table className="data-table">
               <thead>
                  <tr>
                     <th style={{ width: '40px' }}><input type="checkbox" /></th>
                     <th>Student Name</th>
                     <th>ID</th>
                     <th>Department</th>
                     <th>Institution</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {students.length > 0 ? students.map((s) => (
                    <StudentRow 
                      key={s.id}
                      name={s.name ?? "-"} 
                      id={s.studentId ?? "-"} 
                      dept={s.department ?? "-"} 
                      inst={s.institution?.name ?? "-"} 
                    />
                  )) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>No students found to assign.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Assignment Summary Panel */}
         <div className="card" style={{ height: 'fit-content' }}>
            <h2 className="card-title" style={{ fontSize: '16px', marginBottom: '20px' }}>Assignment Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div className="summary-item">
                  <span className="label">Selected Exam:</span>
                  <span className="value">-</span>
               </div>
               <div className="summary-item">
                  <span className="label">Target Groups:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                     <span style={{ fontSize: '12px', color: '#64748B' }}>None selected</span>
                  </div>
               </div>
               <div className="summary-item">
                  <span className="label">Total Students:</span>
                  <span className="value">0 Students</span>
               </div>
               <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>System Note:</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Students will receive email notifications and dashboard alerts once assigned.</div>
               </div>
               <button className="page-btn active" style={{ 
                  backgroundColor: 'var(--accent-color)', 
                  color: 'white', 
                  borderColor: 'var(--accent-color)',
                  marginTop: '20px',
                  width: '100%',
                  height: '44px'
               }}>
                  Confirm & Assign <ArrowRight size={18} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const FilterCard = ({ icon, title, desc }: any) => (
  <div style={{ 
    padding: '16px', 
    border: '1px solid var(--border-color)', 
    borderRadius: '12px', 
    cursor: 'pointer',
    transition: 'all 0.2s'
  }} className="hover-accent">
    <div style={{ color: 'var(--accent-color)', marginBottom: '8px' }}>{icon}</div>
    <div style={{ fontWeight: 600, fontSize: '14px', color: '#1E293B' }}>{title}</div>
    <div style={{ fontSize: '11px', color: '#64748B' }}>{desc}</div>
  </div>
);

const StudentRow = ({ name, id, dept, inst }: any) => (
  <tr>
    <td><input type="checkbox" /></td>
    <td>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
         <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
            {name ? name.charAt(0) : "?"}
         </div>
         <span style={{ fontWeight: 500 }}>{name}</span>
      </div>
    </td>
    <td>{id}</td>
    <td>{dept}</td>
    <td>{inst}</td>
    <td><ChevronRight size={16} color="#94A3B8" /></td>
  </tr>
);

export default StudentAssignmentModule;

