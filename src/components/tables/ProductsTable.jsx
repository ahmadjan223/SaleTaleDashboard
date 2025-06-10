import React from 'react';
import TableActionsHeader from './TableActionsHeader';
import useProductStore from '../../store/productStore';
import { useEffect } from 'react';

const ProductsTable = ({ onDelete, onRowCopy, deletingItemId }) => {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="content-area">
        <div className="section-header"><h2>Products</h2><TableActionsHeader/></div>
        <div className="table-container">
          <div className="loading-message">Loading products data...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="content-area">
      <div className="section-header">
        <h2>Products</h2>
        <TableActionsHeader />
      </div>
      <div className="table-container">
        {products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(p._id, 'ID');}}>{p._id}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.name, 'Name');}}>{p.name}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.price, 'Price');}}>{p.price}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.description, 'Description');}}>{p.description}</td>
                  <td>
                    {deletingItemId === p._id ? 
                      <div className="loader-small"></div> :
                      <button onClick={(e) => { e.stopPropagation(); onDelete('PRODUCTS', p._id, p.name);}} className="action-btn icon-btn delete-btn">🗑️</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No products data found.</p>}
      </div>
    </section>
  );
}

export default ProductsTable; 