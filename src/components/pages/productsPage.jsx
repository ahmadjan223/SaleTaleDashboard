import React, { useState, useEffect } from 'react';
import useProductStore from '../../store/productStore';
import { searchProduct } from '../../utils/searchUtils';
import AddProductForm from '../AddProductForm';
import ProductDetailsCard from '../cards/ProductDetailsCard';
import PasswordConfirmModal from '../PasswordConfirmModal';

const ProductsPage = () => {
  const { products, fetchProducts, loading, addProduct, toggleProductStatus, updateProduct, deleteProduct } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const addProductHandler = (formData) => {
    addProduct(formData);
    setShowAddModal(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product => searchProduct(product, searchQuery));
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleDelete = (id) => {
    const product = products.find(p => p._id === id);
    setProductToDelete(product);
    setShowPasswordModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete._id);
      setProductToDelete(null);
      setShowPasswordModal(false);
    }
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
    setShowPasswordModal(false);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleEditProduct = async (formData) => {
    try {
      await updateProduct(selectedProduct._id, formData);
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts(); // Refresh the list
    } catch {
      // Optionally show an error message
      alert('Failed to update product. Please try again.');
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <section>
        <div className="section-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search all products (ID, Name, Description, Category, Brand, SKU, Price, Stock, Status)"
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

  return (
    <section>
      <div className="section-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search all products (ID, Name, Description, Category, Brand, SKU, Price, Stock, Status)"
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
                          const confirmMsg = p.active
                            ? "Are you sure you want to deactivate this product? Salesmen will not be able to make sales against it."
                            : "Are you sure you want to activate this product?";
                          if (window.confirm(confirmMsg)) {
                            toggleProductStatus(p._id, !p.active);
                          }
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
                  <div className="action-buttons">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }} className="action-btn icon-btn edit-btn">🖊️</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} className="action-btn icon-btn delete-btn">🗑️</button>
                  </div>
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
              <AddProductForm
                onSubmit={addProductHandler}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <AddProductForm
                onSubmit={handleEditProduct}
                onCancel={handleCloseModal}
                initialValues={selectedProduct}
                submitButtonText="Update Product"
                title="Edit Product"
              />
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <ProductDetailsCard product={selectedProduct} onClose={handleCloseModal} />
            </div>
          </div>
        </div>
      )}

      <PasswordConfirmModal
        visible={showPasswordModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

    </section>
  );
};

export default ProductsPage; 