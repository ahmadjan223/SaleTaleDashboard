import React from 'react';
import TableActionsHeader from './TableActionsHeader';
import useSalesmenStore from '../../store/salesmenStore';
import { useEffect } from 'react';
import { deleteItemApi } from '../../utils/api';

const SalesmenTable = ({ onRowCopy }) => {
  const { salesmen, fetchSalesmen, loading } = useSalesmenStore();

  useEffect(() => {
    fetchSalesmen();
  }, []);

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
      <section className="content-area">
        <div className="section-header"><h2>Salesmen</h2><TableActionsHeader/></div>
        <div className="table-container">
          <div className="loading-message">Loading salesmen data...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="content-area">
      <div className="section-header"><h2>Salesmen</h2><TableActionsHeader/></div>
      <div className="table-container">
        {salesmen.length > 0 ? (<table>
            <thead><tr><th>Index</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
            <tbody>
              {salesmen.map((s, index) => (
                <tr key={s._id} >
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
          </table>) : <p>No salesmen data found.</p>}
      </div>
    </section>
  );
}

export default SalesmenTable; 