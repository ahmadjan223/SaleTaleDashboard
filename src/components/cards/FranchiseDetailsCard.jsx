import React from 'react';
import PropTypes from 'prop-types';
import '../app.css';

const FranchiseDetailsCard = ({ franchise, onClose }) => {
  if (!franchise) return null;

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
          Franchise Details
        </h2>

        {/* Details Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>ID</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
              {franchise._id}
            </p>
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Added On</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
              {formatDate(franchise.createdAt)}
            </p>
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Name</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
              {franchise.name || 'N/A'}
            </p>
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Address</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
              {franchise.address || 'N/A'}
            </p>
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Master SIM No</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-light)', fontWeight: 'bold' }}>
              {franchise.masterSimNo || 'N/A'}
            </p>
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)', opacity: 0.7 }}>Status</p>
            <p style={{ margin: '4px 0 0', fontSize: '16px', color: franchise.active ? 'var(--accent-green)' : 'var(--danger-red)', fontWeight: 'bold' }}>
              {franchise.active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

FranchiseDetailsCard.propTypes = {
  franchise: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    masterSimNo: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default FranchiseDetailsCard; 