import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Settings, 
  Shield, 
  Clock, 
  FileText, 
  CheckCircle2,
  Calendar,
  Save,
  Send
} from 'lucide-react';
import './ExamModule.css';

interface CreateExamProps {
  onBack: () => void;
}

const CreateExam: React.FC<CreateExamProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="exam-module-container">
      <div className="breadcrumb" style={{ cursor: 'pointer' }} onClick={onBack}>
        <ChevronLeft size={14} /> Back to Types
      </div>

      <div className="exam-header">
        <div>
          <h1 className="page-title">Configure New Examination</h1>
          <p className="page-subtitle">Complete the details below to set up your enterprise assessment.</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <StepItem num={1} title="General Details" active={step === 1} done={step > 1} />
        <StepItem num={2} title="Exam Configuration" active={step === 2} done={step > 2} />
        <StepItem num={3} title="Security & Proctoring" active={step === 3} done={step > 3} />
      </div>

      <div className="create-exam-form">
        {step === 1 && (
          <div className="form-section">
            <h2 className="section-title"><FileText size={20} color="var(--accent-color)" /> Basic Information</h2>
            <div className="form-grid">
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <label>Exam Title *</label>
                <input type="text" placeholder="e.g. Mid-Term Software Engineering 2026" />
              </div>
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea rows={3} placeholder="Briefly describe the scope of this examination..."></textarea>
              </div>
              <div className="form-field">
                <label>Subject / Course</label>
                <input type="text" placeholder="e.g. CS-402 Software Engineering" />
              </div>
              <div className="form-field">
                <label>Department</label>
                <select>
                  <option>Computer Science</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                </select>
              </div>
              <div className="form-field">
                <label>Institution</label>
                <input type="text" placeholder="e.g. MIT University" />
              </div>
              <div className="form-field">
                <label>Semester / Year</label>
                <input type="text" placeholder="e.g. 6th Semester / 2026" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h2 className="section-title"><Clock size={20} color="var(--accent-color)" /> Exam Settings</h2>
            <div className="form-grid">
              <div className="form-field">
                <label>Start Time *</label>
                <input type="datetime-local" />
              </div>
              <div className="form-field">
                <label>End Time *</label>
                <input type="datetime-local" />
              </div>
              <div className="form-field">
                <label>Duration (Minutes) *</label>
                <input type="number" placeholder="120" />
              </div>
              <div className="form-field">
                <label>Total Marks</label>
                <input type="number" placeholder="100" />
              </div>
              <div className="form-field">
                <label>Passing Marks (%)</label>
                <input type="number" placeholder="40" />
              </div>
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <div className="toggle-group">
                  <span>Enable Negative Marking</span>
                  <ToggleSwitch />
                </div>
              </div>
              <div className="form-field">
                <div className="toggle-group">
                  <span>Randomize Questions</span>
                  <ToggleSwitch />
                </div>
              </div>
              <div className="form-field">
                <div className="toggle-group">
                  <span>Randomize Options</span>
                  <ToggleSwitch />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h2 className="section-title"><Shield size={20} color="var(--accent-color)" /> AI Proctoring & Security</h2>
            <div className="form-grid">
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <div className="toggle-group">
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Face Detection & Identification</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Continuous monitoring of student presence.</span>
                  </div>
                  <ToggleSwitch defaultChecked />
                </div>
              </div>
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <div className="toggle-group">
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Tab Switch & Browser Lock</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Restrict access to other tabs or applications.</span>
                  </div>
                  <ToggleSwitch defaultChecked />
                </div>
              </div>
              <div className="form-field">
                <div className="toggle-group">
                  <span>Scientific Calculator</span>
                  <ToggleSwitch />
                </div>
              </div>
              <div className="form-field">
                <div className="toggle-group">
                  <span>Auto-Save Progress</span>
                  <ToggleSwitch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky-footer">
        <button className="page-btn" style={{ marginRight: 'auto' }} onClick={onBack}>Cancel</button>
        <button className="page-btn">
          <Save size={18} /> Save Draft
        </button>
        {step < 3 ? (
          <button className="page-btn active" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }} onClick={() => setStep(step + 1)}>
            Next Step
          </button>
        ) : (
          <button className="page-btn active" style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderColor: 'var(--accent-color)' }}>
            <Send size={18} /> Publish Exam
          </button>
        )}
      </div>
    </div>
  );
};

const StepItem = ({ num, title, active, done }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: active || done ? 1 : 0.5 }}>
    <div style={{ 
      width: 32, 
      height: 32, 
      borderRadius: '50%', 
      backgroundColor: done ? 'var(--success)' : active ? 'var(--sidebar-bg)' : '#E5E7EB',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 600
    }}>
      {done ? <CheckCircle2 size={18} /> : num}
    </div>
    <span style={{ fontWeight: active ? 600 : 400, fontSize: '14px' }}>{title}</span>
    {num < 3 && <div style={{ width: 40, height: 1, backgroundColor: '#E5E7EB' }}></div>}
  </div>
);

const ToggleSwitch = ({ defaultChecked }: any) => (
  <label style={{ 
    position: 'relative', 
    display: 'inline-block', 
    width: 44, 
    height: 24,
    cursor: 'pointer'
  }}>
    <input type="checkbox" defaultChecked={defaultChecked} style={{ opacity: 0, width: 0, height: 0 }} />
    <span style={{
      position: 'absolute',
      cursor: 'pointer',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: defaultChecked ? 'var(--accent-color)' : '#ccc',
      transition: '.4s',
      borderRadius: '34px'
    }}></span>
    <span style={{
      position: 'absolute',
      content: '""',
      height: 18, width: 18,
      left: defaultChecked ? 23 : 3,
      bottom: 3,
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%'
    }}></span>
  </label>
);

export default CreateExam;
