# Google Meet Auto-Unmute - User Guide

## Quick Start

1. **Install** the extension from Chrome Web Store
2. **Join** any Google Meet call
3. **Done!** The extension works automatically

## 📋 Table of Contents

- [Installation](#installation)
- [How to Use](#how-to-use)
- [Settings & Configuration](#settings--configuration)
- [Troubleshooting](#troubleshooting)
- [FAQ](#frequently-asked-questions)
- [Support](#support)

---

## 🚀 Installation

### From Chrome Web Store
1. Go to the Chrome Web Store
2. Search for "Google Meet Auto-Unmute"
3. Click "Add to Chrome"
4. Click "Add extension" when prompted
5. The extension icon will appear in your toolbar

### Manual Installation (Developer Mode)
1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the extension folder

---

## 🎯 How to Use

### Basic Operation
The extension works automatically once installed:

1. **Join a Google Meet call** as you normally would
2. **If Google Meet auto-mutes you** (6+ participants), the extension detects this
3. **You're automatically unmuted** within 500ms (or your custom delay)
4. **Continue speaking naturally** - no manual unmuting needed

### Accessing Settings
- Click the extension icon in your Chrome toolbar
- A popup will appear with all available settings
- Changes are saved automatically

---

## ⚙️ Settings & Configuration

### Auto-Unmute on Large Calls
- **Default:** Enabled
- **Purpose:** Automatically unmutes you when Google Meet mutes you due to participant count
- **When to disable:** If you prefer manual control in all situations

### Auto-Mute on All Calls  
- **Default:** Disabled
- **Purpose:** Automatically mutes you when joining any meeting
- **When to enable:** For polite meeting entry or company policy compliance
- **Note:** This setting and auto-unmute are mutually exclusive

### Action Delay
- **Default:** 500ms
- **Range:** 0-3000ms (0-3 seconds)
- **Purpose:** Delay before auto-actions to allow page loading
- **Adjust if:** You have slow internet or the extension triggers too quickly

---

## 🔧 Troubleshooting

### Extension Not Working
**Check these first:**
1. ✅ Extension is enabled in `chrome://extensions/`
2. ✅ You're on a Google Meet page (`meet.google.com`)
3. ✅ The meeting has 6+ participants (for auto-mute to occur)
4. ✅ Browser is up to date

### Auto-Unmute Not Triggering
**Possible solutions:**
1. **Increase action delay** to 800-1000ms for slower connections
2. **Refresh the Meet page** and rejoin the call
3. **Check browser console** for error messages (F12 → Console)
4. **Try a different browser tab** - open Meet in a new tab

### Settings Not Saving
**Steps to fix:**
1. **Close and reopen** the extension popup
2. **Refresh the browser** completely
3. **Check Chrome storage** isn't full or corrupted
4. **Reinstall the extension** if issues persist

### Button Click Not Working
**Troubleshooting steps:**
1. **Increase action delay** - Google Meet's UI might need more time to load
2. **Check for Meet updates** - Google occasionally changes their interface
3. **Disable other extensions** temporarily to check for conflicts
4. **Try in incognito mode** to rule out browser-specific issues

---

## 🐛 Debug Mode

### Enabling Debug Mode
1. Open the extension popup
2. Look for debug mode toggle (if available in settings)
3. Or modify `debugMode: true` in the code

### What Debug Mode Shows
- Console messages for all extension actions
- Detailed mute button detection logs
- Error messages and timing information
- DOM mutation observations

### Reading Debug Output
Open browser console (F12 → Console) to see:
```
[Meet Auto-Unmute] Content script loaded!
[Meet Auto-Unmute] Meeting detected, starting observation
[Meet Auto-Unmute] Mute state changed: MUTED
[Meet Auto-Unmute] === AUTO UNMUTE STARTED ===
[Meet Auto-Unmute] Performing auto unmute click...
[Meet Auto-Unmute] === AUTO UNMUTE COMPLETED ===
```

---

## ❓ Frequently Asked Questions

### Does this work in all meeting sizes?
- **Auto-unmute:** Only triggers when Google Meet auto-mutes you (6+ participants)
- **Auto-mute on join:** Works in meetings of any size

### Will this interfere with my manual muting?
- **No** - the extension only acts when Google automatically mutes you
- You can still manually mute/unmute as normal
- The extension respects your manual actions

### Does it work with Google Meet keyboard shortcuts?
- **Yes** - all keyboard shortcuts continue to work normally
- The extension doesn't interfere with Ctrl+D (mute toggle)

### Is my data private?
- **Completely** - all processing happens locally on your device
- No data is sent to external servers
- Settings are stored in Chrome's secure local storage

### Can I use this with other video platforms?
- **No** - this extension is specifically designed for Google Meet
- It only works on `meet.google.com` pages for security

### Does it affect meeting performance?
- **No impact** - the extension is lightweight and efficient
- Uses minimal CPU and memory resources
- Doesn't slow down Google Meet

---

## 🆘 Support

### Getting Help
1. **Check this guide** first for common solutions
2. **Enable debug mode** to see detailed console output
3. **Try basic troubleshooting** steps listed above

### Reporting Issues
When reporting problems, please include:
- **Chrome version** (Help → About Google Chrome)
- **Extension version** (visible in popup or chrome://extensions/)
- **Console error messages** (F12 → Console tab)
- **Steps to reproduce** the issue
- **Meeting size** and any specific circumstances

### Contact Information
- **GitHub Issues:** [Repository URL]/issues
- **Email:** [Your Support Email]

---

## 🔄 Updates

### Automatic Updates
- Chrome automatically updates extensions
- New versions install without user action
- Settings are preserved during updates

### What's New
- Check the Chrome Web Store page for version history
- Major updates will include new features or bug fixes
- Security patches are applied automatically

---

## 🔒 Security & Privacy

### Data Collection
- **None** - we don't collect any personal data
- Settings stored locally in encrypted Chrome storage
- No analytics, tracking, or external communications

### Permissions Explained
- **Storage:** Save your preferences
- **Active Tab:** Detect Google Meet pages
- **Scripting:** Interact with mute button
- **meet.google.com:** Work only on Google Meet

### Safe Usage
- Extension only affects Google Meet functionality
- Cannot access other websites or personal data
- All code runs in Chrome's secure sandbox environment

---

*Need more help? Check our FAQ section or contact support!*