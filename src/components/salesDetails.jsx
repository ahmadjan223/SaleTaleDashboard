// File: src/pages/SaleDetails.js

import React from 'react';
import './app.css';

const SaleDetails = ({ sale, onClose }) => {
  if (!sale) return null;

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const formatProducts = (products) => Object.entries(products).map(([name, details]) => (
    <div key={name} style={{ marginBottom: '15px' }}>
      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{name}</p>
      <p style={{ margin: '2px 0', paddingLeft: '20px' }}>Quantity: {details.quantity.toLocaleString()}</p>
      <p style={{ margin: '2px 0', paddingLeft: '20px' }}>Price: Rs. {details.price.toFixed(4)}</p>
      <p style={{ margin: '2px 0', paddingLeft: '20px' }}>Total: Rs. {details.total.toLocaleString()}</p>
    </div>
  ));

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 5px 0' }}>Sale Invoice</h2>
        <p style={{ margin: '0', color: '#666' }}>{formatDate(sale.createdAt)}</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '20px'
      }}>
        <div>
          <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Retailer Details</h3>
          <p style={{ margin: '5px 0' }}><strong>Name:</strong> {sale.retailer?.retailerName || 'N/A'}</p>
          <p style={{ margin: '5px 0' }}><strong>Contact:</strong> {sale.retailer?.contactNo || 'N/A'}</p>
        </div>

        <div>
          <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Salesman Details</h3>
          <p style={{ margin: '5px 0' }}><strong>Name:</strong> {sale.addedBy?.name || 'N/A'}</p>
          <p style={{ margin: '5px 0' }}><strong>Contact:</strong> {sale.addedBy?.contactNo || 'N/A'}</p>
        </div>
      </div>

      <div style={{ 
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Products</h3>
        {formatProducts(sale.products)}
        <div style={{ 
          marginTop: '15px', 
          borderTop: '1px solid #ddd',
          paddingTop: '10px'
        }}>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Total Amount: Rs. {sale.amount.toLocaleString()}</p>
        </div>
      </div>

      {sale.coordinates?.coordinates && (
        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '20px'
        }}>
          <a
            href={`https://www.google.com/maps?q=${sale.coordinates.coordinates[1].toFixed(4)},${sale.coordinates.coordinates[0].toFixed(4)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0066cc', textDecoration: 'underline' }}
          >
            View Location on Map
          </a>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SaleDetails;
