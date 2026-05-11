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
import api from '../../api';
import './ExamModule.css';

interface CreateExamProps {
  onBack: () => void;
}

const CreateExam: React.FC<CreateExamProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: 'Computer Science',
    institution: '',
    semester: '',
    startTime: '',
    endTime: '',
    duration: '',
    totalMarks: '',
    passingMarks: '40',
    negativeMarking: false,
    randomizeQuestions: false,
    randomizeOptions: false,
    faceDetection: true,
    tabLock: true,
    calculator: false,
    autoSave: true
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/super-admin/exams', formData);
      alert('Exam published successfully!');
      onBack();
    } catch (err) {
      console.error('Error publishing exam:', err);
      alert('Failed to publish exam.');
    }
  };

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
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Mid-Term Software Engineering 2026" 
                />
              </div>
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3} 
                  placeholder="Briefly describe the scope of this examination..."
                ></textarea>
              </div>
              <div className="form-field">
                <label>Subject / Course</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. CS-402 Software Engineering" 
                />
              </div>
              <div className="form-field">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleChange}>
                  <option>Computer Science</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Information Technology</option>
                </select>
              </div>
              <div className="form-field">
                <label>Institution</label>
                <input 
                  type="text" 
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="e.g. MIT University" 
                />
              </div>
              <div className="form-field">
                <label>Semester / Year</label>
                <input 
                  type="text" 
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="e.g. 6th Semester / 2026" 
                />
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
                <input 
                  type="datetime-local" 
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>End Time *</label>
                <input 
                  type="datetime-local" 
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>Duration (Minutes) *</label>
                <input 
                  type="number" 
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="120" 
                />
              </div>
              <div className="form-field">
                <label>Total Marks</label>
                <input 
                  type="number" 
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  placeholder="100" 
                />
              </div>
              <div className="form-field">
                <label>Passing Marks (%)</label>
                <input 
                  type="number" 
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  placeholder="40" 
                />
              </div>
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <div className="toggle-group">
                  <span>Enable Negative Marking</span>
                  <ToggleSwitch name="negativeMarking" checked={formData.negativeMarking} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <div className="toggle-group">
                  <span>Randomize Questions</span>
                  <ToggleSwitch name="randomizeQuestions" checked={formData.randomizeQuestions} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <div className="toggle-group">
                  <span>Randomize Options</span>
                  <ToggleSwitch name="randomizeOptions" checked={formData.randomizeOptions} onChange={handleChange} />
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
                  <ToggleSwitch name="faceDetection" checked={formData.faceDetection} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <div className="toggle-group">
                  <div>
                    <span style={{ fontWeight: 600, display: 'block' }}>Tab Switch & Browser Lock</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Restrict access to other tabs or applications.</span>
                  </div>
                  <ToggleSwitch name="tabLock" checked={formData.tabLock} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <div className="toggle-group">
                  <span>Scientific Calculator</span>
                  <ToggleSwitch name="calculator" checked={formData.calculator} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <div className="toggle-group">
                  <span>Auto-Save Progress</span>
                  <ToggleSwitch name="autoSave" checked={formData.autoSave} onChange={handleChange} />
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
          <button className="page-btn active" style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderColor: 'var(--accent-color)' }} onClick={handleSubmit}>
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

const ToggleSwitch = ({ name, checked, onChange }: any) => (
  <label style={{ 
    position: 'relative', 
    display: 'inline-block', 
    width: 44, 
    height: 24,
    cursor: 'pointer'
  }}>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
    <span style={{
      position: 'absolute',
      cursor: 'pointer',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: checked ? 'var(--accent-color)' : '#ccc',
      transition: '.4s',
      borderRadius: '34px'
    }}></span>
    <span style={{
      position: 'absolute',
      content: '""',
      height: 18, width: 18,
      left: checked ? 23 : 3,
      bottom: 3,
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%'
    }}></span>
  </label>
);

export default CreateExam;

