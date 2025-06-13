import { create } from 'zustand';
import { getAllRetailers, deleteRetailerApi } from '../utils/api';

const useRetailerStore = create((set, get) => ({
  retailers: [],
  loading: false,
  error: null,
  deletingItemId: null,

  // Fetch retailers from API and update store
  fetchRetailers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllRetailers();
      set({ retailers: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Get retailer by ID
  getRetailerById: (id) => {
    return get().retailers.find(retailer => retailer._id === id);
  },

  // Delete retailer from store and API
  deleteRetailer: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteRetailerApi(id);
      set((state) => ({
        retailers: state.retailers.filter(retailer => retailer._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Clear store
  clearRetailers: () => {
    set({ retailers: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useRetailerStore; 