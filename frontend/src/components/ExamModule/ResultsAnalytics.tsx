import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Users, 
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import api from '../../api';
import './ExamModule.css';

const ResultsAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultsData = async () => {
      try {
        const [statsRes, performersRes] = await Promise.all([
          api.get('/super-admin/results/stats'),
          api.get('/super-admin/results/top-performers')
        ]);
        setStats(statsRes.data);
        setTopPerformers(performersRes.data);
      } catch (err) {
        console.error('Error fetching results data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultsData();
  }, []);

  return (
    <div className="exam-module-container">
      <div className="exam-header">
        <div>
          <h1 className="page-title">Results & Performance Analytics</h1>
          <p className="page-subtitle">In-depth analysis of examination outcomes and student performance metrics.</p>
        </div>
        <div className="header-actions">
           <button className="page-btn">
             <Download size={18} />
             Export Results
           </button>
           <button className="page-btn active" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'white' }}>
             <TrendingUp size={18} />
             Live Results
           </button>
        </div>
      </div>

      <div className="exam-stats-grid">
         <MetricCard title="Average Pass Rate" value={stats?.avg_pass_rate ?? "-"} change="+2.4%" positive={true} icon={<Users />} />
         <MetricCard title="Total Students Evaluated" value={stats?.total_evaluated ?? "-"} change="+12%" positive={true} icon={<FileText />} />
         <MetricCard title="Average Score" value={stats?.avg_score ?? "-"} change="-1.2%" positive={false} icon={<BarChart3 />} />
         <MetricCard title="Top Percentile (90+)" value={stats?.top_percentile ?? "-"} change="+5.1%" positive={true} icon={<PieChart />} />
      </div>

      <div className="content-grid">
         <div className="card">
            <div className="card-header">
               <h2 className="card-title">Institution-wise Performance</h2>
               <p className="card-subtitle">Comparative analysis of average scores across institutions.</p>
            </div>
            <div className="chart-placeholder">
               <svg width="100%" height="240" viewBox="0 0 600 240">
                  <rect x="50" y="40" width="500" height="1" fill="#E2E8F0" />
                  <rect x="50" y="80" width="500" height="1" fill="#E2E8F0" />
                  <rect x="50" y="120" width="500" height="1" fill="#E2E8F0" />
                  <rect x="50" y="160" width="500" height="1" fill="#E2E8F0" />
                  <rect x="50" y="200" width="500" height="2" fill="#94A3B8" />
                  
                  {/* Bars */}
                  <rect x="80" y="60" width="40" height="140" fill="var(--accent-color)" rx="4" />
                  <rect x="180" y="90" width="40" height="110" fill="#111" rx="4" />
                  <rect x="280" y="40" width="40" height="160" fill="var(--accent-color)" rx="4" />
                  <rect x="380" y="70" width="40" height="130" fill="#111" rx="4" />
                  <rect x="480" y="110" width="40" height="90" fill="#E5E7EB" rx="4" />
               </svg>
            </div>
         </div>

         <div className="card">
            <div className="card-header">
               <h2 className="card-title">Grade Distribution</h2>
               <p className="card-subtitle">Global student grade spread.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
               <div style={{ position: 'relative', width: 180, height: 180 }}>
                  <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="var(--accent-color)" strokeWidth="4" strokeDasharray="65 100" />
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="#111" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-65" />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                     <div style={{ fontSize: '24px', fontWeight: 700 }}>A+</div>
                     <div style={{ fontSize: '10px', color: '#64748B' }}>Majority Grade</div>
                  </div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '12px' }}>
               <LegendItem label="A/A+" color="var(--accent-color)" />
               <LegendItem label="B/B+" color="#111" />
               <LegendItem label="Others" color="#E2E8F0" />
            </div>
         </div>
      </div>

      <div className="table-container">
         <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">Top Performers</h2>
            <div className="search-bar" style={{ width: '300px', height: '36px' }}>
              <Search size={16} color="#99A1AF" />
              <input type="text" placeholder="Search by name..." />
            </div>
         </div>
         <table className="data-table">
            <thead>
               <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>Institution</th>
                  <th>Total Score</th>
                  <th>Percentile</th>
                  <th>Status</th>
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               {topPerformers.length > 0 ? topPerformers.map((p) => (
                  <RankRow 
                    key={p.rank}
                    rank={p.rank} 
                    name={p.name ?? "-"} 
                    inst={p.institution ?? "-"} 
                    score={p.score ?? "-"} 
                    perc={p.percentile ?? "-"} 
                  />
               )) : (
                 <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>No performance data available.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, positive, icon }: any) => (
  <div className="exam-stat-card">
     <div className="stat-info">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
           {positive ? <TrendingUp size={12} color="var(--success)" /> : <TrendingDown size={12} color="var(--error)" />}
           <span style={{ fontSize: '12px', fontWeight: 600, color: positive ? 'var(--success)' : 'var(--error)' }}>{change}</span>
           <span style={{ fontSize: '11px', color: '#94A3B8' }}>vs last period</span>
        </div>
     </div>
     <div className="stat-icon" style={{ background: '#F8FAFC' }}>
        {React.cloneElement(icon, { size: 20, color: '#1E293B' })}
     </div>
  </div>
);

const LegendItem = ({ label, color }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
     <div style={{ width: 8, height: 8, borderRadius: '2px', background: color }}></div>
     <span style={{ fontSize: '11px', color: '#64748B' }}>{label}</span>
  </div>
);

const RankRow = ({ rank, name, inst, score, perc }: any) => (
  <tr>
     <td><span style={{ fontWeight: 700, color: rank <= 3 ? 'var(--accent-color)' : '#94A3B8' }}>#{rank}</span></td>
     <td><span style={{ fontWeight: 600 }}>{name}</span></td>
     <td>{inst}</td>
     <td>{score}</td>
     <td>{perc}%</td>
     <td><span className="status-badge status-live">Verified</span></td>
     <td><MoreVertical size={16} color="#94A3B8" /></td>
  </tr>
);

export default ResultsAnalytics;

