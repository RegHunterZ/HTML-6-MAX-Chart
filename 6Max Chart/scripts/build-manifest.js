#!/usr/bin/env node

/**
 * build-manifest.js
 * 
 * Scans the "6-Max Rangek" directory to build a manifest.json file
 * containing all images organized by position and category.
 * 
 * Expected structure: 6-Max Rangek/{Position}/{Category}/{files}.png
 * 
 * Output format:
 * {
 *   "LJ": {
 *     "Open": ["6-Max Rangek/LJ/Open/file1.png", ...],
 *     "VS 3Bet": ["6-Max Rangek/LJ/VS 3Bet/file1.png", ...]
 *   },
 *   ...
 * }
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, '6-Max Rangek');
const OUTPUT_FILE = path.join(ROOT_DIR, 'manifest.json');

/**
 * Recursively scan a directory and collect all PNG files
 * @param {string} dir - Directory to scan
 * @param {string} baseDir - Base directory for relative paths
 * @returns {Array<string>} - Array of relative file paths
 */
function scanDirectory(dir, baseDir) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      results.push(...scanDirectory(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      // Add PNG files with relative path from baseDir
      const relativePath = path.relative(baseDir, fullPath);
      // Normalize path separators to forward slashes for web compatibility
      results.push(relativePath.replace(/\\/g, '/'));
    }
  }
  
  return results;
}

/**
 * Build the manifest by organizing images by position and category
 * @returns {Object} - Manifest object
 */
function buildManifest() {
  const manifest = {};
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Error: Directory "${IMAGES_DIR}" not found`);
    process.exit(1);
  }
  
  // Read position directories (LJ, HJ, CO, BU, SB, BB, etc.)
  const positions = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  
  for (const position of positions) {
    const positionDir = path.join(IMAGES_DIR, position);
    manifest[position] = {};
    
    // Read category directories (Open, VS 3Bet, etc.)
    const categories = fs.readdirSync(positionDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    for (const category of categories) {
      const categoryDir = path.join(positionDir, category);
      
      // Scan for all PNG files in this category
      const images = scanDirectory(categoryDir, ROOT_DIR);
      
      if (images.length > 0) {
        manifest[position][category] = images.sort();
      }
    }
    
    // Remove position if it has no categories
    if (Object.keys(manifest[position]).length === 0) {
      delete manifest[position];
    }
  }
  
  return manifest;
}

/**
 * Main execution
 */
function main() {
  console.log('Building manifest from:', IMAGES_DIR);
  
  const manifest = buildManifest();
  
  // Count statistics
  let totalPositions = 0;
  let totalCategories = 0;
  let totalImages = 0;
  
  for (const position in manifest) {
    totalPositions++;
    for (const category in manifest[position]) {
      totalCategories++;
      totalImages += manifest[position][category].length;
    }
  }
  
  console.log(`Found ${totalPositions} positions, ${totalCategories} categories, ${totalImages} images`);
  
  // Write manifest to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Manifest written to:', OUTPUT_FILE);
  
  // Also output statistics per position
  console.log('\nBreakdown by position:');
  for (const position of Object.keys(manifest).sort()) {
    const categories = Object.keys(manifest[position]).sort();
    console.log(`  ${position}: ${categories.join(', ')}`);
  }
}

main();
