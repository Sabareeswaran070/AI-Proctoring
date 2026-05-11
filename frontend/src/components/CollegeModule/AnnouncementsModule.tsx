import React, { useState } from 'react';
import { Send, Bell, User, Building, Trash2, Megaphone, Clock } from 'lucide-react';
import './CollegeModule.css';

const AnnouncementsModule: React.FC = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Annual System Maintenance', target: 'ALL', content: 'The AI Proctoring system will be down for maintenance on Sunday from 2 AM to 6 AM UTC.', date: '2026-05-10' },
    { id: 2, title: 'New Coding Exam Features', target: 'FACULTY', content: 'We have added support for Python 3.12 and C++ 20 in the coding assessment module.', date: '2026-05-08' },
    { id: 3, title: 'Spring Semester Exam Schedule', target: 'STUDENTS', content: 'Final exam schedules for the Spring 2026 semester have been published.', date: '2026-05-05' }
  ]);

  return (
    <div className="announcements-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 className="ey-title">Communication Center</h2>
          <p className="ey-subtitle">Broadcast announcements and notifications across institutions and user roles.</p>
        </div>
        <button className="ey-btn-primary"><Send size={16} /> Create Announcement</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        <div className="ey-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '14px', marginBottom: '24px' }}>Send New Message</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="ey-stat-label">Subject</label>
              <input type="text" className="ey-input" placeholder="Enter title..." />
            </div>
            <div className="form-group">
              <label className="ey-stat-label">Target Audience</label>
              <select className="ey-input">
                <option>All Users</option>
                <option>College Admins Only</option>
                <option>Faculty Only</option>
                <option>Students Only</option>
              </select>
            </div>
            <div className="form-group">
              <label className="ey-stat-label">Message Content</label>
              <textarea className="ey-input" rows={5} placeholder="Type your message here..."></textarea>
            </div>
            <button className="ey-btn-primary" style={{ width: '100%' }}>Broadcast Now</button>
          </div>
        </div>

        <div className="ey-card">
          <h3 style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '14px', marginBottom: '24px' }}>Broadcast History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {announcements.map(ann => (
              <div key={ann.id} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Megaphone size={16} color="var(--accent-color)" />
                    <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{ann.title}</span>
                  </div>
                  <span className="ey-badge" style={{ background: 'var(--text-primary)', color: 'white' }}>{ann.target}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>{ann.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Clock size={12} /> Sent on {ann.date}
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsModule;
