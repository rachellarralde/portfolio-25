/**
 * Retro Portfolio - Main JavaScript
 */

// Import modules
import { renderProjects, filterProjects } from './projects.js';
import { initContactForm } from './contact.js';
import { initPageLoadAnimations, initScrollAnimations } from './animations.js';
import { enhanceLazyLoading } from './lazy-loading.js';
import { fixLazyLoading } from './lazy-loading-fix.js';
import { initImageOptimizer } from './image-optimizer.js';
import { initCodeOptimizer } from './code-optimizer.js';
import { initBrowserCompatibility } from './browser-compatibility.js';
import { initResponsiveTest } from './responsive-test.js';
import { initVisibilityFix } from './animation-visibility-fix.js';

// Navigation active state
const updateActiveNavLink = () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Get the current scroll position
  const scrollPosition = window.scrollY;
  
  // Find which section is currently in view
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100; // Offset for header
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Remove active class from all links
      navLinks.forEach(link => {
        link.classList.remove('active');
      });
      
      // Add active class to the corresponding nav link
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
};

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

/**
 * Smooth scrolling functionality for navigation links
 */
const handleSmoothScroll = (e) => {
  // Get the href attribute
  const targetId = e.currentTarget.getAttribute('href');
  
  // Check if it's an anchor link
  if (targetId && targetId.startsWith('#') && targetId.length > 1) {
    e.preventDefault();
    
    // Get the target element
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Calculate offset to account for fixed header
      const headerOffset = 80; // Adjust based on header height
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      // Scroll to the target element
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without page reload (optional)
      history.pushState(null, null, targetId);
      
      // Update active state after scrolling
      setTimeout(() => {
        updateActiveNavLink();
      }, 100);
    }
  }
};

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');

const toggleMobileMenu = () => {
  mobileMenuToggle.classList.toggle('open');
  navList.classList.toggle('open');
  document.body.classList.toggle('menu-open');
};

// Toggle menu when hamburger is clicked
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Add smooth scrolling to all navigation links
navLinks.forEach(link => {
  link.addEventListener('click', handleSmoothScroll);
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navList.classList.contains('open')) {
      toggleMobileMenu();
    }
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const isNavLink = e.target.closest('.nav-link');
  const isMenuToggle = e.target.closest('.mobile-menu-toggle');
  const isMenuOpen = navList.classList.contains('open');
  
  if (isMenuOpen && !isNavLink && !isMenuToggle) {
    toggleMobileMenu();
  }
});

// Close menu when window is resized to desktop size
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768 && navList.classList.contains('open')) {
    toggleMobileMenu();
  }
});

/**
 * Set up project filter functionality
 */
function setupProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter projects
      filterProjects(filterValue, 'projects-grid');
    });
  });
}

/**
 * Handle scroll animations for sections
 */
function handleScrollAnimations() {
  const sections = document.querySelectorAll('.about-section, .contact-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize browser compatibility checks and fixes first
  initBrowserCompatibility();
  
  // Initialize responsive testing
  initResponsiveTest();
  
  // Check if the Space Mono font has loaded
  if (document.fonts) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded');
      
      // Initialize page load animations after fonts are loaded
      initPageLoadAnimations();
    });
  } else {
    // Fallback for browsers that don't support the fonts API
    document.documentElement.classList.add('fonts-loaded');
    
    // Initialize page load animations
    initPageLoadAnimations();
  }
  
  // Set initial active nav link
  updateActiveNavLink();
  
  // Initialize projects grid
  renderProjects('projects-grid');
  
  // Fix lazy loading for project images
  fixLazyLoading();
  
  // Set up project filters
  setupProjectFilters();
  
  // Initialize scroll animations
  handleScrollAnimations();
  
  // Initialize new scroll animations
  initScrollAnimations();
  
  // Initialize contact form validation
  initContactForm();
  
  // Initialize enhanced lazy loading for all images
  enhanceLazyLoading();
  
  // Initialize image optimization features
  initImageOptimizer();
  
  // Initialize code optimization features
  initCodeOptimizer();
  
  // Initialize animation visibility fix
  initVisibilityFix();
  
  // Add smooth scrolling to footer navigation links
  const footerNavLinks = document.querySelectorAll('.footer-nav-link');
  footerNavLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
  });
  
  // Add smooth scrolling to any other anchor links in the page
  const ctaButtons = document.querySelectorAll('.hero-cta a[href^="#"]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', handleSmoothScroll);
  });
});