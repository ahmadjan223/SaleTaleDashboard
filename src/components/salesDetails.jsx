import React from 'react';
import './AdminLogin.css'; // Reuse same theme styles (changed)

const SaleDetails = ({ sale, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="form-heading">Sale Details</h2> {/* Reuse form-heading style (changed) */}
        <div className="form-label">
          <strong>Retailer:</strong> {sale.addedBy.name}
        </div>
        <div className="form-label">
          <strong>Amount:</strong> ${sale.amount.toFixed(2)}
        </div>
        <div className="form-label">
          <strong>Products:</strong>
          <ul>
            {Object.entries(sale.products).map(([key, p]) => (
              <li key={key} className="form-label">
                {key}: {p.quantity} × ${p.price} = ${p.total.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <button className="submit-button" onClick={onClose}>Close</button> {/* Styled close button (changed) */}
      </div>
    </div>
  );
};

export default SaleDetails;
