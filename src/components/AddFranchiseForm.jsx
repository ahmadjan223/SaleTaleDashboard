import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useFranchiseStore from '../store/franchiseStore';

const AddFranchiseForm = ({ franchise, onClose }) => {
  const { addFranchise, updateFranchise } = useFranchiseStore();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    masterSimNo: ''
  });

  useEffect(() => {
    if (franchise) {
      setFormData({
        name: franchise.name || '',
        address: franchise.address || '',
        masterSimNo: franchise.masterSimNo || ''
      });
    }
  }, [franchise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (franchise) {
        const response = await updateFranchise(franchise._id, formData);
        if (response.franchise) {
          onClose();
        } else {
          throw new Error('Failed to update franchise');
        }
      } else {
        const response = await addFranchise(formData);
        if (response.franchise) {
          onClose();
        } else {
          throw new Error('Failed to create franchise');
        }
      }
    } catch (error) {
      console.error('Error saving franchise:', error);
      alert(error.message || 'Failed to save franchise. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="masterSimNo">Master SIM Number</label>
        <input
          type="text"
          id="masterSimNo"
          name="masterSimNo"
          value={formData.masterSimNo}
          onChange={handleChange}
          required
          pattern="[0-9]{10-15}"
          title="Please enter a valid length SIM number"
          className="form-input"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {franchise ? 'Update Franchise' : 'Add Franchise'}
        </button>
        <button type="button" onClick={onClose} className="cancel-btn">
          Cancel
        </button>
      </div>

      <style jsx>{`
        .form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .submit-btn {
          background-color: var(--accent-color);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-btn:hover {
          background-color: var(--accent-color-dark);
        }

        .cancel-btn {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cancel-btn:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </form>
  );
};

AddFranchiseForm.propTypes = {
  franchise: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    masterSimNo: PropTypes.string,
    active: PropTypes.bool
  }),
  onClose: PropTypes.func.isRequired
};

export default AddFranchiseForm; 