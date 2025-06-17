import React, { useState, useEffect } from 'react';
import useRetailerStore from '../../store/retailerStore';
import { deleteRetailer, uploadRetailersCSV, downloadRetailersCSV } from '../../utils/api';
import RetailerForm from '../RetailerForm';
import RetailerDetailsCard from '../cards/RetailerDetailsCard';
import RetailerFilterSearch from '../RetailerFilterSearch';
import { searchRetailer } from '../../utils/searchUtils';

const RetailersPage = () => {
  const { 
    retailers, 
    filteredRetailers,
    fetchRetailers, 
    fetchFilteredRetailers,
    addRetailer, 
    toggleRetailerStatus, 
    updateRetailer 
  } = useRetailerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [localFilteredRetailers, setLocalFilteredRetailers] = useState([]);
  const [filter, setFilter] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  useEffect(() => {
    fetchRetailers();
  }, []);
  
  useEffect(() => {
    console.log("retailers", retailers)
  }, [retailers]);

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      fetchFilteredRetailers(filter);
    }
  }, [filter]);

  useEffect(() => {
    if (retailers) {
      const filtered = retailers.filter(retailer => searchRetailer(retailer, searchQuery));
      setLocalFilteredRetailers(filtered);
    }
  }, [searchQuery, retailers]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete retailer "${name}"? This will also delete all associated sales.`)) {
      try {
        await deleteRetailer(id);
        // Refresh the retailers list after successful deletion
        fetchRetailers();
      } catch (error) {
        console.error('Error deleting retailer:', error);
        alert('Failed to delete retailer. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleRetailerStatus(id, !currentStatus);
      // Refresh the retailers list after successful status change
      fetchRetailers();
    } catch (error) {
      console.error('Error toggling retailer status:', error);
      alert('Failed to update retailer status. Please try again.');
    }
  };

  const handleAddRetailer = async (formData) => {
    try {
      await addRetailer(formData);
      setShowAddModal(false);
      fetchRetailers(); // Refresh the list
    } catch (error) {
      console.error('Error adding retailer:', error);
      alert('Failed to add retailer. Please try again.');
    }
  };

  const handleEditRetailer = async (formData) => {
    try {
      const response = await updateRetailer(selectedRetailer._id, formData);
      if (response.success) {
        setShowEditModal(false);
        setSelectedRetailer(null);
        fetchRetailers(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to update retailer');
      }
    } catch (error) {
      console.error('Error updating retailer:', error);
      alert(error.message || 'Failed to update retailer. Please try again.');
    }
  };

  const handleEditClick = (retailer) => {
    setSelectedRetailer(retailer);
    setShowEditModal(true);
  };

  const handleRowClick = (retailer) => {
    setSelectedRetailer(retailer);
    setShowDetailsModal(true);
  };

  const handleDownloadCSV = () => {
    downloadRetailersCSV();
  };

  const handleUploadCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await uploadRetailersCSV(file);
      if (response.success) {
        alert(`CSV processing completed\nSuccess: ${response.successCount}\nErrors: ${response.errorCount}`);
        fetchRetailers(); // Refresh the list
      } else {
        alert('Error: ' + (response.message || 'Failed to process CSV'));
      }
    } catch (error) {
      console.error('CSV Upload Error:', error);
      alert('Error uploading CSV: ' + (error.response?.data?.message || error.message || 'Something went wrong'));
    }
  };

  if (!retailers) {
    return (
      <section>
        <RetailerFilterSearch filters={filter} setFilter={setFilter} />
        <div className="section-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search all retailers (ID, Name, Shop, Contact, Address, Location, Assigned Salesman, Status)"
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
              Add Retailer
            </button>
          </div>
        </div>
        <div className="table-container">
          <div className="loading-message">Loading retailers data...</div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <RetailerFilterSearch filters={filter} setFilter={setFilter} />
      <div className="section-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search all retailers (ID, Name, Shop, Contact, Address, Location, Assigned Salesman, Status)"
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
            Add Retailer
          </button>
        </div>
      </div>
      {!filteredRetailers ? (
        <div className="table-container">
          <div className="loading-message">Loading retailers data...</div>
        </div>
      ) : (
        <div className="table-container">
          {(Object.keys(filter).length > 0 ? filteredRetailers : localFilteredRetailers).length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Retailer Name</th>
                  <th>Shop Name</th>
                  <th>Location</th>
                  <th>Salesman Assigned</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(filter).length > 0 ? filteredRetailers : localFilteredRetailers).map((r, index) => (
                  <tr key={r._id} onClick={() => handleRowClick(r)} style={{ cursor: 'pointer' }}>
                    <td>{index + 1}</td>
                    <td>{r.retailerName}</td>
                    <td>{r.shopName}</td>
                    <td>
                      {r.location?.coordinates?.length === 2 ? (
                        <a 
                          href={`https://www.google.com/maps?q=${r.location.coordinates[1].toFixed(4)},${r.location.coordinates[0].toFixed(4)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Show on Map
                        </a>
                      ) : 'Not set'}
                    </td>
                    <td>{r?.assignedSalesman?.name || 'N/A'}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(r._id, r.active);
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: r.active ? 'var(--accent-green)' : 'red',
                          color: r.active ? 'white' : 'var(--accent-red)',
                          border: r.active ? 'none' : '1px solid var(--accent-red)',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        {r.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <button onClick={(e) => { e.stopPropagation(); handleEditClick(r);}} className="action-btn icon-btn edit-btn">✏️</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(r._id, r.retailerName);}} className="action-btn icon-btn delete-btn">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{paddingLeft:15}}>No retailers found matching your search.</p>}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRetailer && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Retailer Details</h3>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <RetailerDetailsCard retailer={selectedRetailer} />
            </div>
          </div>
        </div>
      )}

      {/* Add Retailer Modal */}
      {showAddModal && (
        <div className="modal-overlay">
              <RetailerForm
                onSubmit={handleAddRetailer}
                onCancel={() => setShowAddModal(false)}
                submitButtonText="Add Retailer"
                title="Add New Retailer"
              />
        </div>
      )}

      {/* Edit Retailer Modal */}
      {showEditModal && selectedRetailer && (
        <div className="modal-overlay">
              <RetailerForm
                onSubmit={handleEditRetailer}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedRetailer(null);
                }}
                submitButtonText="Update Retailer"
                title="Edit Retailer"
                initialData={selectedRetailer}
              />
        </div>
      )}

    
    </section>
  );
}

export default RetailersPage; 