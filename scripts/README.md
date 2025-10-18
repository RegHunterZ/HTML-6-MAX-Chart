# Build Scripts

## build-manifest.js

This script automatically scans the `6Max Chart/6-Max Rangek` directory structure and generates manifest files for the chart application.

### What it does

1. Recursively scans all PNG files in `6Max Chart/6-Max Rangek`
2. Organizes them by position (LJ, HJ, CO, BU, SB) and stack type (Open, VS 3Bet, etc.)
3. Generates two files:
   - `6Max Chart/manifest.json` - JSON format for HTTP/HTTPS loading via fetch()
   - `6Max Chart/manifest.js` - JavaScript format with `window.__CHART_MANIFEST__` for file:// loading

### Usage

```bash
node scripts/build-manifest.js
```

### Output

The script generates manifests in this structure:

```json
{
  "BU": {
    "Open": ["6-Max Rangek/BU/Open/BU Open.png"],
    "VS 3Bet": [
      "6-Max Rangek/BU/VS 3Bet/BU VS BB 3Bet.png",
      "6-Max Rangek/BU/VS 3Bet/BU VS SB 3Bet.png"
    ]
  },
  ...
}
```

### CI/CD Integration

The script is automatically run by GitHub Actions when:
- PNG files are added/modified in `6Max Chart/6-Max Rangek/`
- The build script itself is modified
- The workflow is manually triggered

See `.github/workflows/build-manifest.yml` for the automation setup.

### How the fallback mechanism works

1. **HTTP/HTTPS mode**: The browser can fetch `manifest.json` via AJAX
   - Console log: "Loaded manifest.json"
   
2. **file:// mode**: The browser loads `manifest.js` via `<script>` tag
   - fetch() is blocked by browsers when opening from filesystem
   - Falls back to `window.__CHART_MANIFEST__` from the loaded script
   - Console log: "Using inline manifest.js"

This ensures the application works both:
- Online (when served from a web server)
- Offline (when opened as a ZIP download via file://)
