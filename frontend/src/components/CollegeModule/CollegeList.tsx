import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Building2, 
  MapPin, 
  Globe, 
  Calendar,
  ChevronRight,
  Download,
  Trash2,
  Edit,
  Eye,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import api from '../../api';
import './CollegeModule.css';

interface College {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  plan: string;
  usersCount?: number;
  examsCount?: number;
  logo?: string;
}

interface CollegeListProps {
  onAdd: () => void;
  onView: (id: string) => void;
}

const CollegeList: React.FC<CollegeListProps> = ({ onAdd, onView }) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await api.get('/super-admin/institutions', {
          params: { search, status: statusFilter !== 'ALL' ? statusFilter : undefined }
        });
        setColleges(response.data);
      } catch (err) {
        console.error('Failed to fetch colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [search, statusFilter]);

  return (
    <div className="college-list-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="ey-title">Institution Management</h1>
          <p className="ey-subtitle">Manage and monitor affiliated colleges and universities across the platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="ey-btn-outline"><Download size={16} /> Export</button>
          <button className="ey-btn-primary" onClick={onAdd}><Plus size={16} /> Register Institution</button>
        </div>
      </div>

      <div className="ey-card" style={{ padding: '16px', marginBottom: '24px', borderLeft: '4px solid var(--accent-color)' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="ey-input" 
              placeholder="Search by Institution Name, Code or City..." 
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="ey-input" style={{ width: '200px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="ey-table">
          <thead>
            <tr>
              <th>Institution</th>
              <th>Location</th>
              <th>Stats</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i}>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading Institutions...</td>
                </tr>
              ))
            ) : colleges.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)' }}>
                  <Building2 size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>No institutions found matching your criteria.</p>
                </td>
              </tr>
            ) : (
              colleges.map((college) => (
                <tr key={college.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                        {college.logo ? <img src={college.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building2 size={20} color="var(--text-secondary)" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{college.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Code: {college.code}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <MapPin size={14} />
                      {college.city}, {college.state}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      <span style={{ fontWeight: 600 }}>{(college as any)._count?.users || 0}</span> Students
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{(college as any)._count?.exams || 0} Exams</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="var(--accent-color)" />
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{college.plan}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`ey-badge ${(college.status || 'ACTIVE').toLowerCase()}`}>{college.status || 'ACTIVE'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="ey-btn-outline" style={{ padding: '8px' }} onClick={() => onView(college.id)}><Eye size={16} /></button>
                      <button className="ey-btn-outline" style={{ padding: '8px', color: 'var(--error)', borderColor: 'var(--border-color)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Showing <b>{colleges.length}</b> institutions</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ey-btn-outline" disabled style={{ padding: '8px 16px' }}>Prev</button>
          <button className="ey-btn-primary" style={{ padding: '8px 16px' }}>1</button>
          <button className="ey-btn-outline" style={{ padding: '8px 16px' }}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default CollegeList;
