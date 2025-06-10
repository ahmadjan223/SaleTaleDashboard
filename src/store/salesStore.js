import { create } from 'zustand';
import { getAllSales, deleteItemApi } from '../utils/api';

const useSalesStore = create((set, get) => ({
  sales: [],
  loading: false,
  error: null,
  deletingItemId: null,

  // Fetch sales from API and update store
  fetchSales: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllSales();
      set({ sales: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get sale by ID
  getSaleById: (id) => {
    return get().sales.find(sale => sale._id === id);
  },

  // Delete sale from store and API
  deleteSale: async (id) => {
    try {
      set({ deletingItemId: id });
      await deleteItemApi('SALES', id);
      set((state) => ({
        sales: state.sales.filter(sale => sale._id !== id),
        deletingItemId: null
      }));
    } catch (error) {
      set({ error: error.message, deletingItemId: null });
      throw error;
    }
  },

  // Clear store
  clearSales: () => {
    set({ sales: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useSalesStore;
