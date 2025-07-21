/**
 * Projects Data Structure
 * Contains sample project data and functions to render projects dynamically
 */

// Sample projects data array
const projects = [
  {
    id: "project1",
    title: "MISSING BRONTOSAURUS",
    category: "Web Development",
    description: "A fully responsive music label landing page for Missing Brontosaurus.",
    imageUrl: "assets/optimized/missing-brontosaurus.webp",
    imageUrlFallback: "assets/optimized/missing-brontosaurus.png",
    liveUrl: "https://missingbrontosaur.us",
    featured: true
  },
  {
    id: "project2",
    title: "GET FLICKED",
    category: "iOS App",
    description: "A movies and TV show recommendation engine.",
    imageUrl: "assets/optimized/flicked.webp",
    imageUrlFallback: "assets/optimized/flicked.png",
    liveUrl: "https://itsflicked.com",
    featured: true
  },
  {
    id: "project3",
    title: "MINI GAMES",
    category: "Web Development",
    description: "A minimal games site.",
    imageUrl: "assets/optimized/mini-games.webp",
    imageUrlFallback: "assets/optimized/mini-games.png",
    liveUrl: "https://mini-fungames.vercel.app",
    featured: true
  },
  {
    id: "project4",
    title: "5 MINUTE TAROT",
    category: "iOS App",
    description: "AI Tarot fortune teller app",
    // Using witchaudio as a fallback since project4 images don't exist
    imageUrl: "assets/optimized/witchaudio.webp",
    imageUrlFallback: "assets/optimized/witchaudio.png",
    liveUrl: "https://example.com/project4",
    featured: false
  },
  {
    id: "project5",
    title: "WITCH@UDIO PORTFOLIO",
    category: "Web Development",
    description: "Stylish and interactive portfolio website.",
    imageUrl: "assets/optimized/witchaudio.webp",
    imageUrlFallback: "assets/optimized/witchaudio.png",
    liveUrl: "https://witchaudio.me/",
    featured: false
  },
  {
    id: "project6",
    title: "QUEER READS",
    category: "iOS App",
    description: "An app for finding the best LGBTQIA+ literature.",
    // Using flicked as a fallback since project6 images don't exist
    imageUrl: "assets/optimized/flicked.webp",
    imageUrlFallback: "assets/optimized/flicked.png",
    liveUrl: "https://example.com/project6",
    featured: false
  }
];

/**
 * Renders all projects to the specified container element
 * @param {string} containerId - The ID of the container element
 */
function renderProjects(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Clear the container
  container.innerHTML = '';
  
  // Create and append project cards
  projects.forEach(project => {
    const projectCard = createProjectCard(project);
    container.appendChild(projectCard);
  });
}

/**
 * Creates a project card DOM element
 * @param {Object} project - The project data object
 * @returns {HTMLElement} - The project card element
 */
function createProjectCard(project) {
  // Create card container
  const card = document.createElement('article');
  card.className = 'project-card';
  if (project.featured) {
    card.classList.add('featured');
  }
  card.setAttribute('data-category', project.category);
  
  // Create image HTML with picture element for WebP support and advanced lazy loading
  let imageHTML = '';
  if (project.imageUrlFallback) {
    // Use picture element with WebP and fallback with advanced lazy loading
    // Add sizes attribute for responsive images
    imageHTML = `
      <picture class="lazy">
        <source data-srcset="${project.imageUrl}" type="image/webp" sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw">
        <source data-srcset="${project.imageUrlFallback}" type="image/png" sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw">
        <img 
          data-src="${project.imageUrlFallback}" 
          alt="${project.title}" 
          class="lazy lazy-blur" 
          loading="lazy" 
          width="600" 
          height="338"
          fetchpriority="${project.featured ? 'high' : 'auto'}"
        >
      </picture>
    `;
  } else {
    // Use regular img element with advanced lazy loading
    imageHTML = `
      <img 
        data-src="${project.imageUrl}" 
        alt="${project.title}" 
        class="lazy lazy-blur" 
        loading="lazy" 
        width="600" 
        height="338"
        fetchpriority="${project.featured ? 'high' : 'auto'}"
      >
    `;
  }
  
  // Create card content
  card.innerHTML = `
    <div class="project-image placeholder">
      ${imageHTML}
    </div>
    <div class="project-content">
      <span class="project-category">${project.category}</span>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener noreferrer">
        Live Website <span class="arrow-icon">→</span>
      </a>
    </div>
  `;
  
  return card;
}

/**
 * Filters projects by category
 * @param {string} category - The category to filter by (or 'all' for all projects)
 * @param {string} containerId - The ID of the container element
 */
function filterProjects(category, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const projectCards = container.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Export functions for use in main.js
export { projects, renderProjects, filterProjects };