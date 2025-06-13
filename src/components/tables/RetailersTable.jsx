import React from 'react';
import TableActionsHeader from './TableActionsHeader';
import useRetailerStore from '../../store/retailerStore';
import { useEffect } from 'react';
import { deleteRetailerApi } from '../../utils/api';

const RetailersTable = ({ onRowCopy }) => {
  const { retailers, fetchRetailers, loading } = useRetailerStore();

  useEffect(() => {
    fetchRetailers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete retailer "${name}"? This will also delete all associated sales.`)) {
      try {
        await deleteRetailerApi(id);
        // Refresh the retailers list after successful deletion
        fetchRetailers();
      } catch (error) {
        console.error('Error deleting retailer:', error);
        alert('Failed to delete retailer. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <section className="content-area">
        <div className="section-header"><h2>Retailers</h2><TableActionsHeader/></div>
        <div className="table-container">
          <div className="loading-message">Loading retailers data...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="content-area">
      <div className="section-header">
        <h2>Retailers</h2>
        <TableActionsHeader />
      </div>
      <div className="table-container">
        {retailers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Retailer Name</th>
                <th>Shop Name</th>
                <th>Location</th>
                <th>Added By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {retailers.map((r, index) => (
                <tr key={r._id}>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(index + 1, 'Index');}}>{index + 1}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.retailerName, 'Retailer Name');}}>{r.retailerName}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.shopName, 'Shop Name');}}>{r.shopName}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.location?.coordinates?.join(', ') || 'N/A', 'Location');}}>{r.location?.coordinates?.join(', ') || 'N/A'}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.addedBy?.name || r.addedBy || 'N/A', 'Added By');}}>{r.addedBy?.name || r.addedBy || 'N/A'}</td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(r._id, r.retailerName);}} className="action-btn icon-btn delete-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No retailers data found.</p>}
      </div>
    </section>
  );
}

export default RetailersTable; 