import React, { useState, useEffect } from 'react';

const SalesmanForm = ({ onSubmit, onCancel, submitButtonText = 'Add Salesman', title = 'Add New Salesman', initialData = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    contactNo2: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        contactNo: initialData.contactNo || '',
        contactNo2: initialData.contactNo2 || '',
        email: initialData.email || '',
        password: '' // Don't populate password for security
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="add-form" onSubmit={handleSubmit} style={{ maxWidth: '800px', padding:'20px', margin: '0 auto' }}>
      <h3 style={{ color: 'var(--accent-green)', marginBottom: 20 }}>{title}</h3>
      
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="firstName">First Name</label>
          <input
            style={{width:'200px'}}
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="lastName">Last Name</label>
          <input
            style={{width:'200px'}}
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="contactNo">Contact No</label>
          <input
            style={{width:'200px'}}
            type="tel"
            id="contactNo"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
          />
        </div>
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="contactNo2">Secondary Contact No</label>
          <input
            style={{width:'200px'}}
            type="tel"
            id="contactNo2"
            name="contactNo2"
            value={formData.contactNo2}
            onChange={handleChange}
            placeholder="Enter alternative contact number (optional)"
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="email">Email</label>
          <input
            style={{width:'200px'}}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="password">Password</label>
          <input
            style={{width:'200px'}}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={initialData ? "Enter new password (optional)" : "Enter password"}
            required={!initialData}
            minLength={6}
          />
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="confirm-btn">
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default SalesmanForm; 