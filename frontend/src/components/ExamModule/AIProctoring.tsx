import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Eye, 
  AlertTriangle, 
  UserX, 
  Smartphone, 
  Volume2, 
  Copy, 
  Activity,
  History,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import api from '../../api';
import './ExamModule.css';

const AIProctoringSection: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchProctoringData = async () => {
      try {
        const [alertsRes, statsRes] = await Promise.all([
          api.get('/super-admin/proctoring/alerts'),
          api.get('/super-admin/exams/stats') // Reusing stats endpoint for count
        ]);
        setAlerts(alertsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching proctoring data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProctoringData();
  }, []);

  return (
    <div className="exam-module-container">
      <div className="exam-header">
        <div>
          <h1 className="page-title">AI Proctoring & Monitoring</h1>
          <p className="page-subtitle">Real-time suspicious activity detection and violation tracking.</p>
        </div>
        <div className="header-actions">
           <button className="page-btn">
             <History size={18} />
             Violation History
           </button>
           <button className="page-btn active" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }}>
             <Activity size={18} />
             Live Session Monitor
           </button>
        </div>
      </div>

      {/* Monitoring Analytics Grid */}
      <div className="exam-stats-grid">
         <div className="exam-stat-card">
            <div className="stat-info">
               <h3>High Risk Students</h3>
               <div className="stat-value">{stats?.high_risk ?? "-"}</div>
               <p className="stat-change" style={{ color: 'var(--error)' }}>Action required</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#FEF2F2' }}>
               <UserX color="var(--error)" />
            </div>
         </div>
         <div className="exam-stat-card">
            <div className="stat-info">
               <h3>Total Alerts</h3>
               <div className="stat-value">{stats?.alerts ?? "-"}</div>
               <p className="stat-change" style={{ color: 'var(--warning)' }}>All time alerts</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#FFFBEB' }}>
               <Copy color="var(--warning)" />
            </div>
         </div>
         <div className="exam-stat-card">
            <div className="stat-info">
               <h3>Live Sessions</h3>
               <div className="stat-value">{stats?.active ?? "-"}</div>
               <p className="stat-change">Active monitoring</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#F0F9FF' }}>
               <Smartphone color="#0EA5E9" />
            </div>
         </div>
         <div className="exam-stat-card">
            <div className="stat-info">
               <h3>System Integrity</h3>
               <div className="stat-value">99.8%</div>
               <p className="stat-change">Operational</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#F5F3FF' }}>
               <Volume2 color="#8B5CF6" />
            </div>
         </div>
      </div>

      <div className="content-grid">
         {/* Live Monitoring Feed */}
         <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 className="card-title">Live Proctoring Feed</h2>
               <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="status-badge status-live" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#008236', animation: 'pulse 1.5s infinite' }}></div>
                     {stats?.active ?? 0} Active Sessions
                  </span>
               </div>
            </div>
            <div className="proctoring-grid">
               {alerts.length > 0 ? alerts.slice(0, 4).map((alert) => (
                 <ProctorCard 
                    key={alert.id}
                    name={alert.user?.name ?? "-"} 
                    risk={alert.riskScore ?? "-"} 
                    violation={alert.title ?? "-"} 
                    time={new Date(alert.createdAt).toLocaleTimeString() ?? "-"} 
                    severity={alert.type === 'CRITICAL' ? 'high' : 'medium'} 
                 />
               )) : (
                 <div style={{ gridColumn: 'span 2', padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No active proctoring alerts found.</div>
               )}
            </div>
         </div>

         {/* Suspicious Activity Timeline */}
         <div className="card">
            <div className="card-header">
               <h2 className="card-title">Violation Timeline</h2>
               <p className="card-subtitle">Real-time system events</p>
            </div>
            <div className="activity-list">
               {alerts.length > 0 ? alerts.map((alert) => (
                 <TimelineItem 
                    key={alert.id}
                    title={alert.title ?? "-"} 
                    user={alert.user?.name ?? "-"} 
                    time={new Date(alert.createdAt).toLocaleTimeString() ?? "-"} 
                    desc={alert.desc ?? "-"} 
                    type={alert.type === 'CRITICAL' ? 'error' : 'warning'}
                 />
               )) : (
                 <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>Timeline is empty.</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

const ProctorCard = ({ name, risk, violation, time, severity }: any) => (
  <div className={`alert-card alert-${severity}`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
       <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Eye size={20} color="#64748B" />
       </div>
       <MoreVertical size={16} color="#94A3B8" />
    </div>
    <div style={{ fontWeight: 600, fontSize: '15px', color: '#1E293B' }}>{name}</div>
    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>Risk Score: <span style={{ fontWeight: 700, color: severity === 'high' ? 'var(--error)' : severity === 'medium' ? 'var(--warning)' : 'var(--success)' }}>{risk}</span></div>
    
    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.5)', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
       <div style={{ fontWeight: 600, color: '#475569' }}>Last Violation:</div>
       <div style={{ color: severity === 'high' ? 'var(--error)' : '#64748B' }}>{violation} ({time})</div>
    </div>
    
    <button style={{ 
      width: '100%', 
      padding: '8px', 
      borderRadius: '6px', 
      border: '1px solid',
      borderColor: severity === 'high' ? 'var(--error)' : '#E2E8F0',
      background: severity === 'high' ? 'var(--error)' : 'white',
      color: severity === 'high' ? 'white' : '#475569',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px'
    }}>
       <ExternalLink size={14} /> View Live Feed
    </button>
  </div>
);

const TimelineItem = ({ title, user, time, desc, type }: any) => (
  <div className="activity-item">
    <div className="activity-icon" style={{ backgroundColor: type === 'error' ? '#FEF2F2' : type === 'warning' ? '#FFFBEB' : '#F0F9FF' }}>
       <AlertTriangle size={14} color={type === 'error' ? 'var(--error)' : type === 'warning' ? 'var(--warning)' : '#0EA5E9'} />
    </div>
    <div className="activity-content">
       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>{title} - {user}</span>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>{time}</span>
       </div>
       <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{desc}</p>
    </div>
  </div>
);

export default AIProctoringSection;

