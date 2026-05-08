import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuthStore } from '../store/useAuthStore';
import './Login.css';
import loginBg from '../assets/login-bg.png';
import logo from '../assets/logo-dark.svg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // FastAPI returns access_token, not token
      const { user, access_token } = response.data;
      setAuth(user, access_token);
      
      // Redirect based on role
      switch (user.role) {
        case 'SUPER_ADMIN':
          navigate('/super-admin/dashboard');
          break;
        case 'COLLEGE_ADMIN':
          navigate('/college-admin/dashboard');
          break;
        case 'STUDENT':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="login-card">
        <div className="login-logo-container">
          <img src={logo} alt="AI Proctoring Logo" className="login-logo" />
        </div>
        <h1>AI Proctoring System</h1>
        <p className="subtitle">Secure Examination Portal</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="sign-in-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <footer>
          © 2026 AI Proctoring System. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Login;
