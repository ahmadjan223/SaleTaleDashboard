import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateAdminPassword } from '../utils/api';

const PasswordConfirmModal = ({ visible, onConfirm, onCancel, title = 'Confirm Action', message = 'For this action enter password.' }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset state only when modal is closed
  useEffect(() => {
    if (!visible) {
      setPassword('');
      setError('');
      setSuccess(false);
      setLoading(false);
    }
  }, [visible]);

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await validateAdminPassword(password);
      setSuccess(true);
      setTimeout(() => {
        setLoading(false);
        onConfirm(password);
      }, 1000);
    } catch {
      setError('Incorrect password');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={handleCancel}>×</button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: 20, paddingRight:20 }}>{message}</p>
          {success ? (
            <div style={{ color: 'green', marginBottom: 10, textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Success!</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '97%', padding: 8, marginBottom: 10 }}
                autoFocus
                disabled={loading}
              />
              {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="cancel-btn" onClick={handleCancel} disabled={loading}>Cancel</button>
                <button type="submit" className="confirm-btn" disabled={loading}>{loading ? 'Checking...' : 'Confirm'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

PasswordConfirmModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default PasswordConfirmModal; 