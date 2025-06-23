import React, { useState, useEffect } from 'react';
import useSalesmanStore from '../../store/salesmenStore';
import { deleteSalesman, uploadSalesmenCSV, downloadSalesmenCSV } from '../../utils/api';
import SalesmanForm from '../SalesmanForm';
import SalesmanDetailsCard from '../cards/SalesmanDetailsCard';
import SalesmanFilterSearch from '../SalesmanFilterSearch';
import { searchSalesman } from '../../utils/searchUtils';
import PasswordConfirmModal from '../PasswordConfirmModal';

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
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [salesmanToDelete, setSalesmanToDelete] = useState(null);

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

  const handleDelete = (id) => {
    const salesman = salesmen.find(s => s._id === id);
    setSalesmanToDelete(salesman);
    setShowPasswordModal(true);
  };

  const handleConfirmDelete = async () => {
    if (salesmanToDelete) {
      try {
        await deleteSalesman(salesmanToDelete._id);
        fetchSalesmen(); // Refresh the list
      } catch (error) {
        console.error('Error deleting salesman:', error);
        alert('Failed to delete salesman. Please try again.');
      } finally {
        setSalesmanToDelete(null);
        setShowPasswordModal(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setSalesmanToDelete(null);
    setShowPasswordModal(false);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const actionText = currentStatus ? 'deactivate' : 'activate';
    const warningText = currentStatus ? ' An inactive salesman cannot have any sales recorded.' : '';
    
    if (window.confirm(`Are you sure you want to ${actionText} this salesman?${warningText}`)) {
      try {
        await toggleSalesmanStatus(id, !currentStatus);
        // The store handles the state update, so we just need to re-fetch
        fetchSalesmen();
      } catch (error) {
        console.error('Error toggling salesman status:', error);
        alert('Failed to update salesman status. Please try again.');
      }
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
      console.error('Error updating salesman check form:', error);
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

  const handleUploadCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadSalesmenCSV(file);
      if (response.success) {
        alert(`CSV uploaded successfully!\nProcessed: ${response.successCount} records\nErrors: ${response.errorCount}${response.errors ? '\n\nErrors:\n' + response.errors.map(e => `- ${e.error}`).join('\n') : ''}`);
        fetchSalesmen(); // Refresh the list
      } else {
        alert(response.message || 'Failed to upload CSV. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert(error.message || 'Failed to upload CSV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadCSV = () => {
    downloadSalesmenCSV();
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
      {isUploading && (
        <div className="modal-overlay" style={{ zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>
            <p>Uploading and processing CSV...</p>
            <p>This may take a moment. Please wait.</p>
          </div>
        </div>
      )}
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
          <button className="action-btn" onClick={handleDownloadCSV}>
            📥 Download CSV
          </button>
          <label className="action-btn" style={{ cursor: 'pointer' }}>
            📤 Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleUploadCSV}
              style={{ display: 'none' }}
            />
          </label>
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
                  <th>Franchise</th>
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
                    <td>{s.franchise?.name || 'N/A'}</td>
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
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(s); }} className="action-btn icon-btn edit-btn">🖊️</button>
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
            
              <SalesmanForm
                onSubmit={handleAddSalesman}
                onCancel={() => setShowAddModal(false)}
                submitButtonText="Add Salesman"
                title="Add New Salesman"
              />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSalesman && (
        <div className="modal-overlay">
          <div className="modal">
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
      )}

      <PasswordConfirmModal
        visible={showPasswordModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete salesman "${salesmanToDelete?.firstName} ${salesmanToDelete?.lastName}"? Deleting this salesman will also delete their relevant sales. A better option is to simply set their status to Inactive.`}
      />
    
    </section>
  );
};

export default SalesmenPage; 