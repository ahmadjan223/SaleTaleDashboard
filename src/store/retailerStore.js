import { create } from 'zustand';
import { getAllRetailers, deleteRetailer, createRetailer, updateRetailer, toggleRetailerStatus, getFilteredRetailers } from '../utils/api';

const useRetailerStore = create((set, get) => ({
  retailers: [],
  filteredRetailers: [],
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

  // Fetch filtered retailers
  fetchFilteredRetailers: async (filters) => {
    try {
      set({ loading: true, error: null });
      const data = await getFilteredRetailers(filters);
      set({ filteredRetailers: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Add new retailer
  addRetailer: async (retailerData) => {
    set({ loading: true, error: null });
    try {
      console.log('Step 2: addRetailer in retailerStore.js, retailerData:', retailerData);
      const response = await createRetailer(retailerData);
      console.log("response is retailer store",response)
      if (response.success) {
        
        set((state) => ({
          retailers: [...state.retailers, response.data],
          loading: false
        }));
        return response;
      } else {
        set({ error: response.message, loading: false });
        throw new Error(response.message);
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update retailer
  updateRetailer: async (id, retailerData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateRetailer(id, retailerData);
      if (response) {
        set((state) => ({
          retailers: state.retailers.map(retailer => 
            retailer._id === id ? response : retailer
          ),
          loading: false
        }));
        return { success: true, data: response };
      } else {
        throw new Error('No response received from server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update retailer';
      set({ error: errorMessage, loading: false });
      return { success: false, message: errorMessage };
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
      await deleteRetailer(id);
      set((state) => ({
        retailers: state.retailers.filter(retailer => retailer._id !== id),
        filteredRetailers: state.filteredRetailers.filter(retailer => retailer._id !== id),
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
      const response = await toggleRetailerStatus(id, active);
      set((state) => ({
        retailers: state.retailers.map(retailer => 
          retailer._id === id ? { ...retailer, active } : retailer
        ),
        filteredRetailers: state.filteredRetailers.map(retailer =>
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
    set({ retailers: [], filteredRetailers: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useRetailerStore; 