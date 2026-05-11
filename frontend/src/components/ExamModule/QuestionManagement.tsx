import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  FileSpreadsheet,
  Tag,
  BarChart3,
  X,
  ChevronLeft,
  Save,
  CheckCircle2,
  Code,
  Layers,
  FileText,
  Sparkles,
  Loader2,
  HelpCircle,
  Type,
  Link2,
  BookOpen
} from 'lucide-react';
import api from '../../api';
import './ExamModule.css';

interface QuestionStats {
  total: number;
  mcq: number;
  coding: number;
  avg_difficulty: string;
}

const QuestionManagement: React.FC = () => {
  const [view, setView] = useState<'list' | 'types' | 'create'>('list');
  const [questions, setQuestions] = useState<any[]>([]);
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    category: 'Algorithms',
    type: 'MCQ',
    difficulty: 'MEDIUM',
    explanation: '',
    correctAnswer: '',
    options: ['', '', '', '']
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, sRes] = await Promise.all([
        api.get('/super-admin/questions'),
        api.get('/super-admin/questions/stats')
      ]);
      setQuestions(qRes.data);
      setStats(sRes.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddQuestion = async () => {
    try {
      await api.post('/super-admin/questions', newQuestion);
      alert('Question added successfully!');
      setView('list');
      setNewQuestion({ content: '', category: 'Algorithms', type: 'MCQ', difficulty: 'MEDIUM', explanation: '', correctAnswer: '', options: ['', '', '', ''] });
      fetchData();
    } catch (err) {
      console.error('Error adding question:', err);
      alert('Failed to add question.');
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return alert('Please enter a prompt for AI generation');
    setGenerating(true);
    try {
      const response = await api.post('/super-admin/questions/generate', { 
        prompt: aiPrompt,
        type: newQuestion.type 
      });
      const data = response.data;
      
      setNewQuestion(prev => ({
        ...prev,
        content: data.content || prev.content,
        explanation: data.explanation || prev.explanation,
        correctAnswer: data.correctAnswer || prev.correctAnswer,
        options: data.options || prev.options
      }));
      setAiPrompt('');
    } catch (err) {
      console.error('AI Generation Error:', err);
      alert('Failed to generate question with AI. Please check your API configuration.');
    } finally {
      setGenerating(false);
    }
  };

  if (view === 'types') {
    return (
      <div className="exam-module-container">
        <div className="breadcrumb" style={{ cursor: 'pointer' }} onClick={() => setView('list')}>
          <ChevronLeft size={14} /> Back to Question Bank
        </div>
        <div className="exam-header">
          <div>
            <h1 className="page-title">Select Question Type</h1>
            <p className="page-subtitle">Choose the format of the question you want to add to the repository.</p>
          </div>
        </div>

        <div className="exam-types-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <TypeCard 
            icon={<HelpCircle size={32} color="var(--info)" />} 
            title="Multiple Choice (MCQ)" 
            desc="Objective questions with multiple options and one or more correct answers."
            onClick={() => {
              setNewQuestion(prev => ({ ...prev, type: 'mcq' }));
              setView('create');
            }}
          />
          <TypeCard 
            icon={<CheckCircle2 size={32} color="var(--success)" />} 
            title="True / False" 
            desc="Simple binary choice questions for quick conceptual validation."
            onClick={() => {
              setNewQuestion(prev => ({ ...prev, type: 'tf' }));
              setView('create');
            }}
          />
          <TypeCard 
            icon={<Layers size={32} color="var(--accent-color)" />} 
            title="Descriptive" 
            desc="Subjective questions requiring detailed written answers and manual grading."
            onClick={() => {
              setNewQuestion(prev => ({ ...prev, type: 'descriptive' }));
              setView('create');
            }}
          />
          <TypeCard 
            icon={<Code size={32} color="#111" />} 
            title="Coding Problem" 
            desc="Interactive coding challenges with test cases and automated evaluation."
            onClick={() => {
              setNewQuestion(prev => ({ ...prev, type: 'coding' }));
              setView('create');
            }}
          />
          <TypeCard 
            icon={<Type size={32} color="#8B5CF6" />} 
            title="Fill in the Blanks" 
            desc="Assess vocabulary and conceptual knowledge by filling missing parts."
            onClick={() => {
              setNewQuestion(prev => ({ ...prev, type: 'blanks' }));
              setView('create');
            }}
          />
          <TypeCard 
            icon={<Link2 size={32} color="#EC4899" />} 
            title="Match the Following" 
            desc="Relationship and terminology based assessments using pairs."
            onClick={() => {
              setNewQuestion(prev => ({ ...prev, type: 'match' }));
              setView('create');
            }}
          />
          <TypeCard 
            icon={<Upload size={32} color="#10B981" />} 
            title="Assignment Upload" 
            desc="Project or document based submissions for comprehensive evaluation."
            onClick={() => {
              setNewQuestion(prev => ({ ...prev, type: 'assignment' }));
              setView('create');
            }}
          />
          <TypeCard 
            icon={<BookOpen size={32} color="#F59E0B" />} 
            title="Case Study" 
            desc="Scenario-based analytical assessments with complex narratives."
            onClick={() => {
              setNewQuestion(prev => ({ ...prev, type: 'case-study' }));
              setView('create');
            }}
          />
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="exam-module-container">
        <div className="breadcrumb" style={{ cursor: 'pointer' }} onClick={() => setView('types')}>
          <ChevronLeft size={14} /> Back to Type Selection
        </div>

        <div className="exam-header">
          <div>
            <h1 className="page-title">Add New Question</h1>
            <p className="page-subtitle">Create a new entry for the global question repository.</p>
          </div>
          <div className="header-actions">
            <button className="page-btn" onClick={() => setView('list')}>Cancel</button>
            <button className="page-btn active" style={{ backgroundColor: 'var(--accent-color)', color: 'white', borderColor: 'var(--accent-color)' }} onClick={handleAddQuestion}>
              <Save size={18} /> Save Question
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <div className="profile-form" style={{ gap: '24px' }}>
            {/* AI Generator Section */}
            <div style={{ 
              background: 'linear-gradient(135deg, #FFF9F0, #FFF)', 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid #FFE4BC',
              marginBottom: '8px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309' }}>
                <Sparkles size={16} /> AI Question Architect
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Describe what kind of question you want (e.g., Hard MCQ on Binary Search Trees)..."
                  style={{ flex: 1, height: '42px' }}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <button 
                  className="page-btn active" 
                  style={{ backgroundColor: '#B45309', borderColor: '#B45309', color: 'white', height: '42px', minWidth: '140px' }}
                  onClick={handleAiGenerate}
                  disabled={generating}
                >
                  {generating ? <Loader2 size={18} className="animate-spin" /> : <><Sparkles size={16} /> Generate</>}
                </button>
              </div>
              <p style={{ fontSize: '11px', color: '#92400E', marginTop: '8px', opacity: 0.8 }}>
                * AI will automatically populate content, options, and correct answers based on your format.
              </p>
            </div>

            <div className="form-field">
              <label>Question Content *</label>
              <textarea 
                rows={4} 
                placeholder="Enter the question text here..."
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                style={{ fontSize: '15px' }}
              ></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="form-field">
                <label>Category</label>
                <select value={newQuestion.category} onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}>
                  <option>Algorithms</option>
                  <option>Data Structures</option>
                  <option>Web Tech</option>
                  <option>Database Management</option>
                  <option>Artificial Intelligence</option>
                </select>
              </div>
              <div className="form-field">
                <label>Question Type</label>
                <select value={newQuestion.type} onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}>
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="tf">True / False</option>
                  <option value="descriptive">Descriptive</option>
                  <option value="coding">Coding Problem</option>
                  <option value="blanks">Fill in the Blanks</option>
                  <option value="match">Match the Following</option>
                  <option value="assignment">Assignment Upload</option>
                  <option value="case-study">Case Study</option>
                </select>
              </div>
              <div className="form-field">
                <label>Difficulty Level</label>
                <select value={newQuestion.difficulty} onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            {(newQuestion.type === 'MCQ' || newQuestion.type === 'mcq') && (
              <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Options & Correct Answer</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   {newQuestion.options.map((opt, i) => (
                     <div key={i} className="form-field">
                        <label>Option {String.fromCharCode(65 + i)}</label>
                        <input 
                          type="text" 
                          placeholder={`Enter option ${String.fromCharCode(65 + i)}`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...newQuestion.options];
                            newOpts[i] = e.target.value;
                            setNewQuestion({...newQuestion, options: newOpts});
                          }}
                        />
                     </div>
                   ))}
                </div>
                <div className="form-field" style={{ marginTop: '16px' }}>
                  <label>Correct Answer Index (0-3)</label>
                  <select value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}>
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                  </select>
                </div>
              </div>
            )}

            {(newQuestion.type === 'CODING' || newQuestion.type === 'coding') && (
              <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Coding Challenge Configuration</h3>
                <div className="form-field">
                  <label>Initial Code Template</label>
                  <textarea rows={6} placeholder="def solution():\n    # your code here" style={{ fontFamily: 'monospace' }}></textarea>
                </div>
                <div className="form-field" style={{ marginTop: '16px' }}>
                  <label>Test Cases (JSON Format)</label>
                  <textarea rows={4} placeholder='[{"input": "1", "output": "1"}]' style={{ fontFamily: 'monospace' }}></textarea>
                </div>
              </div>
            )}

            {(newQuestion.type === 'TRUE_FALSE' || newQuestion.type === 'tf') && (
              <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Select Correct Answer</h3>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="tf" value="true" checked={newQuestion.correctAnswer === 'true'} onChange={() => setNewQuestion({...newQuestion, correctAnswer: 'true'})} />
                    True
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="tf" value="false" checked={newQuestion.correctAnswer === 'false'} onChange={() => setNewQuestion({...newQuestion, correctAnswer: 'false'})} />
                    False
                  </label>
                </div>
              </div>
            )}

            {newQuestion.type === 'blanks' && (
              <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Fill in the Blanks Configuration</h3>
                <div className="form-field">
                  <label>Correct Answer (The missing word)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Paris"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                  />
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Use '______' in the Question Content to represent the blank.</p>
                </div>
              </div>
            )}

            {newQuestion.type === 'match' && (
              <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Match the Following Pairs</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   {newQuestion.options.map((opt, i) => (
                     <div key={i} className="form-field">
                        <label>Pair {i + 1} (Left:Right)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Apple:Red"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...newQuestion.options];
                            newOpts[i] = e.target.value;
                            setNewQuestion({...newQuestion, options: newOpts});
                          }}
                        />
                     </div>
                   ))}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>Enter pairs separated by a colon (:). Left side will be the key, right side the value.</p>
              </div>
            )}

            {newQuestion.type === 'assignment' && (
              <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Assignment Submission Rules</h3>
                <div className="form-field">
                  <label>Max File Size (MB)</label>
                  <input type="number" placeholder="10" defaultValue="10" />
                </div>
                <div className="form-field" style={{ marginTop: '12px' }}>
                  <label>Allowed File Types</label>
                  <input type="text" placeholder=".pdf, .zip, .docx" defaultValue=".pdf, .zip" />
                </div>
              </div>
            )}

            {newQuestion.type === 'case-study' && (
              <div className="form-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Case Study Passage</h3>
                <div className="form-field">
                  <label>Additional Context / Scenario</label>
                  <textarea 
                    rows={6} 
                    placeholder="Enter the detailed scenario or case study text here..."
                    style={{ fontSize: '14px' }}
                  ></textarea>
                </div>
              </div>
            )}

            <div className="form-field">
              <label>Explanation (Optional)</label>
              <textarea 
                rows={2} 
                placeholder="Explain the correct solution..."
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-module-container">
      <div className="exam-header">
        <div>
          <h1 className="page-title">Question Bank Management</h1>
          <p className="page-subtitle">Centralized repository for all examination questions across categories.</p>
        </div>
        <div className="header-actions">
          <button className="page-btn">
            <FileSpreadsheet size={18} />
            Bulk Import (Excel)
          </button>
          <button 
            className="page-btn active" 
            style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }}
            onClick={() => setView('types')}
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="exam-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="exam-stat-card" style={{ padding: '16px 24px' }}>
          <div className="stat-info">
            <h3 style={{ fontSize: '12px' }}>Total Questions</h3>
            <div className="stat-value" style={{ fontSize: '20px' }}>{stats?.total ?? "-"}</div>
          </div>
          <Tag size={20} color="var(--info)" />
        </div>
        <div className="exam-stat-card" style={{ padding: '16px 24px' }}>
          <div className="stat-info">
            <h3 style={{ fontSize: '12px' }}>MCQ Questions</h3>
            <div className="stat-value" style={{ fontSize: '20px' }}>{stats?.mcq ?? "-"}</div>
          </div>
          <CheckCircleIcon color="var(--success)" />
        </div>
        <div className="exam-stat-card" style={{ padding: '16px 24px' }}>
          <div className="stat-info">
            <h3 style={{ fontSize: '12px' }}>Coding Problems</h3>
            <div className="stat-value" style={{ fontSize: '20px' }}>{stats?.coding ?? "-"}</div>
          </div>
          <CodeIcon color="var(--accent-color)" />
        </div>
        <div className="exam-stat-card" style={{ padding: '16px 24px' }}>
          <div className="stat-info">
            <h3 style={{ fontSize: '12px' }}>Avg. Difficulty</h3>
            <div className="stat-value" style={{ fontSize: '20px' }}>{stats?.avg_difficulty ?? "-"}</div>
          </div>
          <BarChart3 size={20} color="var(--warning)" />
        </div>
      </div>

      <div className="table-container">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
             <div className="select-wrapper">
               <select className="filter-select">
                  <option>All Categories</option>
                  <option>Algorithms</option>
                  <option>Data Structures</option>
                  <option>Web Tech</option>
               </select>
             </div>
             <div className="select-wrapper">
               <select className="filter-select">
                  <option>All Difficulty</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
               </select>
             </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="search-bar" style={{ width: '300px', height: '36px' }}>
              <Search size={16} color="#99A1AF" />
              <input type="text" placeholder="Search by keywords..." />
            </div>
          </div>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}><input type="checkbox" /></th>
              <th>Question Content</th>
              <th>Category</th>
              <th>Type</th>
              <th>Difficulty</th>
              <th>Institution</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? questions.map((q) => (
              <QuestionRow 
                key={q.id}
                content={q.content ?? "-"} 
                category={q.category ?? "-"} 
                type={q.type ?? "-"} 
                difficulty={q.difficulty ?? "-"} 
                institution={q.institution?.name ?? "-"} 
              />
            )) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No questions found in the repository.</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="pagination">
          <span className="page-subtitle">Showing {questions.length} questions</span>
          <div className="pagination-buttons">
            <button className="page-btn" disabled>Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionRow = ({ content, category, type, difficulty, institution }: any) => (
  <tr>
    <td><input type="checkbox" /></td>
    <td>
      <div style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
        {content}
      </div>
    </td>
    <td>{category}</td>
    <td><span style={{ padding: '4px 8px', borderRadius: '6px', background: '#F3F4F6', fontSize: '12px' }}>{type}</span></td>
    <td>
      <span style={{ 
        color: difficulty === 'EASY' ? 'var(--success)' : difficulty === 'MEDIUM' ? 'var(--warning)' : difficulty === 'HARD' ? 'var(--error)' : 'inherit',
        fontWeight: 600,
        fontSize: '13px'
      }}>{difficulty}</span>
    </td>
    <td>{institution}</td>
    <td>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Eye size={16} color="#6A7282" style={{ cursor: 'pointer' }} />
        <Edit2 size={16} color="#6A7282" style={{ cursor: 'pointer' }} />
        <Trash2 size={16} color="#FB2C36" style={{ cursor: 'pointer' }} />
      </div>
    </td>
  </tr>
);

const CheckCircleIcon = ({ color }: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const CodeIcon = ({ color }: any) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const TypeCard = ({ icon, title, desc, onClick }: any) => (
  <div className="exam-type-card" onClick={onClick}>
    <div className="exam-type-icon">
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <button className="create-btn-sm">Select Format</button>
  </div>
);

export default QuestionManagement;



