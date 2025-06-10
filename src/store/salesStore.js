import { create } from 'zustand';
import { getAllSales, deleteItemApi } from '../utils/api';

const useSalesStore = create((set, get) => ({
  // State
  sales: [],
  loading: false,
  error: null,
  deletingItemId: null,

  // Actions
  setSales: (sales) => set({ sales }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setDeletingItemId: (id) => set({ deletingItemId: id }),

  // Async Actions
  fetchSales: async () => {
    const { setLoading, setError, setSales } = get();
    setLoading(true);
    setError(null);
    try {
      const sales = await getAllSales();
      setSales(sales.length > 0 ? sales : []);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err.message);
      setSales([]);
    } finally {
      setLoading(false);
    }
  },

  deleteSale: async (id, itemName = '') => {
    const { setDeletingItemId, fetchSales } = get();
    setDeletingItemId(id);
    try {
      await deleteItemApi('SALES', id);
      await fetchSales(); // Refresh the sales list
      return true;
    } catch (err) {
      console.error('Error deleting sale:', err);
      throw err;
    } finally {
      setDeletingItemId(null);
    }
  },

  // Selectors
  getSaleById: (id) => {
    const { sales } = get();
    return sales.find(sale => sale._id === id);
  },

  getSalesByRetailer: (retailerId) => {
    const { sales } = get();
    return sales.filter(sale => 
      (typeof sale.retailer === 'object' && sale.retailer?._id === retailerId) || 
      sale.retailer === retailerId
    );
  },

  getSalesByProduct: (productId) => {
    const { sales } = get();
    return sales.filter(sale => 
      (typeof sale.product === 'object' && sale.product?._id === productId) || 
      sale.product === productId
    );
  },

  getSalesBySalesman: (salesmanId) => {
    const { sales } = get();
    return sales.filter(sale => 
      (typeof sale.addedBy === 'object' && sale.addedBy?._id === salesmanId) || 
      sale.addedBy === salesmanId
    );
  }
}));

export default useSalesStore; 