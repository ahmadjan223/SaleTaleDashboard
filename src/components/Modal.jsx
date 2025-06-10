import React from 'react';

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = 'Confirm', showConfirm = true }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="action-btn cancel-btn">Close</button>
          {showConfirm && onConfirm && (
            <button onClick={onConfirm} className="action-btn confirm-btn">{confirmText}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal; 