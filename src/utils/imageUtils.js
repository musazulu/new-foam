/**
 * Get the backend base URL from environment or default
 */
export const getBackendUrl = () => {
  return process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
};

/**
 * Convert Django media URLs to absolute URLs
 * @param {string} imagePath - Relative image path from Django
 * @returns {string} Absolute URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === '' || imagePath === null) {
    return 'https://via.placeholder.com/400x400/cccccc/ffffff?text=No+Image+Available';
  }
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const backendUrl = getBackendUrl();
  
  // If it starts with /media/, prepend the backend URL
  if (imagePath.startsWith('/media/')) {
    return `${backendUrl}${imagePath}`;
  }
  
  // If it doesn't start with /, assume it's already relative to media root
  if (!imagePath.startsWith('/')) {
    return `${backendUrl}/media/${imagePath}`;
  }
  
  // If it starts with / but not /media/, still prepend backend URL
  return `${backendUrl}${imagePath}`;
};

/**
 * Safe image loading with fallback
 * @param {Event} e - Image error event
 * @param {string} fallbackUrl - Fallback image URL
 */
export const handleImageError = (e, fallbackUrl = null) => {
  console.warn('Image failed to load:', e.target.src);
  
  if (fallbackUrl) {
    e.target.src = fallbackUrl;
  } else {
    // Default fallback image
    e.target.src = 'https://via.placeholder.com/400x400/cccccc/ffffff?text=Image+Not+Available';
  }
  
  // Prevent infinite loop
  e.target.onerror = null;
};

/**
 * Get multiple image URLs for a product
 * @param {Object} product - Product object
 * @returns {Object} Product with absolute image URLs
 */
export const processProductImages = (product) => {
  if (!product) return product;
  
  const processed = { ...product };
  
  // Process primary image
  if (processed.primary_image) {
    processed.primary_image = getImageUrl(processed.primary_image);
  }
  
  // Process images array
  if (processed.images && Array.isArray(processed.images)) {
    processed.images = processed.images.map((image, index) => ({
      ...image,
      image_url: getImageUrl(image.image_url),
      id: image.id || `img-${index}`, // Ensure ID exists
    }));
  }
  
  // Process related products
  if (processed.related_products && Array.isArray(processed.related_products)) {
    processed.related_products = processed.related_products.map(relatedProduct => ({
      ...relatedProduct,
      primary_image: getImageUrl(relatedProduct.primary_image)
    }));
  }
  
  return processed;
};

/**
 * Test if an image URL is accessible
 * @param {string} url - Image URL to test
 * @returns {Promise<boolean>} True if image loads successfully
 */
export const testImageUrl = async (url) => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
};

/**
 * Get category icon based on category name
 * @param {string} categoryName - Category name
 * @returns {string} Emoji icon
 */
export const getCategoryIcon = (categoryName) => {
  if (!categoryName) return '🛏️';
  
  const category = categoryName.toLowerCase();
  if (category.includes('bed')) return '🛏️';
  if (category.includes('mattress')) return '🛌';
  if (category.includes('pillow')) return '💤';
  if (category.includes('lounge')) return '🛋️';
  if (category.includes('headboard')) return '🖼️';
  return '🛒';
};