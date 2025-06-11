import React, { useEffect } from 'react';
import TableActionsHeader from './TableActionsHeader';
import useSalesStore from '../../store/salesStore';
import useRetailerStore from '../../store/retailerStore';
import useProductStore from '../../store/productStore';
const SalesTable = ({ onRowCopy, onCellMouseEnter, onCellMouseLeave }) => {
  const { 
    sales, 
    loading, 
    error, 
    fetchSales,
    deleteSale
  } = useSalesStore();

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(()=>{
    console.log("sales", sales)
  },[sales])
  const {getRetailerById} = useRetailerStore();

  const retailerDetails = (id) =>{
    const response =  getRetailerById(id)
    return response
  }
  const {getProductById} = useProductStore();
  const productDetails = (id) =>{
    const response = getProductById(id);
    return response;
  }

  if (loading) {
    return (
      <section className="content-area">
        <div className="section-header"><h2>Sales</h2><TableActionsHeader/></div>
        <div className="table-container">
          <div className="loading-message">Loading sales data...</div>
        </div>
      </section>
    );
  }

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
                <th>Location</th>
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
                    { retailerDetails(s.retailer)?.retailerName || 'N/A'}
                  </td>
                  <td 
                    onClick={(e) => {e.stopPropagation(); onRowCopy(s.product?.name || s.product, 'Product');}}
                    onMouseEnter={(e) => onCellMouseEnter(e, 'Product', 'SALES', s)}
                    onMouseLeave={onCellMouseLeave}
                  >
                    {productDetails(s.product)?.name || 'N/A'}
                  </td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.quantity, 'Quantity');}}>{s.quantity}</td>
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
                    onClick={(e) => {e.stopPropagation(); onRowCopy(s.addedBy?.name || s.addedBy || 'N/A', 'Added By');}}
                    onMouseEnter={(e) => onCellMouseEnter(e, 'Added By', 'SALES', s)}
                    onMouseLeave={onCellMouseLeave}
                  >
                    {s.addedBy?.name || (typeof s.addedBy === 'object' && s.addedBy !== null ? s.addedBy._id : s.addedBy) || 'N/A'}
                  </td>
                  <td>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        deleteSale(s._id, s.product?.name || s._id);
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
    </section>
  );
};

export default SalesTable; 