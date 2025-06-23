// File: src/pages/AdminLogin.jsx
import './AdminLogin.css'; // Added import for styles (changed)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, validateAdminToken } from '../../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          await validateAdminToken(token);
          navigate('/admin');
        } catch (error) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          if (error.message?.includes('expired')) {
            setError('Your session has expired. Please login again.');
          }
        }
      }
    };
    validateToken();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAdmin(formData);
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminData', JSON.stringify(response.admin));
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="admin-login-wrapper"> {/* Updated wrapper for full-screen centered flexbox (changed) */}
        <div className="login-card"> {/* Card background and border radius applied (changed) */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            marginBottom: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--accent-green)',
            fontSize: '1rem',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
            display: 'block',
          }}
          aria-label="Back to landing page"
        >
          ← Back
        </button>
        <h2 className="form-heading">Admin Login</h2> {/* Added class for heading style (changed) */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form"> {/* Form layout styles applied (changed) */}
          <label className="form-label">
            Email / Phone
            <input
              className="form-input" // Added input styling (changed)
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or phone"
              required
            />
          </label>
          <label className="form-label">
            Password
            <input
              className="form-input" // Consistent input styling (changed)
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button> {/* Styled button with hover effect (changed) */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;