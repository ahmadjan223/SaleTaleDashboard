import React, { useState, useEffect } from 'react';
import useProductStore from '../../store/productStore';
import AddProductForm from '../AddProductForm';
import ProductDetailsCard from '../cards/ProductDetailsCard';

const ProductsPage = () => {
  const { products, loading, error, fetchProducts, deleteProduct, toggleProductStatus } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleCloseModal = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <section>
        <div className="section-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '35px' }}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="header-actions">
            <button className="add-btn" onClick={() => setShowAddModal(true)}>
              <span className="plus-icon">+</span>
              Add Product
            </button>
          </div>
        </div>
        <div className="table-container">
          <div className="loading-message">Loading products data...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.price.toString().includes(searchQuery)
  );

  return (
    <section>
      <div className="section-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '35px' }}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <span className="plus-icon">+</span>
            Add Product
          </button>
        </div>
      </div>
      <div className="table-container">
        {filteredProducts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, index) => (
                <tr key={p._id} onClick={() => handleRowClick(p)} style={{ cursor: 'pointer' }}>
                  <td>{index + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.description}</td>
                  <td>
                    <span className={`status-badge ${p.active ? 'active' : 'inactive'}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProductStatus(p._id, !p.active);
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: p.active ? 'var(--accent-green)' : 'red',
                          color: p.active ? 'white' : 'var(--accent-red)',
                          border: p.active ? 'none' : '1px solid var(--accent-red)',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        {p.active ? 'Active' : 'Inactive'}
                      </button>
                    </span>
                  </td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }} className="action-btn icon-btn edit-btn">🖊️</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} className="action-btn icon-btn delete-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{paddingLeft:15}}>No products found matching your search.</p>}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <AddProductForm onClose={() => setShowAddModal(false)} />
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button className="modal-close-btn" onClick={() => {
                setShowEditModal(false);
                setEditingProduct(null);
              }}>×</button>
            </div>
            <div className="modal-body">
              <AddProductForm 
                product={editingProduct} 
                onClose={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {showProductDetails && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Product Details</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <ProductDetailsCard product={selectedProduct} />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default ProductsPage; 