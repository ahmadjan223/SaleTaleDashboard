import React, { useState, useMemo, useCallback, useEffect } from 'react';
import useSalesmenStore from '../store/salesmenStore';

const RetailerFilterSearch = ({ filters, setFilter }) => {
  // State for searchable dropdowns
  const [salesmanSearchTerm, setSalesmanSearchTerm] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [isSalesmanDropdownOpen, setIsSalesmanDropdownOpen] = useState(false);

  // Get data from stores
  const { salesmen, fetchSalesmen } = useSalesmenStore();

  // Derive unique options from data
  const uniqueSalesmen = useMemo(() => {
    return salesmen.map(s => ({
      id: s._id,
      name: s.name
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [salesmen]);

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFilter(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  }, [setFilter]);

  const handleClearFilters = useCallback(() => {
    setFilter({});
    setSalesmanSearchTerm('');
    setSelectedSalesman('');
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
    <div className="retailer-filter-search-container" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,.05)' }}>
      <div className="filters-row" style={{ display: 'flex', gap: '40px', alignItems: 'flex-end' }}>
        {/* Assigned Salesman Dropdown */}
        <div className="filter-group-modern" style={{ position: 'relative', flex: '1', maxWidth: '250px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em', color: 'var(--text-light)' }}>Assigned Salesman</label>
          <input
            type="text"
            placeholder="Select Assigned Salesman"
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
                      handleFilterChange('assignedSalesman', salesman.id);
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

        {/* Active Status */}
        <div className="filter-group-modern" style={{ flex: '0 0 250px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em', color: 'var(--text-light)' }}>Status</label>
          <select 
            value={filters.active || ''} 
            onChange={(e) => handleFilterChange('active', e.target.value)}
            style={{ ...inputStyle, backgroundColor: 'var(--card-bg)', color: 'var(--text-light)' }}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="filter-actions-modern">
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

export default RetailerFilterSearch; 