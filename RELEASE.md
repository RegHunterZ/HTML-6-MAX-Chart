# Release Instructions for 6Max Chart v4.0

## Creating the Release

After this PR is merged to main:

1. Go to GitHub Releases: https://github.com/RegHunterZ/HTML-6-MAX-Chart/releases/new
2. Create a new tag: `v4.0.0`
3. Release title: `6-Max Chart v4.0 - Full Offline Support`
4. Description:

```markdown
## 🎉 Full Offline Support Release

This release adds complete offline functionality to the 6-Max Preflop Chart, allowing you to use it directly from your file system without any web server.

### ✨ New Features

- **Three-Tier Manifest Loading**: Automatically uses the best available method to load images
- **Embedded Manifest**: All 20 images catalogued in `manifest.js` for immediate offline use
- **Directory Picker**: Load custom images directly from your file system using the "Mappa betöltése" button
- **Zero Configuration**: Just extract and open - works immediately!

### 📦 What's Included

- 20 poker range charts across 5 positions (UTG/HJ/CO/BTN/SB)
- 2 stack types: Open and VS 3Bet
- Fully responsive design
- Hover and click interaction modes

### 🚀 How to Use

**Simple Method (Recommended):**
1. Download and extract the ZIP file
2. Open `6Max Chart/index.html` in your browser
3. All images load automatically - no server needed!

**Custom Images Method:**
1. Open `6Max Chart/index.html` in your browser
2. Click "📁 Mappa betöltése" button
3. Select your "6-Max Rangek" folder
4. All images load directly from your file system

### 📋 Requirements

- Modern web browser (Chrome 86+, Firefox, Safari, Edge)
- For directory picker: Chrome 86+, Edge 86+, Opera 72+

### 🔧 For Developers

- Auto-generating manifests: Run `node generate-manifest.js`
- CI/CD: Manifests auto-update when images change
- See README.md for full documentation

### 📸 Screenshots

![Open Stack](https://github.com/user-attachments/assets/f9ffcf4a-c84e-425d-b33f-9b531e309d6e)
![VS 3Bet Stack](https://github.com/user-attachments/assets/fc4a3086-06e5-4637-8963-b803d688d7b2)
```

5. Attach the entire repository as a ZIP file:
   - Option A: Use GitHub's automatic source code archive
   - Option B: Create a clean ZIP manually:
     ```bash
     cd /path/to/HTML-6-MAX-Chart
     zip -r 6max-chart-v4.0.zip "6Max Chart" README.md -x "*.git*"
     ```

6. Publish the release

## Testing the Release

After publishing, download the ZIP and verify:

1. Extract the ZIP file
2. Open `6Max Chart/index.html` in a browser (via file://)
3. Verify:
   - ✅ Both stacks (Open, VS 3Bet) appear in dropdown
   - ✅ All 5 positions (UTG/HJ/CO/BTN/SB) work
   - ✅ Hover shows images correctly
   - ✅ No console errors (check browser DevTools)

## What Users Get

When users download and extract the release ZIP, they get:

```
6Max Chart/
├── index.html          # Main application
├── manifest.js         # Embedded image catalog (auto-loaded)
├── manifest.json       # JSON catalog (for HTTP servers)
└── 6-Max Rangek/      # 20 PNG image files organized by position/stack
    ├── LJ/            # UTG position
    ├── HJ/            # HiJack
    ├── CO/            # CutOff
    ├── BU/            # Button
    └── SB/            # Small Blind
```

Plus documentation:
- README.md - Complete usage instructions
- generate-manifest.js - For regenerating manifests if they add images

## Expected User Experience

**Offline (file://):**
- Opens `index.html` directly
- Manifest.js loads automatically
- All 20 images available immediately
- Both stacks (Open, VS 3Bet) work
- Alternatively, can click "Mappa betöltése" to load from custom folder

**Online (HTTP server):**
- Serves via any web server (nginx, Apache, Python http.server, etc.)
- Fetches manifest.json
- All images load normally
- No difference in functionality

## Version History

- **v4.0**: Full offline support with three-tier manifest loading
- **v3.1**: Previous version with minimal hardcoded manifest
- Earlier: Basic functionality
