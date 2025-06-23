  import React from 'react';
  import './app.css';

  const SaleDetails = ({ sale, onClose }) => {
    if (!sale) return null;

    const formatDate = (dateString) => new Date(dateString).toLocaleString();

    return (
      // Overlay backdrop: click outside closes modal
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
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: 'relative',
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            maxHeight: '80vh',
            width: '90%',
            maxWidth: '600px',
            overflowY: 'auto',
            padding: '24px',
            boxSizing: 'border-box',
            color: '#fff',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Heading */}
          <h2 style={{
            color: '#31C58D',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
            marginBottom: '16px',
          }}>
            Sale Details
          </h2>

          {/* Header details */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {[
              { label: 'Sale ID', value: sale._id },
              { label: 'Date', value: formatDate(sale.createdAt) },
              { label: 'Retailer Name', value: sale.retailer?.retailerName },
              { label: 'Retailer Contact', value: sale.retailer?.contactNo },
              { label: 'Salesman Name', value: sale.addedBy?.name },
              { label: 'Salesman Contact', value: sale.addedBy?.contactNo },
            ].map(({ label, value }) => (
              <div key={label} style={{ flex: '1 1 45%' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>
                  {label}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>
                  {value || 'N/A'}
                </p>
              </div>
            ))}
          </div>

          {/* Products table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 4px', color: '#fff' }}>Product</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', color: '#fff' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', color: '#fff' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', color: '#fff' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sale.products).map(([name, details]) => (
                <tr key={name}>
                  <td style={{ padding: '8px 4px', color: '#fff', fontSize: '16px' }}>{name}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', color: '#fff', fontSize: '16px' }}>
                    {details.quantity.toLocaleString()}
                  </td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', color: '#fff', fontSize: '16px' }}>
                    Rs. {details.price.toFixed(4)}
                  </td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', color: '#fff', fontSize: '16px' }}>
                    Rs. {details.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>
                  Total Amount
                </td>
                <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>
                  Rs. {sale.amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* View Location button */}
          {sale.coordinates?.coordinates && (
            <button
              onClick={() => window.open(
                `https://www.google.com/maps?q=${sale.coordinates.coordinates[1].toFixed(4)},${sale.coordinates.coordinates[0].toFixed(4)}`,
                '_blank'
              )}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                backgroundColor: '#31C58D',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              View Location
            </button>
          )}
        </div>
      </div>
    );
  };

  export default SaleDetails;
