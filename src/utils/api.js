// const API_BASE_URL = 'https://sale-tale-backend.vercel.app/api';
const API_BASE_URL = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const { signal, ...restOptions } = options; // Extract signal if present
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, { ...restOptions, signal }); // Pass signal to fetch
    if (!response.ok) {
      // Try to parse error message from backend, otherwise use a default
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || `API request failed with status ${response.status}` };
      }
      console.error(`API Error (${response.status}) for ${url}:`, errorData);
      throw new Error(errorData.message || `API request failed for ${endpoint.split('/')[1] || 'resource'}`);
    }
    // Handle cases where DELETE might not return a body or returns 204 No Content
    if (response.status === 204) {
      return { success: true, message: 'Operation successful (No Content)' };
    }
    // For other successful responses (e.g., GET, POST, PUT), expect JSON
    return response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      // Don't log AbortError as a network error, it's an intentional cancellation
      console.log(`Request to ${url} aborted`);
      throw err; // Re-throw so the calling function knows it was aborted
    }
    console.error(`Network or other error for ${url}:`, err);
    // Re-throw the error so it can be caught by the calling function
    // This ensures that UI can react to API errors
    throw err instanceof Error ? err : new Error(err.message || 'An unknown network error occurred');
  }
};

export const getAllSales = () => request('/sales/admin/all');
export const getAllProducts = () => request('/products/admin/all');
export const getAllRetailers = () => request('/retailers/admin/all');
export const getAllSalesmen = () => request('/salesmen/admin/all');

// Get filtered sales with query parameters
export const getFilteredSales = (filters = {}) => {
  // Convert filters object to URLSearchParams
  const queryParams = new URLSearchParams();
  
  // Add each filter if it exists
  if (filters.salesman) queryParams.append('salesman', filters.salesman);
  if (filters.product) queryParams.append('product', filters.product);
  if (filters.retailer) queryParams.append('retailer', filters.retailer);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);

  // Construct the endpoint with query parameters
  const endpoint = `/sales/admin/filtered${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  return request(endpoint);
};

// Fetch specific retailer details for admin tooltip
export const getAdminRetailerDetails = (retailerId) => request(`/retailers/admin/details/${retailerId}`);

// Fetch specific product details for admin tooltip
export const getAdminProductDetails = (productId) => request(`/products/admin/details/${productId}`);

// Fetch specific salesman details for admin tooltip
export const getAdminSalesmanDetails = (salesmanId) => request(`/salesmen/admin/details/${salesmanId}`);

// Generic delete function
export const deleteItemApi = (itemType, itemId) => {
  let endpoint = '';
  // Ensure itemType is one of the VIEWS enum values (e.g., VIEWS.SALES)
  // Or, if you pass the string directly, make sure it matches these cases.
  switch (itemType.toUpperCase()) { // Make it case-insensitive for robustness
    case 'SALES': endpoint = `/sales/admin/${itemId}`; break;
    case 'PRODUCTS': endpoint = `/products/admin/${itemId}`; break;
    case 'RETAILERS': endpoint = `/retailers/admin/${itemId}`; break;
    case 'SALESMEN': endpoint = `/salesmen/admin/${itemId}`; break;
    default:
      console.error(`Unknown item type for deletion: ${itemType}`);
      return Promise.reject(new Error(`Unknown item type for deletion: ${itemType}`));
  }
  return request(endpoint, { method: 'DELETE' });
};

// Example for adding a product
export const addProductApi = (productData) => {
  return request('/products/add', { // Assuming '/products/add' is the correct endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
};

// Placeholder for logout - implement if backend endpoint exists
// export const logoutUserApi = () => request('/auth/logout', { method: 'POST' });

// Delete retailer with proper error handling
export const deleteRetailerApi = (id) => {
  return request(`/retailers/admin/${id}`, { 
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Toggle retailer status
export const toggleRetailerStatusApi = (id, active) => {
  return request(`/retailers/admin/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ active })
  });
};

// Create a new product
export const createProduct = (productData) => {
  return request('/products/admin/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
};

// Update an existing product
export const updateProduct = (productId, productData) => {
  return request(`/products/admin/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
};

// Toggle product active status
export const toggleProductStatus = (productId, active) => {
  return request(`/products/admin/${productId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ active }),
  });
};

// Get product by ID
export const getProductById = (id) => request(`/products/admin/${id}`);

// Delete product
export const deleteProduct = (id) => {
  return request(`/products/admin/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Add new retailer
export const addRetailerApi = (retailerData) => {
  return request('/retailers/admin/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(retailerData),
  });
};

// Update retailer
export const updateRetailerApi = (id, retailerData) => {
  return request(`/retailers/admin/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(retailerData),
  });
};

// Admin Salesman Management
export const createSalesmanApi = (salesmanData) => {
  return request('/salesmen/admin/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(salesmanData)
  });
};

export const updateSalesmanApi = (id, salesmanData) => {
  return request(`/salesmen/admin/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(salesmanData)
  });
};

export const getAllSalesmenApi = () => {
  return request('/salesmen/admin/all');
};

export const getSalesmanDetailsApi = (id) => {
  return request(`/salesmen/admin/details/${id}`);
};

export const deleteSalesmanApi = (id) => {
  return request(`/salesmen/admin/${id}`, {
    method: 'DELETE'
  });
};

export const toggleSalesmanStatusApi = (id, active) => {
  return request(`/salesmen/admin/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ active })
  });
}; 