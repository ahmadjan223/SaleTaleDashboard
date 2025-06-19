import React, { useState, useEffect } from 'react';
import {
  getAdminProfile,
  updateAdminEmail,
  updateAdminPhone,
  updateAdminPassword
} from '../../utils/api';
import './AdminProfilePage.css';

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeEdit, setActiveEdit] = useState(null);

  const [forms, setForms] = useState({
    email: { email: '', currentPassword: '' },
    phone: { phone: '', currentPassword: '' },
    password: { currentPassword: '', newPassword: '', confirmPassword: '' }
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await getAdminProfile();
      setAdminData(response);
      setForms(prev => ({
        ...prev,
        email: { ...prev.email, email: response.email },
        phone: { ...prev.phone, phone: response.phone }
      }));
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = msg => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = msg => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const handleUpdate = async (field) => {
    try {
      if (field === 'email') {
        const res = await updateAdminEmail(forms.email);
        setAdminData(res.admin);
        showSuccess('Email updated');
      } else if (field === 'phone') {
        const res = await updateAdminPhone(forms.phone);
        setAdminData(res.admin);
        showSuccess('Phone updated');
      } else if (field === 'password') {
        const { newPassword, confirmPassword } = forms.password;
        if (newPassword !== confirmPassword) return showError('Passwords do not match');
        if (newPassword.length < 6) return showError('Minimum 6 characters required');
        await updateAdminPassword(forms.password);
        showSuccess('Password updated');
      }
      setActiveEdit(null);
    } catch (err) {
      showError(err.message || 'Update failed');
    }
  };

  const renderRow = (label, value, field) => {
    const isEditing = activeEdit === field;
    return (
      <div className="profile-row">
        <div className="profile-label">{label}</div>
        <div className="profile-value">
          {isEditing ? (
            <div className="update-form">
              {field !== 'password' ? (
                <>
                  <input
                    type={field === 'email' ? 'email' : 'tel'}
                    value={forms[field][field]}
                    placeholder={`New ${field}`}
                    onChange={(e) => setForms(prev => ({
                      ...prev,
                      [field]: { ...prev[field], [field]: e.target.value }
                    }))}
                  />
                  <input
                    type="password"
                    value={forms[field].currentPassword}
                    placeholder="Current Password"
                    onChange={(e) => setForms(prev => ({
                      ...prev,
                      [field]: { ...prev[field], currentPassword: e.target.value }
                    }))}
                  />
                </>
              ) : (
                <>
                  <input
                    type="password"
                    value={forms.password.currentPassword}
                    placeholder="Current Password"
                    onChange={(e) => setForms(prev => ({
                      ...prev,
                      password: { ...prev.password, currentPassword: e.target.value }
                    }))}
                  />
                  <input
                    type="password"
                    value={forms.password.newPassword}
                    placeholder="New Password"
                    onChange={(e) => setForms(prev => ({
                      ...prev,
                      password: { ...prev.password, newPassword: e.target.value }
                    }))}
                  />
                  <input
                    type="password"
                    value={forms.password.confirmPassword}
                    placeholder="Confirm New Password"
                    onChange={(e) => setForms(prev => ({
                      ...prev,
                      password: { ...prev.password, confirmPassword: e.target.value }
                    }))}
                  />
                </>
              )}
            </div>
          ) : (
            <span>{field === 'password' ? '••••••••' : value}</span>
          )}
        </div>
        <div className="profile-action">
          {isEditing ? (
            <>
              <button onClick={() => handleUpdate(field)} className="update-btn">Save</button>
              <button onClick={() => setActiveEdit(null)} className="cancel-btn">Cancel</button>
            </>
          ) : (
            <button onClick={() => setActiveEdit(field)} className="edit-btn">Edit</button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="admin-profile-container">
      <div className="profile-header">
        <h1>Account Settings</h1>
        <p>Manage your contact and login info</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-card">
        {renderRow('Email', adminData.email, 'email')}
        {renderRow('Phone', adminData.phone, 'phone')}
        {renderRow('Password', '********', 'password')}
      </div>
    </div>
  );
};

export default AdminProfilePage;
