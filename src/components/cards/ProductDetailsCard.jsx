// File: src/components/ProductDetailsCard.jsx

import React from 'react';
import '../app.css'; // ensure theme variables are defined here

const ProductDetailsCard = ({ product }) => {
  if (!product) return null;

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Card and typography styles using theme variables
  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-light)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1.5rem',
    maxWidth: '600px',
    margin: '1rem auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    fontFamily: 'Arial, sans-serif'
  };
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '1.5rem',
  };
  const titleStyle = {
    margin: '0 0 0.5rem 0',
    color: 'var(--accent-green)',
    fontSize: '1.75rem'
  };
  const subtitleStyle = {
    margin: '0',
    color: 'var(--text-light)',
    opacity: 0.8
  };
  const sectionGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  };
  const infoSection = {
    backgroundColor: 'var(--background-dark)',
    borderRadius: '6px',
    padding: '1rem'
  };
  const sectionHeader = {
    margin: '0 0 0.75rem 0',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
    color: 'var(--accent-green)',
    fontSize: '1.25rem'
  };
  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  };
  const labelStyle = {
    fontWeight: 'bold'
  };
  const statusStyle = {
    color: product.active ? 'var(--accent-green)' : 'var(--danger-red)',
    fontWeight: 'bold'
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Product Details</h2>
        <p style={subtitleStyle}>Added on {formatDate(product.createdAt)}</p>
      </div>

      <div style={sectionGrid}>
        {/* Basic Information */}
        <div style={infoSection}>
          <h3 style={sectionHeader}>Basic Information</h3>
          <div style={rowStyle}><span style={labelStyle}>Name:</span><span>{product.name || 'N/A'}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Description:</span><span>{product.description || 'N/A'}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Status:</span><span style={statusStyle}>{product.active ? 'Active' : 'Inactive'}</span></div>
        </div>

        {/* Pricing Information */}
        <div style={infoSection}>
          <h3 style={sectionHeader}>Pricing Information</h3>
          <div style={rowStyle}><span style={labelStyle}>Price:</span><span>Rs. {product.price?.toFixed(4) || 'N/A'}</span></div>
          <div style={rowStyle}><span style={labelStyle}>ID:</span><span>{product._id || 'N/A'}</span></div>
        </div>
      </div>

      {/* Additional Information */}
      <div style={{ ...infoSection, marginTop: '1rem' }}>
        <h3 style={sectionHeader}>Additional Information</h3>
        <div style={rowStyle}><span style={labelStyle}>Version:</span><span>{product.__v ?? '0'}</span></div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
