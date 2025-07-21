/**
 * Animation Visibility Fix
 * 
 * This module fixes issues with animations running too fast when returning to a tab
 * or window after it has been inactive.
 */

/**
 * Initialize visibility change handler to fix animation issues
 */
export function initVisibilityFix() {
  // Listen for visibility changes
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Also handle window focus/blur events for browsers that don't support visibilitychange
  window.addEventListener('blur', () => {
    document.body.classList.add('tab-inactive');
  });
  
  window.addEventListener('focus', () => {
    resetAnimations();
    document.body.classList.remove('tab-inactive');
  });
  
  // Add CSS to pause animations when tab is inactive
  const style = document.createElement('style');
  style.textContent = `
    /* Pause all animations when tab is inactive */
    .tab-inactive * {
      animation-play-state: paused !important;
      transition: none !important;
    }
    
    /* Fix for animations that should run continuously */
    .animation-reset {
      animation: none !important;
      transition: none !important;
    }
    
    /* Restore animations after reset */
    .animation-restored .hero-title-line:last-child .text-accent {
      animation: blink 1s step-end infinite !important;
    }
    
    .animation-restored .pixel-element {
      animation: float 4s ease-in-out infinite !important;
    }
    
    .animation-restored .pixel-element:nth-child(2) {
      animation-delay: 0.5s !important;
    }
    
    .animation-restored .pixel-element:nth-child(3) {
      animation-delay: 1s !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Handle visibility change events
 */
function handleVisibilityChange() {
  if (document.hidden) {
    // Tab is now inactive
    document.body.classList.add('tab-inactive');
  } else {
    // Tab is now active again
    resetAnimations();
    document.body.classList.remove('tab-inactive');
  }
}

/**
 * Reset animations to prevent them from running too fast when returning to the tab
 */
function resetAnimations() {
  // Add a class to temporarily disable all animations
  document.body.classList.add('animation-reset');
  
  // Force a reflow to apply the animation reset
  void document.body.offsetWidth;
  
  // Remove the reset class and add the restored class after a short delay
  setTimeout(() => {
    document.body.classList.remove('animation-reset');
    document.body.classList.add('animation-restored');
    
    // Reset continuous animations
    resetContinuousAnimations();
  }, 50);
}

/**
 * Reset continuous animations like the blinking cursor and floating elements
 */
function resetContinuousAnimations() {
  // Reset the blinking cursor animation
  const cursorElement = document.querySelector('.hero-title-line:last-child .text-accent');
  if (cursorElement) {
    cursorElement.style.animation = 'none';
    void cursorElement.offsetWidth;
    cursorElement.style.animation = '';
  }
  
  // Reset the floating pixel elements
  const pixelElements = document.querySelectorAll('.pixel-element');
  pixelElements.forEach((element, index) => {
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = '';
    
    // Restore the animation with the appropriate delay
    if (index === 0) {
      element.style.animation = 'float 4s ease-in-out infinite';
    } else if (index === 1) {
      element.style.animation = 'float 4s ease-in-out infinite';
      element.style.animationDelay = '0.5s';
    } else if (index === 2) {
      element.style.animation = 'float 4s ease-in-out infinite';
      element.style.animationDelay = '1s';
    }
  });
}