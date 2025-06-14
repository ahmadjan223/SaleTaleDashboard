import { create } from 'zustand';
import { getAllProducts, deleteItem, createProduct, updateProduct, toggleProductStatus } from '../utils/api';

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
      const response = await createProduct(productData);
      if (response.success) {
        set((state) => ({
          products: [...state.products, response.data],
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

  // Update product in store and API
  updateProduct: async (productId, productData) => {
    try {
      set({ loading: true, error: null });
      const response = await updateProduct(productId, productData);
      if (response.success) {
        set((state) => ({
          products: state.products.map(p => p._id === productId ? response.data : p),
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

  // Delete product from store and API
  deleteProduct: async (id) => {
    try {
      set({ deletingItemId: id });
      await deleteItem('PRODUCTS', id);
      set((state) => ({
        products: state.products.filter(product => product._id !== id),
        deletingItemId: null
      }));
    } catch (error) {
      set({ error: error.message, deletingItemId: null });
      throw error;
    }
  },

  // Toggle product active status
  toggleProductStatus: async (productId, active) => {
    try {
      const updatedProduct = await toggleProductStatus(productId, active);
      set((state) => ({
        products: state.products.map(p => p._id === productId ? updatedProduct.data : p)
      }));
      return updatedProduct;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear store
  clearProducts: () => {
    set({ products: [], loading: false, error: null, deletingItemId: null });
  }
}));

export default useProductStore; 