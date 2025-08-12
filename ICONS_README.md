# Icon Generation Instructions

This extension requires PNG icons in multiple sizes for Chrome Web Store and browser display.

## Required Icon Sizes
- 16x16 pixels (toolbar)
- 32x32 pixels (Windows and other OS)
- 48x48 pixels (extension management page)
- 128x128 pixels (Chrome Web Store)

## Source
The base SVG icon is located at `public/images/icon.svg`

## How to Generate PNG Icons

### Option 1: Using Online Converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload the `icon.svg` file
3. Set the width to each required size
4. Download and rename as:
   - `icon16.png`
   - `icon32.png`
   - `icon48.png`
   - `icon128.png`

### Option 2: Using Node.js (if svg2png is installed)
```bash
npm install -g svg2png-cli
svg2png public/images/icon.svg --width=16 --height=16 --output=public/images/icon16.png
svg2png public/images/icon.svg --width=32 --height=32 --output=public/images/icon32.png
svg2png public/images/icon.svg --width=48 --height=48 --output=public/images/icon48.png
svg2png public/images/icon.svg --width=128 --height=128 --output=public/images/icon128.png
```

### Option 3: Using Inkscape (if installed)
```bash
inkscape --export-png=public/images/icon16.png --export-width=16 --export-height=16 public/images/icon.svg
inkscape --export-png=public/images/icon32.png --export-width=32 --export-height=32 public/images/icon.svg
inkscape --export-png=public/images/icon48.png --export-width=48 --export-height=48 public/images/icon.svg
inkscape --export-png=public/images/icon128.png --export-width=128 --export-height=128 public/images/icon.svg
```

## Icon Design
The icon features:
- Gradient background (blue to purple)
- White microphone symbol
- Green checkmark indicator (represents auto-unmute functionality)
- Modern, clean design suitable for Chrome extensions