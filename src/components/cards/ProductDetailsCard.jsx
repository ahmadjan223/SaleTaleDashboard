import React from 'react';
import '../app.css';

const ProductDetailsCard = ({ product, onClose }) => {
  if (!product) return null;

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-light)',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '600px',
          width: '90%',
          margin: '1rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heading */}
        <h2 style={{
          color: 'var(--accent-green)',
          fontSize: '1.75rem',
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          Product Details
        </h2>

        {/* Details Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: '1 1 45%' }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>ID</p>
          <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
            {product._id}
          </p>
        </div>
        <div style={{ flex: '1 1 45%' }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Added On</p>
          <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
            {formatDate(product.createdAt)}
          </p>
        </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Name</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
              {product.name || 'N/A'}
            </p>
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Description</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
              {product.description || 'N/A'}
            </p>
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Status</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: product.active ? 'var(--accent-green)' : 'var(--danger-red)', fontWeight: 'bold' }}>
              {product.active ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Price</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
              Rs. {product.price?.toFixed(2) || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
