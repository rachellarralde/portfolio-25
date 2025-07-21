/**
 * Responsive Testing Module
 * Tests and fixes responsive behavior issues
 */

// Define common screen sizes for testing
const screenSizes = [
  { name: "Mobile Small", width: 320, height: 568, category: "Mobile" },
  { name: "Mobile Medium", width: 375, height: 667, category: "Mobile" },
  { name: "Mobile Large", width: 414, height: 736, category: "Mobile Large" },
  { name: "Tablet Portrait", width: 768, height: 1024, category: "Tablet" },
  { name: "Tablet Landscape", width: 1024, height: 768, category: "Tablet" },
  { name: "Laptop", width: 1280, height: 800, category: "Desktop" },
  { name: "Desktop", width: 1440, height: 900, category: "Large Desktop" },
  {
    name: "Large Desktop",
    width: 1920,
    height: 1080,
    category: "Large Desktop",
  },
];

// Log the current viewport size
function logViewportSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;

  console.log(
    `Viewport Size: ${width}px × ${height}px (Device Pixel Ratio: ${devicePixelRatio})`
  );

  // Determine current screen category
  let screenCategory = "Unknown";
  if (width < 576) {
    screenCategory = "Mobile";
  } else if (width < 768) {
    screenCategory = "Mobile Large";
  } else if (width < 992) {
    screenCategory = "Tablet";
  } else if (width < 1200) {
    screenCategory = "Desktop";
  } else {
    screenCategory = "Large Desktop";
  }

  console.log(`Screen Category: ${screenCategory}`);

  // Find closest predefined screen size for reference
  const closestScreenSize = findClosestScreenSize(width, height);
  if (closestScreenSize) {
    console.log(
      `Closest predefined screen: ${closestScreenSize.name} (${closestScreenSize.width}x${closestScreenSize.height})`
    );
  }

  return { width, height, screenCategory };
}

// Find the closest predefined screen size to the current viewport
function findClosestScreenSize(width, height) {
  if (!screenSizes.length) return null;

  return screenSizes.reduce((closest, current) => {
    const currentDiff =
      Math.abs(current.width - width) + Math.abs(current.height - height);
    const closestDiff =
      Math.abs(closest.width - width) + Math.abs(closest.height - height);

    return currentDiff < closestDiff ? current : closest;
  });
}

// Check for responsive layout issues
function checkResponsiveLayout() {
  const { width, height, screenCategory } = logViewportSize();
  const issues = [];

  // Check for horizontal overflow
  const bodyWidth = document.body.offsetWidth;
  const htmlWidth = document.documentElement.offsetWidth;
  const scrollWidth = Math.max(bodyWidth, htmlWidth);

  if (scrollWidth > width) {
    issues.push({
      type: "overflow",
      message: `Horizontal overflow detected: Page width (${scrollWidth}px) exceeds viewport width (${width}px)`,
      severity: "high",
    });

    // Try to find the overflowing element
    const allElements = document.querySelectorAll("*");
    const overflowingElements = Array.from(allElements).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > width || rect.right > width;
    });

    if (overflowingElements.length > 0) {
      console.log("Overflowing elements:", overflowingElements.slice(0, 5));

      // Highlight overflowing elements in test mode
      if (window.RESPONSIVE_TEST_MODE) {
        overflowingElements.slice(0, 10).forEach((el) => {
          el.dataset.responsiveIssue = "overflow";
          el.style.outline = "2px solid red";
        });
      }
    }
  }

  // Check for touch target size issues on mobile
  if (screenCategory === "Mobile" || screenCategory === "Mobile Large") {
    const smallTouchTargets = [];

    // Check interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [role="button"]'
    );
    interactiveElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Touch targets should be at least 44x44px according to WCAG
      if (rect.width < 44 || rect.height < 44) {
        smallTouchTargets.push(el);

        // Highlight small touch targets in test mode
        if (window.RESPONSIVE_TEST_MODE) {
          el.dataset.responsiveIssue = "touchTarget";
          el.style.outline = "2px dashed orange";
        }
      }
    });

    if (smallTouchTargets.length > 0) {
      issues.push({
        type: "touchTarget",
        message: `${smallTouchTargets.length} elements have touch targets smaller than 44x44px`,
        elements: smallTouchTargets.slice(0, 5),
        severity: "medium",
      });
    }
  }

  // Check for font size issues
  const smallTextElements = [];
  const textElements = document.querySelectorAll(
    "p, span, a, li, h1, h2, h3, h4, h5, h6"
  );
  textElements.forEach((el) => {
    const fontSize = parseInt(window.getComputedStyle(el).fontSize);
    const computedStyle = window.getComputedStyle(el);

    // Text should be at least 16px on mobile for readability
    // Only check visible text elements
    if (
      screenCategory.includes("Mobile") &&
      fontSize < 16 &&
      el.offsetParent !== null &&
      computedStyle.display !== "none" &&
      computedStyle.visibility !== "hidden" &&
      el.textContent.trim().length > 0
    ) {
      smallTextElements.push({
        element: el,
        fontSize: fontSize,
      });

      // Highlight small text elements in test mode
      if (window.RESPONSIVE_TEST_MODE) {
        el.dataset.responsiveIssue = "fontSize";
        el.style.outline = "2px dotted blue";
      }
    }
  });

  if (smallTextElements.length > 0) {
    issues.push({
      type: "fontSize",
      message: `${smallTextElements.length} text elements have font size smaller than 16px on mobile`,
      elements: smallTextElements.slice(0, 5),
      severity: "medium",
    });
  }

  // Check for navigation issues on mobile
  if (screenCategory.includes("Mobile")) {
    const navList = document.querySelector(".nav-list");
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

    if (navList && mobileMenuToggle) {
      const navListStyle = window.getComputedStyle(navList);

      // Check if mobile menu is properly implemented
      if (
        navListStyle.position !== "absolute" &&
        navListStyle.position !== "fixed"
      ) {
        issues.push({
          type: "navigation",
          message: "Mobile navigation menu may not be properly implemented",
          severity: "medium",
        });

        // Highlight navigation issues in test mode
        if (window.RESPONSIVE_TEST_MODE) {
          navList.dataset.responsiveIssue = "navigation";
          navList.style.outline = "2px solid purple";
        }
      }
    }
  }

  // Check for content width issues
  const contentContainers = document.querySelectorAll(
    ".container, section > div, main > div"
  );
  contentContainers.forEach((container) => {
    const rect = container.getBoundingClientRect();

    // Check if container is too wide for the viewport
    if (rect.width > width) {
      issues.push({
        type: "containerWidth",
        message: `Container is wider than viewport: ${Math.round(
          rect.width
        )}px vs ${width}px viewport`,
        element: container,
        severity: "high",
      });

      // Highlight container width issues in test mode
      if (window.RESPONSIVE_TEST_MODE) {
        container.dataset.responsiveIssue = "containerWidth";
        container.style.outline = "2px solid red";
      }
    }

    // Check if container is too narrow on desktop (potential layout issue)
    if (
      !screenCategory.includes("Mobile") &&
      !screenCategory.includes("Tablet") &&
      rect.width < width * 0.5
    ) {
      issues.push({
        type: "containerNarrow",
        message: `Container may be too narrow on desktop: ${Math.round(
          rect.width
        )}px vs ${width}px viewport`,
        element: container,
        severity: "low",
      });
    }
  });

  // Check for image aspect ratio issues
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    // Only check loaded images with dimensions
    if (img.complete && img.naturalWidth > 0) {
      const imgWidth = img.width;
      const imgHeight = img.height;

      // Check if image is displayed at proper aspect ratio
      const naturalRatio = img.naturalWidth / img.naturalHeight;
      const displayRatio = imgWidth / imgHeight;

      // Allow for small rounding differences
      if (Math.abs(naturalRatio - displayRatio) > 0.1) {
        issues.push({
          type: "imageRatio",
          message: `Image aspect ratio distorted: natural ${naturalRatio.toFixed(
            2
          )} vs displayed ${displayRatio.toFixed(2)}`,
          element: img,
          severity: "low",
        });

        // Highlight image ratio issues in test mode
        if (window.RESPONSIVE_TEST_MODE) {
          img.dataset.responsiveIssue = "imageRatio";
          img.style.outline = "2px dashed green";
        }
      }
    }
  });

  // Log all issues
  if (issues.length > 0) {
    console.log("Responsive Issues Found:", issues);

    // Group issues by severity
    const highSeverity = issues.filter((issue) => issue.severity === "high");
    const mediumSeverity = issues.filter(
      (issue) => issue.severity === "medium"
    );
    const lowSeverity = issues.filter((issue) => issue.severity === "low");

    console.log(
      `Issues by severity: ${highSeverity.length} high, ${mediumSeverity.length} medium, ${lowSeverity.length} low`
    );
  } else {
    console.log("No responsive issues detected");
  }

  return issues;
}

// Fix responsive layout issues
function fixResponsiveIssues() {
  const issues = checkResponsiveLayout();
  const { screenCategory } = logViewportSize();

  // Apply fixes based on detected issues
  issues.forEach((issue) => {
    if (issue.type === "overflow") {
      console.log("Fixing overflow issues...");

      // Add a class to the body to fix overflow issues
      document.body.classList.add("fix-overflow");

      // Add CSS to fix common overflow causes
      const style = document.createElement("style");
      style.textContent = `
        .fix-overflow * {
          max-width: 100% !important;
          overflow-wrap: break-word !important;
        }
        
        .fix-overflow img {
          height: auto !important;
        }
        
        .fix-overflow table {
          display: block !important;
          overflow-x: auto !important;
        }
      `;
      document.head.appendChild(style);
    }

    if (issue.type === "touchTarget" && issue.elements) {
      console.log("Fixing touch target issues...");

      // Add a class to small touch targets
      issue.elements.forEach((el) => {
        el.classList.add("enhance-touch-target");
      });

      // Add CSS to enhance touch targets
      const style = document.createElement("style");
      style.textContent = `
        .enhance-touch-target {
          min-height: 44px !important;
          min-width: 44px !important;
          padding: 12px !important;
        }
      `;
      document.head.appendChild(style);
    }

    if (issue.type === "fontSize" && issue.elements) {
      console.log("Fixing font size issues...");

      // Add a class to small text elements
      issue.elements.forEach((item) => {
        item.element.classList.add("enhance-font-size");
      });

      // Add CSS to enhance font sizes
      const style = document.createElement("style");
      style.textContent = `
        .enhance-font-size {
          font-size: 16px !important;
        }
      `;
      document.head.appendChild(style);
    }

    if (issue.type === "navigation") {
      console.log("Fixing navigation issues...");

      // Fix mobile navigation
      const navList = document.querySelector(".nav-list");
      const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

      if (navList && mobileMenuToggle) {
        // Ensure proper mobile navigation styling
        const style = document.createElement("style");
        style.textContent = `
          @media (max-width: 767px) {
            .nav-list {
              position: fixed !important;
              top: 60px !important;
              left: 0 !important;
              width: 100% !important;
              background-color: var(--color-bg-primary, #0d0d0d) !important;
              z-index: 1000 !important;
              padding: 1rem !important;
              box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2) !important;
            }
            
            .nav-list.hidden {
              display: none !important;
            }
          }
        `;
        document.head.appendChild(style);
      }
    }

    if (issue.type === "containerWidth") {
      console.log("Fixing container width issues...");

      // Fix container width issues
      if (issue.element) {
        issue.element.style.maxWidth = "100%";
        issue.element.style.overflowX = "hidden";
      }
    }

    if (issue.type === "imageRatio") {
      console.log("Fixing image ratio issues...");

      // Fix image ratio issues
      if (issue.element) {
        issue.element.style.objectFit = "contain";
      }
    }
  });

  // Additional fixes based on screen category
  if (screenCategory.includes("Mobile")) {
    // Fix navigation on mobile
    const mobileNav = document.querySelector(".nav-list");
    if (mobileNav) {
      mobileNav.style.width = "100%";
    }

    // Ensure proper spacing in mobile view
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.style.padding = "2rem 0";
    });

    // Fix hero section on small screens
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      heroTitle.style.fontSize = "calc(10vw + 1rem)";
    }

    // Improve touch targets for all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [role="button"]'
    );
    interactiveElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        el.classList.add("enhance-touch-target");
      }
    });

    // Ensure proper font sizes for readability
    const textElements = document.querySelectorAll("p, li, a");
    textElements.forEach((el) => {
      const fontSize = parseInt(window.getComputedStyle(el).fontSize);
      if (fontSize < 16) {
        el.style.fontSize = "16px";
      }
    });
  }

  // Fix for tablets
  if (screenCategory === "Tablet") {
    // Adjust grid layouts for tablets
    const projectsGrid = document.querySelector(".projects-grid");
    if (projectsGrid) {
      projectsGrid.style.gridTemplateColumns = "repeat(2, 1fr)";
    }

    const skillsContainer = document.querySelector(".skills-container");
    if (skillsContainer) {
      skillsContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    }

    // Adjust spacing for better tablet experience
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.style.padding = "3rem 1.5rem";
    });
  }

  return issues;
}

// Listen for resize events to recheck responsive behavior
function setupResizeListener() {
  let resizeTimer;

  window.addEventListener("resize", () => {
    // Debounce the resize event
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      console.log("Window resized, checking responsive behavior...");
      fixResponsiveIssues();
    }, 250);
  });
}

// Create a visual testing mode UI
function createTestingUI() {
  // Only create if it doesn't exist already
  if (document.getElementById("responsive-test-ui")) {
    return;
  }

  // Create the testing UI container
  const testUI = document.createElement("div");
  testUI.id = "responsive-test-ui";
  testUI.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 5px;
    font-family: monospace;
    z-index: 10000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    max-width: 300px;
    transition: all 0.3s ease;
  `;

  // Create the header
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #555;
    padding-bottom: 5px;
  `;

  const title = document.createElement("h3");
  title.textContent = "Responsive Test";
  title.style.margin = "0";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  `;
  closeBtn.onclick = () => {
    document.body.removeChild(testUI);
    window.RESPONSIVE_TEST_MODE = false;

    // Remove all test highlights
    document.querySelectorAll("[data-responsive-issue]").forEach((el) => {
      el.style.outline = "";
      delete el.dataset.responsiveIssue;
    });
  };

  header.appendChild(title);
  header.appendChild(closeBtn);
  testUI.appendChild(header);

  // Create viewport info display
  const viewportInfo = document.createElement("div");
  viewportInfo.id = "viewport-info";
  viewportInfo.style.marginBottom = "10px";
  testUI.appendChild(viewportInfo);

  // Create device simulation dropdown
  const deviceLabel = document.createElement("label");
  deviceLabel.textContent = "Simulate Device:";
  deviceLabel.style.display = "block";
  deviceLabel.style.marginBottom = "5px";
  testUI.appendChild(deviceLabel);

  const deviceSelect = document.createElement("select");
  deviceSelect.style.cssText = `
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    background-color: #333;
    color: white;
    border: 1px solid #555;
  `;

  // Add option for current size
  const currentOption = document.createElement("option");
  currentOption.value = "current";
  currentOption.textContent = "Current Size";
  deviceSelect.appendChild(currentOption);

  // Add options for each predefined screen size
  screenSizes.forEach((size) => {
    const option = document.createElement("option");
    option.value = `${size.width}x${size.height}`;
    option.textContent = `${size.name} (${size.width}x${size.height})`;
    deviceSelect.appendChild(option);
  });

  deviceSelect.onchange = (e) => {
    if (e.target.value === "current") {
      // Reset to current size
      window.innerWidth = window.outerWidth;
      window.innerHeight = window.outerHeight;
      return;
    }

    // Parse selected dimensions
    const [width, height] = e.target.value.split("x").map(Number);

    // Simulate viewport resize
    simulateViewport(width, height);
  };

  testUI.appendChild(deviceSelect);

  // Create test controls
  const controlsDiv = document.createElement("div");
  controlsDiv.style.display = "flex";
  controlsDiv.style.justifyContent = "space-between";
  controlsDiv.style.marginBottom = "10px";

  // Run test button
  const testBtn = document.createElement("button");
  testBtn.textContent = "Run Test";
  testBtn.style.cssText = `
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 3px;
    cursor: pointer;
    flex: 1;
    margin-right: 5px;
  `;
  testBtn.onclick = () => {
    const issues = checkResponsiveLayout();
    updateIssuesList(issues);
  };

  // Fix issues button
  const fixBtn = document.createElement("button");
  fixBtn.textContent = "Fix Issues";
  fixBtn.style.cssText = `
    background-color: #2196F3;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 3px;
    cursor: pointer;
    flex: 1;
    margin-left: 5px;
  `;
  fixBtn.onclick = () => {
    const issues = fixResponsiveIssues();
    updateIssuesList(issues);
  };

  controlsDiv.appendChild(testBtn);
  controlsDiv.appendChild(fixBtn);
  testUI.appendChild(controlsDiv);

  // Create issues list
  const issuesTitle = document.createElement("h4");
  issuesTitle.textContent = "Detected Issues:";
  issuesTitle.style.margin = "10px 0 5px 0";
  testUI.appendChild(issuesTitle);

  const issuesList = document.createElement("ul");
  issuesList.id = "issues-list";
  issuesList.style.cssText = `
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 150px;
    overflow-y: auto;
    font-size: 12px;
  `;
  testUI.appendChild(issuesList);

  // Add the UI to the page
  document.body.appendChild(testUI);

  // Update viewport info initially
  updateViewportInfo();

  // Function to update the viewport info display
  function updateViewportInfo() {
    const { width, height, screenCategory } = logViewportSize();
    viewportInfo.innerHTML = `
      <div>Width: ${width}px</div>
      <div>Height: ${height}px</div>
      <div>Category: ${screenCategory}</div>
    `;
  }

  // Function to update the issues list
  function updateIssuesList(issues) {
    issuesList.innerHTML = "";

    if (!issues || issues.length === 0) {
      const noIssues = document.createElement("li");
      noIssues.textContent = "No issues detected";
      noIssues.style.color = "#4CAF50";
      issuesList.appendChild(noIssues);
      return;
    }

    issues.forEach((issue) => {
      const issueItem = document.createElement("li");
      issueItem.style.cssText = `
        padding: 5px 0;
        border-bottom: 1px solid #444;
        color: ${
          issue.severity === "high"
            ? "#FF5252"
            : issue.severity === "medium"
            ? "#FFC107"
            : "#8BC34A"
        };
      `;
      issueItem.textContent = issue.message;
      issuesList.appendChild(issueItem);
    });
  }

  // Listen for window resize to update the viewport info
  window.addEventListener("resize", () => {
    updateViewportInfo();
  });

  return testUI;
}

// Simulate different viewport sizes
function simulateViewport(width, height) {
  console.log(`Simulating viewport: ${width}x${height}`);

  // Create a viewport meta tag if it doesn't exist
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement("meta");
    viewport.name = "viewport";
    document.head.appendChild(viewport);
  }

  // Set the viewport content to the specified dimensions
  viewport.content = `width=${width}, height=${height}`;

  // Run responsive tests for the new viewport
  setTimeout(() => {
    const issues = checkResponsiveLayout();

    // Update the issues list if the UI exists
    const issuesList = document.getElementById("issues-list");
    if (issuesList) {
      // Find the updateIssuesList function in the parent scope
      const testUI = document.getElementById("responsive-test-ui");
      if (testUI && testUI.updateIssuesList) {
        testUI.updateIssuesList(issues);
      }
    }
  }, 500);
}

// Toggle visual testing mode
function toggleTestingMode() {
  window.RESPONSIVE_TEST_MODE = !window.RESPONSIVE_TEST_MODE;

  if (window.RESPONSIVE_TEST_MODE) {
    console.log("Responsive testing mode enabled");
    const testUI = createTestingUI();
    checkResponsiveLayout(); // Run initial check to highlight issues
  } else {
    console.log("Responsive testing mode disabled");
    const testUI = document.getElementById("responsive-test-ui");
    if (testUI) {
      document.body.removeChild(testUI);
    }

    // Remove all test highlights
    document.querySelectorAll("[data-responsive-issue]").forEach((el) => {
      el.style.outline = "";
      delete el.dataset.responsiveIssue;
    });
  }
}

// Initialize responsive testing
function initResponsiveTest() {
  console.log("Initializing responsive testing...");

  // Log initial viewport size
  logViewportSize();

  // Check and fix responsive issues
  fixResponsiveIssues();

  // Set up resize listener
  setupResizeListener();

  // Add meta viewport tag if missing
  if (!document.querySelector('meta[name="viewport"]')) {
    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content = "width=device-width, initial-scale=1.0";
    document.head.appendChild(metaViewport);
    console.log("Added missing viewport meta tag");
  }

  // Add keyboard shortcut to toggle testing mode (Ctrl+Shift+T)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "T") {
      e.preventDefault();
      toggleTestingMode();
    }
  });

  // Add testing mode to window object for external access
  window.toggleResponsiveTestMode = toggleTestingMode;
}

// Export the initialization function and testing utilities
export {
  initResponsiveTest,
  toggleTestingMode,
  checkResponsiveLayout,
  fixResponsiveIssues,
  simulateViewport,
  screenSizes,
};
