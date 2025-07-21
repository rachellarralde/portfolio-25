/**
 * Retro Portfolio - Build Script
 * 
 * This script provides commands to optimize and minify the website's assets for production.
 * It creates minified versions of CSS and JavaScript files, optimizes images,
 * and generates a production-ready version of the website.
 * 
 * Usage:
 * 1. Install Node.js if not already installed
 * 2. Run the following commands in the terminal:
 *    - npm install -g terser clean-css-cli
 *    - node build.js
 * 
 * The optimized files will be created in the 'dist' directory.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Source directories
  srcDir: './',
  jsDir: './js',
  cssDir: './css',
  assetsDir: './assets',
  
  // Destination directories
  distDir: './dist',
  distJsDir: './dist/js',
  distCssDir: './dist/css',
  distAssetsDir: './dist/assets',
  
  // Files to minify
  jsFiles: [
    'main.js',
    'animations.js',
    'contact.js',
    'lazy-loading.js',
    'projects.js',
    'image-optimizer.js'
  ],
  cssFiles: [
    'styles.css',
    'animations-fix.css'
  ],
  
  // HTML files to process
  htmlFiles: [
    'index.html'
  ]
};

/**
 * Creates directory if it doesn't exist
 * @param {string} dir - Directory path
 */
function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

/**
 * Minifies JavaScript files
 */
function minifyJavaScript() {
  console.log('Minifying JavaScript files...');
  
  // Create destination directory
  createDirIfNotExists(config.distJsDir);
  
  try {
    // Create the command to minify all JS files
    const jsFilePaths = config.jsFiles.map(file => path.join(config.jsDir, file)).join(' ');
    const outputPath = path.join(config.distJsDir, 'bundle.min.js');
    
    // Execute terser command
    const command = `terser ${jsFilePaths} -o ${outputPath} -c -m`;
    execSync(command, { stdio: 'inherit' });
    
    console.log('JavaScript minification completed successfully.');
  } catch (error) {
    console.error('Error minifying JavaScript:', error.message);
    console.log('Make sure terser is installed: npm install -g terser');
  }
}

/**
 * Minifies CSS files
 */
function minifyCSS() {
  console.log('Minifying CSS files...');
  
  // Create destination directory
  createDirIfNotExists(config.distCssDir);
  
  try {
    // Create the command to minify all CSS files
    const cssFilePaths = config.cssFiles.map(file => path.join(config.cssDir, file)).join(' ');
    const outputPath = path.join(config.distCssDir, 'styles.min.css');
    
    // Execute clean-css command
    const command = `cleancss -o ${outputPath} ${cssFilePaths}`;
    execSync(command, { stdio: 'inherit' });
    
    console.log('CSS minification completed successfully.');
  } catch (error) {
    console.error('Error minifying CSS:', error.message);
    console.log('Make sure clean-css-cli is installed: npm install -g clean-css-cli');
  }
}

/**
 * Copies and processes HTML files
 */
function processHTMLFiles() {
  console.log('Processing HTML files...');
  
  // Create destination directory
  createDirIfNotExists(config.distDir);
  
  try {
    config.htmlFiles.forEach(file => {
      const srcPath = path.join(config.srcDir, file);
      const destPath = path.join(config.distDir, file);
      
      // Read the HTML file
      let htmlContent = fs.readFileSync(srcPath, 'utf8');
      
      // Replace CSS links with minified version
      htmlContent = htmlContent.replace(
        /<link rel="stylesheet" href="css\/styles.css">/,
        '<link rel="stylesheet" href="css/styles.min.css">'
      );
      
      // Remove animations-fix.css link (it's included in the minified CSS)
      htmlContent = htmlContent.replace(
        /<link rel="stylesheet" href="css\/animations-fix.css">/,
        ''
      );
      
      // Replace JavaScript imports with minified bundle
      htmlContent = htmlContent.replace(
        /<script src="js\/main.js" type="module"><\/script>/,
        '<script src="js/bundle.min.js"></script>'
      );
      
      // Add preload for critical assets
      const preloadTags = `
    <!-- Preload critical assets -->
    <link rel="preload" href="css/styles.min.css" as="style">
    <link rel="preload" href="js/bundle.min.js" as="script">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" as="style">`;
      
      // Insert preload tags before the first stylesheet
      htmlContent = htmlContent.replace(
        /<link rel="preconnect" href="https:\/\/fonts.googleapis.com" \/>/,
        `${preloadTags}\n    <link rel="preconnect" href="https://fonts.googleapis.com" />`
      );
      
      // Write the processed HTML file
      fs.writeFileSync(destPath, htmlContent);
      
      console.log(`Processed HTML file: ${file}`);
    });
  } catch (error) {
    console.error('Error processing HTML files:', error.message);
  }
}

/**
 * Copies assets to the distribution directory
 */
function copyAssets() {
  console.log('Copying assets...');
  
  // Create destination directory
  createDirIfNotExists(config.distAssetsDir);
  
  try {
    // Copy the optimized assets directory
    const optimizedDir = path.join(config.assetsDir, 'optimized');
    const distOptimizedDir = path.join(config.distAssetsDir, 'optimized');
    
    // Create the optimized directory in dist
    createDirIfNotExists(distOptimizedDir);
    
    // Copy all files from optimized directory
    const files = fs.readdirSync(optimizedDir);
    files.forEach(file => {
      const srcPath = path.join(optimizedDir, file);
      const destPath = path.join(distOptimizedDir, file);
      
      // Skip directories
      if (fs.statSync(srcPath).isDirectory()) return;
      
      // Copy the file
      fs.copyFileSync(srcPath, destPath);
    });
    
    console.log('Assets copied successfully.');
  } catch (error) {
    console.error('Error copying assets:', error.message);
  }
}

/**
 * Main build function
 */
function build() {
  console.log('Starting build process...');
  
  // Create dist directory
  createDirIfNotExists(config.distDir);
  
  // Run build steps
  minifyJavaScript();
  minifyCSS();
  processHTMLFiles();
  copyAssets();
  
  console.log('Build completed successfully!');
  console.log(`The optimized website is available in the '${config.distDir}' directory.`);
}

// Run the build process
build();