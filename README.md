# HTML-6-MAX-Chart

6-Max Cash Game Preflop Chart Viewer - A single-page application for viewing poker range charts.

## Features

- **Offline Support**: Works when opened directly from filesystem (file://) without a web server
- **Online Support**: Works when served via HTTP/HTTPS with dynamic manifest loading
- **Auto-Generated Manifests**: Chart data is automatically built from image files
- **Multiple Stacks**: Supports different stack sizes and scenarios (Open, VS 3Bet, etc.)
- **Fixed Position Order**: UTG / HJ / CO / BTN / SB / BB

## Usage

### For End Users

1. Download the repository as a ZIP file
2. Extract it anywhere on your computer
3. Open `6Max Chart/index.html` in your browser
4. No web server required! The app works offline via the fallback manifest.

### For Developers

#### Building the Manifest

When you add or modify PNG files in `6Max Chart/6-Max Rangek/`:

```bash
node scripts/build-manifest.js
```

This generates:
- `6Max Chart/manifest.json` - For HTTP/HTTPS mode
- `6Max Chart/manifest.js` - For file:// mode

#### How It Works

The application uses a dual-loading strategy:

1. **HTTP/HTTPS mode**: Fetches `manifest.json` dynamically
2. **file:// mode**: Falls back to `manifest.js` loaded via `<script>` tag

This ensures the chart viewer works in both scenarios without requiring a local server.

#### CI/CD

GitHub Actions automatically rebuilds manifests when:
- PNG files change in `6Max Chart/6-Max Rangek/`
- The build script is modified

See `.github/workflows/build-manifest.yml` for details.

## Project Structure

```
HTML-6-MAX-Chart/
├── 6Max Chart/
│   ├── index.html              # Main application
│   ├── manifest.json           # Auto-generated (HTTP mode)
│   ├── manifest.js             # Auto-generated (file:// fallback)
│   └── 6-Max Rangek/          # PNG chart images
├── scripts/
│   ├── build-manifest.js       # Manifest generator
│   └── README.md              # Build script documentation
└── .github/
    └── workflows/
        └── build-manifest.yml  # CI automation
```