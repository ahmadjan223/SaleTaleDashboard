import { create } from 'zustand';
import { getAllFranchises, deleteFranchise, createFranchise, updateFranchise, toggleFranchiseStatus } from '../utils/api';

const useFranchiseStore = create((set, get) => ({
  franchises: [],
  loading: false,
  error: null,
  deletingItemId: null,

  // Fetch franchises from API and update store
  fetchFranchises: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllFranchises();
      set({ franchises: response.franchises || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get franchise by ID
  getFranchiseById: (id) => {
    return get().franchises.find(franchise => franchise._id === id);
  },

  // Add new franchise to store and API
  addFranchise: async (franchiseData) => {
    try {
      set({ loading: true, error: null });
      const response = await createFranchise(franchiseData);
      set((state) => ({
        franchises: [...state.franchises, response.franchise],
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update franchise in store and API
  updateFranchise: async (franchiseId, franchiseData) => {
    try {
      set({ loading: true, error: null });
      const response = await updateFranchise(franchiseId, franchiseData);
      set((state) => ({
        franchises: state.franchises.map(f => f._id === franchiseId ? response.franchise : f),
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete franchise from store and API
  deleteFranchise: async (id) => {
    try {
      set({ deletingItemId: id });
      await deleteFranchise(id);
      set((state) => ({
        franchises: state.franchises.filter(franchise => franchise._id !== id),
        deletingItemId: null
      }));
    } catch (error) {
      set({ error: error.message, deletingItemId: null });
      throw error;
    }
  },

  // Toggle franchise active status
  toggleFranchiseStatus: async (franchiseId, active) => {
    try {
      const updatedFranchise = await toggleFranchiseStatus(franchiseId, active);
      set((state) => ({
        franchises: state.franchises.map(f => f._id === franchiseId ? updatedFranchise.data : f)
      }));
      return updatedFranchise;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear store
  clearFranchises: () => {
    set({ franchises: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useFranchiseStore; 