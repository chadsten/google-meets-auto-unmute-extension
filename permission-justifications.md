# Permission Justifications for Google Meet Auto-Unmute Extension

**For Chrome Web Store Submission**

## Overview
This document provides detailed justifications for each permission requested by the Google Meet Auto-Unmute extension, as required by Chrome Web Store publishing guidelines.

---

## Requested Permissions

### 1. `"storage"`
**What it does:** Allows the extension to save and retrieve user preferences using Chrome's storage API.

**Why it's necessary:** 
- Stores user settings (auto-unmute enabled/disabled, auto-mute on join, action delay, debug mode)
- Remembers preferences between browser sessions
- Allows users to customize extension behavior
- Essential for providing a personalized user experience

**Data stored:**
- Boolean flags for feature toggles
- Numeric value for action delay timing
- No personal or sensitive information

---

### 2. `"activeTab"`
**What it does:** Grants temporary access to the currently active tab when the user interacts with the extension.

**Why it's necessary:**
- Allows the extension to detect when users are on Google Meet pages
- Enables communication between the popup and content scripts
- Required for the extension to know when to activate its functionality
- Provides secure, user-initiated access to tab information

**Scope:** Only activated when user clicks the extension icon, limited to current tab

---

### 3. `"scripting"`
**What it does:** Allows the extension to programmatically inject scripts into web pages.

**Why it's necessary:**
- Injects content script into Google Meet pages to detect mute state changes
- Enables the extension to interact with Google Meet's mute button
- Required for the core auto-unmute functionality
- Allows real-time monitoring of meeting interface changes

**Usage:** Only injects scripts into meet.google.com pages, no other websites

---

### 4. `"tabs"`
**What it does:** Provides access to tab information and allows interaction with browser tabs.

**Why it's necessary:**
- Detects when users navigate to Google Meet pages
- Automatically injects content script when Meet pages load
- Enables communication between background script and content scripts
- Required for seamless extension activation without manual user intervention

**Data accessed:** Only tab URLs to identify Google Meet pages, no browsing history stored

---

### 5. Host Permission: `"https://meet.google.com/*"`
**What it does:** Grants access to run scripts and access content on Google Meet pages.

**Why it's necessary:**
- Enables the extension to function exclusively on Google Meet
- Allows content script injection and DOM manipulation for mute detection
- Required for monitoring mute button state changes
- Permits automatic mute/unmute button interactions

**Scope:** Strictly limited to meet.google.com domain only

---

## Permission Usage Compliance

### Data Minimization
- Extension requests only the minimum permissions required for functionality
- No access to browsing history, bookmarks, or other sensitive browser data
- Limited to specific domain (meet.google.com) rather than broad web access

### Single Purpose
- All permissions support the extension's single purpose: auto-unmute functionality in Google Meet
- No permissions are used for tracking, analytics, or advertising
- User data (settings) stays local and is never transmitted externally

### User Benefit
- Permissions directly enable features that benefit users (automatic unmuting)
- Transparent about what data is accessed and why
- Users maintain full control over extension behavior through settings

---

## Security Measures

- Content script injection only occurs on Google Meet pages
- No external network requests or data transmission
- All user data stored locally using secure Chrome storage APIs
- Extension follows Chrome's security best practices

---

## User Control

Users can:
- Disable the extension at any time through Chrome's extension management
- Modify all extension settings through the popup interface
- Remove all stored data by uninstalling the extension
- View exactly what permissions are granted before installation

---

*This extension uses permissions solely for its stated purpose of providing auto-unmute functionality in Google Meet and does not collect, transmit, or share any personal user data.*