import React, { useState, useEffect } from 'react';
import useFranchiseStore from '../store/franchiseStore';
import useSalesmanStore from '../store/salesmenStore';

const SalesmanForm = ({ onSubmit, onCancel, submitButtonText = 'Add Salesman', title = 'Add New Salesman', initialData = null }) => {
  const { franchises, fetchFranchises } = useFranchiseStore();
  const { loading } = useSalesmanStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    contactNo2: '',
    email: '',
    password: '',
    franchise: ''
  });

  // Add new state variables for franchise selection
  const [isFranchiseDropdownOpen, setIsFranchiseDropdownOpen] = useState(false);
  const [franchiseSearchTerm, setFranchiseSearchTerm] = useState('');
  const [selectedFranchise, setSelectedFranchise] = useState('');

  // Styles for the dropdown
  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const dropdownOptionStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        contactNo: initialData.contactNo || '',
        contactNo2: initialData.contactNo2 || '',
        email: initialData.email || '',
        password: '',
        franchise: initialData.franchise?._id || ''
      });
      // Set the selected franchise name if it exists
      if (initialData.franchise) {
        setSelectedFranchise(initialData.franchise.name);
      }
    }
  }, [initialData, franchises]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFranchiseSelect = (franchise) => {
    setSelectedFranchise(franchise.name);
    setFranchiseSearchTerm('');
    setFormData(prev => ({
      ...prev,
      franchise: franchise._id
    }));
    setIsFranchiseDropdownOpen(false);
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

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label htmlFor="franchise">Franchise</label>
        <div className="filter-group-modern" style={{ position: 'relative', width: "250px" }}>
          <input
            type="text"
            placeholder="Select Franchise"
            value={isFranchiseDropdownOpen ? franchiseSearchTerm : selectedFranchise}
            onChange={(e) => {
              setFranchiseSearchTerm(e.target.value);
              setIsFranchiseDropdownOpen(true);
            }}
            onFocus={() => {
              setIsFranchiseDropdownOpen(true);
              setFranchiseSearchTerm('');
            }}
            onBlur={() => setTimeout(() => setIsFranchiseDropdownOpen(false), 100)}
            style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
            required
          />
          {isFranchiseDropdownOpen && (
            <div className="dropdown-options" style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              zIndex: 1000,
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              marginTop: '5px'
            }}>
              {franchises
                .filter(franchise => 
                  (franchise.name.toLowerCase().includes(franchiseSearchTerm.toLowerCase()) ||
                   franchise._id.toLowerCase().includes(franchiseSearchTerm.toLowerCase())) &&
                  franchise.active
                )
                .map(franchise => (
                  <div
                    key={franchise._id}
                    onMouseDown={() => handleFranchiseSelect(franchise)}
                    style={{ ...dropdownOptionStyle, color: 'var(--text-light)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {franchise.name}
                  </div>
                ))}
              {franchises.filter(franchise => 
                (franchise.name.toLowerCase().includes(franchiseSearchTerm.toLowerCase()) ||
                 franchise._id.toLowerCase().includes(franchiseSearchTerm.toLowerCase())) &&
                franchise.active
              ).length === 0 && (
                <div style={{ ...dropdownOptionStyle, cursor: 'default', color: 'var(--text-light)', background: 'var(--card-bg)' }}>No active franchises found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{marginTop:20, fontWeight:'bold', color:'var(--accent-color)'}}>processing...</div>
      ) : (
        <div className="form-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="confirm-btn">
            {submitButtonText}
          </button>
        </div>
      )}
    </form>
  );
};

export default SalesmanForm; 