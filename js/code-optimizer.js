/**
 * Code Optimizer Module
 * Optimizes and validates HTML and CSS code
 */

// Fix HTML validation issues
function fixHTMLValidation() {
  console.log('Fixing HTML validation issues...');
  
  // Fix 1: Fix SVG favicon encoding
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (faviconLink) {
    const currentHref = faviconLink.getAttribute('href');
    if (currentHref && currentHref.includes('svg')) {
      // Properly encode the SVG for use in data URI
      const encodedSVG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💻</text></svg>');
      faviconLink.setAttribute('href', encodedSVG);
      console.log('Fixed SVG favicon encoding');
    }
  }
  
  // Fix 2: Add srcset attribute to source elements with data-srcset
  const sourcesWithDataSrcset = document.querySelectorAll('source[data-srcset]:not([srcset])');
  sourcesWithDataSrcset.forEach(source => {
    // For lazy loading to work properly, we'll keep data-srcset but also add an empty srcset
    source.setAttribute('srcset', '');
    console.log('Added srcset attribute to source element');
  });
  
  // Fix 3: Add src attribute to img elements with data-src
  const imgsWithDataSrc = document.querySelectorAll('img[data-src]:not([src])');
  imgsWithDataSrc.forEach(img => {
    // For lazy loading to work properly, we'll add a tiny transparent placeholder
    img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    console.log('Added src attribute to img element');
  });
  
  // Fix 4: Remove trailing slashes from void elements (this would require server-side changes)
  console.log('Note: Trailing slashes on void elements should be removed in the HTML source file');
}

// Check for CSS validation issues
function checkCSSValidation() {
  console.log('Checking for common CSS validation issues...');
  
  const issues = [];
  
  // Get all stylesheets
  const styleSheets = Array.from(document.styleSheets);
  
  styleSheets.forEach(sheet => {
    try {
      // Try to access cssRules to check if the stylesheet is accessible
      const rules = sheet.cssRules || sheet.rules;
      
      // Check each rule for common issues
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        
        // Check for vendor prefixes without standard property
        if (rule.cssText.includes('-webkit-') || rule.cssText.includes('-moz-') || 
            rule.cssText.includes('-ms-') || rule.cssText.includes('-o-')) {
          
          // Check if the rule also includes the standard property
          // This is a simplified check and might not catch all cases
          if (rule.cssText.includes('display: flex') && !rule.cssText.includes('display: -webkit-flex')) {
            issues.push({
              type: 'vendorPrefix',
              rule: rule.cssText,
              message: 'Missing vendor prefix for flexbox'
            });
          }
          
          if (rule.cssText.includes('display: grid') && !rule.cssText.includes('display: -ms-grid')) {
            issues.push({
              type: 'vendorPrefix',
              rule: rule.cssText,
              message: 'Missing vendor prefix for grid'
            });
          }
        }
        
        // Check for potentially invalid properties
        if (rule.cssText.includes('overflow-wrap: break-word') && !rule.cssText.includes('word-wrap: break-word')) {
          issues.push({
            type: 'compatibility',
            rule: rule.cssText,
            message: 'Missing word-wrap fallback for overflow-wrap'
          });
        }
      }
    } catch (e) {
      // CORS restrictions might prevent accessing some stylesheets
      console.log('Could not access stylesheet:', sheet.href, e.message);
    }
  });
  
  // Log all issues
  if (issues.length > 0) {
    console.log('CSS Validation Issues Found:', issues);
  } else {
    console.log('No common CSS validation issues detected');
  }
  
  return issues;
}

// Fix CSS validation issues
function fixCSSValidation() {
  const issues = checkCSSValidation();
  
  if (issues.length > 0) {
    console.log('Fixing CSS validation issues...');
    
    // Add a style element with fixes
    const style = document.createElement('style');
    style.textContent = `
      /* CSS Validation Fixes */
      
      /* Fix for flexbox compatibility */
      .projects-grid, .skills-container, .social-icons, .work-filters {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }
      
      /* Fix for grid compatibility */
      .projects-grid, .skills-container {
        display: -ms-grid;
        display: grid;
      }
      
      /* Fix for word-wrap compatibility */
      p, h1, h2, h3, h4, h5, h6 {
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      /* Fix for backdrop-filter compatibility */
      .site-header {
        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);
      }
    `;
    
    document.head.appendChild(style);
    console.log('Added CSS compatibility fixes');
  }
}

// Initialize code optimization
function initCodeOptimizer() {
  console.log('Initializing code optimizer...');
  
  // Fix HTML validation issues
  fixHTMLValidation();
  
  // Fix CSS validation issues
  fixCSSValidation();
  
  // Log completion
  console.log('Code optimization complete');
}

// Export the initialization function
export { initCodeOptimizer };