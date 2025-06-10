import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { VIEWS } from './constants/views'
import { useTooltip } from './hooks/useTooltip'
import {
  getAllProducts,
  getAllRetailers,
  getAllSalesmen,
  deleteItemApi,
  addProductApi,
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
  const [deletingItemId, setDeletingItemId] = useState(null)
  // const { tooltip, handleCellMouseEnter, handleCellMouseLeave } = useTooltip()
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


  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

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

  // Delete handler using Modal and new API
  const handleDelete = useCallback(async (view, id, itemName = '') => {
    const itemType = view.toLowerCase().slice(0, -1)
    const displayName = itemName || `ID ${id}`

    openModal(
      `Confirm Deletion`,
      `Are you sure you want to delete this ${itemType}: ${displayName}? This action cannot be undone.`,
      async () => {
        closeModal()
        setDeletingItemId(id)
        try {
          await deleteItemApi(view, id)
          showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} "${displayName}" deleted successfully.`, 'success')
          setData(prevData => ({ ...prevData, [view]: null }))
        } catch (err) {
          console.error(`Error deleting ${itemType}:`, err)
          showToast(`Failed to delete ${itemType}: ${err.message}`, 'error')
        } finally {
          setDeletingItemId(null)
        }
      },
      'Delete'
    )
  }, [openModal, closeModal, showToast])

  // Add Product handler
  const handleAddProduct = useCallback(() => {
    const ProductForm = () => {
      const [name, setName] = useState('')
      const [price, setPrice] = useState('')
      const [description, setDescription] = useState('')

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
      )
    }

    openModal(
      'Add New Product',
      <ProductForm />,
      async () => {
        const form = document.querySelector('.modal-form')
        if (!form) {
          showToast('Could not find form data.', 'error')
          closeModal()
          return
        }
        const nameInput = form.querySelector('input[type="text"]')
        const priceInput = form.querySelector('input[type="number"]')
        const descriptionTextarea = form.querySelector('textarea')

        const newProductData = {
          name: nameInput ? nameInput.value : 'Test Product',
          price: priceInput ? parseFloat(priceInput.value) : 0,
          description: descriptionTextarea ? descriptionTextarea.value : 'Test Description'
        }

        if (!newProductData.name || !newProductData.price) {
          showToast('Product name and price are required.', 'error')
          return
        }

        closeModal()
        try {
          setLoading(true)
          await addProductApi(newProductData)
          showToast('Product added successfully! Refreshing...', 'success')
          setData(prevData => ({ ...prevData, [VIEWS.PRODUCTS]: null }))
        } catch (err) {
          console.error('Error adding product:', err)
          showToast(`Failed to add product: ${err.message}`, 'error')
        } finally {
          setLoading(false)
        }
      },
      'Add Product',
      true,
      true
    )
  }, [openModal, closeModal, showToast])

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
        return <SalesTable 
          onDelete={handleDelete} 
          onRowCopy={handleRowCopy} 
          deletingItemId={deletingItemId} 
        />
      case VIEWS.PRODUCTS:
        return <ProductsTable 
          onAdd={handleAddProduct} 
          onDelete={handleDelete} 
          onRowCopy={handleRowCopy} 
          deletingItemId={deletingItemId} 
        />
      case VIEWS.RETAILERS:
        return <RetailersTable 
          onDelete={handleDelete} 
          onRowCopy={handleRowCopy} 
          deletingItemId={deletingItemId} 
        />
      case VIEWS.SALESMEN:
        return <SalesmenTable 
          onDelete={handleDelete} 
          onRowCopy={handleRowCopy} 
          deletingItemId={deletingItemId} 
        />
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
