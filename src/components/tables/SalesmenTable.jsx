import React, { useState, useEffect } from 'react';
import useSalesmenStore from '../../store/salesmenStore';
import { deleteItemApi } from '../../utils/api';

const SalesmenTable = ({ onRowCopy }) => {
  const { salesmen, fetchSalesmen, loading } = useSalesmenStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSalesmen, setFilteredSalesmen] = useState([]);

  useEffect(() => {
    fetchSalesmen();
  }, []);

  useEffect(() => {
    if (salesmen) {
      const filtered = salesmen.filter(salesman => 
        (salesman.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (salesman.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (salesman.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSalesmen(filtered);
    }
  }, [searchQuery, salesmen]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete salesman "${name}"? This will also delete all associated retailers and sales.`)) {
      try {
        await deleteItemApi('SALESMEN', id);
        // Refresh the salesmen list after successful deletion
        fetchSalesmen();
      } catch (error) {
        console.error('Error deleting salesman:', error);
        alert('Failed to delete salesman. Please try again.');
      }
    }
  };

  if (loading) {
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
          <button className="add-btn">
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
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalesmen.map((s, index) => (
                <tr key={s._id}>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(index + 1, 'Index');}}>{index + 1}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.name, 'Name');}}>{s.name}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.email, 'Email');}}>{s.email}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.phone, 'Phone');}}>{s.phone}</td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(s._id, s.name);}} className="action-btn icon-btn delete-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{paddingLeft:15}}>No salesmen found matching your search.</p>}
      </div>
    </section>
  );
}

export default SalesmenTable; 