import React, { useEffect, useState } from 'react';
import useSalesStore from '../../store/salesStore';
import SaleFilterSearch from '../SaleFilterSearch';
import SaleDetails from '../salesDetails';
import { searchSale } from '../../utils/searchUtils';
import {format, subDays, parse, endOfDay } from 'date-fns';


const SalesPage = ({ onCellMouseEnter, onCellMouseLeave }) => {

  const today = format(new Date(), 'yyyy-MM-dd');
  const weekAgo = format(subDays(new Date(), 6), 'yyyy-MM-dd');
  const { 
    filteredSales,
    loading, 
    error, 
    fetchFilteredSales,
    deleteSale
  } = useSalesStore();
  const [filter, setFilter] = useState({
    startDate: weekAgo,
    endDate: today
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaleDetailsModal, setShowSaleDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [sortBy, setSortBy] = useState('date_desc');

  

  useEffect(() => {
    // Only fetch filtered sales on mount (with default filter)
    fetchFilteredSales(filter);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      const { startDate, endDate, ...restFilters } = filter;
      const filtersWithIsoDates = { ...restFilters };

      if (startDate) {
        filtersWithIsoDates.startDate = parse(startDate, 'yyyy-MM-dd', new Date()).toISOString();
      }
      if (endDate) {
        filtersWithIsoDates.endDate = endOfDay(parse(endDate, 'yyyy-MM-dd', new Date())).toISOString();
      }

      fetchFilteredSales(filtersWithIsoDates);
    }
    // eslint-disable-next-line
  }, [filter]);

  // Filtered and searched sales
  let displaySales = searchQuery.trim()
    ? filteredSales.filter(sale => searchSale(sale, searchQuery))
    : filteredSales;

  // Sort logic
  if (sortBy === 'date_desc') {
    displaySales = [...displaySales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'date_asc') {
    displaySales = [...displaySales].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortBy === 'amount_desc') {
    displaySales = [...displaySales].sort((a, b) => b.amount - a.amount);
  } else if (sortBy === 'amount_asc') {
    displaySales = [...displaySales].sort((a, b) => a.amount - b.amount);
  } else if (sortBy === 'retailer_az') {
    displaySales = [...displaySales].sort((a, b) => (a.retailer?.retailerName || '').localeCompare(b.retailer?.retailerName || ''));
  } else if (sortBy === 'retailer_za') {
    displaySales = [...displaySales].sort((a, b) => (b.retailer?.retailerName || '').localeCompare(a.retailer?.retailerName || ''));
  }

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

  return (
    <section>
      <SaleFilterSearch filters={filter} setFilter={setFilter} />
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <div style={{ minWidth: 180 }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              background: 'var(--card-bg)',
              color: 'var(--text-light)',
              border: '1px solid var(--border-color)',
              fontSize: '0.95rem',
              minWidth: '180px',
              outline: 'none',
              transition: 'border 0.2s',
            }}
          >
            <option value="date_desc">Date: Newest First</option>
            <option value="date_asc">Date: Oldest First</option>
            <option value="amount_desc">Amount: High to Low</option>
            <option value="amount_asc">Amount: Low to High</option>
            <option value="retailer_az">Retailer: A-Z</option>
            <option value="retailer_za">Retailer: Z-A</option>
          </select>
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
                          if (window.confirm('Are you sure you want to delete this sale?')) {
                            deleteSale(s._id, Object.keys(s.products || {})[0] || s._id);
                          }
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