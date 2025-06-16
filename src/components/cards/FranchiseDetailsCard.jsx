import React from 'react';
import PropTypes from 'prop-types';

const FranchiseDetailsCard = ({ franchise }) => {
  return (
    <div className="details-card">
      <div className="details-section">
        <h4>Basic Information</h4>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Name:</span>
            <span className="value">{franchise.name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Address:</span>
            <span className="value">{franchise.address}</span>
          </div>
          <div className="detail-item">
            <span className="label">Master SIM No:</span>
            <span className="value">{franchise.masterSimNo}</span>
          </div>
          <div className="detail-item">
            <span className="label">Status:</span>
            <span className={`value status ${franchise.active ? 'active' : 'inactive'}`}>
              {franchise.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Created At:</span>
            <span className="value">{new Date(franchise.createdAt).toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="label">Last Updated:</span>
            <span className="value">{new Date(franchise.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .details-card {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
        }

        .details-section {
          margin-bottom: 20px;
        }

        .details-section h4 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .value {
          font-size: 14px;
          color: #333;
        }

        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .status.active {
          background-color: var(--accent-green);
          color: white;
        }

        .status.inactive {
          background-color: var(--accent-red);
          color: white;
        }
      `}</style>
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
  }).isRequired
};

export default FranchiseDetailsCard; 