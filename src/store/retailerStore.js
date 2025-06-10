import { create } from 'zustand';
import { getAllRetailers, deleteItemApi } from '../utils/api';

const useRetailerStore = create((set, get) => ({
  retailers: [],
  loading: false,
  error: null,
  deletingItemId: null,

  // Fetch retailers from API and update store
  fetchRetailers: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllRetailers();
      set({ retailers: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get retailer by ID
  getRetailerById: (id) => {
    return get().retailers.find(retailer => retailer._id === id);
  },

  // Delete retailer from store and API
  deleteRetailer: async (id) => {
    try {
      set({ deletingItemId: id });
      await deleteItemApi('RETAILERS', id);
      set((state) => ({
        retailers: state.retailers.filter(retailer => retailer._id !== id),
        deletingItemId: null
      }));
    } catch (error) {
      set({ error: error.message, deletingItemId: null });
      throw error;
    }
  },

  // Clear store
  clearRetailers: () => {
    set({ retailers: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useRetailerStore; 