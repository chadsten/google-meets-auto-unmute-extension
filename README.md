# Google Meet Auto-Unmute Extension

A Chrome extension that automatically unmutes you when Google Meet mutes you due to the number of participants in the call.

<img width="640" height="400" alt="auto-mute-ss" src="https://github.com/user-attachments/assets/87eac70d-6915-4b16-99a8-044daba4b91c" />

## Problem Solved

When you join a Google Meet call with more than 6 participants, Google automatically mutes you and shows the message "You are muted due to the number of participants." This extension detects this scenario and automatically unmutes you, providing a seamless meeting experience.

## Features

- **Automatic Unmute**: Instantly detects when you're auto-muted and unmutes you
- **Smart Detection**: Uses MutationObserver to monitor Google Meet's DOM changes
- **Customizable Delay**: Set the delay before auto-unmuting (0-3000ms)
- **Privacy Focused**: All processing happens locally, no data sent to external servers

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
├── background/          # Service worker for background tasks
├── content/            # Content script injected into Meet pages  
├── popup/              # Extension popup UI
├── types/              # TypeScript type definitions
public/
├── manifest.json       # Extension manifest
├── images/             # Extension icons
dist/                   # Built extension files
```

## How It Works

1. **Detection**: The content script uses MutationObserver to watch for changes in Google Meet's DOM
2. **Identification**: Recognizes mute button state changes and auto-mute notifications
3. **Action**: When auto-mute is detected, programmatically clicks the unmute button
4. **Feedback**: Shows visual indicator and updates statistics
5. **Debouncing**: Prevents rapid mute/unmute cycles with configurable delays

## Settings

Access settings by clicking the extension icon in Chrome's toolbar:

- **Enable Auto-Unmute**: Toggle the main functionality on/off
- **Debug Mode**: Enable detailed console logging
- **Auto-Unmute Delay**: Time to wait before unmuting (0-3000ms)

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
