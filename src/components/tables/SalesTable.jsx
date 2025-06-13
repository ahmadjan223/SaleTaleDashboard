import React, { useEffect, useState } from 'react';
import useSalesStore from '../../store/salesStore';
import SaleFilterSearch from '../SaleFilterSearch';

const SalesTable = ({ onRowCopy, onCellMouseEnter, onCellMouseLeave }) => {
  const { 
    sales, 
    filteredSales,
    loading, 
    error, 
    fetchSales,
    fetchFilteredSales,
    deleteSale
  } = useSalesStore();
  const [filter, setFilter] = useState({});

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      fetchFilteredSales(filter);
    }
  }, [filter]);

  const formatProducts = (products) => {
    if (!products) return 'N/A';
    const productNames = Object.keys(products);
    if (productNames.length === 0) return 'N/A';
    if (productNames.length === 1) return productNames[0];
    return `${productNames.join(', ')}...`;
  };

  if (error) return <div className="content-area"><h2 className="error-message">Error loading sales: {error}</h2></div>;

  // Use filteredSales if filters are applied, otherwise use sales
  const displaySales = Object.keys(filter).length > 0 ? filteredSales : sales;

  return (
    <section>
      <SaleFilterSearch filters={filter} setFilter={setFilter} />
      {loading ? (
        <section className="content-area">
          <div className="table-container">
            <div className="loading-message">Loading sales data...</div>
          </div>
        </section>
      ) : (
        <div className="table-container">
          {displaySales.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Retailer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Added By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displaySales.map((s, index) => (
                  <tr key={s._id}>
                    <td onClick={(e) => {e.stopPropagation()}}>{index + 1}</td>
                    <td 
                      onClick={(e) => {e.stopPropagation(); onRowCopy(s.retailer?.shopName || 'N/A', 'Retailer');}}
                      onMouseEnter={(e) => onCellMouseEnter(e, 'Retailer', 'SALES', s)}
                      onMouseLeave={onCellMouseLeave}
                    >
                      {s.retailer?.retailerName || 'N/A'}
                    </td>
                    <td 
                      onClick={(e) => {e.stopPropagation(); onRowCopy(formatProducts(s.products), 'Product');}}
                      onMouseEnter={(e) => onCellMouseEnter(e, 'Product', 'SALES', s)}
                      onMouseLeave={onCellMouseLeave}
                    >
                      {formatProducts(s.products)}
                    </td>
                    <td onClick={(e) => {e.stopPropagation(); onRowCopy(Object.values(s.products || {})[0]?.quantity || 'N/A', 'Quantity');}}>
                      {Object.values(s.products || {})[0]?.quantity || 'N/A'}
                    </td>
                    <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.amount, 'Amount');}}>{s.amount}</td>
                    <td>
                      {s.coordinates?.coordinates ? (
                        <a 
                          href={`https://www.google.com/maps?q=${s.coordinates.coordinates[1]},${s.coordinates.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Show on Map
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td 
                      onClick={(e) => {e.stopPropagation(); onRowCopy(s.addedBy?.name || 'N/A', 'Added By');}}
                      onMouseEnter={(e) => onCellMouseEnter(e, 'Added By', 'SALES', s)}
                      onMouseLeave={onCellMouseLeave}
                    >
                      {s.addedBy?.name || 'N/A'}
                    </td>
                    <td>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          deleteSale(s._id, Object.keys(s.products || {})[0] || s._id);
                        }} 
                        className="action-btn icon-btn delete-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No sales data found.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default SalesTable; 