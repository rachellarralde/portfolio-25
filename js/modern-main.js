// Modern Portfolio Scripts

// Project Data
const projects = [
    {
        id: "project4",
        title: "ARCADE",
        category: "Audio Sampler Plug-In by Output",
        description: "A sampler plug-in for audio production.",
        imageUrl: "assets/arcade.png",
        liveUrl: "https://output.com/arcade",
        featured: false,
    },
    {
        id: "project2",
        title: "GET FLICKED",
        category: "iOS App",
        description: "A movies and TV show recommendation engine.",
        imageUrl: "assets/optimized/flicked.webp",
        liveUrl: "https://getflicked.app",
        featured: true,
    },
    {
        id: "project3",
        title: "RESUME MATCH",
        category: "AI Powered Web App",
        description: "AI-powered resume analysis and optimization tool.",
        imageUrl: "assets/resume-match-dashboard.png",
        liveUrl: "https://www.resumematch.online",
        featured: true,
    },
    {
        id: "project5",
        title: "WITCH@UDIO PORTFOLIO",
        category: "Web Development",
        description: "Stylish and interactive portfolio website.",
        imageUrl: "assets/optimized/witchaudio.webp",
        liveUrl: "https://witchaudio.me/",
        featured: false,
    },
    {
        id: "project6",
        title: "CO-PRODUCER",
        category: "AI Powered Plug-In by Output",
        description: "An AI-powered plug-in for audio production.",
        imageUrl: "assets/copro.png",
        liveUrl: "https://output.com/products/co-producer",
        featured: false,
    },
    {
        id: "project1",
        title: "MISSING BRONTOSAURUS",
        category: "Web Development",
        description: "A fully responsive music label landing page for Missing Brontosaurus.",
        imageUrl: "assets/optimized/missing-brontosaurus.webp",
        liveUrl: "https://missingbrontosaur.us",
        featured: true,
    },
];

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded. Initializing systems...');

    // Render Projects
    renderProjects();

    // Typewriter Effect for Hero
    initTypewriter();

    // Smooth Scroll
    initSmoothScroll();

    // Intersection Observer for Fade-in animations
    initScrollAnimations();

    // Mouse Move Parallax Effect
    initParallax();
});

function renderProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-tilt', ''); // For tilt effect

        let mediaContent = '';
        if (project.videoUrl) {
            mediaContent = `
                <div class="project-media video-container">
                    <iframe src="${project.videoUrl}" title="${project.title}" frameborder="0" allowfullscreen></iframe>
                </div>
            `;
        } else {
            mediaContent = `
                <div class="project-media">
                    <img src="${project.imageUrl}" alt="${project.title}" loading="lazy">
                    <div class="media-overlay"></div>
                </div>
            `;
        }

        card.innerHTML = `
            ${mediaContent}
            <div class="project-content">
                <div class="project-header">
                    <span class="project-category">// ${project.category}</span>
                    <div class="project-status"></div>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <a href="${project.liveUrl}" class="project-link glitched-link" target="_blank">
                    <span class="link-text">ACCESS_SYSTEM</span>
                    <span class="link-decoration">>></span>
                </a>
            </div>
            <div class="card-decoration top-left"></div>
            <div class="card-decoration top-right"></div>
            <div class="card-decoration bottom-left"></div>
            <div class="card-decoration bottom-right"></div>
        `;

        container.appendChild(card);
    });

    // Initialize Tilt Effect
    // We can add a simple vanilla JS tilt here if we don't want to load a library
    initTiltEffect();
}

function initTypewriter() {
    const roles = [
        "Software Development Engineer in Test",
        "Fullstack Developer",
        "Context AI Engineer"
    ];
    const taglineElement = document.querySelector('.hero-tagline');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            taglineElement.textContent = "I am a " + currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            taglineElement.textContent = "I am a " + currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing loop
    // type(); 
    // Actually, let's stick to the static text for now but animate the cursor
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .project-card').forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });
}

function initParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.transform = `translate(-${x * 20}px, -${y * 20}px)`;
        }

        const decoration = document.querySelector('.hero-decoration');
        if (decoration) {
            decoration.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        }
    });
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}
