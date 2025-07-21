/**
 * Image Optimizer Module
 * 
 * This module provides utilities for image optimization and management.
 * It helps with:
 * 1. Checking if images are properly optimized
 * 2. Preloading critical images
 * 3. Monitoring image loading performance
 */

/**
 * Preloads critical images for faster rendering
 * @param {Array<string>} imagePaths - Array of image paths to preload
 */
export function preloadCriticalImages(imagePaths) {
  if (!imagePaths || !Array.isArray(imagePaths) || imagePaths.length === 0) return;
  
  // Create link elements for preloading
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    
    // Add appropriate type based on file extension
    if (path.endsWith('.webp')) {
      link.type = 'image/webp';
    } else if (path.endsWith('.png')) {
      link.type = 'image/png';
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      link.type = 'image/jpeg';
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Monitors image loading performance
 * Logs warnings for images that take too long to load
 */
export function monitorImagePerformance() {
  if (!window.performance || !window.performance.getEntriesByType) return;
  
  // Wait for page load
  window.addEventListener('load', () => {
    // Get all resource entries
    const resources = window.performance.getEntriesByType('resource');
    
    // Filter for image resources
    const imageResources = resources.filter(resource => {
      return resource.initiatorType === 'img' || 
             (resource.name && (
               resource.name.endsWith('.jpg') || 
               resource.name.endsWith('.jpeg') || 
               resource.name.endsWith('.png') || 
               resource.name.endsWith('.webp') || 
               resource.name.endsWith('.gif')
             ));
    });
    
    // Check for large or slow-loading images
    imageResources.forEach(image => {
      const loadTime = image.responseEnd - image.startTime;
      const size = image.transferSize;
      
      // Log warnings for images that take more than 200ms to load
      if (loadTime > 200) {
        console.warn(`Slow image load: ${image.name} took ${loadTime.toFixed(2)}ms to load`);
      }
      
      // Log warnings for images larger than 200KB
      if (size > 200 * 1024) {
        console.warn(`Large image: ${image.name} is ${(size / 1024).toFixed(2)}KB`);
      }
    });
  });
}

/**
 * Checks if WebP format is supported by the browser
 * @returns {Promise<boolean>} - Promise that resolves to true if WebP is supported
 */
export function checkWebPSupport() {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = function() {
      // Check if the image's width is > 0 and height is > 0
      const result = (webP.width > 0) && (webP.height > 0);
      resolve(result);
    };
    webP.onerror = function() {
      resolve(false);
    };
    // Smallest WebP image possible
    webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}

/**
 * Adds WebP class to HTML element if WebP is supported
 * This allows for CSS targeting based on WebP support
 */
export function detectWebPSupport() {
  checkWebPSupport().then(supported => {
    if (supported) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  });
}

/**
 * Initialize image optimization features
 */
export function initImageOptimizer() {
  // Detect WebP support for potential CSS optimizations
  detectWebPSupport();
  
  // Monitor image performance
  monitorImagePerformance();
  
  // Preload critical images (featured project images)
  const criticalImages = [
    'assets/optimized/missing-brontosaurus.webp',
    'assets/optimized/flicked.webp',
    'assets/optimized/mini-games.webp'
  ];
  
  // Check WebP support before preloading
  checkWebPSupport().then(supported => {
    if (supported) {
      preloadCriticalImages(criticalImages);
    } else {
      // Fallback to PNG if WebP is not supported
      const fallbackImages = criticalImages.map(path => 
        path.replace('.webp', '.png')
      );
      preloadCriticalImages(fallbackImages);
    }
  });
}