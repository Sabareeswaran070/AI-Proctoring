import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  Settings, 
  Save, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Layout,
  Maximize2
} from 'lucide-react';
import './ExamModule.css';

const CodingAssessment: React.FC = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(`# Write your code here\ndef solve():\n    print("Hello AI Proctoring")\n\nsolve()`);

  return (
    <div className="exam-module-container">
      <div className="exam-header" style={{ marginBottom: '16px' }}>
        <div>
          <h1 className="page-title">Advanced Coding Assessment</h1>
          <p className="page-subtitle">Design complex programming assessments with real-time evaluation.</p>
        </div>
        <div className="header-actions">
          <button className="page-btn">
            <Layout size={18} />
            Layout
          </button>
          <button className="page-btn active" style={{ backgroundColor: 'var(--success)', color: 'white', borderColor: 'var(--success)' }}>
            <Play size={18} />
            Run Test Cases
          </button>
        </div>
      </div>

      <div className="coding-container">
        {/* Editor Panel */}
        <div className="editor-panel">
          <div className="editor-header">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ 
                  background: '#2D2D2D', 
                  color: 'white', 
                  border: '1px solid #444', 
                  padding: '4px 12px', 
                  borderRadius: '4px',
                  fontSize: '13px' 
                }}
              >
                <option value="python">Python 3.10</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
                <option value="javascript">JavaScript (Node.js)</option>
              </select>
              <div style={{ width: '1px', height: '20px', background: '#444' }}></div>
              <span style={{ fontSize: '12px', color: '#888' }}>main.py</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <RotateCcw size={16} color="#888" style={{ cursor: 'pointer' }} title="Reset Code" />
              <Settings size={16} color="#888" style={{ cursor: 'pointer' }} />
              <Maximize2 size={16} color="#888" style={{ cursor: 'pointer' }} />
            </div>
          </div>
          <textarea 
            className="code-area"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          ></textarea>
          <div style={{ padding: '8px 20px', background: '#252526', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ fontSize: '12px', color: '#888' }}>Ln 5, Col 8</span>
             <span style={{ fontSize: '12px', color: '#888' }}>UTF-8</span>
          </div>
        </div>

        {/* Sidebar Panel: Test Cases & Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
              <h3 className="card-title" style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Terminal size={16} color="var(--accent-color)" /> Console Output
              </h3>
              <div style={{ 
                flex: 1, 
                background: '#F8FAFC', 
                borderRadius: '8px', 
                padding: '16px', 
                fontFamily: 'var(--mono)',
                fontSize: '13px',
                color: '#1E293B',
                border: '1px solid var(--border-color)'
              }}>
                 <div style={{ color: '#64748B', marginBottom: '8px' }}>{'>'} Running main.py...</div>
                 <div style={{ color: '#059669' }}>Hello AI Proctoring</div>
                 <div style={{ marginTop: '16px', color: '#64748B' }}>[Process completed with exit code 0]</div>
              </div>
           </div>

           <div className="card" style={{ padding: '20px' }}>
              <h3 className="card-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Test Cases</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <TestCaseRow label="Test Case 1" status="passed" />
                 <TestCaseRow label="Test Case 2" status="passed" />
                 <TestCaseRow label="Test Case 3" status="failed" />
                 <TestCaseRow label="Hidden Case" status="locked" />
              </div>
           </div>

           <div className="card" style={{ padding: '20px', background: 'var(--sidebar-bg)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>Execution Time</span>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>0.42s</div>
                 </div>
                 <Clock size={24} color="var(--accent-color)" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const TestCaseRow = ({ label, status }: any) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '10px 12px',
    background: status === 'passed' ? '#ECFDF5' : status === 'failed' ? '#FEF2F2' : '#F8FAFC',
    borderRadius: '6px',
    border: '1px solid',
    borderColor: status === 'passed' ? '#D1FAE5' : status === 'failed' ? '#FEE2E2' : '#E2E8F0'
  }}>
    <span style={{ fontSize: '13px', fontWeight: 500, color: '#1E293B' }}>{label}</span>
    {status === 'passed' ? <CheckCircle2 size={16} color="var(--success)" /> : 
     status === 'failed' ? <XCircle size={16} color="var(--error)" /> : 
     <Clock size={16} color="#94A3B8" />}
  </div>
);

export default CodingAssessment;
