import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Settings, 
  Shield, 
  Clock, 
  FileText, 
  CheckCircle2,
  Calendar,
  Save,
  Send,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  Type,
  HelpCircle,
  Link2,
  BookOpen
} from 'lucide-react';
import api from '../../api';
import './ExamModule.css';

interface CreateExamProps {
  onBack: () => void;
  type?: string | null;
}

const CreateExam: React.FC<CreateExamProps> = ({ onBack, type }) => {
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
    autoSave: true,
    type: type || 'mcq'
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (type) {
      setFormData(prev => ({ ...prev, type }));
    }
  }, [type]);

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
        <StepItem num={4} title="Question Builder" active={step === 4} done={step > 4} />
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
        {step === 4 && (
          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}><HelpCircle size={20} color="var(--accent-color)" /> Question Builder ({formData.type.toUpperCase()})</h2>
              <button 
                className="page-btn active" 
                style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }}
                onClick={() => setQuestions([...questions, { content: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }])}
              >
                <Plus size={16} /> Add Question
              </button>
            </div>

            {/* AI Generator for this Exam Type */}
            <div style={{ 
              background: 'linear-gradient(135deg, #FFF9F0, #FFF)', 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid #FFE4BC',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309' }}>
                <Sparkles size={16} /> AI {formData.type.toUpperCase()} Architect
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder={`Topic for AI to generate ${formData.type} question...`}
                  style={{ flex: 1, height: '42px' }}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <button 
                  className="page-btn active" 
                  style={{ backgroundColor: '#B45309', borderColor: '#B45309', color: 'white', height: '42px', minWidth: '140px' }}
                  onClick={async () => {
                    if (!aiPrompt) return;
                    setGenerating(true);
                    try {
                      const res = await api.post('/super-admin/questions/generate', { prompt: aiPrompt, type: formData.type });
                      setQuestions([...questions, res.data]);
                      setAiPrompt('');
                    } catch (err) {
                      console.error(err);
                      alert('AI Generation failed');
                    } finally {
                      setGenerating(false);
                    }
                  }}
                  disabled={generating}
                >
                  {generating ? <Loader2 size={18} className="animate-spin" /> : <><Sparkles size={16} /> Generate</>}
                </button>
              </div>
            </div>

            <div className="questions-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {questions.map((q, idx) => (
                <div key={idx} className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-color)' }}>Question {idx + 1}</span>
                    <button onClick={() => setQuestions(questions.filter((_, i) => i !== idx))} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="form-field">
                    <label>Content</label>
                    <textarea 
                      rows={3} 
                      value={q.content} 
                      onChange={(e) => {
                        const newQs = [...questions];
                        newQs[idx].content = e.target.value;
                        setQuestions(newQs);
                      }}
                    />
                  </div>

                  {/* Format Specific Inputs */}
                  {formData.type === 'mcq' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                      {q.options?.map((opt: string, optIdx: number) => (
                        <input 
                          key={optIdx} 
                          type="text" 
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`} 
                          value={opt}
                          onChange={(e) => {
                            const newQs = [...questions];
                            newQs[idx].options[optIdx] = e.target.value;
                            setQuestions(newQs);
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {(formData.type === 'tf' || formData.type === 'TRUE_FALSE') && (
                    <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                      <label><input type="radio" checked={q.correctAnswer === 'true'} onChange={() => {
                        const newQs = [...questions];
                        newQs[idx].correctAnswer = 'true';
                        setQuestions(newQs);
                      }} /> True</label>
                      <label><input type="radio" checked={q.correctAnswer === 'false'} onChange={() => {
                        const newQs = [...questions];
                        newQs[idx].correctAnswer = 'false';
                        setQuestions(newQs);
                      }} /> False</label>
                    </div>
                  )}

                  {formData.type === 'blanks' && (
                    <input 
                      type="text" 
                      placeholder="Answer for the blank" 
                      style={{ marginTop: '12px' }}
                      value={q.correctAnswer}
                      onChange={(e) => {
                        const newQs = [...questions];
                        newQs[idx].correctAnswer = e.target.value;
                        setQuestions(newQs);
                      }}
                    />
                  )}

                  {formData.type === 'match' && (
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ fontSize: '12px', marginBottom: '8px', display: 'block' }}>Matching Pairs (Format: LeftSide:RightSide)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {q.options?.map((opt: string, optIdx: number) => (
                          <input 
                            key={optIdx} 
                            type="text" 
                            placeholder={`Pair ${optIdx + 1} (e.g. DNA:Nucleus)`} 
                            value={opt}
                            onChange={(e) => {
                              const newQs = [...questions];
                              newQs[idx].options[optIdx] = e.target.value;
                              setQuestions(newQs);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.type === 'case-study' && (
                    <div className="form-field" style={{ marginTop: '12px' }}>
                      <label>Case Scenario / Passage</label>
                      <textarea 
                        rows={4} 
                        placeholder="Describe the case scenario..."
                        value={q.explanation} // Using explanation for the passage for simplicity
                        onChange={(e) => {
                          const newQs = [...questions];
                          newQs[idx].explanation = e.target.value;
                          setQuestions(newQs);
                        }}
                      />
                    </div>
                  )}

                  {formData.type === 'assignment' && (
                    <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                      <div className="form-field" style={{ flex: 1 }}>
                        <label>Max Size (MB)</label>
                        <input type="number" defaultValue="10" />
                      </div>
                      <div className="form-field" style={{ flex: 2 }}>
                        <label>Allowed Formats</label>
                        <input type="text" placeholder=".pdf, .zip, .docx" />
                      </div>
                    </div>
                  )}

                  {formData.type !== 'case-study' && (
                    <div className="form-field" style={{ marginTop: '12px' }}>
                      <label>Explanation / Sample Answer</label>
                      <input 
                        type="text" 
                        placeholder="Explain the correct answer for student review..."
                        value={q.explanation} 
                        onChange={(e) => {
                          const newQs = [...questions];
                          newQs[idx].explanation = e.target.value;
                          setQuestions(newQs);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              {questions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', background: '#F9FAFB', borderRadius: '12px', border: '2px dashed #E5E7EB' }}>
                  <HelpCircle size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                  <p style={{ color: '#6B7280' }}>No questions added yet. Use the "Add Question" button or let AI generate them for you.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="sticky-footer">
        <button className="page-btn" style={{ marginRight: 'auto' }} onClick={onBack}>Cancel</button>
        {step === 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '20px' }}>
             <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Randomize Question Order</span>
             <ToggleSwitch name="randomizeQuestions" checked={formData.randomizeQuestions} onChange={handleChange} />
          </div>
        )}
        <button className="page-btn">
          <Save size={18} /> Save Draft
        </button>
        {step < 4 ? (
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
    {num < 4 && <div style={{ width: 40, height: 1, backgroundColor: '#E5E7EB' }}></div>}
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

