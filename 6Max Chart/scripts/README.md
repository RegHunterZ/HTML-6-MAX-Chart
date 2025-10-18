# Build Scripts

## build-manifest.js

This script scans the `6-Max Rangek` directory and generates a `manifest.json` file containing all images organized by position and category.

### Usage

```bash
node scripts/build-manifest.js
```

### What it does

1. Scans the `6-Max Rangek` directory structure
2. Discovers all positions (LJ, HJ, CO, BU, SB, BB, etc.)
3. Discovers all categories under each position (Open, VS 3Bet, etc.)
4. Finds all PNG images in each category
5. Generates `manifest.json` with the complete image inventory

### Output

The script creates `manifest.json` in the root of the `6Max Chart` directory with the following structure:

```json
{
  "LJ": {
    "Open": ["6-Max Rangek/LJ/Open/LJ Open.png"],
    "VS 3Bet": ["6-Max Rangek/LJ/VS 3Bet/..."]
  },
  "HJ": { ... },
  ...
}
```

### When to run

Run this script whenever you:
- Add new images to the `6-Max Rangek` directory
- Add new positions or categories
- Update or reorganize the image files

The HTML chart (`index.html`) will automatically load and use the updated manifest.
