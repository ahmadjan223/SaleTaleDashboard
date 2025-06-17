import React, { useEffect, useState } from 'react';
import useSalesStore from '../../store/salesStore';
import SaleFilterSearch from '../SaleFilterSearch';
import SaleDetails from '../salesDetails';
import { searchSale } from '../../utils/searchUtils';

const SalesPage = ({ onCellMouseEnter, onCellMouseLeave }) => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [localFilteredSales, setLocalFilteredSales] = useState([]);
  const [showSaleDetailsModal, setShowSaleDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      fetchFilteredSales(filter);
    }
  }, [filter]);

  useEffect(() => {
    if (sales) {
      const filtered = sales.filter(sale => searchSale(sale, searchQuery));
      setLocalFilteredSales(filtered);
    }
  }, [searchQuery, sales]);

  const formatProducts = (products) => {
    if (!products) return 'N/A';
    const productNames = Object.keys(products);
    if (productNames.length === 0) return 'N/A';
    if (productNames.length === 1) return productNames[0];
    return `${productNames.join(', ')}...`;
  };

  const handleRowClick = (sale) => {
    setSelectedSale(sale);
    setShowSaleDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowSaleDetailsModal(false);
    setSelectedSale(null);
  };

  if (error) return <div className="content-area"><h2 className="error-message">Error loading sales: {error}</h2></div>;

  // Use filteredSales if filters are applied, otherwise use sales
  const displaySales = Object.keys(filter).length > 0 ? filteredSales : 
                      searchQuery.trim() ? localFilteredSales : sales;

  return (
    <section>
      <SaleFilterSearch filters={filter} setFilter={setFilter} />
      <div className="section-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search all sales (ID, Retailer, Product, Salesman, Amount, Location)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '35px' }}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
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
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Added By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displaySales.map((s, index) => (
                  <tr key={s._id} onClick={() => handleRowClick(s)} style={{ cursor: 'pointer' }}>
                    <td>{index + 1}</td>
                    <td 
                      onMouseEnter={(e) => onCellMouseEnter(e, 'Retailer', 'SALES', s)}
                      onMouseLeave={onCellMouseLeave}
                    >
                      {s.retailer?.retailerName || 'N/A'}
                    </td>
                    <td 
                      onMouseEnter={(e) => onCellMouseEnter(e, 'Product', 'SALES', s)}
                      onMouseLeave={onCellMouseLeave}
                    >
                      {formatProducts(s.products)}
                    </td>
                    <td>{s.amount}</td>
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
                      onMouseEnter={(e) => onCellMouseEnter(e, 'Added By', 'SALES', s)}
                      onMouseLeave={onCellMouseLeave}
                    >
                      {s.addedBy?.name || 'N/A'}
                    </td>
                    <td>
                      <span className={`status-badge ${s.valid ? 'Valid' : 'Invalid'}`}>
                        <button
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: s.valid ? 'var(--accent-green)' : 'red',
                            color: s.valid ? 'white' : 'white',
                            border: 'none',
                            cursor: 'default',
                            transition: 'opacity 0.2s'
                          }}
                        >
                          {s.valid ? 'Valid' : 'Invalid'}
                        </button>
                      </span>
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
            <p style={{paddingLeft:15}}>No sales data found.</p>
          )}
        </div>
      )}

      {showSaleDetailsModal && selectedSale && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <SaleDetails sale={selectedSale} onClose={handleCloseModal} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SalesPage; 