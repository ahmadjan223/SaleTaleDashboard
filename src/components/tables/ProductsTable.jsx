import React, { useState, useEffect } from 'react';
import useProductStore from '../../store/productStore';
import AddProductForm from '../AddProductForm';

const ProductsTable = ({ onRowCopy }) => {
  const { products, fetchProducts, loading, deleteProduct, addProduct, updateProduct, toggleProductStatus } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.price.toString().includes(searchQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleAddProduct = async (formData) => {
    try {
      await addProduct(formData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleEditProduct = async (formData) => {
    try {
      await updateProduct(editingProduct._id, formData);
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleProductStatus(id, !currentStatus);
    } catch (error) {
      console.error('Error toggling product status:', error);
      alert('Failed to update product status. Please try again.');
    }
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
                <tr key={p._id}>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(index + 1, 'Index');}}>{index + 1}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.name, 'Name');}}>{p.name}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.price, 'Price');}}>{p.price}</td>
                  <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.description, 'Description');}}>{p.description}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={p.active}
                        onChange={(e) => { e.stopPropagation(); handleToggleStatus(p._id, p.active); }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); handleEditClick(p); }} className="action-btn icon-btn edit-btn">🖊️</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id, p.name); }} className="action-btn icon-btn delete-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No products found matching your search.</p>}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Product</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <AddProductForm 
                onSubmit={handleAddProduct}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Product</h3>
              <button className="modal-close-btn" onClick={handleEditCancel}>×</button>
            </div>
            <div className="modal-body">
              <AddProductForm
                initialValues={editingProduct}
                onSubmit={handleEditProduct}
                onCancel={handleEditCancel}
                submitButtonText="Update Product"
                title="Edit Product"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #4CAF50;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #4CAF50;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .slider.round {
          border-radius: 24px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </section>
  );
}

export default ProductsTable; 