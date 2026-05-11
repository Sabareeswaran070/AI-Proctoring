import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Printer,
  Mail,
  Share2
} from 'lucide-react';
import './ExamModule.css';

const ReportsSectionPage: React.FC = () => {
  return (
    <div className="exam-module-container">
      <div className="exam-header">
        <div>
          <h1 className="page-title">Reports & Data Center</h1>
          <p className="page-subtitle">Generate, schedule, and export comprehensive examination and proctoring reports.</p>
        </div>
        <div className="header-actions">
           <button className="page-btn">
             <Calendar size={18} />
             Schedule Report
           </button>
           <button className="page-btn active" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }}>
             <Download size={18} />
             Export Center
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
         <ReportTypeCard title="Attendance Report" count="124 Generated" icon={<CheckCircle2 />} color="#00A63E" />
         <ReportTypeCard title="AI Violation Report" count="42 Flagged" icon={<AlertCircle />} color="#FB2C36" />
         <ReportTypeCard title="Performance Report" count="86 Available" icon={<FileText />} color="#1447E6" />
         <ReportTypeCard title="System Audit Logs" count="1.2k Logs" icon={<Clock />} color="#111" />
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '1fr 400px' }}>
         <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 className="card-title">Recent Generated Reports</h2>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="page-btn"><Filter size={16} /> Filters</button>
                  <div className="search-bar" style={{ width: '200px', height: '36px' }}>
                    <Search size={16} color="#99A1AF" />
                    <input type="text" placeholder="Search reports..." />
                  </div>
               </div>
            </div>
            
            <div className="reports-list">
               <ReportListItem 
                  name="Spring Mid-Term 2026 - CS Dept" 
                  type="Performance" 
                  date="May 10, 2026" 
                  size="2.4 MB" 
                  format="PDF" 
               />
               <ReportListItem 
                  name="AI Integrity Audit - Week 18" 
                  type="Security" 
                  date="May 09, 2026" 
                  size="1.1 MB" 
                  format="Excel" 
               />
               <ReportListItem 
                  name="Institution Master Attendance" 
                  type="Attendance" 
                  date="May 08, 2026" 
                  size="4.8 MB" 
                  format="CSV" 
               />
               <ReportListItem 
                  name="Faculty Evaluation Report" 
                  type="Administrative" 
                  date="May 05, 2026" 
                  size="900 KB" 
                  format="PDF" 
               />
            </div>
         </div>

         {/* Advanced Filters / Report Generation Panel */}
         <div className="card">
            <h2 className="card-title" style={{ fontSize: '16px', marginBottom: '20px' }}>Generate Custom Report</h2>
            <div className="profile-form" style={{ gap: '16px' }}>
               <div className="form-group">
                  <label>Report Type</label>
                  <select>
                     <option>Detailed Examination Report</option>
                     <option>AI Violation Summary</option>
                     <option>Student Performance Analysis</option>
                     <option>Institutional Audit</option>
                  </select>
               </div>
               <div className="form-group">
                  <label>Date Range</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     <input type="date" style={{ flex: 1 }} />
                     <input type="date" style={{ flex: 1 }} />
                  </div>
               </div>
               <div className="form-group">
                  <label>Institution / Department</label>
                  <select>
                     <option>All Entities</option>
                     <option>MIT University</option>
                     <option>Stanford Academy</option>
                  </select>
               </div>
               <div className="form-group">
                  <label>File Format</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <FormatOption label="PDF" active />
                     <FormatOption label="XLSX" />
                     <FormatOption label="CSV" />
                  </div>
               </div>
               <button className="page-btn active" style={{ 
                  backgroundColor: 'var(--accent-color)', 
                  color: 'white', 
                  borderColor: 'var(--accent-color)',
                  marginTop: '10px',
                  width: '100%',
                  height: '44px'
               }}>
                  Generate Report
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const ReportTypeCard = ({ title, count, icon, color }: any) => (
  <div className="exam-stat-card" style={{ cursor: 'pointer', borderBottom: `3px solid ${color}` }}>
     <div className="stat-info">
        <h3 style={{ fontSize: '13px' }}>{title}</h3>
        <div style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>{count}</div>
        <span style={{ fontSize: '11px', color: '#94A3B8' }}>Click to view details</span>
     </div>
     <div style={{ color: color }}>
        {React.cloneElement(icon, { size: 24 })}
     </div>
  </div>
);

const ReportListItem = ({ name, type, date, size, format }: any) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '16px', 
    borderBottom: '1px solid #F1F5F9',
    transition: 'background 0.2s'
  }} className="hover-light">
     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
           width: 40, 
           height: 40, 
           borderRadius: '8px', 
           background: format === 'PDF' ? '#FEF2F2' : format === 'Excel' || format === 'CSV' ? '#ECFDF5' : '#F8FAFC',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           color: format === 'PDF' ? '#DC2626' : format === 'Excel' || format === 'CSV' ? '#059669' : '#64748B'
        }}>
           {format === 'PDF' ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
        </div>
        <div>
           <div style={{ fontWeight: 600, fontSize: '14px', color: '#1E293B' }}>{name}</div>
           <div style={{ fontSize: '12px', color: '#64748B' }}>{type} • {date} • {size}</div>
        </div>
     </div>
     <div style={{ display: 'flex', gap: '12px' }}>
        <button className="icon-btn" title="Download"><Download size={16} color="#64748B" /></button>
        <button className="icon-btn" title="Email"><Mail size={16} color="#64748B" /></button>
        <button className="icon-btn" title="Share"><Share2 size={16} color="#64748B" /></button>
        <button className="icon-btn" title="Print"><Printer size={16} color="#64748B" /></button>
     </div>
  </div>
);

const FormatOption = ({ label, active }: any) => (
  <div style={{ 
    flex: 1, 
    padding: '8px', 
    textAlign: 'center', 
    borderRadius: '6px', 
    border: '1px solid',
    borderColor: active ? 'var(--accent-color)' : '#E2E8F0',
    background: active ? '#FFF7ED' : 'white',
    color: active ? 'var(--accent-color)' : '#64748B',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer'
  }}>
     {label}
  </div>
);

export default ReportsSectionPage;
