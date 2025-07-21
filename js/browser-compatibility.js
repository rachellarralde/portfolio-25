/**
 * Browser Compatibility Testing Module
 * This module helps identify and fix cross-browser compatibility issues
 */

// Log browser information for testing purposes
function logBrowserInfo() {
  const userAgent = navigator.userAgent;
  const browserInfo = {
    userAgent: userAgent,
    vendor: navigator.vendor || 'Unknown',
    platform: navigator.platform || 'Unknown',
    language: navigator.language || 'Unknown'
  };
  
  console.log('Browser Information:', browserInfo);
  
  // Detect browser
  let browserName = 'Unknown';
  if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
  } else if (userAgent.indexOf('SamsungBrowser') > -1) {
    browserName = 'Samsung Internet';
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    browserName = 'Opera';
  } else if (userAgent.indexOf('Trident') > -1) {
    browserName = 'Internet Explorer';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge (Legacy)';
  } else if (userAgent.indexOf('Edg') > -1) {
    browserName = 'Edge (Chromium)';
  } else if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
  }
  
  console.log('Detected Browser:', browserName);
  
  return browserName;
}

// Check for CSS features support
function checkCSSSupport() {
  const features = {
    flexbox: typeof document.documentElement.style.flex !== 'undefined',
    grid: typeof document.documentElement.style.grid !== 'undefined',
    cssVars: window.CSS && window.CSS.supports && window.CSS.supports('--a', '0'),
    backdropFilter: CSS.supports('backdrop-filter', 'blur(5px)') || CSS.supports('-webkit-backdrop-filter', 'blur(5px)'),
    webp: document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
  };
  
  console.log('CSS Feature Support:', features);
  return features;
}

// Check for JavaScript API support
function checkJSSupport() {
  const features = {
    intersectionObserver: 'IntersectionObserver' in window,
    mutationObserver: 'MutationObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    fontLoading: 'fonts' in document,
    webAnimations: 'animate' in document.createElement('div'),
    passiveEvents: (function() {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
            return true;
          }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
      } catch (e) {}
      return supportsPassive;
    })()
  };
  
  console.log('JavaScript API Support:', features);
  return features;
}

// Apply fixes based on browser detection
function applyBrowserFixes() {
  const browserName = logBrowserInfo();
  const cssSupport = checkCSSSupport();
  const jsSupport = checkJSSupport();
  
  // Fix 1: IntersectionObserver polyfill
  if (!jsSupport.intersectionObserver) {
    console.log('Adding IntersectionObserver polyfill');
    // In a real implementation, you would load a polyfill here
    // For this test, we'll just provide a simple fallback
    window.IntersectionObserver = function(callback) {
      return {
        observe: function(element) {
          // Simple fallback - trigger immediately
          setTimeout(() => {
            callback([{
              isIntersecting: true,
              target: element
            }]);
          }, 100);
        },
        unobserve: function() {}
      };
    };
  }
  
  // Fix 2: CSS Variables fallback for IE11
  if (!cssSupport.cssVars) {
    console.log('Adding CSS Variables fallback');
    // Apply fallback colors directly
    document.documentElement.style.setProperty('--color-bg-primary', '#0d0d0d');
    document.documentElement.style.setProperty('--color-bg-secondary', '#1a1a1a');
    document.documentElement.style.setProperty('--color-text-primary', '#f5f5f5');
    document.documentElement.style.setProperty('--color-accent', '#ffd700');
    document.documentElement.style.setProperty('--color-subtle-1', '#333333');
    document.documentElement.style.setProperty('--color-subtle-2', '#444444');
  }
  
  // Fix 3: Backdrop filter fallback
  if (!cssSupport.backdropFilter) {
    console.log('Adding backdrop-filter fallback');
    // Make header background more opaque as a fallback
    const header = document.querySelector('.site-header');
    if (header) {
      header.style.backgroundColor = 'rgba(13, 13, 13, 0.98)';
    }
  }
  
  // Fix 4: WebP fallback
  if (!cssSupport.webp) {
    console.log('Adding WebP fallback');
    // Force all images to use JPG/PNG instead of WebP
    const sources = document.querySelectorAll('source[type="image/webp"]');
    sources.forEach(source => {
      source.remove(); // Remove WebP sources to fall back to the next source or img
    });
  }
  
  // Fix 5: Font loading API fallback
  if (!jsSupport.fontLoading) {
    console.log('Adding font loading fallback');
    // Simply add the fonts-loaded class after a timeout
    setTimeout(() => {
      document.documentElement.classList.add('fonts-loaded');
    }, 1000); // Wait 1 second to give fonts a chance to load
  }
  
  // Fix 6: Safari-specific fixes
  if (browserName === 'Safari') {
    console.log('Applying Safari-specific fixes');
    
    // Fix for flexbox gap issues in older Safari
    const flexContainers = document.querySelectorAll('.skills-list, .social-icons, .work-filters');
    flexContainers.forEach(container => {
      // Add a class for Safari-specific CSS
      container.classList.add('safari-flex-fix');
    });
    
    // Fix for sticky positioning
    const header = document.querySelector('.site-header');
    if (header) {
      header.classList.add('safari-sticky-fix');
    }
  }
  
  // Fix 7: Internet Explorer fixes
  if (browserName === 'Internet Explorer') {
    console.log('Applying Internet Explorer fixes');
    
    // Add a class to the body for IE-specific styles
    document.body.classList.add('is-ie');
    
    // Disable animations that might cause issues
    document.body.classList.add('reduce-animation');
  }
  
  // Fix 8: Edge (Legacy) fixes
  if (browserName === 'Edge (Legacy)') {
    console.log('Applying Edge Legacy fixes');
    
    // Add a class for Edge-specific CSS
    document.body.classList.add('is-edge-legacy');
  }
}

// Check for animation performance issues
function checkAnimationPerformance() {
  // Simple FPS counter
  let lastTime = performance.now();
  let frames = 0;
  let fps = 0;
  
  function countFrames(now) {
    frames++;
    
    if (now - lastTime > 1000) {
      fps = Math.round((frames * 1000) / (now - lastTime));
      console.log(`Current FPS: ${fps}`);
      
      // If FPS is too low, reduce animations
      if (fps < 30) {
        console.log('Low FPS detected, reducing animations');
        document.body.classList.add('reduce-animation');
      }
      
      frames = 0;
      lastTime = now;
    }
    
    requestAnimationFrame(countFrames);
  }
  
  // Start counting frames
  requestAnimationFrame(countFrames);
}

// Initialize browser compatibility checks and fixes
function initBrowserCompatibility() {
  console.log('Initializing browser compatibility checks');
  
  // Apply fixes based on browser detection
  applyBrowserFixes();
  
  // Check animation performance after a short delay
  setTimeout(() => {
    checkAnimationPerformance();
  }, 2000);
}

// Export the initialization function
export { initBrowserCompatibility };