import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import api from './api';
import ExamDetailView from './components/ExamModule/ExamDetailView';
import './App.css';

function App() {
  const { isAuthenticated, user, token, setAuth, logout } = useAuthStore();
  const [hydrating, setHydrating] = useState(!!token && !user);

  // If we have a token but no user (page refresh), re-fetch user from /auth/me
  useEffect(() => {
    if (token && !user) {
      api.get('/auth/me')
        .then((res) => {
          setAuth(res.data, token);
        })
        .catch(() => {
          logout(); // token is invalid or expired, clear it
        })
        .finally(() => {
          setHydrating(false);
        });
    }
  }, []);

  if (hydrating) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F5F6FA' }}>
        <div style={{ color: '#666', fontSize: 16 }}>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route - redirect to dashboard if already logged in */}
          <Route
            path="/"
            element={
              isAuthenticated && user?.role === 'SUPER_ADMIN'
                ? <Navigate to="/super-admin/dashboard" replace />
                : <Login />
            }
          />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/exam-detail/:id"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <ExamDetailView />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
