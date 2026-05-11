import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Edit, 
  ExternalLink,
  Users,
  FileText,
  Clock,
  ChevronLeft,
  Settings,
  MoreVertical
} from 'lucide-react';
import api from '../../api';
import './CollegeModule.css';

interface CollegeProfileProps {
  id: string;
  onBack: () => void;
}

const CollegeProfile: React.FC<CollegeProfileProps> = ({ id, onBack }) => {
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await api.get(`/super-admin/institutions/${id}`);
        setCollege(response.data);
      } catch (err) {
        console.error('Failed to fetch college profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Institutional Profile...</div>;
  if (!college) return <div style={{ padding: '40px', textAlign: 'center' }}>Institution not found.</div>;

  return (
    <div className="college-profile-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} className="ey-btn-outline" style={{ border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeft size={16} /> Back to Institution List
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="ey-btn-outline"><Settings size={16} /> Configuration</button>
          <button className="ey-btn-primary"><Edit size={16} /> Edit Profile</button>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '100px' }}>
        <div style={{ height: '200px', background: college.banner ? `url(${college.banner})` : 'var(--text-primary)', borderRadius: '12px', backgroundSize: 'cover' }}></div>
        <div style={{ position: 'absolute', left: '32px', bottom: '-60px', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            background: 'var(--card-bg)', 
            border: '4px solid var(--card-bg)', 
            boxShadow: 'var(--shadow)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {college.logo ? <img src={college.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Building2 size={48} color="var(--text-secondary)" />}
          </div>
          <div style={{ paddingBottom: '10px' }}>
            <h1 className="ey-title" style={{ marginBottom: '4px' }}>{college.name}</h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {college.city}, {college.state}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Globe size={14} /> {college.website || 'No website'}</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '32px', bottom: '-10px' }}>
           <span className={`ey-badge ${(college.status || 'ACTIVE').toLowerCase()}`}>{college.status || 'ACTIVE'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="ey-card">
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} /> Institutional Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <InfoField label="University Code" value={college.code} />
              <InfoField label="Institution Type" value={college.type} />
              <InfoField label="Affiliation" value={college.affiliation} />
              <InfoField label="Accreditation" value={college.accreditation} />
              <InfoField label="Contact Email" value={college.email} />
              <InfoField label="Contact Phone" value={college.phone} />
              <InfoField label="Full Address" value={college.address} fullWidth />
            </div>
          </div>

          <div className="ey-card">
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Department Overview</h3>
            <table className="ey-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>HOD</th>
                  <th>Students</th>
                  <th>Faculty</th>
                </tr>
              </thead>
              <tbody>
                {college.departments?.length > 0 ? college.departments.map((dept: any) => (
                  <tr key={dept.id}>
                    <td style={{ fontWeight: 600 }}>{dept.name}</td>
                    <td>{dept.hodName || 'Not Assigned'}</td>
                    <td>{dept.studentsCount}</td>
                    <td>{dept.facultyCount}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No departments configured.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="ey-card" style={{ borderTop: '4px solid var(--accent-color)' }}>
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="var(--accent-color)" /> Subscription Details
            </h3>
            <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)' }}>Active Plan</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{college.plan}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Contract Start:</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{new Date(college.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Next Billing:</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{college.expiryDate ? new Date(college.expiryDate).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            <button className="ey-btn-primary" style={{ width: '100%', marginTop: '20px' }}>Manage Subscription</button>
          </div>

          <div className="ey-card">
            <h3 style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <StatRow icon={<Users size={18} />} label="Total Registered" value={college._count?.users || 0} />
              <StatRow icon={<FileText size={18} />} label="Total Exams" value={college._count?.exams || 0} />
              <StatRow icon={<Clock size={18} />} label="Proctoring Hours" value="N/A" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value, fullWidth }: any) => (
  <div style={{ gridColumn: fullWidth ? 'span 2' : 'span 1' }}>
    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '14px', fontWeight: 500 }}>{value || '---'}</div>
  </div>
);

const StatRow = ({ icon, label, value }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ width: '36px', height: '36px', background: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: 700 }}>{value}</div>
    </div>
  </div>
);

export default CollegeProfile;
