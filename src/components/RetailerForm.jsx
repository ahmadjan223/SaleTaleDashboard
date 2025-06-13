import React, { useState, useEffect } from 'react';
import useSalesmanStore from '../store/salesmenStore';

const RetailerForm = ({ initialValues, onSubmit, onCancel, submitButtonText = 'Add Retailer', title = 'Add New Retailer' }) => {
  const { salesmen, fetchSalesmen } = useSalesmanStore();
  const [formData, setFormData] = useState({
    retailerName: '',
    shopName: '',
    contactNo: '',
    contactNo2: '',
    address: '',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    assignedSalesman: ''
  });

  useEffect(() => {
    fetchSalesmen();
  }, []);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...initialValues,
        location: initialValues.location || {
          type: 'Point',
          coordinates: [0, 0]
        }
      });
    }
  }, [initialValues]);

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
    <form className="add-form" onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ color: 'var(--accent-green)', marginBottom: 20 }}>{title}</h3>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="retailerName">Retailer Name</label>
          <input
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
          <label htmlFor="contactNo">Contact Number</label>
          <input
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
          <label htmlFor="contactNo2">Alternative Contact Number</label>
          <input
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
          style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
        />
      </div>
      <div className="form-group" style={{ marginTop: '20px' }}>
        <label htmlFor="assignedSalesman">Assigned Salesman</label>
        <select
          id="assignedSalesman"
          name="assignedSalesman"
          value={formData.assignedSalesman}
          onChange={handleChange}
          required
        >
          <option value="">Select a salesman</option>
          {salesmen.map(salesman => (
            <option key={salesman._id} value={salesman._id}>
              {salesman.name} ({salesman.email})
            </option>
          ))}
        </select>
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