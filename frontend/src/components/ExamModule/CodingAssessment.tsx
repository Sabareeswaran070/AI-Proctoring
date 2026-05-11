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
  const [code, setCode] = useState(`# Start building your coding challenge\n\ndef solution():\n    # Implement your logic here\n    pass`);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate API call for code execution
    setTimeout(() => {
      setOutput(['> Running solution...', 'Process completed with exit code 0']);
      setIsRunning(false);
    }, 1500);
  };

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
          <button 
            className="page-btn active" 
            onClick={handleRunCode}
            disabled={isRunning}
            style={{ backgroundColor: 'var(--success)', color: 'white', borderColor: 'var(--success)', opacity: isRunning ? 0.7 : 1 }}
          >
            <Play size={18} />
            {isRunning ? "Running..." : "Run Test Cases"}
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
              <span style={{ fontSize: '12px', color: '#888' }}>{language === 'python' ? 'main.py' : language === 'java' ? 'Main.java' : 'script.js'}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <RotateCcw size={16} color="#888" style={{ cursor: 'pointer' }} title="Reset Code" onClick={() => setCode('')} />
              <Settings size={16} color="#888" style={{ cursor: 'pointer' }} />
              <Maximize2 size={16} color="#888" style={{ cursor: 'pointer' }} />
            </div>
          </div>
          <textarea 
            className="code-area"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Type your solution here..."
            spellCheck={false}
          ></textarea>
          <div style={{ padding: '8px 20px', background: '#252526', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ fontSize: '12px', color: '#888' }}>Ln {code.split('\n').length}, Col {code.split('\n').pop()?.length ?? 0}</span>
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
                border: '1px solid var(--border-color)',
                minHeight: '150px'
              }}>
                 {output.length > 0 ? output.map((line, i) => (
                   <div key={i} style={{ color: line.startsWith('>') ? '#64748B' : line.includes('error') ? 'var(--error)' : '#059669', marginBottom: '4px' }}>
                     {line}
                   </div>
                 )) : (
                   <div style={{ color: '#94A3B8', textAlign: 'center', marginTop: '40px' }}>Run the code to see output.</div>
                 )}
              </div>
           </div>

           <div className="card" style={{ padding: '20px' }}>
              <h3 className="card-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Test Cases</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', padding: '10px' }}>
                    No test cases defined for this problem.
                 </div>
              </div>
           </div>

           <div className="card" style={{ padding: '20px', background: 'var(--sidebar-bg)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>Execution Time</span>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>{isRunning ? "..." : "-"}</div>
                 </div>
                 <Clock size={24} color="var(--accent-color)" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;

