import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { VIEWS } from './constants/views'
import { useTooltip } from './hooks/useTooltip'
import axios from 'axios'
import { adminLogout } from './utils/api'

// Components
import Toast from './components/Toast'
import Tooltip from './components/Tooltip'
import TopBar from './components/layout/TopBar'
import Sidebar from './components/layout/Sidebar'
import SalesTable from './components/tables/SalesTable'
import ProductsTable from './components/tables/ProductsTable'
import RetailersTable from './components/tables/RetailersTable'
import SalesmenTable from './components/tables/SalesmenTable'
import HomePage from './components/pages/homePage'
import AdminLogin from './components/AdminLogin'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        await axios.get('http://localhost:5000/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
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
  const [activeView, setActiveView] = useState(VIEWS.HOME)
  const { tooltip } = useTooltip()
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

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

  const renderContent = () => {
    switch (activeView) {
      case VIEWS.HOME:
        return <HomePage />
      case VIEWS.SALES:
        return <SalesTable onRowCopy={handleRowCopy} />
      case VIEWS.PRODUCTS:
        return <ProductsTable onRowCopy={handleRowCopy} />
      case VIEWS.RETAILERS:
        return <RetailersTable onRowCopy={handleRowCopy} />
      case VIEWS.SALESMEN:
        return <SalesmenTable onRowCopy={handleRowCopy} />
      default:
        return <div className="content-area">Select an option from the sidebar.</div>
    }
  }

  const DashboardLayout = () => (
    <>
      <TopBar onHomeClick={() => setActiveView(VIEWS.HOME)} onLogout={handleLogout} />
      <div className="dashboard-layout">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <Tooltip 
        text={tooltip.content} 
        visible={tooltip.isVisible} 
        position={tooltip.position} 
      />
    </Router>
  )
}

export default App
