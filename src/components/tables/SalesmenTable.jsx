import React, { useState, useEffect } from 'react';
import useSalesmanStore from '../../store/salesmenStore';
import { deleteSalesman } from '../../utils/api';
import SalesmanForm from '../SalesmanForm';

const SalesmenTable = ({ onRowCopy }) => {
  const { salesmen, fetchSalesmen, loading, addSalesman, updateSalesman, toggleSalesmanStatus } = useSalesmanStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSalesmen, setFilteredSalesmen] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState(null);

  useEffect(() => {
    fetchSalesmen();
  }, []);

  useEffect(() => {
    if (salesmen) {
      const filtered = salesmen.filter(salesman => 
        salesman.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salesman.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salesman.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salesman.contactNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSalesmen(filtered);
    }
  }, [searchQuery, salesmen]);

  const handleDelete = async (id, name) => {
      try {
        await deleteSalesman(id);
        // Refresh the salesmen list after successful deletion
        fetchSalesmen();
      } catch (error) {
        console.error('Error deleting salesman:', error);
        alert('Failed to delete salesman. Please try again.');
      }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleSalesmanStatus(id, !currentStatus);
      // Refresh the salesmen list after successful status change
      fetchSalesmen();
    } catch (error) {
      console.error('Error toggling salesman status:', error);
      alert('Failed to update salesman status. Please try again.');
    }
  };

  const handleAddSalesman = async (formData) => {
    try {
      const response = await addSalesman(formData);
      if (response.success) {
        setShowAddModal(false);
        fetchSalesmen(); // Refresh the list
      } else {
        alert(response.message || 'Failed to add salesman. Please try again.');
      }
    } catch (error) {
      console.error('Error adding salesman:', error);
      alert(error.message || 'Failed to add salesman. Please try again.');
    }
  };

  const handleEditSalesman = async (formData) => {
    try {
      const response = await updateSalesman(selectedSalesman._id, formData);
      if (response.success) {
        setShowEditModal(false);
        setSelectedSalesman(null);
        fetchSalesmen(); // Refresh the list
      } else {
        alert(response.message || 'Failed to update salesman. Please try again.');
      }
    } catch (error) {
      console.error('Error updating salesman:', error);
      alert(error.message || 'Failed to update salesman. Please try again.');
    }
  };

  const handleEditClick = (salesman) => {
    setSelectedSalesman(salesman);
    setShowEditModal(true);
  };

  if (!salesmen) {
    return (
      <section className>
        <div className="section-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search salesmen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '35px' }}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="header-actions">
            <button className="add-btn">
              <span className="plus-icon">+</span>
              Add Salesman
            </button>
          </div>
        </div>
        <div className="table-container">
          <div className="loading-message">Loading salesmen data...</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="section-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search salesmen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '35px' }}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <span className="plus-icon">+</span>
            Add Salesman
          </button>
        </div>
      </div>
      <div className="table-container">
        {filteredSalesmen.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalesmen.map((s, index) => (
                <tr key={s._id}>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(index + 1, 'Index');}}>{index + 1}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(`${s.firstName} ${s.lastName}`, 'Name');}}>{`${s.firstName} ${s.lastName}`}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.email, 'Email');}}>{s.email}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.contactNo, 'Contact No');}}>{s.contactNo}</td>
                  <td>
                    <span className={`status-badge ${s.active ? 'active' : 'inactive'}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(s._id, s.active);
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: s.active ? 'var(--accent-green)' : 'red',
                        color: s.active ? 'white' : 'var(--accent-red)',
                        border: s.active ? 'none' : '1px solid var(--accent-red)',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {s.active ? 'Active' : 'Inactive'}
                    </button>
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={(e) => { e.stopPropagation(); handleEditClick(s); }} className="action-btn icon-btn edit-btn">✏️</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(s._id, `${s.firstName} ${s.lastName}`); }} className="action-btn icon-btn delete-btn">🗑️</button>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{paddingLeft:15}}>No salesmen found matching your search.</p>}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add New Salesman</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <SalesmanForm
                onSubmit={handleAddSalesman}
                onCancel={() => setShowAddModal(false)}
                submitButtonText="Add Salesman"
                title="Add New Salesman"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSalesman && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Edit Salesman</h3>
                <button className="close-btn" onClick={() => {
                  setShowEditModal(false);
                  setSelectedSalesman(null);
                }}>×</button>
              </div>
              <SalesmanForm
                onSubmit={handleEditSalesman}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedSalesman(null);
                }}
                submitButtonText="Update Salesman"
                title="Edit Salesman"
                initialData={selectedSalesman}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SalesmenTable; 