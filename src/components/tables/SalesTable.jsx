import React, { useEffect } from 'react';
import TableActionsHeader from './TableActionsHeader';
import useSalesStore from '../../store/salesStore';

const SalesTable = ({ onRowCopy, onCellMouseEnter, onCellMouseLeave }) => {
  const { 
    sales, 
    loading, 
    error, 
    deletingItemId,
    fetchSales,
    deleteSale
  } = useSalesStore();

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  if (loading) return <div className="content-area"><h2 className="loading-message">Loading sales...</h2></div>;
  if (error) return <div className="content-area"><h2 className="error-message">Error loading sales: {error}</h2></div>;

  return (
    <section className="content-area">
      <div className="section-header">
        <h2>Sales</h2>
        <TableActionsHeader onRefresh={fetchSales} />
      </div>
      <div className="table-container">
        {sales.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Retailer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Coordinates</th>
                <th>Added By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s._id}>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s._id, 'ID');}}>{s._id}</td>
                  <td 
                    onClick={(e) => {e.stopPropagation(); onRowCopy(s.retailer?.shopName || s.retailer, 'Retailer');}}
                    onMouseEnter={(e) => onCellMouseEnter(e, 'Retailer', 'SALES', s)}
                    onMouseLeave={onCellMouseLeave}
                  >
                    {s.retailer?.shopName || (typeof s.retailer === 'object' && s.retailer !== null ? s.retailer._id : s.retailer) || 'N/A'}
                  </td>
                  <td 
                    onClick={(e) => {e.stopPropagation(); onRowCopy(s.product?.name || s.product, 'Product');}}
                    onMouseEnter={(e) => onCellMouseEnter(e, 'Product', 'SALES', s)}
                    onMouseLeave={onCellMouseLeave}
                  >
                    {s.product?.name || (typeof s.product === 'object' && s.product !== null ? s.product._id : s.product) || 'N/A'}
                  </td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.quantity, 'Quantity');}}>{s.quantity}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.amount, 'Amount');}}>{s.amount}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.coordinates?.coordinates?.join(', ') || 'N/A', 'Coordinates');}}>
                    {s.coordinates?.coordinates?.join(', ') || 'N/A'}
                  </td>
                  <td 
                    onClick={(e) => {e.stopPropagation(); onRowCopy(s.addedBy?.name || s.addedBy || 'N/A', 'Added By');}}
                    onMouseEnter={(e) => onCellMouseEnter(e, 'Added By', 'SALES', s)}
                    onMouseLeave={onCellMouseLeave}
                  >
                    {s.addedBy?.name || (typeof s.addedBy === 'object' && s.addedBy !== null ? s.addedBy._id : s.addedBy) || 'N/A'}
                  </td>
                  <td>
                    {deletingItemId === s._id ? 
                      <div className="loader-small"></div> :
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          deleteSale(s._id, s.product?.name || s._id);
                        }} 
                        className="action-btn icon-btn delete-btn"
                      >
                        🗑️
                      </button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No sales data found.</p>
        )}
      </div>
    </section>
  );
};

export default SalesTable; 