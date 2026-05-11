import React from 'react';
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
  BarChart3
} from 'lucide-react';
import './ExamModule.css';

const QuestionManagement: React.FC = () => {
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
          <button className="page-btn active" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }}>
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
            <div className="stat-value" style={{ fontSize: '20px' }}>2,450</div>
          </div>
          <Tag size={20} color="var(--info)" />
        </div>
        <div className="exam-stat-card" style={{ padding: '16px 24px' }}>
          <div className="stat-info">
            <h3 style={{ fontSize: '12px' }}>MCQ Questions</h3>
            <div className="stat-value" style={{ fontSize: '20px' }}>1,820</div>
          </div>
          <CheckCircleIcon color="var(--success)" />
        </div>
        <div className="exam-stat-card" style={{ padding: '16px 24px' }}>
          <div className="stat-info">
            <h3 style={{ fontSize: '12px' }}>Coding Problems</h3>
            <div className="stat-value" style={{ fontSize: '20px' }}>142</div>
          </div>
          <CodeIcon color="var(--accent-color)" />
        </div>
        <div className="exam-stat-card" style={{ padding: '16px 24px' }}>
          <div className="stat-info">
            <h3 style={{ fontSize: '12px' }}>Avg. Difficulty</h3>
            <div className="stat-value" style={{ fontSize: '20px' }}>Moderate</div>
          </div>
          <BarChart3 size={20} color="var(--warning)" />
        </div>
      </div>

      <div className="table-container">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
             <select className="page-btn" style={{ fontSize: '13px' }}>
                <option>All Categories</option>
                <option>Algorithms</option>
                <option>Data Structures</option>
                <option>Web Tech</option>
             </select>
             <select className="page-btn" style={{ fontSize: '13px' }}>
                <option>All Difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
             </select>
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
              <th>Used In</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <QuestionRow 
              content="Explain the difference between Merge Sort and Quick Sort algorithms..." 
              category="Algorithms" 
              type="Descriptive" 
              difficulty="Hard" 
              used="12 Exams" 
            />
            <QuestionRow 
              content="Which of the following is not a primitive data type in Java?" 
              category="Java Programming" 
              type="MCQ" 
              difficulty="Easy" 
              used="45 Exams" 
            />
            <QuestionRow 
              content="Write a program to find the longest palindromic substring in a given string..." 
              category="Coding" 
              type="Coding" 
              difficulty="Medium" 
              used="8 Exams" 
            />
            <QuestionRow 
              content="The Big-O complexity of binary search is O(log n). (True/False)" 
              category="DSA" 
              type="T/F" 
              difficulty="Easy" 
              used="18 Exams" 
            />
          </tbody>
        </table>
        
        <div className="pagination">
          <span className="page-subtitle">Showing 1-10 of 2,450 questions</span>
          <div className="pagination-buttons">
            <button className="page-btn">Prev</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionRow = ({ content, category, type, difficulty, used }: any) => (
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
        color: difficulty === 'Easy' ? 'var(--success)' : difficulty === 'Medium' ? 'var(--warning)' : 'var(--error)',
        fontWeight: 600,
        fontSize: '13px'
      }}>{difficulty}</span>
    </td>
    <td>{used}</td>
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

export default QuestionManagement;
