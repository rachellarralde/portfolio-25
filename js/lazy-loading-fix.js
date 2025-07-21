/**
 * Lazy Loading Fix
 * This file contains fixes for the lazy loading implementation
 */

/**
 * Fix lazy loading issues
 * This function addresses issues with lazy loading not working properly
 */
export function fixLazyLoading() {
  console.log('Fixing lazy loading issues...');
  
  // Add CSS to ensure images are visible during loading
  const style = document.createElement('style');
  style.textContent = `
    .project-image {
      background-color: var(--color-bg-secondary, #1a1a1a);
      min-height: 200px;
    }
    
    .lazy:not(.loaded) {
      opacity: 1 !important;
    }
    
    .lazy-blur {
      filter: blur(0) !important;
    }
    
    img[data-src], source[data-srcset] {
      visibility: visible !important;
    }
  `;
  document.head.appendChild(style);
  
  // Force load all project images immediately
  const projectImages = document.querySelectorAll('.project-image img.lazy');
  if (projectImages.length > 0) {
    console.log(`Found ${projectImages.length} project images to fix`);
    
    projectImages.forEach(img => {
      if (img.dataset.src) {
        // Force load the image
        img.src = img.dataset.src;
        img.classList.add('loaded');
        console.log(`Forced loading of project image: ${img.dataset.src}`);
      }
    });
  }
  
  // Fix picture elements in project cards
  const projectPictures = document.querySelectorAll('.project-image picture.lazy');
  if (projectPictures.length > 0) {
    console.log(`Found ${projectPictures.length} project picture elements to fix`);
    
    projectPictures.forEach(picture => {
      // Fix sources
      const sources = picture.querySelectorAll('source[data-srcset]');
      sources.forEach(source => {
        if (source.dataset.srcset) {
          source.srcset = source.dataset.srcset;
          console.log(`Set srcset for source: ${source.dataset.srcset}`);
        }
      });
      
      // Fix img
      const img = picture.querySelector('img[data-src]');
      if (img && img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        console.log(`Forced loading of image in picture: ${img.dataset.src}`);
      }
    });
  }
  
  // Check if any images are still not loaded
  setTimeout(() => {
    const stillLazyImages = document.querySelectorAll('img.lazy:not(.loaded)');
    if (stillLazyImages.length > 0) {
      console.log(`Still found ${stillLazyImages.length} lazy images that haven't loaded, forcing load...`);
      
      stillLazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
        }
      });
    }
    
    // Check for WebP support and apply appropriate fixes
    checkWebPSupport().then(supported => {
      if (!supported) {
        console.log('WebP not supported, removing WebP sources...');
        document.querySelectorAll('source[type="image/webp"]').forEach(source => {
          // Instead of removing, just set srcset directly from data-srcset
          if (source.dataset.srcset) {
            source.srcset = '';
          }
        });
      }
    });
  }, 500);
}

/**
 * Checks if WebP format is supported by the browser
 * @returns {Promise<boolean>} - Promise that resolves to true if WebP is supported
 */
function checkWebPSupport() {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = function() {
      const result = (webP.width > 0) && (webP.height > 0);
      resolve(result);
    };
    webP.onerror = function() {
      resolve(false);
    };
    webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}