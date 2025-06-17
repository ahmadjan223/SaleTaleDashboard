import React, { useState, useEffect } from 'react';
import useSalesmanStore from '../../store/salesmenStore';
import { deleteSalesman } from '../../utils/api';
import SalesmanForm from '../SalesmanForm';
import SalesmanDetailsCard from '../cards/SalesmanDetailsCard';
import SalesmanFilterSearch from '../SalesmanFilterSearch';
import { searchSalesman } from '../../utils/searchUtils';

const SalesmenPage = () => {
  const { 
    salesmen, 
    filteredSalesmen,
    fetchSalesmen, 
    fetchFilteredSalesmen,
    addSalesman, 
    updateSalesman, 
    toggleSalesmanStatus 
  } = useSalesmanStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [localFilteredSalesmen, setLocalFilteredSalesmen] = useState([]);
  const [filter, setFilter] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState(null);

  useEffect(() => {
    fetchSalesmen();
  }, []);

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      fetchFilteredSalesmen(filter);
    }
  }, [filter]);

  useEffect(() => {
    if (salesmen) {
      const filtered = salesmen.filter(salesman => searchSalesman(salesman, searchQuery));
      setLocalFilteredSalesmen(filtered);
    }
  }, [searchQuery, salesmen]);

  const handleDelete = async (id) => {
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

  const handleRowClick = (salesman) => {
    setSelectedSalesman(salesman);
    setShowDetailsModal(true);
  };

  if (!salesmen) {
    return (
      <section className>
        <div className="section-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search all salesmen (ID, Name, Email, Contact, Address, Franchise, Status)"
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
      <SalesmanFilterSearch filters={filter} setFilter={setFilter} />
      <div className="section-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search all salesmen (ID, Name, Email, Contact, Address, Franchise, Status)"
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
      {!(filteredSalesmen ) ? (
        <div className="table-container">
          <div className="loading-message">Loading salesmen data...</div>
        </div>
      ) : (
        <div className="table-container">
          {(Object.keys(filter).length > 0 ? filteredSalesmen : localFilteredSalesmen).length > 0 ? (
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
                {(Object.keys(filter).length > 0 ? filteredSalesmen : localFilteredSalesmen).map((s, index) => (
                  <tr key={s._id} onClick={() => handleRowClick(s)} style={{ cursor: 'pointer' }}>
                    <td>{index + 1}</td>
                    <td>{`${s.firstName} ${s.lastName}`}</td>
                    <td>{s.email}</td>
                    <td>{s.contactNo}</td>
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
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(s._id); }} className="action-btn icon-btn delete-btn">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{paddingLeft:15}}>No salesmen found matching your search.</p>}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedSalesman && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Salesman Details</h3>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <SalesmanDetailsCard salesman={selectedSalesman} />
            </div>
          </div>
        </div>
      )}

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

      {/* <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }

        .modal-header h3 {
          margin: 0;
          color: var(--accent-green);
          font-size: 1.2rem;
          font-weight: 500;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background-color: #f5f5f5;
          color: #333;
        }

        .modal-body {
          padding: 24px;
        }

        @media (max-width: 768px) {
          .modal-content {
            max-height: 95vh;
          }
        }
      `}</style> */}
    </section>
  );
};

export default SalesmenPage; 