import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const inputBoxStyle = {
  boxSizing: 'border-box',
};

const AddProductForm = ({ onSubmit, onCancel, initialValues, submitButtonText = 'Add Product', title = 'Add New Product' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        description: initialValues.description || '',
        price: initialValues.price || ''
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
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
        {/* Name Field */}
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            style={inputBoxStyle}
          />
        </div>
        {/* Price Field */}
        <div className="form-group" style={{ flex: '1', minWidth: 0 }}>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            min="0"
            step="0.01"
            required
            style={inputBoxStyle}
          />
        </div>
      </div>
      {/* Description Field */}
      <div className="form-group" style={{ marginTop: '20px' }}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          required
          style={{ ...inputBoxStyle, width: '100%', minHeight: '80px', resize: 'vertical' }}
        />
      </div>
      {/* Form Actions */}
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

AddProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  submitButtonText: PropTypes.string,
  title: PropTypes.string
};

export default AddProductForm; 