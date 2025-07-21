/**
 * Animations Module
 * Handles page load animations and scroll-triggered animations
 */

/**
 * Initialize page load animations
 * Adds fade-in animations to elements when the page loads
 */
function initPageLoadAnimations() {
  // Add a class to the body when the page has loaded
  document.body.classList.add('page-loaded');
  
  // Elements to animate on page load with their delays
  // Exclude critical navigation and hero elements to prevent layout issues
  const animatedElements = [
    // Skip header and nav items to prevent layout issues
    // { selector: '.site-header', delay: 0 },
    // { selector: '.logo', delay: 0.1 },
    // { selector: '.nav-item', delay: 0.2, staggered: true },
    // { selector: '.hero-section', delay: 0.3 },
    
    // Only animate non-critical elements
    { selector: '.work-section .section-title', delay: 0.4 },
    { selector: '.work-filters', delay: 0.5 },
    { selector: '.social-icon', delay: 0.6, staggered: true },
    { selector: '.about-section .section-title', delay: 0.4 },
    { selector: '.contact-section .section-title', delay: 0.4 }
  ];
  
  // Apply animations to each element
  animatedElements.forEach(item => {
    const elements = document.querySelectorAll(item.selector);
    
    elements.forEach((element, index) => {
      // Calculate delay (add staggered delay if specified)
      let delay = item.delay;
      if (item.staggered) {
        delay += (index * 0.1);
      }
      
      // Set animation delay
      element.style.animationDelay = `${delay}s`;
      
      // Add animation class
      element.classList.add('fade-in');
    });
  });
  
  // Add subtle animation to hero elements without affecting layout
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title');
    const heroTagline = document.querySelector('.hero-tagline');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroTitle) heroTitle.classList.add('animate-hero');
    if (heroTagline) heroTagline.classList.add('animate-hero');
    if (heroCta) heroCta.classList.add('animate-hero');
  }, 300);
}

/**
 * Initialize scroll-triggered animations
 * Sets up IntersectionObserver to trigger animations when elements come into view
 */
function initScrollAnimations() {
  // Elements to animate on scroll
  const scrollAnimElements = [
    '.work-section',
    '.project-card',
    '.about-section',
    '.skills-section',
    '.skill-category',
    '.contact-section',
    '.contact-form-container',
    '.social-links',
    '.site-footer'
  ];
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Unobserve after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  // Observe all elements that should animate on scroll
  scrollAnimElements.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      observer.observe(element);
    });
  });
  
  // Add parallax effect to decorative elements
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Parallax for hero section pixel elements
    const pixelElements = document.querySelectorAll('.pixel-element');
    pixelElements.forEach((element, index) => {
      const speed = 0.05 * (index + 1);
      element.style.transform = `translateY(${scrollPosition * speed}px)`;
    });
    
    // Subtle parallax for section backgrounds
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const distance = scrollPosition - sectionTop;
      
      // Only apply effect when section is in view
      if (distance > -window.innerHeight && distance < window.innerHeight) {
        // Get the ::before pseudo-element (grid background)
        // We can't directly manipulate pseudo-elements with JS,
        // so we'll add a data attribute to the section and use that in CSS
        section.style.setProperty('--scroll-offset', `${distance * 0.02}px`);
      }
    });
  });
  
  // Add scroll progress indicator
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'scroll-progress';
  document.body.appendChild(progressIndicator);
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressIndicator.style.width = `${scrolled}%`;
  });
}

// Export functions for use in main.js
export { initPageLoadAnimations, initScrollAnimations };