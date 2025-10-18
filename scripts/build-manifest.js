#!/usr/bin/env node

/**
 * Build manifest.json and manifest.js from the folder structure
 * Scans "6Max Chart/6-Max Rangek" directory for PNG files and generates:
 * - manifest.json: JSON file with position->stack->images mapping
 * - manifest.js: JavaScript file that sets window.__CHART_MANIFEST__
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', '6Max Chart', '6-Max Rangek');
const OUTPUT_DIR = path.join(__dirname, '..', '6Max Chart');

/**
 * Recursively scan directory for PNG files and build manifest structure
 */
function buildManifest(baseDir) {
  const manifest = {};
  
  // Read all position directories (LJ, HJ, CO, BU, SB, etc.)
  const positions = fs.readdirSync(baseDir).filter(item => {
    const fullPath = path.join(baseDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  positions.forEach(pos => {
    const posPath = path.join(baseDir, pos);
    manifest[pos] = {};

    // Read all stack/action directories (Open, VS 3Bet, etc.)
    const stacks = fs.readdirSync(posPath).filter(item => {
      const fullPath = path.join(posPath, item);
      return fs.statSync(fullPath).isDirectory();
    });

    stacks.forEach(stack => {
      const stackPath = path.join(posPath, stack);
      
      // Read all PNG files in this directory
      const images = fs.readdirSync(stackPath)
        .filter(file => file.toLowerCase().endsWith('.png'))
        .map(file => {
          // Create relative path from "6Max Chart" directory
          return path.join('6-Max Rangek', pos, stack, file).replace(/\\/g, '/');
        })
        .sort();

      if (images.length > 0) {
        manifest[pos][stack] = images;
      }
    });
  });

  return manifest;
}

/**
 * Write manifest.json
 */
function writeManifestJSON(manifest, outputDir) {
  const outputPath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✓ Generated ${outputPath}`);
}

/**
 * Write manifest.js with window.__CHART_MANIFEST__
 */
function writeManifestJS(manifest, outputDir) {
  const outputPath = path.join(outputDir, 'manifest.js');
  const content = `window.__CHART_MANIFEST__ = ${JSON.stringify(manifest, null, 2)};\n`;
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`✓ Generated ${outputPath}`);
}

// Main execution
try {
  console.log('Building manifest from:', BASE_DIR);
  
  if (!fs.existsSync(BASE_DIR)) {
    console.error(`Error: Directory not found: ${BASE_DIR}`);
    process.exit(1);
  }

  const manifest = buildManifest(BASE_DIR);
  
  // Count total images
  let totalImages = 0;
  Object.keys(manifest).forEach(pos => {
    Object.keys(manifest[pos]).forEach(stack => {
      totalImages += manifest[pos][stack].length;
    });
  });

  console.log(`Found ${totalImages} images across ${Object.keys(manifest).length} positions`);

  writeManifestJSON(manifest, OUTPUT_DIR);
  writeManifestJS(manifest, OUTPUT_DIR);

  console.log('✓ Manifest build complete!');
} catch (error) {
  console.error('Error building manifest:', error);
  process.exit(1);
}
