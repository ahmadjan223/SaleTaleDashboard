import { create } from 'zustand';
import { getAllSalesmen, deleteItemApi } from '../utils/api';

const useSalesmenStore = create((set, get) => ({
  salesmen: [],
  loading: false,
  error: null,
  deletingItemId: null,

  // Fetch salesmen from API and update store
  fetchSalesmen: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllSalesmen();
      set({ salesmen: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get salesman by ID
  getSalesmanById: (id) => {
    return get().salesmen.find(salesman => salesman._id === id);
  },

  // Delete salesman from store and API
  deleteSalesman: async (id) => {
    try {
      set({ deletingItemId: id });
      await deleteItemApi('SALESMEN', id);
      set((state) => ({
        salesmen: state.salesmen.filter(salesman => salesman._id !== id),
        deletingItemId: null
      }));
    } catch (error) {
      set({ error: error.message, deletingItemId: null });
      throw error;
    }
  },

  // Clear store
  clearSalesmen: () => {
    set({ salesmen: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useSalesmenStore; 