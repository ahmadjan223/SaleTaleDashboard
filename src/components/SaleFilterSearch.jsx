import React, { useState, useMemo, useCallback } from 'react';
import useSalesmenStore from '../store/salesmenStore'
import useRetailerStore from '../store/retailerStore'
import useProductStore from '../store/productStore'
const SaleFilterSearch = ({ onSearch, onClear }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    salesman: '',
    product: '',
    retailer: '',
    startDate: '',
    endDate: '',
  });

  // State for searchable dropdowns
  const [salesmanSearchTerm, setSalesmanSearchTerm] = useState('');
  const [isSalesmanDropdownOpen, setIsSalesmanDropdownOpen] = useState(false);
  const [selectedSalesmanName, setSelectedSalesmanName] = useState('');

  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');

  const [retailerSearchTerm, setRetailerSearchTerm] = useState('');
  const [isRetailerDropdownOpen, setIsRetailerDropdownOpen] = useState(false);
  const [selectedRetailerName, setSelectedRetailerName] = useState('');

  // Derive unique options from sales data
  const {salesmen} = useSalesmenStore();
  const uniqueSalesmen = useMemo(() => {
    const elements = new Set();
    salesmen.forEach(s => {
      if (s.name) {
        elements.add(s.name);
      } 
    });
    return Array.from(elements).sort();
  }, [salesmen]);

  const {products} = useProductStore();
  const uniqueProducts = useMemo(() => {
    const elements = new Set();
    products.forEach(s => {
      if (s.name) {
        elements.add(s.name);
      } 
    });
    return Array.from(elements).sort();
  }, [products]);

  const {retailers} = useRetailerStore();
  const uniqueRetailers = useMemo(() => {
   console.log(retailers) 
    const elements = new Set();
    retailers.forEach(s => {
      if (s.retailerName) {
        elements.add(s.retailerName);
      } 
    });
    return Array.from(elements).sort();
  }, [retailers]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(searchQuery, filters);
  }, [onSearch, searchQuery, filters]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({
      salesman: '',
      product: '',
      retailer: '',
      startDate: '',
      endDate: '',
    });
    setSelectedSalesmanName('');
    setSalesmanSearchTerm('');
    setSelectedProductName('');
    setProductSearchTerm('');
    setSelectedRetailerName('');
    setRetailerSearchTerm('');
    onClear();
  }, [onClear]);

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    fontSize: '0.95em',
    color: '#333',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,.04)',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#fff'
  };

  const dropdownOptionStyle = {
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    color: '#333',
  };

  const buttonStylePrimary = {
    padding: '10px 20px',
    background: 'var(--accent-green)',
    color: 'var(--background-dark)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    flexShrink: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,.1)'
  };

  const buttonStyleSecondary = {
    padding: '10px 20px',
    background: 'var(--border-color)',
    color: 'var(--text-light)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    flexShrink: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,.1)'
  };

  return (
    <div className="sale-filter-search-container" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,.05)' }}>
      <div className="top-search-bar" style={{ display: 'flex', marginBottom: '20px', border: '1px solid var(--border-color)', borderRadius: '5px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
        <input 
          type="text" 
          placeholder="Search all sales (ID, Salesman, Product, Retailer)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ ...inputStyle, border: 'none', borderRadius: '0', boxShadow: 'none', padding: '10px 15px', backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
        />
        <button 
          onClick={handleSearch}
          style={{ ...buttonStylePrimary, borderRadius: '0', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          🔍
        </button>
      </div>

      <div className="filters-row-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '15px' }}>
        {/* Salesman Dropdown */}
        <div className="filter-group-modern" style={{ position: 'relative', width:"80%" }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em', color: 'var(--text-light)' }}>Salesman</label>
          <input
            type="text"
            placeholder="Select Salesman"
            value={isSalesmanDropdownOpen ? salesmanSearchTerm : selectedSalesmanName}
            onChange={(e) => {
              setSalesmanSearchTerm(e.target.value);
              setIsSalesmanDropdownOpen(true);
            }}
            onFocus={() => setIsSalesmanDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsSalesmanDropdownOpen(false), 100)}
            style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
          />
          {isSalesmanDropdownOpen && (
            <div className="dropdown-options" style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              zIndex: 1000,
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              marginTop: '5px'
            }}>
              {uniqueSalesmen
                .filter(name => name.toLowerCase().includes(salesmanSearchTerm.toLowerCase()))
                .map(name => (
                  <div
                    key={name}
                    onMouseDown={() => {
                      setSelectedSalesmanName(name);
                      handleFilterChange('salesman', name);
                      setIsSalesmanDropdownOpen(false);
                      setSalesmanSearchTerm('');
                    }}
                    style={{ ...dropdownOptionStyle, color: 'var(--text-light)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {name}
                  </div>
                ))}
              {uniqueSalesmen.filter(name => name.toLowerCase().includes(salesmanSearchTerm.toLowerCase())).length === 0 && (
                <div style={{ ...dropdownOptionStyle, cursor: 'default', color: 'var(--text-light)', background: 'var(--card-bg)' }}>No results</div>
              )}
            </div>
          )}
        </div>

        {/* Product Dropdown */}
        <div className="filter-group-modern" style={{ position: 'relative',width:"80%" }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em', color: 'var(--text-light)' }}>Product</label>
          <input
            type="text"
            placeholder="Select Product"
            value={isProductDropdownOpen ? productSearchTerm : selectedProductName}
            onChange={(e) => {
              setProductSearchTerm(e.target.value);
              setIsProductDropdownOpen(true);
            }}
            onFocus={() => setIsProductDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsProductDropdownOpen(false), 100)}
            style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
          />
          {isProductDropdownOpen && (
            <div className="dropdown-options" style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              zIndex: 1000,
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              marginTop: '5px'
            }}>
              {uniqueProducts
                .filter(name => name.toLowerCase().includes(productSearchTerm.toLowerCase()))
                .map(name => (
                  <div
                    key={name}
                    onMouseDown={() => {
                      setSelectedProductName(name);
                      handleFilterChange('product', name);
                      setIsProductDropdownOpen(false);
                      setProductSearchTerm('');
                    }}
                    style={{ ...dropdownOptionStyle, color: 'var(--text-light)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {name}
                  </div>
                ))}
              {uniqueProducts.filter(name => name.toLowerCase().includes(productSearchTerm.toLowerCase())).length === 0 && (
                <div style={{ ...dropdownOptionStyle, cursor: 'default', color: 'var(--text-light)', background: 'var(--card-bg)' }}>No results</div>
              )}
            </div>
          )}
        </div>

        {/* Retailer Dropdown */}
        <div className="filter-group-modern" style={{ position: 'relative',width:"80%" }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em', color: 'var(--text-light)' }}>Retailer</label>
          <input
            type="text"
            placeholder="Select Retailer"
            value={isRetailerDropdownOpen ? retailerSearchTerm : selectedRetailerName}
            onChange={(e) => {
              setRetailerSearchTerm(e.target.value);
              setIsRetailerDropdownOpen(true);
            }}
            onFocus={() => setIsRetailerDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsRetailerDropdownOpen(false), 100)}
            style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
          />
          {isRetailerDropdownOpen && (
            <div className="dropdown-options" style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              zIndex: 1000,
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0,0,0,.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              marginTop: '5px'
            }}>
              {uniqueRetailers
                .filter(name => name.toLowerCase().includes(retailerSearchTerm.toLowerCase()))
                .map(name => (
                  <div
                    key={name}
                    onMouseDown={() => {
                      setSelectedRetailerName(name);
                      handleFilterChange('retailer', name);
                      setIsRetailerDropdownOpen(false);
                      setRetailerSearchTerm('');
                    }}
                    style={{ ...dropdownOptionStyle, color: 'var(--text-light)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {name}
                  </div>
                ))}
              {uniqueRetailers.filter(name => name.toLowerCase().includes(retailerSearchTerm.toLowerCase())).length === 0 && (
                <div style={{ ...dropdownOptionStyle, cursor: 'default', color: 'var(--text-light)', background: 'var(--card-bg)' }}>No results</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="filters-row-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        {/* Date Duration */}
        <div className="filter-group-modern">
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em', color: 'var(--text-light)' }}>Date Duration</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="date" 
              name="startDate" 
              value={filters.startDate} 
              onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
              style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
            />
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-light)' }}>-</span>
            <input 
              type="date" 
              name="endDate" 
              value={filters.endDate} 
              onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
              style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
            />
          </div>
        </div>
        {/* Placeholder for remaining space in second row */}
        <div className="filter-group-modern" style={{ visibility: 'hidden' }}></div>
        <div className="filter-group-modern" style={{ visibility: 'hidden' }}></div>
        
        <div className="filter-actions-modern" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', gridColumn: 'span var(--num-cols, 1)', alignItems: 'flex-end' }}>
        <button 
          onClick={handleSearch}
          style={buttonStylePrimary}
        >
          Search
        </button>
        <button 
          onClick={handleClearFilters}
          style={buttonStyleSecondary}
        >
          Clear filters
        </button>
      </div>
      </div>
    </div>
  );
};

export default SaleFilterSearch; 