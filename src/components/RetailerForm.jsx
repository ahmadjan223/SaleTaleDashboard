import React, { useState, useEffect } from 'react';
import useSalesmanStore from '../store/salesmenStore';

const RetailerForm = ({ onSubmit, onCancel, submitButtonText = 'Add Retailer', title = 'Add New Retailer', initialData = null }) => {
  const { salesmen, fetchSalesmen } = useSalesmanStore();
  const [formData, setFormData] = useState({
    retailerName: '',
    shopName: '',
    contactNo: '',
    contactNo2: '',
    address: '',
    assignedSalesman: '',
    location: {
      type: 'Point',
      coordinates: []
    }
  });

  // Add new state variables for salesman selection
  const [isSalesmanDropdownOpen, setIsSalesmanDropdownOpen] = useState(false);
  const [salesmanSearchTerm, setSalesmanSearchTerm] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');

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
    fetchSalesmen();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        retailerName: initialData.retailerName || '',
        shopName: initialData.shopName || '',
        contactNo: initialData.contactNo || '',
        contactNo2: initialData.contactNo2 || '',
        address: initialData.address || '',
        assignedSalesman: initialData.assignedSalesman || '',
        location: initialData.location || {
          type: 'Point',
          coordinates: []
        }
      });
      if (initialData.assignedSalesman?.name) {
        setSelectedSalesman(initialData.assignedSalesman.name);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalesmanSelect = (salesman) => {
    setSelectedSalesman(salesman.name);
    setSalesmanSearchTerm('');
    setFormData(prev => ({
      ...prev,
      assignedSalesman: salesman._id
    }));
    setIsSalesmanDropdownOpen(false);
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
          <label htmlFor="retailerName">Retailer Name</label>
          <input
            style={{width:'200px'}}
            type="text"
            id="retailerName"
            name="retailerName"
            value={formData.retailerName}
            onChange={handleChange}
            placeholder="Enter retailer name"
            required
          />
        </div>
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="shopName">Shop Name</label>
          <input
            style={{width:'200px'}}
            type="text"
            id="shopName"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            placeholder="Enter shop name"
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

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter shop address"
          required
          style={{ width: '94%', minHeight: '80px', resize: 'vertical' }}
        />
      </div>

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label htmlFor="assignedSalesman">Assigned Salesman</label>
        <div className="filter-group-modern" style={{ position: 'relative', width: "80%" }}>
          <input
            type="text"
            placeholder="Select Salesman"
            value={isSalesmanDropdownOpen ? salesmanSearchTerm : selectedSalesman}
            onChange={(e) => {
              setSalesmanSearchTerm(e.target.value);
              setIsSalesmanDropdownOpen(true);
            }}
            onFocus={() => {
              setIsSalesmanDropdownOpen(true);
              setSalesmanSearchTerm('');
            }}
            onBlur={() => setTimeout(() => setIsSalesmanDropdownOpen(false), 100)}
            style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
            required
          />
          {isSalesmanDropdownOpen && (
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
              {salesmen
                .filter(salesman => 
                  (salesman.name.toLowerCase().includes(salesmanSearchTerm.toLowerCase()) ||
                   salesman._id.toLowerCase().includes(salesmanSearchTerm.toLowerCase())) &&
                  salesman.active
                )
                .map(salesman => (
                  <div
                    key={salesman._id}
                    onMouseDown={() => handleSalesmanSelect(salesman)}
                    style={{ ...dropdownOptionStyle, color: 'var(--text-light)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {salesman.name}
                  </div>
                ))}
              {salesmen.filter(salesman => 
                (salesman.name.toLowerCase().includes(salesmanSearchTerm.toLowerCase()) ||
                 salesman._id.toLowerCase().includes(salesmanSearchTerm.toLowerCase())) &&
                salesman.active
              ).length === 0 && (
                <div style={{ ...dropdownOptionStyle, cursor: 'default', color: 'var(--text-light)', background: 'var(--card-bg)' }}>No active salesmen found</div>
              )}
            </div>
          )}
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

export default RetailerForm; 