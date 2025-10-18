#!/usr/bin/env node
/**
 * Generate manifest.json and manifest.js from the 6-Max Rangek directory
 * Usage: node generate-manifest.js
 */

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '6Max Chart', '6-Max Rangek');
const OUTPUT_JSON = path.join(__dirname, '6Max Chart', 'manifest.json');
const OUTPUT_JS = path.join(__dirname, '6Max Chart', 'manifest.js');

/**
 * Recursively scan directory and collect all .png files
 * @param {string} dir - Directory to scan
 * @param {string} baseDir - Base directory for relative paths
 * @returns {string[]} Array of relative image paths
 */
function scanImages(dir, baseDir) {
  const results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push(...scanImages(fullPath, baseDir));
    } else if (stat.isFile() && item.toLowerCase().endsWith('.png')) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push(relativePath);
    }
  }
  
  return results;
}

/**
 * Build manifest structure from image paths
 * Structure: { POS: { STACK: [image1, image2, ...] } }
 */
function buildManifest() {
  const manifest = {};
  const basePath = path.join(__dirname, '6Max Chart');
  const images = scanImages(IMAGES_DIR, basePath);
  
  for (const imagePath of images) {
    // Parse path: 6-Max Rangek/POS/STACK/filename.png
    const parts = imagePath.split('/');
    if (parts.length < 4 || parts[0] !== '6-Max Rangek') continue;
    
    const position = parts[1]; // e.g., LJ, HJ, CO, BU, SB, BB
    const stack = parts[2];    // e.g., Open, VS 3Bet
    
    if (!manifest[position]) {
      manifest[position] = {};
    }
    if (!manifest[position][stack]) {
      manifest[position][stack] = [];
    }
    manifest[position][stack].push(imagePath);
  }
  
  // Sort arrays for consistent output
  for (const pos in manifest) {
    for (const stack in manifest[pos]) {
      manifest[pos][stack].sort();
    }
  }
  
  return manifest;
}

/**
 * Main function
 */
function main() {
  console.log('Scanning images directory:', IMAGES_DIR);
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('Error: Images directory not found:', IMAGES_DIR);
    process.exit(1);
  }
  
  const manifest = buildManifest();
  const imageCount = Object.values(manifest)
    .flatMap(pos => Object.values(pos))
    .reduce((sum, arr) => sum + arr.length, 0);
  
  console.log(`Found ${imageCount} images across ${Object.keys(manifest).length} positions`);
  
  // Write manifest.json
  const jsonContent = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(OUTPUT_JSON, jsonContent, 'utf8');
  console.log('Created:', OUTPUT_JSON);
  
  // Write manifest.js
  const jsContent = `// Auto-generated manifest file - do not edit manually
// Generated: ${new Date().toISOString()}
window.__CHART_MANIFEST__ = ${JSON.stringify(manifest, null, 2)};
`;
  fs.writeFileSync(OUTPUT_JS, jsContent, 'utf8');
  console.log('Created:', OUTPUT_JS);
  
  console.log('\nManifest generation complete!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { buildManifest, scanImages };
