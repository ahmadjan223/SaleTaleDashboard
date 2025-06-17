// Comprehensive search utility functions

/**
 * Search across all properties of a salesman
 * @param {Object} salesman - The salesman object
 * @param {string} searchQuery - The search query
 * @returns {boolean} - Whether the salesman matches the search
 */
export const searchSalesman = (salesman, searchQuery) => {
  if (!searchQuery.trim()) return true;
  
  const query = searchQuery.toLowerCase();
  
  // Search across all possible properties
  return (
    // Basic info
    (salesman._id?.toLowerCase().includes(query)) ||
    (salesman.firstName?.toLowerCase().includes(query)) ||
    (salesman.lastName?.toLowerCase().includes(query)) ||
    (salesman.name?.toLowerCase().includes(query)) ||
    (salesman.email?.toLowerCase().includes(query)) ||
    (salesman.contactNo?.toLowerCase().includes(query)) ||
    (salesman.contactNo2?.toLowerCase().includes(query)) ||
    (salesman.phone?.toLowerCase().includes(query)) ||
    
    // Address info
    (salesman.address?.toLowerCase().includes(query)) ||
    (salesman.city?.toLowerCase().includes(query)) ||
    (salesman.state?.toLowerCase().includes(query)) ||
    (salesman.country?.toLowerCase().includes(query)) ||
    (salesman.zipCode?.toLowerCase().includes(query)) ||
    
    // Franchise info
    (salesman.franchise?.name?.toLowerCase().includes(query)) ||
    (salesman.franchise?.address?.toLowerCase().includes(query)) ||
    
    // Status and other fields
    (salesman.active?.toString().toLowerCase().includes(query)) ||
    (salesman.verified?.toString().toLowerCase().includes(query)) ||
    (salesman.createdAt?.toString().toLowerCase().includes(query)) ||
    
    // Added by info
    (salesman.addedBy?.name?.toLowerCase().includes(query)) ||
    (salesman.addedBy?.email?.toLowerCase().includes(query))
  );
};

/**
 * Search across all properties of a retailer
 * @param {Object} retailer - The retailer object
 * @param {string} searchQuery - The search query
 * @returns {boolean} - Whether the retailer matches the search
 */
export const searchRetailer = (retailer, searchQuery) => {
  if (!searchQuery.trim()) return true;
  
  const query = searchQuery.toLowerCase();
  
  // Search across all possible properties
  return (
    // Basic info
    (retailer._id?.toLowerCase().includes(query)) ||
    (retailer.retailerName?.toLowerCase().includes(query)) ||
    (retailer.shopName?.toLowerCase().includes(query)) ||
    (retailer.contactNo?.toLowerCase().includes(query)) ||
    (retailer.contactNo2?.toLowerCase().includes(query)) ||
    (retailer.phone?.toLowerCase().includes(query)) ||
    
    // Address info
    (retailer.address?.toLowerCase().includes(query)) ||
    (retailer.city?.toLowerCase().includes(query)) ||
    (retailer.state?.toLowerCase().includes(query)) ||
    (retailer.country?.toLowerCase().includes(query)) ||
    (retailer.zipCode?.toLowerCase().includes(query)) ||
    
    // Location coordinates
    (retailer.location?.coordinates?.join(', ').toLowerCase().includes(query)) ||
    
    // Assigned salesman info
    (retailer.assignedSalesman?.name?.toLowerCase().includes(query)) ||
    (retailer.assignedSalesman?.email?.toLowerCase().includes(query)) ||
    (retailer.assignedSalesman?.contactNo?.toLowerCase().includes(query)) ||
    
    // Status and other fields
    (retailer.active?.toString().toLowerCase().includes(query)) ||
    (retailer.createdAt?.toString().toLowerCase().includes(query)) ||
    
    // Added by info
    (retailer.addedBy?.name?.toLowerCase().includes(query)) ||
    (retailer.addedBy?.email?.toLowerCase().includes(query))
  );
};

/**
 * Search across all properties of a product
 * @param {Object} product - The product object
 * @param {string} searchQuery - The search query
 * @returns {boolean} - Whether the product matches the search
 */
export const searchProduct = (product, searchQuery) => {
  if (!searchQuery.trim()) return true;
  
  const query = searchQuery.toLowerCase();
  
  // Search across all possible properties
  return (
    // Basic info
    (product._id?.toLowerCase().includes(query)) ||
    (product.name?.toLowerCase().includes(query)) ||
    (product.description?.toLowerCase().includes(query)) ||
    (product.category?.toLowerCase().includes(query)) ||
    (product.brand?.toLowerCase().includes(query)) ||
    (product.sku?.toLowerCase().includes(query)) ||
    
    // Price and quantity
    (product.price?.toString().toLowerCase().includes(query)) ||
    (product.quantity?.toString().toLowerCase().includes(query)) ||
    (product.stock?.toString().toLowerCase().includes(query)) ||
    
    // Status and other fields
    (product.active?.toString().toLowerCase().includes(query)) ||
    (product.createdAt?.toString().toLowerCase().includes(query)) ||
    
    // Added by info
    (product.addedBy?.name?.toLowerCase().includes(query)) ||
    (product.addedBy?.email?.toLowerCase().includes(query))
  );
};

/**
 * Search across all properties of a franchise
 * @param {Object} franchise - The franchise object
 * @param {string} searchQuery - The search query
 * @returns {boolean} - Whether the franchise matches the search
 */
export const searchFranchise = (franchise, searchQuery) => {
  if (!searchQuery.trim()) return true;
  
  const query = searchQuery.toLowerCase();
  
  // Search across all possible properties
  return (
    // Basic info
    (franchise._id?.toLowerCase().includes(query)) ||
    (franchise.name?.toLowerCase().includes(query)) ||
    (franchise.description?.toLowerCase().includes(query)) ||
    (franchise.address?.toLowerCase().includes(query)) ||
    (franchise.city?.toLowerCase().includes(query)) ||
    (franchise.state?.toLowerCase().includes(query)) ||
    (franchise.country?.toLowerCase().includes(query)) ||
    (franchise.zipCode?.toLowerCase().includes(query)) ||
    
    // Contact info
    (franchise.contactNo?.toLowerCase().includes(query)) ||
    (franchise.email?.toLowerCase().includes(query)) ||
    (franchise.masterSimNo?.toLowerCase().includes(query)) ||
    
    // Status and other fields
    (franchise.active?.toString().toLowerCase().includes(query)) ||
    (franchise.createdAt?.toString().toLowerCase().includes(query)) ||
    
    // Added by info
    (franchise.addedBy?.name?.toLowerCase().includes(query)) ||
    (franchise.addedBy?.email?.toLowerCase().includes(query))
  );
};

/**
 * Search across all properties of a sale
 * @param {Object} sale - The sale object
 * @param {string} searchQuery - The search query
 * @returns {boolean} - Whether the sale matches the search
 */
export const searchSale = (sale, searchQuery) => {
  if (!searchQuery.trim()) return true;
  
  const query = searchQuery.toLowerCase();
  
  // Search across all possible properties
  return (
    // Basic info
    (sale._id?.toLowerCase().includes(query)) ||
    (sale.amount?.toString().toLowerCase().includes(query)) ||
    
    // Retailer info
    (sale.retailer?.retailerName?.toLowerCase().includes(query)) ||
    (sale.retailer?.shopName?.toLowerCase().includes(query)) ||
    (sale.retailer?.contactNo?.toLowerCase().includes(query)) ||
    (sale.retailer?.address?.toLowerCase().includes(query)) ||
    
    // Salesman info
    (sale.addedBy?.name?.toLowerCase().includes(query)) ||
    (sale.addedBy?.email?.toLowerCase().includes(query)) ||
    (sale.addedBy?.contactNo?.toLowerCase().includes(query)) ||
    
    // Product info (search through all products in the sale)
    Object.keys(sale.products || {}).some(productName => 
      productName.toLowerCase().includes(query)
    ) ||
    
    // Location coordinates
    (sale.coordinates?.coordinates?.join(', ').toLowerCase().includes(query)) ||
    
    // Status and other fields
    (sale.valid?.toString().toLowerCase().includes(query)) ||
    (sale.createdAt?.toString().toLowerCase().includes(query))
  );
};

/**
 * Generic search function that can search any object by converting all values to strings
 * @param {Object} item - The item object
 * @param {string} searchQuery - The search query
 * @returns {boolean} - Whether the item matches the search
 */
export const searchAnyObject = (item, searchQuery) => {
  if (!searchQuery.trim()) return true;
  
  const query = searchQuery.toLowerCase();
  
  // Recursively search through all properties
  const searchObject = (obj) => {
    if (obj === null || obj === undefined) return false;
    
    // If it's a string, number, or boolean, check directly
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj.toString().toLowerCase().includes(query);
    }
    
    // If it's an array, search through all elements
    if (Array.isArray(obj)) {
      return obj.some(element => searchObject(element));
    }
    
    // If it's an object, search through all properties
    if (typeof obj === 'object') {
      return Object.values(obj).some(value => searchObject(value));
    }
    
    return false;
  };
  
  return searchObject(item);
}; 