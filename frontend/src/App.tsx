import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
