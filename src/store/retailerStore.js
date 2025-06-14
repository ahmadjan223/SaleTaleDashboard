import { create } from 'zustand';
import { getAllRetailers, deleteRetailerApi, addRetailerApi, toggleRetailerStatusApi, updateRetailerApi } from '../utils/api';

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

  // Add new retailer
  addRetailer: async (retailerData) => {
    set({ loading: true, error: null });
    try {
      console.log("retailerData ",retailerData)
      const newRetailer = await addRetailerApi(retailerData);
      set((state) => ({
        retailers: [...state.retailers, newRetailer],
        loading: false
      }));
      return newRetailer;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update retailer
  updateRetailer: async (id, retailerData) => {
    set({ loading: true, error: null });
    try {
      const updatedRetailer = await updateRetailerApi(id, retailerData);
      set((state) => ({
        retailers: state.retailers.map(retailer => 
          retailer._id === id ? updatedRetailer : retailer
        ),
        loading: false
      }));
      return updatedRetailer;
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

  // Toggle retailer status
  toggleRetailerStatus: async (id, active) => {
    set({ loading: true, error: null });
    try {
      const response = await toggleRetailerStatusApi(id, active);
      set((state) => ({
        retailers: state.retailers.map(retailer => 
          retailer._id === id ? { ...retailer, active } : retailer
        ),
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Clear store
  clearRetailers: () => {
    set({ retailers: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useRetailerStore; 