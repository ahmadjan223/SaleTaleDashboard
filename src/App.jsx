import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import axios from 'axios'
import { adminLogout } from './utils/api'
import { validateAdminToken } from './utils/api'

// Components
import Toast from './components/Toast'
import Tooltip from './components/Tooltip'
import TopBar from './components/layout/TopBar'
import Sidebar from './components/layout/Sidebar'
import SalesPage from './components/pages/salesPage'
import ProductsPage from './components/pages/productsPage'
import RetailersPage from './components/pages/retailersPage'
import SalesmenPage from './components/pages/salesmenPage'
import FranchisePage from './components/pages/franchisePage'
import HomePage from './components/pages/homePage'
import AdminLogin from './components/AdminLogin'
import AdminProfilePage from './components/pages/AdminProfilePage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateTokenAsync = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        await validateAdminToken(token);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid/expired token
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setIsAuthenticated(false);
        
        // Show error message if it's a token expiration
        if (error.response?.data?.error?.includes('expired')) {
          console.log('Token expired. Please login again.');
        }
      } finally {
        setIsValidating(false);
      }
    };

    validateTokenAsync();
  }, []);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  // Responsive sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarToggle = () => setSidebarOpen(open => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type })
  }, [])

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }))
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await adminLogout();
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout failed:', error);
      showToast('Failed to logout. Please try again.', 'error');
    }
  }, [showToast]);

  // Updated handleRowCopy for cell-specific copying
  const handleRowCopy = useCallback(async (cellData, columnName) => {
    const textToCopy = typeof cellData === 'object' ? JSON.stringify(cellData) : String(cellData)
    try {
      await navigator.clipboard.writeText(textToCopy)
      showToast(`${columnName} "${textToCopy.substring(0,30)}${textToCopy.length > 30 ? '...' : ''}" copied to clipboard!`, 'success')
    } catch (err) {
      console.error('Failed to copy text: ', err)
      showToast(`Could not copy ${columnName} to clipboard.`, 'error')
    }
  }, [showToast])

  const DashboardLayout = () => (
    <>
      <TopBar onHomeClick={() => window.location.href = '/admin'} onLogout={handleLogout} onSidebarToggle={handleSidebarToggle} />
      <div className="dashboard-layout">
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={handleSidebarClose}></div>
        )}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sales" element={<SalesPage onRowCopy={handleRowCopy} />} />
            <Route path="/products" element={<ProductsPage onRowCopy={handleRowCopy} />} />
            <Route path="/retailers" element={<RetailersPage onRowCopy={handleRowCopy} />} />
            <Route path="/salesmen" element={<SalesmenPage onRowCopy={handleRowCopy} />} />
            <Route path="/franchises" element={<FranchisePage onRowCopy={handleRowCopy} />} />
            <Route path="/profile" element={<AdminProfilePage />} />
          </Routes>
        </main>
      </div>
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      
    </Router>
  )
}

export default App
