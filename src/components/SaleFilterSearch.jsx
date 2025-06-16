import React, { useState, useMemo, useCallback,useEffect } from 'react';
import useSalesmenStore from '../store/salesmenStore'
import useRetailerStore from '../store/retailerStore'
import useProductStore from '../store/productStore'

const SaleFilterSearch = ({ filters, setFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // State for searchable dropdowns
  const [salesmanSearchTerm, setSalesmanSearchTerm] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [isSalesmanDropdownOpen, setIsSalesmanDropdownOpen] = useState(false);

  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const [retailerSearchTerm, setRetailerSearchTerm] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [isRetailerDropdownOpen, setIsRetailerDropdownOpen] = useState(false);

  // Derive unique options from sales data
  const {salesmen,fetchSalesmen} = useSalesmenStore();
  const uniqueSalesmen = useMemo(() => {
    return salesmen.map(s => ({
      id: s._id,
      name: s.name
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [salesmen]);

  const {products,fetchProducts} = useProductStore();
  const uniqueProducts = useMemo(() => {
    return products.map(p => ({
      id: p._id,
      name: p.name
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const {retailers,fetchRetailers} = useRetailerStore();
  const uniqueRetailers = useMemo(() => {
    return retailers.map(r => ({
      id: r._id,
      name: r.retailerName
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [retailers]);

  useEffect(()=>{
    fetchProducts();
    fetchRetailers();
    fetchSalesmen();
  },[])

  const handleFilterChange = useCallback((name, value) => {
    setFilter(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  }, [setFilter]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setFilter({});
    setSalesmanSearchTerm('');
    setSelectedSalesman('');
    setProductSearchTerm('');
    setSelectedProduct('');
    setRetailerSearchTerm('');
    setSelectedRetailer('');
  }, [setFilter]);

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
          onClick={() => handleFilterChange('search', searchQuery)}
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
            value={isSalesmanDropdownOpen ? salesmanSearchTerm : selectedSalesman}
            onChange={(e) => {
              setSalesmanSearchTerm(e.target.value);
              setIsSalesmanDropdownOpen(true);
            }}
            onFocus={() => {
              setIsSalesmanDropdownOpen(true);
              setSalesmanSearchTerm('');
            }}
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
                .filter(salesman => salesman.name.toLowerCase().includes(salesmanSearchTerm.toLowerCase()))
                .map(salesman => (
                  <div
                    key={salesman.id}
                    onMouseDown={() => {
                      setSelectedSalesman(salesman.name);
                      setSalesmanSearchTerm('');
                      handleFilterChange('salesman', salesman.id);
                      setIsSalesmanDropdownOpen(false);
                    }}
                    style={{ ...dropdownOptionStyle, color: 'var(--text-light)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {salesman.name}
                  </div>
                ))}
              {uniqueSalesmen.filter(salesman => salesman.name.toLowerCase().includes(salesmanSearchTerm.toLowerCase())).length === 0 && (
                <div style={{ ...dropdownOptionStyle, cursor: 'default', color: 'var(--text-light)', background: 'var(--card-bg)' }}>No results</div>
              )}
            </div>
          )}
        </div>

        {/* Product Dropdown */}
        <div className="filter-group-modern" style={{ position: 'relative', width:"80%" }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em', color: 'var(--text-light)' }}>Product</label>
          <input
            type="text"
            placeholder="Select Product"
            value={isProductDropdownOpen ? productSearchTerm : selectedProduct}
            onChange={(e) => {
              setProductSearchTerm(e.target.value);
              setIsProductDropdownOpen(true);
            }}
            onFocus={() => {
              setIsProductDropdownOpen(true);
              setProductSearchTerm('');
            }}
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
                .filter(product => product.name.toLowerCase().includes(productSearchTerm.toLowerCase()))
                .map(product => (
                  <div
                    key={product.id}
                    onMouseDown={() => {
                      setSelectedProduct(product.name);
                      setProductSearchTerm('');
                      handleFilterChange('product', product.name);
                      setIsProductDropdownOpen(false);
                    }}
                    style={{ ...dropdownOptionStyle, color: 'var(--text-light)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {product.name}
                  </div>
                ))}
              {uniqueProducts.filter(product => product.name.toLowerCase().includes(productSearchTerm.toLowerCase())).length === 0 && (
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
            value={isRetailerDropdownOpen ? retailerSearchTerm : selectedRetailer}
            onChange={(e) => {
              setRetailerSearchTerm(e.target.value);
              setIsRetailerDropdownOpen(true);
            }}
            onFocus={() => {
              setIsRetailerDropdownOpen(true);
              setRetailerSearchTerm('');
            }}
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
                .filter(retailer => retailer.name.toLowerCase().includes(retailerSearchTerm.toLowerCase()))
                .map(retailer => (
                  <div
                    key={retailer.id}
                    onMouseDown={() => {
                      setSelectedRetailer(retailer.name);
                      setRetailerSearchTerm('');
                      handleFilterChange('retailer', retailer.id);
                      setIsRetailerDropdownOpen(false);
                    }}
                    style={{ ...dropdownOptionStyle, color: 'var(--text-light)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {retailer.name}
                  </div>
                ))}
              {uniqueRetailers.filter(retailer => retailer.name.toLowerCase().includes(retailerSearchTerm.toLowerCase())).length === 0 && (
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
              value={filters.startDate || ''} 
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
            />
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-light)' }}>-</span>
            <input 
              type="date" 
              name="endDate" 
              value={filters.endDate || ''} 
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
            />
          </div>
        </div>
        {/* Placeholder for remaining space in second row */}
        <div className="filter-group-modern" style={{ visibility: 'hidden' }}></div>
        <div className="filter-group-modern" style={{ visibility: 'hidden' }}></div>
        
        <div className="filter-actions-modern" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', gridColumn: 'span var(--num-cols, 1)', alignItems: 'flex-end' }}>
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