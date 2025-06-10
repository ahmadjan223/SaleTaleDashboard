import React from 'react';
import TableActionsHeader from './TableActionsHeader';
import useSalesmenStore from '../../store/salesmenStore';
import { useEffect } from 'react';

const SalesmenTable = ({ onRowCopy }) => {
  const { salesmen, fetchSalesmen, loading,deleteSalesman } = useSalesmenStore();

  useEffect(() => {
    fetchSalesmen();
  }, []);

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
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Verified</th><th>Actions</th></tr></thead>
            <tbody>
              {salesmen.map(sm => (
                <tr key={sm.googleId || sm._id} >
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.googleId || sm._id, 'ID');}}>{sm.googleId || sm._id}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.name, 'Name');}}>{sm.name}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.email, 'Email');}}>{sm.email}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.phone, 'Phone');}}>{sm.phone}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.verified ? 'Yes' : 'No', 'Verified');}}>{sm.verified ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); deleteSalesman('SALESMEN', sm.googleId || sm._id, sm.name);}} className="action-btn icon-btn delete-btn">🗑️</button>
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