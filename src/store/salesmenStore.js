import { create } from 'zustand';
import { getAllSalesmen, deleteSalesmanApi, createSalesmanApi, updateSalesmanApi, toggleSalesmanStatusApi } from '../utils/api';

const useSalesmanStore = create((set, get) => ({
  salesmen: [],
  loading: false,
  error: null,

  // Fetch salesmen from API and update store
  fetchSalesmen: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllSalesmen();
      set({ salesmen: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add new salesman
  addSalesman: async (salesmanData) => {
    set({ loading: true, error: null });
    try {
      const response = await createSalesmanApi(salesmanData);
      if (response.success) {
        set((state) => ({
          salesmen: [...state.salesmen, response.data],
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

  // Update salesman
  updateSalesman: async (id, salesmanData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateSalesmanApi(id, salesmanData);
      if (response.success) {
        set((state) => ({
          salesmen: state.salesmen.map(salesman => 
            salesman._id === id ? response.data : salesman
          ),
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

  // Toggle salesman status
  toggleSalesmanStatus: async (id, active) => {
    set({ loading: true, error: null });
    try {
      const response = await toggleSalesmanStatusApi(id, active);
      set((state) => ({
        salesmen: state.salesmen.map(salesman => 
          salesman._id === id ? { ...salesman, active } : salesman
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
  clearSalesmen: () => {
    set({ salesmen: [], loading: false, error: null });
  }
}));

export default useSalesmanStore; 