import React, { useState } from 'react';
import { Send, Trash2, Megaphone, Clock, Bell } from 'lucide-react';
import './CollegeModule.css';

interface Announcement {
  id: number;
  title: string;
  target: string;
  content: string;
  date: string;
}

const AnnouncementsModule: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subject, setSubject] = useState('');
  const [target, setTarget] = useState('ALL');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleBroadcast = () => {
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    setTimeout(() => {
      const now = new Date();
      const newAnn: Announcement = {
        id: Date.now(),
        title: subject.trim(),
        target,
        content: message.trim(),
        date: now.toISOString().split('T')[0],
      };
      setAnnouncements(prev => [newAnn, ...prev]);
      setSubject('');
      setMessage('');
      setTarget('ALL');
      setSending(false);
    }, 500);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="announcements-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 className="ey-title">Communication Center</h2>
          <p className="ey-subtitle">Broadcast announcements and notifications across institutions and user roles.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Compose Panel */}
        <div className="ey-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '14px', marginBottom: '24px' }}>
            Send New Message
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="ey-stat-label">Subject</label>
              <input
                type="text"
                className="ey-input"
                placeholder="Enter title..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="ey-stat-label">Target Audience</label>
              <select className="ey-input" value={target} onChange={e => setTarget(e.target.value)}>
                <option value="ALL">All Users</option>
                <option value="ADMINS">College Admins Only</option>
                <option value="FACULTY">Faculty Only</option>
                <option value="STUDENTS">Students Only</option>
              </select>
            </div>
            <div className="form-group">
              <label className="ey-stat-label">Message Content</label>
              <textarea
                className="ey-input"
                rows={5}
                placeholder="Type your message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <button
              className="ey-btn-primary"
              style={{ width: '100%', opacity: sending || !subject.trim() || !message.trim() ? 0.6 : 1 }}
              onClick={handleBroadcast}
              disabled={sending || !subject.trim() || !message.trim()}
            >
              <Send size={16} /> {sending ? 'Sending…' : 'Broadcast Now'}
            </button>
          </div>
        </div>

        {/* Broadcast History */}
        <div className="ey-card">
          <h3 style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '14px', marginBottom: '24px' }}>
            Broadcast History
          </h3>

          {announcements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-secondary)' }}>
              <Bell size={42} style={{ opacity: 0.1, marginBottom: '16px' }} />
              <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>No Announcements Yet</p>
              <p style={{ fontSize: '13px' }}>Compose and broadcast your first message to get started.</p>
            </div>
          ) : (
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
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}
                      onClick={() => handleDelete(ann.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsModule;
