import React, { useState, useEffect } from 'react';
import useFranchiseStore from '../../store/franchiseStore';
import { deleteFranchise } from '../../utils/api';
import AddFranchiseForm from '../AddFranchiseForm';
import FranchiseDetailsCard from '../cards/FranchiseDetailsCard';
import { searchFranchise } from '../../utils/searchUtils';

const FranchisePage = () => {
  const { franchises, fetchFranchises, loading, error, addFranchise, updateFranchise, toggleFranchiseStatus } = useFranchiseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFranchises, setFilteredFranchises] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState(null);

  useEffect(() => {
    fetchFranchises();
  }, []);

  useEffect(() => {
    if (franchises) {
      const filtered = franchises.filter(franchise => searchFranchise(franchise, searchQuery));
      setFilteredFranchises(filtered);
    }
  }, [searchQuery, franchises]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this franchise?')) {
      await deleteFranchise(id);
    }
  };

  const handleEdit = (franchise) => {
    setSelectedFranchise(franchise);
    setShowDetailsModal(true);
  };

  const handleRowClick = (franchise) => {
    setSelectedFranchise(franchise);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedFranchise(null);
  };

  if (!franchises) {
    return (
      <section>
        <div className="section-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search all franchises (ID, Name, Description, Address, Contact, Email, Master SIM, Status)"
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
              Add Franchise
            </button>
          </div>
        </div>
        <div className="table-container">
          <div className="loading-message">Loading franchises data...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <div className="section-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search all franchises (ID, Name, Description, Address, Contact, Email, Master SIM, Status)"
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
            Add Franchise
          </button>
        </div>
      </div>
      <div className="table-container">
        {filteredFranchises.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Address</th>
                <th>Master SIM No</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFranchises.map((f, index) => (
                <tr key={f._id} onClick={() => handleRowClick(f)} style={{ cursor: 'pointer' }}>
                  <td>{index + 1}</td>
                  <td>{f.name || 'N/A'}</td>
                  <td>{f.address || 'N/A'}</td>
                  <td>{f.masterSimNo || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${f.active ? 'active' : 'inactive'}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFranchiseStatus(f._id, !f.active);
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: f.active ? 'var(--accent-green)' : 'red',
                          color: f.active ? 'white' : 'var(--accent-red)',
                          border: f.active ? 'none' : '1px solid var(--accent-red)',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        {f.active ? 'Active' : 'Inactive'}
                      </button>
                    </span>
                  </td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(f); }} className="action-btn icon-btn edit-btn">🖊️</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(f._id); }} className="action-btn icon-btn delete-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <p>No franchises found matching your search.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Franchise</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <AddFranchiseForm onClose={() => setShowAddModal(false)} />
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedFranchise && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Franchise Details</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <FranchiseDetailsCard franchise={selectedFranchise} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FranchisePage; 