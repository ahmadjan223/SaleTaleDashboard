import React, { useState, useMemo, useCallback, useEffect } from 'react';
import useSalesmenStore from '../store/salesmenStore';
import useRetailerStore from '../store/retailerStore';
import useProductStore from '../store/productStore';

// Helper functions to get start of week and today in yyyy-mm-dd format
function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

const SaleFilterSearch = ({ filters, setFilter }) => {
  const [saleId, setSaleId] = useState('');
  const [salesmanSearchTerm, setSalesmanSearchTerm] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState('');
  const [isSalesmanOpen, setIsSalesmanOpen] = useState(false);

  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isProductOpen, setIsProductOpen] = useState(false);

  const [retailerSearchTerm, setRetailerSearchTerm] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [isRetailerOpen, setIsRetailerOpen] = useState(false);

  const { salesmen, fetchSalesmen } = useSalesmenStore();
  const { products, fetchProducts } = useProductStore();
  const { retailers, fetchRetailers } = useRetailerStore();

  useEffect(() => {
    fetchSalesmen();
    fetchProducts();
    fetchRetailers();
  }, []);

  const uniqueSalesmen = useMemo(() =>
    salesmen.map(s => ({ id: s._id, name: s.name })).sort((a, b) => a.name.localeCompare(b.name)),
    [salesmen]
  );
  const uniqueProducts = useMemo(() =>
    products.map(p => ({ id: p._id, name: p.name })).sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );
  const uniqueRetailers = useMemo(() =>
    retailers.map(r => ({ id: r._id, name: r.retailerName })).sort((a, b) => a.name.localeCompare(b.name)),
    [retailers]
  );

  const handleFilterChange = useCallback((name, value) => {
    setFilter(prev => ({ ...prev, [name]: value }));
  }, [setFilter]);

  const handleClear = useCallback(() => {
    setFilter({
      startDate: getStartOfWeek(),
      endDate: getToday()
    });
    setSaleId('');
    setSelectedSalesman(''); setSalesmanSearchTerm('');
    setSelectedProduct(''); setProductSearchTerm('');
    setSelectedRetailer(''); setRetailerSearchTerm('');
  }, [setFilter]);

  const containerStyle = {
    padding: '20px',
    background: 'var(--card-bg)',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,.05)'  
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'auto auto',
    gap: '10px'
  };

  const inputBase = {
    width: '100%',
    padding: '8px',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    fontSize: '0.9em',
    outline: 'none',
    background: 'var(--card-bg)',
    color: 'var(--text-light)'
  };

  // Dark dropdown background
  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 10,
    maxHeight: '150px',
    overflowY: 'auto',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    background: 'var(--card-bg)'
  };

  // Light dropdown text
  const optionStyle = {
    padding: '8px',
    cursor: 'pointer',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-light)'  
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
      <div style={{ position: 'relative',paddingRight:20 }}>
          <input
            type="text"
            placeholder="Sale ID"
            value={saleId}
            onChange={e => { setSaleId(e.target.value); handleFilterChange('id', e.target.value); }}
            style={inputBase}
          />
        </div>

        <div style={{ position: 'relative',paddingRight:20 }}>
          <input
            type="text"
            placeholder="Salesman"
            value={isSalesmanOpen ? salesmanSearchTerm : selectedSalesman}
            onChange={e => { setSalesmanSearchTerm(e.target.value); setIsSalesmanOpen(true); }}
            onFocus={() => { setIsSalesmanOpen(true); setSalesmanSearchTerm(''); }}
            onBlur={() => setTimeout(() => setIsSalesmanOpen(false), 100)}
            style={inputBase}
          />
          {isSalesmanOpen && (
            <div style={dropdownStyle}>
              {uniqueSalesmen.filter(s => s.name.toLowerCase().includes(salesmanSearchTerm.toLowerCase())).map(s => (
                <div key={s.id} onMouseDown={() => { setSelectedSalesman(s.name); handleFilterChange('salesman', s.id); setIsSalesmanOpen(false); }} style={optionStyle}>
                  {s.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative',paddingRight:20 }}>
          <input
            type="text"
            placeholder="Product"
            value={isProductOpen ? productSearchTerm : selectedProduct}
            onChange={e => { setProductSearchTerm(e.target.value); setIsProductOpen(true); }}
            onFocus={() => { setIsProductOpen(true); setProductSearchTerm(''); }}
            onBlur={() => setTimeout(() => setIsProductOpen(false), 100)}
            style={inputBase}
          />
          {isProductOpen && (
            <div style={dropdownStyle}>
              {uniqueProducts.filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase())).map(p => (
                <div key={p.id} onMouseDown={() => { setSelectedProduct(p.name); handleFilterChange('product', p.name); setIsProductOpen(false); }} style={optionStyle}>
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative', paddingRight:20 }}>
          <input
            type="text"
            placeholder="Retailer"
            value={isRetailerOpen ? retailerSearchTerm : selectedRetailer}
            onChange={e => { setRetailerSearchTerm(e.target.value); setIsRetailerOpen(true); }}
            onFocus={() => { setIsRetailerOpen(true); setRetailerSearchTerm(''); }}
            onBlur={() => setTimeout(() => setIsRetailerOpen(false), 100)}
            style={inputBase}
          />
          {isRetailerOpen && (
            <div style={dropdownStyle}>
              {uniqueRetailers.filter(r => r.name.toLowerCase().includes(retailerSearchTerm.toLowerCase())).map(r => (
                <div key={r.id} onMouseDown={() => { setSelectedRetailer(r.name); handleFilterChange('retailer', r.id); setIsRetailerOpen(false); }} style={optionStyle}>
                  {r.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={e => handleFilterChange('startDate', e.target.value)}
            style={{ ...inputBase, flex: 1 }}
          />
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={e => handleFilterChange('endDate', e.target.value)}
            style={{ ...inputBase, flex: 1 }}
          />
        </div>

        <div>
          <select
            value={filters.valid || ''}
            onChange={e => handleFilterChange('valid', e.target.value)}
            style={inputBase}
          >
            <option value="">All Sales</option>
            <option value="true">Valid</option>
            <option value="false">Invalid</option>
          </select>
        </div>

        <div style={{ gridColumn: '4 / 5', justifySelf: 'end' }}>
          <button
            onClick={handleClear}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleFilterSearch;
