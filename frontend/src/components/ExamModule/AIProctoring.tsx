import React from 'react';
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
import './ExamModule.css';

const AIProctoringSection: React.FC = () => {
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
               <div className="stat-value">08</div>
               <p className="stat-change" style={{ color: 'var(--error)' }}>Action required</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#FEF2F2' }}>
               <UserX color="var(--error)" />
            </div>
         </div>
         <div className="exam-stat-card">
            <div className="stat-info">
               <h3>Tab Switch Alerts</h3>
               <div className="stat-value">124</div>
               <p className="stat-change" style={{ color: 'var(--warning)' }}>Last 24 hours</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#FFFBEB' }}>
               <Copy color="var(--warning)" />
            </div>
         </div>
         <div className="exam-stat-card">
            <div className="stat-info">
               <h3>Mobile Detection</h3>
               <div className="stat-value">14</div>
               <p className="stat-change">Object AI flagged</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#F0F9FF' }}>
               <Smartphone color="#0EA5E9" />
            </div>
         </div>
         <div className="exam-stat-card">
            <div className="stat-info">
               <h3>Noise Violation</h3>
               <div className="stat-value">32</div>
               <p className="stat-change">Threshold exceeded</p>
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
                     86 Active Sessions
                  </span>
               </div>
            </div>
            <div className="proctoring-grid">
               <ProctorCard name="James Wilson" risk="92%" violation="Mobile Detected" time="02:14" severity="high" />
               <ProctorCard name="Sarah Chen" risk="74%" violation="Multiple Persons" time="05:30" severity="high" />
               <ProctorCard name="Michael Ross" risk="45%" violation="Tab Switched" time="12:05" severity="medium" />
               <ProctorCard name="Emma Watson" risk="12%" violation="None" time="45:00" severity="low" />
            </div>
         </div>

         {/* Suspicious Activity Timeline */}
         <div className="card">
            <div className="card-header">
               <h2 className="card-title">Violation Timeline</h2>
               <p className="card-subtitle">Real-time system events</p>
            </div>
            <div className="activity-list">
               <TimelineItem 
                  title="Mobile Detected" 
                  user="James Wilson" 
                  time="Just now" 
                  desc="Object detection model flagged smartphone in frame." 
                  type="error"
               />
               <TimelineItem 
                  title="Face Not Found" 
                  user="Robert Fox" 
                  time="2 mins ago" 
                  desc="User went out of camera frame for 15 seconds." 
                  type="warning"
               />
               <TimelineItem 
                  title="Noise Alert" 
                  user="Alice Smith" 
                  time="5 mins ago" 
                  desc="Ambient noise exceeded 75dB threshold." 
                  type="info"
               />
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
