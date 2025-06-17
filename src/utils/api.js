// const API_BASE_URL = 'https://sale-tale-backend.vercel.app/api';
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Base request function with authentication
const request = async (endpoint, options = {}) => {
  const { signal, ...restOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Add auth header to all requests
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { 
      ...restOptions, 
      headers,
      signal 
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || `API request failed with status ${response.status}` };
      }
      console.error(`API Error (${response.status}) for ${url}:`, errorData);
      throw new Error(errorData.message || `API request failed for ${endpoint.split('/')[1] || 'resource'}`);
    }

    if (response.status === 204) {
      return { success: true, message: 'Operation successful (No Content)' };
    }

    return response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log(`Request to ${url} aborted`);
      throw err;
    }
    console.error(`Network or other error for ${url}:`, err);
    throw err instanceof Error ? err : new Error(err.message || 'An unknown network error occurred');
  }
};

// ===== Admin Authentication =====
export const adminLogin = (credentials) => {
  return request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getAdminProfile = () => {
  return request('/admin/profile');
};

export const adminLogout = () => {
  return request('/admin/logout', {
    method: 'POST'
  });
};

// ===== Sales Management =====
export const getAllSales = () => request('/sales/admin/all');

export const getFilteredSales = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.salesman) queryParams.append('salesman', filters.salesman);
  if (filters.product) queryParams.append('product', filters.product);
  if (filters.retailer) queryParams.append('retailer', filters.retailer);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.valid !== undefined) queryParams.append('valid', filters.valid);

  const endpoint = `/sales/admin/filtered${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return request(endpoint);
};

export const deleteSale = (saleId) => {
  return request(`/sales/admin/${saleId}`, { method: 'DELETE' });
};

export const toggleSaleValidity = (saleId, isValid) => {
  return request(`/sales/admin/${saleId}/validity`, {
    method: 'PUT',
    body: JSON.stringify({ isValid }),
  });
};

// ===== Product Management =====
export const getAllProducts = () => request('/products/admin/all');

export const getProductById = (id) => request(`/products/admin/${id}`);

export const createProduct = (productData) => {
  return request('/products/admin/create', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

export const updateProduct = (productId, productData) => {
  return request(`/products/admin/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = (productId) => {
  return request(`/products/admin/${productId}`, { method: 'DELETE' });
};

export const toggleProductStatus = (productId, active) => {
  return request(`/products/admin/${productId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ active }),
  });
};

// ===== Retailer Management =====
export const getAllRetailers = () => request('/retailers/admin/all');

export const getRetailerById = (id) => request(`/retailers/admin/details/${id}`);

export const createRetailer = (retailerData) => {
  return request('/retailers/admin/create', {
    method: 'POST',
    body: JSON.stringify(retailerData),
  });
};

export const updateRetailer = (id, retailerData) => {
  return request(`/retailers/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(retailerData),
  });
};

export const deleteRetailer = (id) => {
  return request(`/retailers/admin/${id}`, { method: 'DELETE' });
};

export const toggleRetailerStatus = (id, active) => {
  return request(`/retailers/admin/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ active }),
  });
};

// ===== Salesman Management =====
export const getAllSalesmen = () => request('/salesmen/admin/all');

export const getSalesmanById = (id) => request(`/salesmen/admin/details/${id}`);

export const createSalesman = (salesmanData) => {
  return request('/salesmen/admin/create', {
    method: 'POST',
    body: JSON.stringify(salesmanData),
  });
};

export const updateSalesman = (id, salesmanData) => {
  return request(`/salesmen/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(salesmanData),
  });
};

export const deleteSalesman = (id) => {
  return request(`/salesmen/admin/${id}`, { method: 'DELETE' });
};

export const toggleSalesmanStatus = (id, active) => {
  return request(`/salesmen/admin/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ active }),
  });
};

// ===== Generic Operations =====
export const deleteItem = (itemType, itemId) => {
  const endpoints = {
    SALES: `/sales/admin/${itemId}`,
    PRODUCTS: `/products/admin/${itemId}`,
    RETAILERS: `/retailers/admin/${itemId}`,
    SALESMEN: `/salesmen/admin/${itemId}`,
  };

  const endpoint = endpoints[itemType.toUpperCase()];
  if (!endpoint) {
    return Promise.reject(new Error(`Unknown item type for deletion: ${itemType}`));
  }

  return request(endpoint, { method: 'DELETE' });
};

// Fetch specific retailer details for admin tooltip
export const getAdminRetailerDetails = (retailerId) => request(`/retailers/admin/details/${retailerId}`);

// Fetch specific product details for admin tooltip
export const getAdminProductDetails = (productId) => request(`/products/admin/details/${productId}`);

// Fetch specific salesman details for admin tooltip
export const getAdminSalesmanDetails = (salesmanId) => request(`/salesmen/admin/details/${salesmanId}`);

// Franchise API functions
export const getAllFranchises = () => {
  return request('/franchises/admin/all');
};

export const getFranchiseById = (id) => {
  return request(`/franchises/admin/${id}`);
};

export const createFranchise = (franchiseData) => {
  return request('/franchises/admin/create', {
    method: 'POST',
    body: JSON.stringify(franchiseData),
  });
};

export const updateFranchise = (franchiseId, franchiseData) => {
  return request(`/franchises/admin/${franchiseId}`, {
    method: 'PUT',
    body: JSON.stringify(franchiseData),
  });
};

export const deleteFranchise = (franchiseId) => {
  return request(`/franchises/admin/${franchiseId}`, { 
    method: 'DELETE' 
  });
};

export const getFranchiseSalesmen = (franchiseId) => {
  return request(`/franchises/admin/${franchiseId}/salesmen`);
};

export const toggleFranchiseStatus = (franchiseId, active) => {
  return request(`/franchises/admin/${franchiseId}/toggle-status`, {
    method: 'PUT',
    body: JSON.stringify({ active }),
  });
};

export const getFilteredRetailers = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.retailerName) queryParams.append('retailerName', filters.retailerName);
  if (filters.shopName) queryParams.append('shopName', filters.shopName);
  if (filters.contactNo) queryParams.append('contactNo', filters.contactNo);
  if (filters.assignedSalesman) queryParams.append('assignedSalesman', filters.assignedSalesman);
  if (filters.active !== undefined) queryParams.append('active', filters.active);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);

  const endpoint = `/retailers/admin/filtered${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return request(endpoint);
};

export const getFilteredSalesmen = (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.name) queryParams.append('name', filters.name);
  if (filters.email) queryParams.append('email', filters.email);
  if (filters.contactNo) queryParams.append('contactNo', filters.contactNo);
  if (filters.franchise) queryParams.append('franchise', filters.franchise);
  if (filters.active !== undefined) queryParams.append('active', filters.active);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);

  const endpoint = `/salesmen/admin/filtered${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return request(endpoint);
}; 