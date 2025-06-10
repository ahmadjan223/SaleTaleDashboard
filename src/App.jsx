import { useState, useCallback } from 'react'
import './App.css'
import { VIEWS } from './constants/views'
import { useTooltip } from './hooks/useTooltip'
import {

} from './utils/api'

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

  return (
    <>
      <TopBar onHomeClick={() => setActiveView(VIEWS.HOME)} />
      <div className="dashboard-layout">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
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
