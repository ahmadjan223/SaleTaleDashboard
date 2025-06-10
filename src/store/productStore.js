import { create } from 'zustand';
import { getAllProducts, deleteItemApi, addProductApi } from '../utils/api';

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  deletingItemId: null,

  // Fetch products from API and update store
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getAllProducts();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get product by ID
  getProductById: (id) => {
    return get().products.find(product => product._id === id);
  },

  // Add new product to store and API
  addProduct: async (productData) => {
    try {
      set({ loading: true, error: null });
      const newProduct = await addProductApi(productData);
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false
      }));
      return newProduct;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Delete product from store and API
  deleteProduct: async (id) => {
    try {
      set({ deletingItemId: id });
      await deleteItemApi('PRODUCTS', id);
      set((state) => ({
        products: state.products.filter(product => product._id !== id),
        deletingItemId: null
      }));
    } catch (error) {
      set({ error: error.message, deletingItemId: null });
      throw error;
    }
  },

  // Clear store
  clearProducts: () => {
    set({ products: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useProductStore; 