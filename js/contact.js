/**
 * Contact Section Functionality
 * 
 * This file contains functionality for the contact section,
 * including email link tracking and contact card interactions.
 */

/**
 * Initialize the contact section functionality
 */
function initContactForm() {
  console.log('Contact section initialized');
  
  // Add functionality for the contact button
  const contactBtn = document.querySelector('.contact-btn');
  
  if (contactBtn) {
    // Track clicks on the contact button if analytics are implemented
    contactBtn.addEventListener('click', () => {
      console.log('Contact button clicked');
      // If you add analytics later, you can track this event
      // Example: analytics.trackEvent('contact_email_click');
    });
  }
  
  // Add functionality for email links in contact details
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  
  emailLinks.forEach(link => {
    link.addEventListener('click', () => {
      console.log('Email link clicked:', link.href);
      // Track email link clicks if analytics are implemented
    });
  });
}

// Export the initialization function
export { initContactForm };