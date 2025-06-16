// File: src/components/SalesmanDetailsCard.jsx

import React from 'react';
import '../app.css'; // ensure theme variables are defined here

const SalesmanDetailsCard = ({ salesman }) => {
  if (!salesman) return null;

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // === Added theme-based style objects ===
  const cardStyle = {                                       /* Added cardStyle */
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
  const headerStyle = {                                     /* Added headerStyle */
    textAlign: 'center',
    marginBottom: '1.5rem',
  };
  const titleStyle = {                                      /* Added titleStyle */
    margin: '0 0 0.5rem 0',
    color: 'var(--accent-green)',
    fontSize: '1.75rem'
  };
  const subtitleStyle = {                                   /* Added subtitleStyle */
    margin: '0',
    color: 'var(--text-light)',
    opacity: 0.8
  };
  const sectionGrid = {                                     /* Added sectionGrid */
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  };
  const infoSection = {                                     /* Added infoSection */
    backgroundColor: 'var(--background-dark)',
    borderRadius: '6px',
    padding: '1rem'
  };
  const sectionHeader = {                                   /* Added sectionHeader */
    margin: '0 0 0.75rem 0',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
    color: 'var(--accent-green)',
    fontSize: '1.25rem'
  };
  const rowStyle = {                                        /* Added rowStyle */
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  };
  const labelStyle = {                                      /* Added labelStyle */
    fontWeight: 'bold'
  };
  const statusStyle = {                                     /* Added statusStyle */
    color: salesman.active ? 'var(--accent-green)' : 'var(--danger-red)',
    fontWeight: 'bold'
  };
  // === end of additions ===

  return (
    <div style={cardStyle}>                                  {/* Changed from inline to cardStyle */}
      <div style={headerStyle}>                              {/* Changed from inline */}
        <h2 style={titleStyle}>Salesman Details</h2>         {/* Changed from inline */}
        <p style={subtitleStyle}>                           {/* Changed from inline */}
          Added on {formatDate(salesman.createdAt)}
        </p>
      </div>

      <div style={sectionGrid}>                              {/* Changed from inline */}
        <div style={infoSection}>                           {/* Changed from inline */}
          <h3 style={sectionHeader}>Basic Information</h3>   {/* Changed from inline */}
          <div style={rowStyle}><span style={labelStyle}>Full Name:</span><span>{salesman.name || 'N/A'}</span></div>
          <div style={rowStyle}><span style={labelStyle}>First Name:</span><span>{salesman.firstName || 'N/A'}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Last Name:</span><span>{salesman.lastName || 'N/A'}</span></div>
          <div style={rowStyle}>
            <span style={labelStyle}>Status:</span>
            <span style={statusStyle}>{salesman.active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        <div style={infoSection}>                           {/* Changed from inline */}
          <h3 style={sectionHeader}>Contact Information</h3> {/* Changed from inline */}
          <div style={rowStyle}><span style={labelStyle}>Primary Contact:</span><span>{salesman.contactNo || 'N/A'}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Secondary Contact:</span><span>{salesman.contactNo2 || 'N/A'}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Email:</span><span>{salesman.email || 'N/A'}</span></div>
        </div>
      </div>

      <div style={{ ...infoSection, marginTop: '1rem' }}>    {/* Minor inline tweak kept for margin */}
        <h3 style={sectionHeader}>Additional Information</h3>
        <div style={rowStyle}><span style={labelStyle}>Last Updated:</span><span>{formatDate(salesman.updatedAt)}</span></div>
        {salesman.franchise && (
          <div style={rowStyle}><span style={labelStyle}>Franchise:</span><span>{salesman.franchise}</span></div>
        )}
      </div>
    </div>
  );
};

export default SalesmanDetailsCard;