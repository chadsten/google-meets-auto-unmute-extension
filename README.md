# Google Meet Auto-Unmute Extension

A Chrome extension that automatically unmutes you when Google Meet mutes you due to the number of participants in the call.

<img width="640" height="400" alt="auto-mute-ss" src="https://github.com/user-attachments/assets/87eac70d-6915-4b16-99a8-044daba4b91c" />

## Features

- **Automatic Unmute**: Instantly detects when you're auto-muted by Google Meet and unmutes you
- **Auto-Mute on Join**: Optionally mute yourself automatically when joining any meeting
- **Advanced Button Detection**: Robust mute button detection across different Meet UI versions and languages
- **Smart Injection System**: Prevents duplicate script injection with intelligent tab detection
- **Customizable Timing**: Fine-tune delays from 0-3000ms in 50ms increments for optimal performance
- **Privacy Focused**: All processing happens locally, no data sent to external servers

## Settings

Access settings by clicking the extension icon in Chrome's toolbar:

- **Auto-Unmute on Large Calls**: Automatically unmute when Google Meet mutes you due to participant count
- **Auto-Mute on All Calls**: Automatically mute yourself when joining any meeting (mutually exclusive with auto-unmute)
- **Action Delay**: Fine-tune timing from 0-3000ms in 50ms increments for optimal performance with your system

## Installation

### From Chrome Web Store (Coming Soon!)
1. Visit the Chrome Web Store
2. Search for "Google Meet Auto-Unmute"
3. Click "Add to Chrome"

### Manual Installation (Developer Mode)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/meets-disable-automute.git
   cd meets-disable-automute
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Build the extension:
   ```bash
   yarn build
   ```

4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

## Development

### Prerequisites
- Node.js 16+
- Yarn package manager

### Setup
```bash
# Install dependencies
yarn install

# Development build with watch mode
yarn dev

# Production build
yarn build

# Type checking
yarn typecheck

# Linting
yarn lint

# Clean build directory
yarn clean
```

### Project Structure
```
src/
├── background/         # Service worker for tab detection and settings management
├── content/            # Content script injected into Meet pages with smart detection
├── popup/              # Extension popup UI with real-time settings sync
├── types/              # TypeScript type definitions and constants
│   └── settings.ts     # TIMING_CONSTANTS, UI_CONSTANTS, MESSAGE_TYPES
├── utils/              # Shared utilities
│   └── settingsManager.ts  # Centralized Chrome storage management
public/
├── manifest.json       # Extension manifest (Manifest V3)
├── images/             # Extension icons (16px, 32px, 48px, 128px, SVG)
dist/                   # Built extension files for Chrome
```

## Privacy & Permissions

This extension requires minimal permissions:
- `https://meet.google.com/*` - To interact with Google Meet pages
- `storage` - To save your preferences
- `activeTab` - To inject content scripts

**No data is collected or transmitted.** All processing happens locally in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

This is provided as-is; if it's successfully published to the Chrome extension store, I'll at least provide basic maintenance. 
