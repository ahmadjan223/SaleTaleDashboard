import React, { useState, useEffect } from 'react';
import useRetailerStore from '../../store/retailerStore';
import { deleteRetailer } from '../../utils/api';
import RetailerForm from '../RetailerForm';

const RetailersTable = ({ onRowCopy }) => {
  const { retailers, fetchRetailers, loading, addRetailer, toggleRetailerStatus, updateRetailer } = useRetailerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRetailers, setFilteredRetailers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  useEffect(() => {
    fetchRetailers();
  }, []);
  
  useEffect(() => {
    console.log("salesmen", retailers)

  }, [retailers]);
  
  useEffect(() => {
    if (retailers) {
      const filtered = retailers.filter(retailer => 
        retailer.retailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        retailer.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        retailer.location?.coordinates?.join(', ').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (retailer.addedBy?.name || retailer.addedBy || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRetailers(filtered);
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

  if (!retailers) {
    return (
      <section>
        <div className="section-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search retailers..."
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
      <div className="section-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search retailers..."
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
            Add Retailer
          </button>
        </div>
      </div>
      <div className="table-container">
        {filteredRetailers.length > 0 ? (
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
              {filteredRetailers.map((r, index) => (
                <tr key={r._id}>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(index + 1, 'Index');}}>{index + 1}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.retailerName, 'Retailer Name');}}>{r.retailerName}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.shopName, 'Shop Name');}}>{r.shopName}</td>
                  <td>
                    {r.location?.coordinates?.length === 2 ? (
                      <a 
                        href={`https://www.google.com/maps?q=${r.location.coordinates[1]},${r.location.coordinates[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        Show on Map
                      </a>
                    ) : 'Not set'}
                  </td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy( r?.assignedSalesman?.name || 'N/A', 'Added By');}}>{r?.assignedSalesman?.name || 'N/A'}</td>
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

      <style jsx>{`
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

        .modal-close-btn {
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

        .modal-close-btn:hover {
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
      `}</style>
    </section>
  );
}

export default RetailersTable; 