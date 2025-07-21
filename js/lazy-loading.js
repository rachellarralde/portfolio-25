/**
 * Lazy Loading Implementation
 * Efficiently loads images only when they are about to enter the viewport
 * with enhanced performance optimizations
 */

// Create a tiny SVG placeholder
const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initLazyLoading();
  
  // Also call enhanceLazyLoading to process any dynamically added images
  enhanceLazyLoading();
});

/**
 * Initialize lazy loading for all images with the 'lazy' class
 */
function initLazyLoading() {
  // Check if the browser supports Intersection Observer
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          
          // Handle <picture> elements with <source> tags
          if (lazyImage.tagName.toLowerCase() === 'picture') {
            const sources = lazyImage.querySelectorAll('source');
            const img = lazyImage.querySelector('img');
            
            sources.forEach(source => {
              if (source.dataset.srcset) {
                source.srcset = source.dataset.srcset;
                source.removeAttribute('data-srcset');
              }
            });
            
            if (img && img.dataset.src) {
              loadImage(img);
            }
          } 
          // Handle regular <img> elements
          else if (lazyImage.dataset.src) {
            loadImage(lazyImage);
          }
          
          observer.unobserve(lazyImage);
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading images 200px before they enter the viewport
      threshold: 0.01
    });

    // Observe all elements with the 'lazy' class
    const lazyImages = document.querySelectorAll('.lazy');
    lazyImages.forEach(image => {
      lazyImageObserver.observe(image);
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    // Use the native 'loading="lazy"' attribute which is already in place
    console.log('Browser does not support IntersectionObserver. Using native lazy loading.');
    
    // Apply native lazy loading to all images
    document.querySelectorAll('img.lazy').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.setAttribute('loading', 'lazy');
        img.classList.add('loaded');
      }
    });
  }
}

/**
 * Load an image with fade-in effect
 * @param {HTMLImageElement} img - The image element to load
 */
function loadImage(img) {
  // Create a new image to preload
  const newImage = new Image();
  
  // When the image is loaded, update the visible image
  newImage.onload = function() {
    img.src = img.dataset.src;
    img.classList.add('loaded');
    img.removeAttribute('data-src');
  };
  
  // Set the source to start loading
  newImage.src = img.dataset.src;
}

/**
 * Converts all images on the page to use the advanced lazy loading
 * This is called after the DOM is loaded and can be called again
 * when new content is dynamically added to the page
 */
export function enhanceLazyLoading() {
  // Only proceed if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Apply native lazy loading to all images
    document.querySelectorAll('img:not(.lazy)').forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
    return;
  }
  
  // Find all images with loading="lazy" and convert them to use our custom lazy loading
  const images = document.querySelectorAll('img[loading="lazy"]:not(.lazy)');
  images.forEach(img => {
    // Skip if already processed
    if (img.classList.contains('lazy')) return;
    
    // Add placeholder class for styling
    img.parentElement.classList.add('placeholder');
    
    // Store the original src in data-src
    if (img.src && !img.src.includes('data:image')) {
      img.dataset.src = img.src;
      img.src = PLACEHOLDER_SVG;
      img.classList.add('lazy');
      img.classList.add('lazy-blur');
    }
  });
  
  // Find all picture elements with source tags
  const pictures = document.querySelectorAll('picture:not(.lazy)');
  pictures.forEach(picture => {
    const img = picture.querySelector('img');
    const sources = picture.querySelectorAll('source');
    
    // Skip if already processed
    if (img && img.classList.contains('lazy')) return;
    
    // Add placeholder class for styling
    picture.parentElement.classList.add('placeholder');
    
    // Process sources
    sources.forEach(source => {
      if (source.srcset) {
        source.dataset.srcset = source.srcset;
        source.srcset = '';
      }
    });
    
    // Process img
    if (img && img.src && !img.src.includes('data:image')) {
      img.dataset.src = img.src;
      img.src = PLACEHOLDER_SVG;
      img.classList.add('lazy');
      img.classList.add('lazy-blur');
    }
    
    // Add lazy class to picture element
    picture.classList.add('lazy');
  });
  
  // Initialize lazy loading for newly added elements
  initLazyLoading();
}