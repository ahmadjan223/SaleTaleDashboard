import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { VIEWS } from './constants/views'
import { useTooltip } from './hooks/useTooltip'
import {
  getAllProducts,
  getAllRetailers,
  getAllSalesmen,
} from './utils/api'

// Components
import Modal from './components/Modal'
import Toast from './components/Toast'
import Tooltip from './components/Tooltip'
import TopBar from './components/layout/TopBar'
import Sidebar from './components/layout/Sidebar'
import SalesTable from './components/tables/SalesTable'
import ProductsTable from './components/tables/ProductsTable'
import RetailersTable from './components/tables/RetailersTable'
import SalesmenTable from './components/tables/SalesmenTable'

function App() {
  const [activeView, setActiveView] = useState(VIEWS.HOME)
  const [data, setData] = useState({}) // Store all fetched data here, keyed by view
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { tooltip } = useTooltip()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState({ 
    title: '', 
    message: '', 
    onConfirm: null, 
    confirmText: 'Confirm', 
    showConfirm: true, 
    isContentJsx: false 
  })
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    const fetchDataForView = async (view) => {
      if (data[view] !== null && typeof data[view] !== 'undefined') {
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      let fetchFunction
      switch (view) {
        case VIEWS.PRODUCTS: fetchFunction = getAllProducts
          break
        case VIEWS.RETAILERS: fetchFunction = getAllRetailers
          break
        case VIEWS.SALESMEN: fetchFunction = getAllSalesmen
          break
        default: setLoading(false)
          return
      }
      try {
        const fetchedData = await fetchFunction()
        setData(prevData => ({ ...prevData, [view]: fetchedData.length > 0 ? fetchedData : [] }))
      } catch (err) { 
        console.error(`Fetch error for ${view}:`, err)
        setError(err.message)
        setData(prevData => ({ ...prevData, [view]: [] }))
      } finally {
        setLoading(false)
      }
    }
    if (activeView !== VIEWS.HOME && activeView !== VIEWS.SALES) fetchDataForView(activeView)
  }, [activeView, data])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type })
  }, [])

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }))
  }, [])

  const openModal = useCallback((title, messageOrContent, onConfirmCallback, confirmText = 'Confirm', showConfirm = true, isContentJsx = false) => {
    setModalConfig({ title, message: messageOrContent, onConfirm: onConfirmCallback, confirmText, showConfirm, isContentJsx })
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

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
    if (loading && activeView !== VIEWS.HOME) return <div className="content-area"><h2 className="loading-message">Loading {activeView.toLowerCase()}...</h2></div>
    if (error) return <div className="content-area"><h2 className="error-message">Error loading {activeView.toLowerCase()}: {error}</h2></div>

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
        )
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

  return (
    <>
      <TopBar onHomeClick={() => setActiveView(VIEWS.HOME)} />
      <div className="dashboard-layout">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
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
      />
    </>
  )
}

export default App
