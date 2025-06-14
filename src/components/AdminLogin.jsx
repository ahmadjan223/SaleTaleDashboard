// File: src/pages/AdminLogin.jsx
import './AdminLogin.css'; // Added import for styles (changed)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          // Verify token by making a request to get admin profile
          await axios.get('http://localhost:5000/api/admin/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // If successful, redirect to dashboard
          navigate('/admin/dashboard');
        } catch  {
          // If token is invalid, remove it
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
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
      const response = await axios.post('http://localhost:5000/api/admin/login', formData);

      // Store the token and admin data
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper"> {/* Updated wrapper for full-screen centered flexbox (changed) */}
      <h1 className="page-title">SaleTaleDashboard</h1> {/* Page title styling applied in CSS (changed) */}
      <div className="login-card"> {/* Card background and border radius applied (changed) */}
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