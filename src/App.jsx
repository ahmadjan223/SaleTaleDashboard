import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import {
  getAllSales,
  getAllProducts,
  getAllRetailers,
  getAllSalesmen,
  deleteItemApi,
  addProductApi,
  getAdminRetailerDetails,
  getAdminProductDetails,
  getAdminSalesmanDetails
  // logoutUserApi, // Uncomment if you implement logout API
} from './utils/api'; // Import from the new api.js

// Assume backend is running on http://localhost:5000
// const API_BASE_URL = 'https://sale-tale-backend.vercel.app/api'

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
  const [deletingItemId, setDeletingItemId] = useState(null); // For row-specific loader

  const [tooltip, setTooltip] = useState({
    isVisible: false,
    content: null,
    position: { x: 0, y: 0 },
    isLoadingTarget: false, // Is a fetch currently in progress for the target?
    fetchError: null, // Stores any error message from fetch
    dataReadyForDisplay: false, // True when data is fetched and formatted, or error occurred
    hoverTargetInfo: null // { type, id, columnName, viewName }
  });

  const fetchDataDelayTimerRef = useRef(null);
  const showTooltipDelayTimerRef = useRef(null);
  const currentFetchControllerRef = useRef(null);
  const hoverStartTimeRef = useRef(null);

  // Ref to hold the latest hover target info to avoid stale closures in timeouts
  const tooltipHoverTargetInfoRef = useRef();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', onConfirm: null, confirmText: 'Confirm', showConfirm: true, isContentJsx: false });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  const openModal = useCallback((title, messageOrContent, onConfirmCallback, confirmText = 'Confirm', showConfirm = true, isContentJsx = false) => {
    setModalConfig({ title, message: messageOrContent, onConfirm: onConfirmCallback, confirmText, showConfirm, isContentJsx });
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Delete handler using Modal and new API
  const handleDelete = useCallback(async (view, id, itemName = '') => {
    const itemType = view.toLowerCase().slice(0, -1);
    const displayName = itemName || `ID ${id}`;

    openModal(
      `Confirm Deletion`,
      `Are you sure you want to delete this ${itemType}: ${displayName}? This action cannot be undone.`,
      async () => {
        closeModal(); // Close confirmation modal first
        setDeletingItemId(id); // Set the ID of the item being deleted
        // setLoading(true); // General loading can be removed or kept if preferred for overall feedback
        try {
          await deleteItemApi(view, id); 
          showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} "${displayName}" deleted successfully.`, 'success');
          setData(prevData => ({ ...prevData, [view]: null })); 
        } catch (err) {
          console.error(`Error deleting ${itemType}:`, err);
          showToast(`Failed to delete ${itemType}: ${err.message}`, 'error');
        } finally {
          // setLoading(false);
          setDeletingItemId(null); // Clear deleting item ID
        }
      },
      'Delete'
    );
  }, [openModal, closeModal, showToast]);

  // Add Product handler (will also use modal for confirmation/form later)
  const handleAddProduct = useCallback(() => {
    // Dummy form content for now
    const ProductForm = () => {
      const [name, setName] = useState('');
      const [price, setPrice] = useState('');
      const [description, setDescription] = useState('');

      return (
        <form onSubmit={(e) => e.preventDefault()} className="modal-form">
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Price:
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
        </form>
      );
    };

    openModal(
      'Add New Product',
      <ProductForm />, // Pass JSX directly
      async () => {
        // This is where you'd get the form data
        // For now, using placeholder data or data from a hypothetical form state
        const form = document.querySelector('.modal-form'); // Simple way to get form data, better to use controlled components
        if (!form) {
            showToast('Could not find form data.', 'error');
            closeModal();
            return;
        }
        const nameInput = form.querySelector('input[type="text"]');
        const priceInput = form.querySelector('input[type="number"]');
        const descriptionTextarea = form.querySelector('textarea');

        const newProductData = {
            name: nameInput ? nameInput.value : 'Test Product',
            price: priceInput ? parseFloat(priceInput.value) : 0,
            description: descriptionTextarea ? descriptionTextarea.value : 'Test Description'
        };

        if (!newProductData.name || !newProductData.price) {
            showToast('Product name and price are required.', 'error');
            return; // Don't close modal if validation fails
        }

        closeModal();
        try {
          setLoading(true);
          await addProductApi(newProductData); 
          showToast('Product added successfully! Refreshing...', 'success');
          setData(prevData => ({ ...prevData, [VIEWS.PRODUCTS]: null })); // Refresh products view
        } catch (err) {
          console.error('Error adding product:', err);
          showToast(`Failed to add product: ${err.message}`, 'error');
        } finally {
          setLoading(false);
        }
      },
      'Add Product',
      true, // showConfirm
      true // isContentJsx = true
    );
  }, [openModal, closeModal, showToast]);

  // Logout handler using Modal
  const handleLogout = useCallback(() => {
    openModal(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      async () => {
        closeModal();
        try {
          // setLoading(true); // Optional: if logout is an API call
          // await logoutUserApi(); // Uncomment and use if you have a logout endpoint
          showToast('You have been logged out successfully (simulated).', 'success');
          // TODO: Actual logout logic (e.g., clear token, redirect to login page)
          // For now, just navigating to home might be an option or disabling parts of UI
          setActiveView(VIEWS.HOME); // Example: go to home screen
        } catch (err) {
          console.error('Logout error:', err);
          showToast(`Logout failed: ${err.message}`, 'error');
        } finally {
          // setLoading(false);
        }
      },
      'Logout'
    );
  }, [openModal, closeModal, showToast]);

  // Updated handleRowCopy for cell-specific copying
  const handleRowCopy = useCallback(async (cellData, columnName) => {
    const textToCopy = typeof cellData === 'object' ? JSON.stringify(cellData) : String(cellData);
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast(`${columnName} "${textToCopy.substring(0,30)}${textToCopy.length > 30 ? '...' : ''}" copied to clipboard!`, 'success');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast(`Could not copy ${columnName} to clipboard.`, 'error');
    }
  }, [showToast]);

  const handleRefresh = useCallback((viewToRefresh) => {
    showToast(`Refreshing ${viewToRefresh.toLowerCase()}...`, 'info'); // Changed to info for refresh start
    setData(prevData => ({ ...prevData, [viewToRefresh]: null })); // Clear data for the specific view to trigger refetch
    // Fetching will be triggered by useEffect due to data[viewToRefresh] becoming null
  }, [showToast]);

  const handleCellMouseLeave = useCallback(() => {
    clearTimeout(fetchDataDelayTimerRef.current);
    clearTimeout(showTooltipDelayTimerRef.current);
    if (currentFetchControllerRef.current) {
      currentFetchControllerRef.current.abort();
      currentFetchControllerRef.current = null;
    }
    setTooltip({
      isVisible: false,
      content: null,
      position: { x: 0, y: 0 },
      isLoadingTarget: false,
      fetchError: null,
      dataReadyForDisplay: false,
      hoverTargetInfo: null
    });
    hoverStartTimeRef.current = null;
  }, []);

  const handleCellMouseEnter = useCallback((event, columnName, viewName, itemData) => {
    // console.log('Mouse enter cell:', { columnName, viewName, itemData }); // General log
    handleCellMouseLeave();
    hoverStartTimeRef.current = Date.now();

    let targetType = null;
    let itemId = null;

    if (viewName === VIEWS.SALES) {
      // console.log(`Hovering over SALES table. Column: ${columnName}. Item Data:`, JSON.parse(JSON.stringify(itemData)));
      if (columnName === 'Retailer') {
        targetType = 'Retailer';
        itemId = typeof itemData.retailer === 'object' && itemData.retailer !== null ? itemData.retailer._id : itemData.retailer;
        // console.log('Retailer Hover - Extracted itemId:', itemId, 'Raw retailer data:', itemData.retailer);
      } else if (columnName === 'Product') {
        targetType = 'Product';
        itemId = typeof itemData.product === 'object' && itemData.product !== null ? itemData.product._id : itemData.product;
        // console.log('Product Hover - Extracted itemId:', itemId, 'Raw product data:', itemData.product);
      } else if (columnName === 'Added By') {
        targetType = 'Salesman';
        itemId = typeof itemData.addedBy === 'object' && itemData.addedBy !== null ? itemData.addedBy._id : itemData.addedBy;
        // console.log('Added By (Salesman) Hover - Extracted itemId:', itemId, 'Raw addedBy data:', itemData.addedBy);
      }
    }

    if (!targetType || !itemId) {
      // console.log('Tooltip not triggered: No targetType or itemId found.', { targetType, itemId });
      return;
    }
    // console.log(`Tooltip will attempt for: Type=${targetType}, ID=${itemId}`);

    const currentTarget = { type: targetType, id: itemId, columnName, viewName };
    setTooltip(prev => ({ ...prev, position: { x: event.clientX, y: event.clientY }, hoverTargetInfo: currentTarget }));

    fetchDataDelayTimerRef.current = setTimeout(async () => {
      // Log values right before the check
      // console.log('DEBUG Tooltip Timeout Check:', {
      //   currentTime: Date.now(),
      //   hoverTargetInfoFromRef: tooltipHoverTargetInfoRef.current, // Use ref
      //   closedItemId: itemId,
      //   closedTargetType: targetType,
      //   isIdMatch: tooltipHoverTargetInfoRef.current?.id === itemId,       // Use ref
      //   isTypeMatch: tooltipHoverTargetInfoRef.current?.type === targetType, // Use ref
      //   shouldProceed: tooltipHoverTargetInfoRef.current?.id === itemId && tooltipHoverTargetInfoRef.current?.type === targetType // Use ref
      // });

      // Compare against the ref's current value and the closed over itemId/targetType
      if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) {
        // console.log(`Tooltip fetch aborted for ${targetType} ID ${itemId} because current hover target (${tooltipHoverTargetInfoRef.current?.type} ID ${tooltipHoverTargetInfoRef.current?.id}) doesn't match scheduled target.`);
        return;
      }

      // Original console.log, modified to be more specific
      // console.log(`:::PROCEEDING TO FETCH details for ${targetType} ID: ${itemId}`);

      setTooltip(prev => ({ ...prev, isLoadingTarget: true, content: `Loading ${targetType.toLowerCase()}...` }));
      currentFetchControllerRef.current = new AbortController();
      const { signal } = currentFetchControllerRef.current;
      let details;
      let fetchError = null;

      try {
        // Check again before fetching, using the ref, in case of rapid changes.
        if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) {
            // console.log(`Tooltip fetch aborted for ${targetType} ID ${itemId} (pre-fetch check) due to hover target mismatch.`);
            setTooltip(prev => prev.hoverTargetInfo?.id === itemId && prev.hoverTargetInfo?.type === targetType ? { ...prev, isLoadingTarget: false } : prev);
            return;
        }
        // console.log(`:::PROCEEDING TO FETCH details for ${targetType} ID: ${itemId}`);

        switch (targetType) {
          case 'Retailer':
            details = await getAdminRetailerDetails(itemId, { signal }); 
            break;
          case 'Product':
            details = await getAdminProductDetails(itemId, { signal });
            break;
          case 'Salesman':
            details = await getAdminSalesmanDetails(itemId, { signal });
            break;
          default:
            throw new Error('Unknown target type for tooltip');
        }
        // console.log(`Fetched details for ${targetType} ID ${itemId}:`, details); // Log after successful fetch
      } catch (err) {
        if (err.name === 'AbortError') {
          // console.log(`${targetType} details fetch aborted for ID: ${itemId}`);
          setTooltip(prev => prev.hoverTargetInfo?.id === itemId && prev.hoverTargetInfo?.type === targetType ? { ...prev, isLoadingTarget: false } : prev);
          return;
        }
        console.error(`Error fetching ${targetType} details for tooltip (ID: ${itemId}):`, err); // Keep this error log
        fetchError = err.message || `Error loading ${targetType.toLowerCase()} details`;
      }

      if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) return;

      let newContent = '';
      if (fetchError) {
        newContent = fetchError;
      } else if (details) {
        // Check one last time using the ref before setting content,
        // to ensure the fetched details correspond to the current hover.
        if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) {
            // console.log(`Tooltip content update skipped for ${targetType} ID ${itemId} because hover target changed post-fetch.`);
            // Ensure loading state is cleared if we bail here
            setTooltip(prev => prev.hoverTargetInfo?.id === itemId && prev.hoverTargetInfo?.type === targetType ? { ...prev, isLoadingTarget: false } : prev);
            return;
        }
        newContent = JSON.stringify(details, null, 2);
      } else {
        newContent = 'No details found or an unexpected error occurred.'; 
      }

      setTooltip(prev => {
        // Final check using the ref before making tooltip visible or updating content
        if (tooltipHoverTargetInfoRef.current?.id !== itemId || tooltipHoverTargetInfoRef.current?.type !== targetType) return prev;

        const newState = {
          ...prev,
          isLoadingTarget: false,
          content: newContent,
          fetchError: fetchError,
          dataReadyForDisplay: true
        };
        const elapsedTime = Date.now() - (hoverStartTimeRef.current || Date.now());
        if (elapsedTime >= 1500) { 
          newState.isVisible = true;
        }
        return newState;
      });

    }, 100);

    showTooltipDelayTimerRef.current = setTimeout(() => {
      setTooltip(prev => {
        // Use ref here as well for consistency, ensuring the tooltip shows for the *actual* current hover
        if (tooltipHoverTargetInfoRef.current?.id === itemId && 
            tooltipHoverTargetInfoRef.current?.type === targetType && 
            prev.hoverTargetInfo?.id === itemId && // also ensure the state's target matches (double check)
            prev.hoverTargetInfo?.type === targetType &&
            prev.dataReadyForDisplay && 
            !prev.isLoadingTarget) {
          return { ...prev, isVisible: true };
        }
        return prev;
      });
    }, 1500);

  }, [handleCellMouseLeave]); // Removed tooltip.hoverTargetInfo dependencies as ref handles freshness for timeout logic

  useEffect(() => {
    // Keep the ref updated with the latest tooltip hover target info
    tooltipHoverTargetInfoRef.current = tooltip.hoverTargetInfo;
  }, [tooltip.hoverTargetInfo]);

  useEffect(() => {
    const fetchDataForView = async (view) => {
      if (data[view] !== null && typeof data[view] !== 'undefined') {
        setLoading(false); return;
      }
      setLoading(true); setError(null);
      let fetchFunction;
      switch (view) {
        case VIEWS.SALES: fetchFunction = getAllSales; break;
        case VIEWS.PRODUCTS: fetchFunction = getAllProducts; break;
        case VIEWS.RETAILERS: fetchFunction = getAllRetailers; break;
        case VIEWS.SALESMEN: fetchFunction = getAllSalesmen; break;
        default: setLoading(false); return;
      }
      try {
        const fetchedData = await fetchFunction();
        setData(prevData => ({ ...prevData, [view]: fetchedData.length > 0 ? fetchedData : [] }));
      } catch (err) { 
        console.error(`Fetch error for ${view}:`, err);
        setError(err.message);
        setData(prevData => ({ ...prevData, [view]: [] })); 
      } finally {
        setLoading(false);
      }
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
        return <SalesTable 
                  sales={data[VIEWS.SALES] || []} 
                  onDelete={handleDelete} 
                  onRowCopy={handleRowCopy} 
                  onRefresh={() => handleRefresh(VIEWS.SALES)} 
                  deletingItemId={deletingItemId} 
                  onCellMouseEnter={handleCellMouseEnter}
                  onCellMouseLeave={handleCellMouseLeave}
                />;
      case VIEWS.PRODUCTS:
        return <ProductsTable products={data[VIEWS.PRODUCTS] || []} onAdd={handleAddProduct} onDelete={handleDelete} onRowCopy={handleRowCopy} onRefresh={() => handleRefresh(VIEWS.PRODUCTS)} deletingItemId={deletingItemId} />;
      case VIEWS.RETAILERS:
        return <RetailersTable retailers={data[VIEWS.RETAILERS] || []} onDelete={handleDelete} onRowCopy={handleRowCopy} onRefresh={() => handleRefresh(VIEWS.RETAILERS)} deletingItemId={deletingItemId} />;
      case VIEWS.SALESMEN:
        return <SalesmenTable salesmen={data[VIEWS.SALESMEN] || []} onDelete={handleDelete} onRowCopy={handleRowCopy} onRefresh={() => handleRefresh(VIEWS.SALESMEN)} deletingItemId={deletingItemId} />;
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
        {modalConfig.isContentJsx ? modalConfig.message : <p>{modalConfig.message}</p>}
      </Modal>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <Tooltip 
        text={tooltip.content} 
        visible={tooltip.isVisible} 
        position={tooltip.position} 
        // isLoadingTarget can be used by Tooltip component if you want a visual cue there, but current logic hides tooltip if no content
      />
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

const SalesTable = ({ sales, onDelete, onRowCopy, onRefresh, deletingItemId, onCellMouseEnter, onCellMouseLeave }) => (
  <section className="content-area">
    <div className="section-header"><h2>Sales</h2><TableActionsHeader onRefresh={onRefresh} /></div>
    <div className="table-container">
      {sales.length > 0 ? ( <table>
          <thead><tr><th>ID</th><th>Retailer</th><th>Product</th><th>Quantity</th><th>Amount</th><th>Coordinates</th><th>Added By</th><th>Actions</th></tr></thead>
          <tbody>
            {sales.map(s => (
              <tr key={s._id} >
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(s._id, 'ID');}}>{s._id}</td>
                <td 
                  onClick={(e) => {e.stopPropagation(); onRowCopy(s.retailer?.shopName || s.retailer, 'Retailer');}}
                  onMouseEnter={(e) => onCellMouseEnter(e, 'Retailer', VIEWS.SALES, s)}
                  onMouseLeave={onCellMouseLeave}
                >
                  {s.retailer?.shopName || (typeof s.retailer === 'object' && s.retailer !== null ? s.retailer._id : s.retailer) || 'N/A'}
                </td>
                <td 
                  onClick={(e) => {e.stopPropagation(); onRowCopy(s.product?.name || s.product, 'Product');}}
                  onMouseEnter={(e) => onCellMouseEnter(e, 'Product', VIEWS.SALES, s)}
                  onMouseLeave={onCellMouseLeave}
                >
                  {s.product?.name || (typeof s.product === 'object' && s.product !== null ? s.product._id : s.product) || 'N/A'}
                </td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.quantity, 'Quantity');}}>{s.quantity}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.amount, 'Amount');}}>{s.amount}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(s.coordinates?.coordinates?.join(', ') || 'N/A', 'Coordinates');}}>{s.coordinates?.coordinates?.join(', ') || 'N/A'}</td>
                <td 
                  onClick={(e) => {e.stopPropagation(); onRowCopy(s.addedBy?.name || s.addedBy || 'N/A', 'Added By');}}
                  onMouseEnter={(e) => onCellMouseEnter(e, 'Added By', VIEWS.SALES, s)}
                  onMouseLeave={onCellMouseLeave}
                >
                  {s.addedBy?.name || (typeof s.addedBy === 'object' && s.addedBy !== null ? s.addedBy._id : s.addedBy) || 'N/A'}
                </td>
                <td>
                  {deletingItemId === s._id ? 
                    <div className="loader-small"></div> :
                    <button onClick={(e) => { e.stopPropagation(); onDelete(VIEWS.SALES, s._id, s.product?.name || s._id); }} className="action-btn icon-btn delete-btn">🗑️</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>) : <p>No sales data found.</p>}
    </div>
  </section>
);

const ProductsTable = ({ products, onAdd, onDelete, onRowCopy, onRefresh, deletingItemId }) => (
  <section className="content-area">
    <div className="section-header"><h2>Products</h2><TableActionsHeader onRefresh={onRefresh}><button onClick={onAdd} className="action-btn icon-btn add-btn" title="Add Product">➕</button></TableActionsHeader></div>
    <div className="table-container">
      {products.length > 0 ? (<table>
          <thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} >
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(p._id, 'ID');}}>{p._id}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.name, 'Name');}}>{p.name}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.price, 'Price');}}>{p.price}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(p.description, 'Description');}}>{p.description}</td>
                <td>
                  {deletingItemId === p._id ? 
                    <div className="loader-small"></div> :
                    <button onClick={(e) => { e.stopPropagation(); onDelete(VIEWS.PRODUCTS, p._id, p.name);}} className="action-btn icon-btn delete-btn">🗑️</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>) : <p>No products data found.</p>}
    </div>
  </section>
);

const RetailersTable = ({ retailers, onDelete, onRowCopy, onRefresh, deletingItemId }) => (
  <section className="content-area">
    <div className="section-header"><h2>Retailers</h2><TableActionsHeader onRefresh={onRefresh} /></div>
    <div className="table-container">
      {retailers.length > 0 ? (<table>
          <thead><tr><th>ID</th><th>Retailer Name</th><th>Shop Name</th><th>Location</th><th>Added By</th><th>Actions</th></tr></thead>
          <tbody>
            {retailers.map(r => (
              <tr key={r._id} >
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r._id, 'ID');}}>{r._id}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.retailerName, 'Retailer Name');}}>{r.retailerName}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.shopName, 'Shop Name');}}>{r.shopName}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.location?.coordinates?.join(', ') || 'N/A', 'Location');}}>{r.location?.coordinates?.join(', ') || 'N/A'}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(r.addedBy?.name || r.addedBy || 'N/A', 'Added By');}}>{r.addedBy?.name || r.addedBy || 'N/A'}</td>
                <td>
                  {deletingItemId === r._id ? 
                    <div className="loader-small"></div> :
                    <button onClick={(e) => { e.stopPropagation(); onDelete(VIEWS.RETAILERS, r._id, r.retailerName);}} className="action-btn icon-btn delete-btn">🗑️</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>) : <p>No retailers data found.</p>}
    </div>
  </section>
);

const SalesmenTable = ({ salesmen, onDelete, onRowCopy, onRefresh, deletingItemId }) => (
  <section className="content-area">
    <div className="section-header"><h2>Salesmen</h2><TableActionsHeader onRefresh={onRefresh} /></div>
    <div className="table-container">
      {salesmen.length > 0 ? (<table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Verified</th><th>Actions</th></tr></thead>
          <tbody>
            {salesmen.map(sm => (
              <tr key={sm.googleId || sm._id} >
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.googleId || sm._id, 'ID');}}>{sm.googleId || sm._id}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.name, 'Name');}}>{sm.name}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.email, 'Email');}}>{sm.email}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.phone, 'Phone');}}>{sm.phone}</td>
                <td onClick={(e) => {e.stopPropagation(); onRowCopy(sm.verified ? 'Yes' : 'No', 'Verified');}}>{sm.verified ? 'Yes' : 'No'}</td>
                <td>
                  {deletingItemId === (sm.googleId || sm._id) ? 
                    <div className="loader-small"></div> :
                    <button onClick={(e) => { e.stopPropagation(); onDelete(VIEWS.SALESMEN, sm.googleId || sm._id, sm.name);}} className="action-btn icon-btn delete-btn">🗑️</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>) : <p>No salesmen data found.</p>}
    </div>
  </section>
);

// Updated Tooltip Component
const Tooltip = ({ text, visible, position }) => {
  if (!visible || !text) return null; // Only render if visible and has text
  return (
    <div 
      className="tooltip"
      style={{
        position: 'fixed',
        left: position.x + 10, 
        top: position.y + 10,  
        pointerEvents: 'none',
        whiteSpace: 'pre-line' 
      }}
    >
      {text} 
    </div>
  );
};

export default App
