import React from 'react';
import { useNavigate } from 'react-router-dom';

const APK_URL = 'https://example.com/your-app.apk'; // TODO: Replace with actual APK link

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .landing-card {
            padding: 1rem !important;
            max-width: 100% !important;
            width: 100% !important;
            border-radius: 10px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
          }
          .landing-title {
            font-size: 1.2rem !important;
            margin-bottom: 1.2rem !important;
          }
          .landing-btn {
            font-size: 1rem !important;
            padding: 0.75rem !important;
          }
        }
      `}</style>
      <div style={styles.wrapper}>
        <div className="landing-card" style={styles.card}>
          <h1 className="landing-title" style={styles.title}>Welcome to SaleTale Dashboard</h1>
          <div style={styles.buttonGroup}>
            <button className="landing-btn" style={styles.button} onClick={() => navigate('/admin/login')}>
              Admin Panel
            </button>
            <a href={APK_URL} className="landing-btn" style={{ ...styles.button, ...styles.linkButton }} download>
              Download APK for Mobile App
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--background-dark, #181c20)',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  card: {
    background: 'var(--card-bg, #23272f)',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    padding: '2.5rem 2rem',
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  title: {
    color: 'var(--accent-green, #4ade80)',
    fontSize: '2rem',
    marginBottom: '2rem',
    fontWeight: 700,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  button: {
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    background: 'var(--accent-green, #4ade80)',
    color: 'var(--text-light, #fff)',
    cursor: 'pointer',
    transition: 'background 0.2s',
    textDecoration: 'none',
    display: 'block',
  },
  linkButton: {
    textAlign: 'center',
  },
};

export default LandingPage; 