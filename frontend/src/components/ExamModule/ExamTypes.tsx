import React from 'react';
import { 
  ChevronLeft, 
  HelpCircle, 
  CheckSquare, 
  FileText, 
  Code, 
  Type, 
  Link2, 
  Upload, 
  BookOpen
} from 'lucide-react';
import './ExamModule.css';

interface ExamTypesProps {
  onBack: () => void;
  onCreateType: (type: string) => void;
}

const ExamTypes: React.FC<ExamTypesProps> = ({ onBack, onCreateType }) => {
  const examTypes = [
    { id: 'mcq', title: 'MCQ Exam', icon: <HelpCircle />, desc: 'Multiple choice questions with automated evaluation.' },
    { id: 'tf', title: 'True / False Exam', icon: <CheckSquare />, desc: 'Quick assessment with binary choice questions.' },
    { id: 'descriptive', title: 'Descriptive Exam', icon: <FileText />, desc: 'Long-form answers with manual or AI grading.' },
    { id: 'coding', title: 'Coding Exam', icon: <Code />, desc: 'Real-time code execution and test case validation.' },
    { id: 'blanks', title: 'Fill in the Blanks', icon: <Type />, desc: 'Assess vocabulary and conceptual knowledge.' },
    { id: 'match', title: 'Match the Following', icon: <Link2 />, desc: 'Relationship and terminology based assessments.' },
    { id: 'assignment', title: 'Assignment Upload', icon: <Upload />, desc: 'Document and project based submissions.' },
    { id: 'case-study', title: 'Case Study Questions', icon: <BookOpen />, desc: 'Scenario-based analytical assessments.' },
  ];

  return (
    <div className="exam-module-container">
      <div className="breadcrumb" style={{ cursor: 'pointer' }} onClick={onBack}>
        <ChevronLeft size={14} /> Back to Dashboard
      </div>

      <div className="exam-header">
        <div>
          <h1 className="page-title">Select Exam Type</h1>
          <p className="page-subtitle">Choose the format that best suits your assessment needs.</p>
        </div>
      </div>

      <div className="exam-types-grid">
        {examTypes.map((type) => (
          <div key={type.id} className="exam-type-card" onClick={() => onCreateType(type.id)}>
            <div className="exam-type-icon">
              {React.cloneElement(type.icon as React.ReactElement, { size: 32 })}
            </div>
            <h3>{type.title}</h3>
            <p>{type.desc}</p>
            <button className="create-btn-sm">Create {type.title}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamTypes;
