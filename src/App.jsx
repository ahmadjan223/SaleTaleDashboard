import { useState, useEffect, useCallback } from 'react'
import './App.css'

// Assume backend is running on http://localhost:5000
const API_BASE_URL = 'https://sale-tale-backend.vercel.app/api'

const VIEWS = {
  HOME: 'HOME',
  SALES: 'SALES',
  PRODUCTS: 'PRODUCTS',
  RETAILERS: 'RETAILERS',
  SALESMEN: 'SALESMEN'
}

// Modal Component
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

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
};

function App() {
  const [activeView, setActiveView] = useState(VIEWS.HOME)
  const [data, setData] = useState({}) // Store all fetched data here, keyed by view
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', onConfirm: null, confirmText: 'Confirm', showConfirm: true });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const openModal = useCallback((title, message, onConfirmCallback, confirmText = 'Confirm', showConfirm = true) => {
    setModalConfig({ title, message, onConfirm: onConfirmCallback, confirmText, showConfirm });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Delete handler using Modal
  const handleDelete = useCallback((view, id, itemName = '') => {
    const itemType = view.toLowerCase().slice(0, -1);
    const displayName = itemName || `ID ${id}`;
    openModal(
      `Confirm Deletion`,
      `Are you sure you want to delete this ${itemType}: ${displayName}? This action cannot be undone.`,
      () => {
        console.log(`Deleting ${itemType} with ID: ${id}`);
        // Dummy delete success
        closeModal();
        openModal('Success', `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} "${displayName}" deleted successfully (dummy).`, null, 'OK', false);
         // TODO: Actual API call and data refresh
      },
      'Delete'
    );
  }, [openModal, closeModal]);

  // Add Product handler (will also use modal for confirmation/form later)
  const handleAddProduct = useCallback(() => {
    openModal('Add New Product', 'This is where a form to add a new product would appear. (Dummy)', null, 'OK', false);
  }, [openModal, closeModal]);

  // Logout handler using Modal
  const handleLogout = useCallback(() => {
    openModal(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      () => {
        closeModal();
        openModal('Logged Out', 'You have been logged out successfully (dummy).', null, 'OK', false);
        // TODO: Actual logout logic (e.g., clear token, redirect)
      },
      'Logout'
    );
  }, [openModal, closeModal]);

  const handleRowCopy = useCallback(async (rowData) => {
    const formattedData = Object.entries(rowData)
      .map(([key, value]) => {
        if (key === '__v') return null; // Skip __v field
        if (typeof value === 'object' && value !== null) {
          if (value.type === 'Point' && Array.isArray(value.coordinates)) {
            return `${key}: [${value.coordinates.join(', ')}]`;
          }
          return `${key}: ${JSON.stringify(value)}`; // Basic object stringification
        }
        return `${key}: ${value}`;
      })
      .filter(Boolean) // Remove null entries (skipped __v)
      .join('\n');
    try {
      await navigator.clipboard.writeText(formattedData);
      showToast('Row data copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Could not copy data to clipboard.', 'error');
    }
  }, [showToast]);

  const handleRefresh = useCallback((viewToRefresh) => {
    showToast(`Refreshing ${viewToRefresh.toLowerCase()}...`, 'success');
    setData(prevData => ({ ...prevData, [viewToRefresh]: null })); // Clear data for the specific view to trigger refetch
    // Fetching will be triggered by useEffect due to data[viewToRefresh] becoming null
  }, [showToast]);

  useEffect(() => {
    const fetchDataForView = async (view) => {
      // If data is null (cleared by refresh) or undefined (never fetched), then fetch.
      // If data exists and has length 0, it might mean an empty result from API, so don't refetch unless refreshed.
      if (data[view] !== null && typeof data[view] !== 'undefined') { 
          setLoading(false); return; 
      }
      setLoading(true); setError(null);
      let endpoint = '';
      switch (view) {
        case VIEWS.SALES: endpoint = '/sales/all'; break;
        case VIEWS.PRODUCTS: endpoint = '/products/all'; break;
        case VIEWS.RETAILERS: endpoint = '/retailers/all'; break;
        case VIEWS.SALESMEN: endpoint = '/salesmen/all'; break;
        default: setLoading(false); return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`API request failed for ${view}`);
        const fetchedData = await response.json();
        setData(prevData => ({ ...prevData, [view]: fetchedData.length > 0 ? fetchedData : [] })); // Ensure it's an array, even if empty
      } catch (err) { console.error(`Fetch error for ${view}:`, err); setError(err.message); setData(prevData => ({ ...prevData, [view]: [] })); /* Set to empty array on error to stop loading */ }
      finally { setLoading(false); }
    };
    if (activeView !== VIEWS.HOME) fetchDataForView(activeView);
  }, [activeView, data]); // data is in dependency array to react to refresh changes

  const renderContent = () => {
    if (loading && activeView !== VIEWS.HOME) return <div className="content-area"><h2 className="loading-message">Loading {activeView.toLowerCase()}...</h2></div>;
    if (error) return <div className="content-area"><h2 className="error-message">Error loading {activeView.toLowerCase()}: {error}</h2></div>;

    switch (activeView) {
      case VIEWS.HOME:
        return (
          <div className="content-area home-content">
            <h1>Welcome to SaleTale Dashboard!</h1>
            <p className="tagline">Streamlining Your Sales Operations with Precision and Insight.</p>
            <div className="features-overview">
              <p>SaleTale provides a comprehensive suite of tools to empower your sales team and manage your business effectively. From tracking sales and managing products to overseeing retailers and salesmen, our dashboard offers real-time data and intuitive controls.</p>
              <h3>Key Features:</h3>
              <ul>
                <li><strong>Sales Management:</strong> Monitor sales performance, track transactions, and analyze trends.</li>
                <li><strong>Product Catalog:</strong> Easily add, update, and manage your product listings.</li>
                <li><strong>Retailer Network:</strong> Keep track of your retailers, their locations, and performance.</li>
                <li><strong>Sales Team Overview:</strong> Manage your salesmen, verify accounts, and monitor activity.</li>
                <li><strong>Interactive Data Tables:</strong> Click to copy row data, perform quick actions, and navigate with ease.</li>
                <li><strong>Secure & Reliable:</strong> Built with modern technologies to ensure your data is safe and accessible.</li>
              </ul>
              <p>Select an option from the sidebar to get started!</p>
            </div>
          </div>
        );
      case VIEWS.SALES:
        return <SalesTable sales={data[VIEWS.SALES] || []} onDelete={handleDelete} onRowCopy={handleRowCopy} onRefresh={() => handleRefresh(VIEWS.SALES)} />;
      case VIEWS.PRODUCTS:
        return <ProductsTable products={data[VIEWS.PRODUCTS] || []} onAdd={handleAddProduct} onDelete={handleDelete} onRowCopy={handleRowCopy} onRefresh={() => handleRefresh(VIEWS.PRODUCTS)} />;
      case VIEWS.RETAILERS:
        return <RetailersTable retailers={data[VIEWS.RETAILERS] || []} onDelete={handleDelete} onRowCopy={handleRowCopy} onRefresh={() => handleRefresh(VIEWS.RETAILERS)} />;
      case VIEWS.SALESMEN:
        return <SalesmenTable salesmen={data[VIEWS.SALESMEN] || []} onDelete={handleDelete} onRowCopy={handleRowCopy} onRefresh={() => handleRefresh(VIEWS.SALESMEN)} />;
      default:
        return <div className="content-area">Select an option from the sidebar.</div>;
    }
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title-container" onClick={() => setActiveView(VIEWS.HOME)}>
          <h1>SaleTale</h1>
          <p className="subline">Admin Dashboard</p>
        </div>
        <button onClick={handleLogout} className="action-btn icon-btn logout-btn-icon" title="Logout">🚪<span style={{fontSize: '0.7em', verticalAlign: 'middle'}}>➡️</span></button>
      </div>
      <div className="dashboard-layout">
        <nav className="sidebar">
          <div className="sidebar-header">
             {/* Sidebar title can be removed if top-bar has main title */}
          </div>
          <ul>
            <li onClick={() => setActiveView(VIEWS.HOME)} className={`${activeView === VIEWS.HOME ? 'active' : ''} sidebar-item`}>Home</li>
            <li className="sidebar-divider"></li>
            <li onClick={() => setActiveView(VIEWS.SALES)} className={`${activeView === VIEWS.SALES ? 'active' : ''} sidebar-item`}>Sales</li>
            <li onClick={() => setActiveView(VIEWS.PRODUCTS)} className={`${activeView === VIEWS.PRODUCTS ? 'active' : ''} sidebar-item`}>Products</li>
            <li onClick={() => setActiveView(VIEWS.RETAILERS)} className={`${activeView === VIEWS.RETAILERS ? 'active' : ''} sidebar-item`}>Retailers</li>
            <li onClick={() => setActiveView(VIEWS.SALESMEN)} className={`${activeView === VIEWS.SALESMEN ? 'active' : ''} sidebar-item`}>Salesmen</li>
          </ul>
        </nav>
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalConfig.title}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        showConfirm={modalConfig.showConfirm}
      >
        <p>{modalConfig.message}</p>
      </Modal>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </>
  )
}

// Modified Table Components to pass item name for better delete messages
const TableActionsHeader = ({ onRefresh, children }) => (
  <div className="section-header-actions">
    {children}
    <button onClick={onRefresh} className="action-btn icon-btn refresh-btn" title="Refresh Data">🔄</button>
  </div>
);

const SalesTable = ({ sales, onDelete, onRowCopy, onRefresh }) => (
  <section className="content-area">
    <div className="section-header"><h2>Sales</h2><TableActionsHeader onRefresh={onRefresh} /></div>
    <div className="table-container">
      {sales.length > 0 ? ( <table>
          <thead><tr><th>ID</th><th>Retailer</th><th>Product</th><th>Quantity</th><th>Amount</th><th>Coordinates</th><th>Added By</th><th>Actions</th></tr></thead>
          <tbody>
            {sales.map(s => <tr key={s._id} onClick={() => onRowCopy(s)}><td>{s._id}</td><td>{s.retailer?.shopName || s.retailer}</td><td>{s.product?.name || s.product}</td><td>{s.quantity}</td><td>{s.amount}</td><td>{s.coordinates?.coordinates?.join(', ') || 'N/A'}</td><td>{s.addedBy?.name || s.addedBy || 'N/A'}</td><td><button onClick={(e) => { e.stopPropagation(); onDelete(VIEWS.SALES, s._id, s.product?.name || s._id); }} className="action-btn icon-btn delete-btn">🗑️</button></td></tr>)}
          </tbody>
        </table>) : <p>No sales data found.</p>}
    </div>
  </section>
);

const ProductsTable = ({ products, onAdd, onDelete, onRowCopy, onRefresh }) => (
  <section className="content-area">
    <div className="section-header"><h2>Products</h2><TableActionsHeader onRefresh={onRefresh}><button onClick={onAdd} className="action-btn icon-btn add-btn" title="Add Product">➕</button></TableActionsHeader></div>
    <div className="table-container">
      {products.length > 0 ? (<table>
          <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => <tr key={p._id} onClick={() => onRowCopy(p)}><td>{p._id}</td><td>{p.name}</td><td>{p.price}</td><td>{p.description}</td><td><button onClick={(e) => { e.stopPropagation(); onDelete(VIEWS.PRODUCTS, p._id, p.name);}} className="action-btn icon-btn delete-btn">🗑️</button></td></tr>)}
          </tbody>
        </table>) : <p>No products data found.</p>}
    </div>
  </section>
);

const RetailersTable = ({ retailers, onDelete, onRowCopy, onRefresh }) => (
  <section className="content-area">
    <div className="section-header"><h2>Retailers</h2><TableActionsHeader onRefresh={onRefresh} /></div>
    <div className="table-container">
      {retailers.length > 0 ? (<table>
          <thead><tr><th>ID</th><th>Retailer Name</th><th>Shop Name</th><th>Location</th><th>Added By</th><th>Actions</th></tr></thead>
          <tbody>
            {retailers.map(r => <tr key={r._id} onClick={() => onRowCopy(r)}><td>{r._id}</td><td>{r.retailerName}</td><td>{r.shopName}</td><td>{r.location?.coordinates?.join(', ') || 'N/A'}</td><td>{r.addedBy?.name || r.addedBy || 'N/A'}</td><td><button onClick={(e) => { e.stopPropagation(); onDelete(VIEWS.RETAILERS, r._id, r.retailerName);}} className="action-btn icon-btn delete-btn">🗑️</button></td></tr>)}
          </tbody>
        </table>) : <p>No retailers data found.</p>}
    </div>
  </section>
);

const SalesmenTable = ({ salesmen, onDelete, onRowCopy, onRefresh }) => (
  <section className="content-area">
    <div className="section-header"><h2>Salesmen</h2><TableActionsHeader onRefresh={onRefresh} /></div>
    <div className="table-container">
      {salesmen.length > 0 ? (<table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Verified</th><th>Actions</th></tr></thead>
          <tbody>
            {salesmen.map(sm => <tr key={sm.googleId || sm._id} onClick={() => onRowCopy(sm)}><td>{sm.googleId || sm._id}</td><td>{sm.name}</td><td>{sm.email}</td><td>{sm.phone}</td><td>{sm.verified ? 'Yes' : 'No'}</td><td><button onClick={(e) => { e.stopPropagation(); onDelete(VIEWS.SALESMEN, sm.googleId || sm._id, sm.name);}} className="action-btn icon-btn delete-btn">🗑️</button></td></tr>)}
          </tbody>
        </table>) : <p>No salesmen data found.</p>}
    </div>
  </section>
);

export default App
