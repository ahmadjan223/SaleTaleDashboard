import React from 'react';
import TableActionsHeader from './TableActionsHeader';
import useRetailerStore from '../../store/retailerStore';
import { useEffect } from 'react';
const RetailersTable = ({ onDelete, onRowCopy, deletingItemId }) => {
  const { retailers, fetchRetailers } = useRetailerStore();

  useEffect(() => {
    fetchRetailers();
  }, []);

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
              <th>ID</th>
              <th>Retailer Name</th>
              <th>Shop Name</th>
              <th>Location</th>
              <th>Added By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {retailers.map(r => (
              <tr key={r._id}>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r._id, 'ID');}}>{r._id}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.retailerName, 'Retailer Name');}}>{r.retailerName}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.shopName, 'Shop Name');}}>{r.shopName}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.location?.coordinates?.join(', ') || 'N/A', 'Location');}}>{r.location?.coordinates?.join(', ') || 'N/A'}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.addedBy?.name || r.addedBy || 'N/A', 'Added By');}}>{r.addedBy?.name || r.addedBy || 'N/A'}</td>
                <td>
                  {deletingItemId === r._id ? 
                    <div className="loader-small"></div> :
                    <button onClick={(e) => { e.stopPropagation(); onDelete('RETAILERS', r._id, r.retailerName);}} className="action-btn icon-btn delete-btn">🗑️</button>
                  }
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