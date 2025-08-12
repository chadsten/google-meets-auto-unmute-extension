import { ExtensionSettings, DEFAULT_SETTINGS, MuteState, TIMING_CONSTANTS, MESSAGE_TYPES } from '../types/settings';
import { SettingsManager } from '../utils/settingsManager';

// Only log essential info in debug mode
if (DEFAULT_SETTINGS.debugMode) {
  console.log('[Meet Auto-Unmute] Content script loading on:', window.location.href);
}

// Set a global flag so popup can detect if script loaded
(window as unknown as { MEET_AUTO_UNMUTE_LOADED: boolean }).MEET_AUTO_UNMUTE_LOADED = true;

class MeetAutoUnmute {
  private settings: ExtensionSettings = DEFAULT_SETTINGS;
  private muteState: MuteState = {
    isMuted: false,
    lastUnmuteTime: 0,
    hasAutoMutedOnJoin: false
  };
  private debounceTimer: number | null = null;
  private isProcessing = false;
  private hasJoinedMeeting = false;

  constructor() {
    this.log('Content script loaded!');
    try {
      this.init();
    } catch (error) {
      console.error('[Meet Auto-Unmute] Constructor error:', error);
    }
  }

  private async init(): Promise<void> {
    try {
      await this.loadSettings();
      this.setupMessageListener();
      this.waitForMeetingToLoad();
      this.log('Extension initialized successfully');
    } catch (error) {
      console.error('[Meet Auto-Unmute] Init error:', error);
    }
  }

  private async loadSettings(): Promise<void> {
    try {
      this.settings = await SettingsManager.loadSettings();
      this.log('Settings loaded:', this.settings);
    } catch (error) {
      this.logError('Failed to load settings:', error);
    }
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      this.log('Received message:', request);
      if (request.type === MESSAGE_TYPES.GET_SETTINGS) {
        sendResponse(this.settings);
      } else if (request.type === MESSAGE_TYPES.SET_SETTINGS) {
        this.settings = request.data;
        SettingsManager.saveSettings(this.settings);
        this.log('Settings updated:', this.settings);
      } else if (request.type === MESSAGE_TYPES.PING) {
        sendResponse({ status: 'pong' });
      }
      return true;
    });
  }

  private waitForMeetingToLoad(): void {
    // Poll for Google Meet UI elements that indicate a meeting has loaded
    const checkInterval = setInterval(() => {
      const meetingIndicator = document.querySelector('[data-meeting-title]') || 
                               document.querySelector('[data-call-id]');
      
      if (meetingIndicator) {
        clearInterval(checkInterval);
        this.hasJoinedMeeting = true;
        this.log('Meeting detected, checking initial mute state only');
        this.checkInitialMuteStateOnJoin();
        this.checkAutoMuteOnJoin();
      }
    }, TIMING_CONSTANTS.MEETING_POLL_INTERVAL);

    // Stop checking after 30 seconds if no meeting detected
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!this.hasJoinedMeeting) {
        this.log('Meeting not detected after 30 seconds');
      }
    }, TIMING_CONSTANTS.MEETING_DETECTION_TIMEOUT);
  }





  private checkInitialMuteStateOnJoin(): void {
    setTimeout(() => {
      const muteButton = this.findMuteButton();
      if (muteButton) {
        const isMuted = this.isMuted(muteButton);
        this.muteState.isMuted = isMuted;
        this.log(`Initial mute state on join: ${isMuted ? 'MUTED' : 'UNMUTED'}`);
        
        // If initially muted when joining and auto-unmute is enabled, unmute once
        if (isMuted && this.shouldAutoUnmute()) {
          this.log('Joined meeting in muted state - performing one-time auto-unmute');
          this.scheduleAutoUnmute();
        }
      }
    }, TIMING_CONSTANTS.UI_STABILIZATION_DELAY + this.settings.autoUnmuteDelay);
  }


  private shouldAutoUnmute(): boolean {
    if (!this.settings.enabled) { return false; }
    
    // Prevent rapid unmute loops - wait at least 3 seconds between unmutes
    const timeSinceLastUnmute = Date.now() - this.muteState.lastUnmuteTime;
    if (timeSinceLastUnmute < TIMING_CONSTANTS.RAPID_UNMUTE_PREVENTION_DELAY) {
      this.log('Skipping auto-unmute: too soon after last unmute');
      return false;
    }

    // Simple approach: auto-unmute whenever we detect mute state
    return true;
  }


  private scheduleAutoUnmute(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.performAutoUnmute();
    }, this.settings.autoUnmuteDelay);
  }

  private async performAutoUnmute(): Promise<void> {
    await this.performMuteChange('unmute', 'AUTO UNMUTE', () => {
      this.muteState.lastUnmuteTime = Date.now();
    });
  }

  private async performMuteChange(desiredState: 'mute' | 'unmute', context: string, stateUpdates?: () => void): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      this.log(`=== ${context} STARTED ===`);
      this.log(`=== ${context} STARTED ===`);
      
      const muteButton = this.findMuteButton();
      if (!muteButton) {
        this.logError(`${context} FAILED: Mute button not found`);
        return;
      }

      const currentlyMuted = this.isMuted(muteButton);
      this.log(`Current mute state: ${currentlyMuted ? 'MUTED' : 'UNMUTED'}`);

      // Avoid unnecessary clicks - check if already in desired state
      if ((desiredState === 'mute' && currentlyMuted) || (desiredState === 'unmute' && !currentlyMuted)) {
        this.log(`Already ${desiredState}d, skipping ${context.toLowerCase()}`);
        if (stateUpdates) { stateUpdates(); }
        return;
      }

      this.log(`Performing ${context.toLowerCase()} click...`);
      this.clickMuteButton(muteButton);
      
      // Update state immediately if provided
      if (stateUpdates) { stateUpdates(); }

      // Wait a moment and verify the operation worked
      setTimeout(() => {
        const newButton = this.findMuteButton();
        if (newButton) {
          const newMuteState = this.isMuted(newButton);
          this.log(`Mute state after ${context.toLowerCase()}: ${newMuteState ? 'MUTED' : 'UNMUTED'}`);
          this.log(`=== ${context} COMPLETED ===`);
        }
      }, TIMING_CONSTANTS.OPERATION_VERIFICATION_DELAY);

      // Send success message to background for auto actions only
      if (context.includes('AUTO')) {
        const messageType = context.includes('UNMUTE') ? MESSAGE_TYPES.AUTO_UNMUTED : MESSAGE_TYPES.AUTO_MUTED;
        await chrome.runtime.sendMessage({
          type: messageType,
          data: { timestamp: Date.now() }
        });
      }

      this.log(`${context} operation completed successfully`);
    } catch (error) {
      this.logError(`${context} ERROR:`, error);
    } finally {
      this.isProcessing = false;
    }
  }

  private findMuteButton(): HTMLElement | null {
    // Multiple selectors to handle different Meet UI versions and languages
    const selectors = [
      // English labels
      '[aria-label*="Turn on microphone"]',
      '[aria-label*="Turn off microphone"]',
      '[aria-label*="Microphone"]',
      '[aria-label*="microphone"]',
      '[aria-label*="Mute"]',
      '[aria-label*="mute"]',
      '[aria-label*="Unmute"]',
      '[aria-label*="unmute"]',
      // Data attributes
      '[data-is-muted]',
      '[data-mute-state]',
      // Google Meet specific selectors
      'button[jsname="BOHaEe"]',
      'button[data-tooltip*="microphone" i]',
      // More generic button selectors in Meet UI
      '[role="button"][aria-label*="mic" i]',
      'div[role="button"][aria-label*="mic" i]',
      '[data-testid*="mic"]',
      '[data-testid*="mute"]',
      // SVG-based buttons
      'button svg[viewBox] + *',
      'div[role="button"] svg[viewBox] + *'
    ];

    this.log('Searching for mute button...');
    
    for (const selector of selectors) {
      const buttons = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
      for (const button of buttons) {
        const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
        const title = button.getAttribute('title')?.toLowerCase() || '';
        const tooltip = button.getAttribute('data-tooltip')?.toLowerCase() || '';
        
        this.log(`Found button with selector "${selector}":`, {
          ariaLabel,
          title,
          tooltip,
          tagName: button.tagName,
          className: button.className
        });
        
        // Check if this looks like a microphone button
        if (ariaLabel.includes('microphone') || 
            ariaLabel.includes('mic') || 
            ariaLabel.includes('mute') ||
            title.includes('microphone') || 
            title.includes('mic') || 
            title.includes('mute') ||
            tooltip.includes('microphone') || 
            tooltip.includes('mic') || 
            tooltip.includes('mute')) {
          
          this.log('Selected mute button:', button);
          return button;
        }
      }
    }
    
    // Fallback: look for any button that might contain microphone icon
    const allButtons = document.querySelectorAll('button, div[role="button"]') as NodeListOf<HTMLElement>;
    this.log(`Checking ${allButtons.length} buttons for microphone icons...`);
    
    for (const button of allButtons) {
      const svg = button.querySelector('svg');
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      
      if (svg && (ariaLabel.includes('mic') || ariaLabel.includes('mute'))) {
        this.log('Found button with SVG and mic-related label:', button);
        return button;
      }
    }

    this.log('No mute button found');
    return null;
  }

  private isMuted(button: HTMLElement): boolean {
    const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
    const tooltip = button.getAttribute('data-tooltip')?.toLowerCase() || '';
    const isMutedAttr = button.getAttribute('data-is-muted');
    
    return ariaLabel.includes('turn on microphone') || 
           tooltip.includes('turn on microphone') ||
           isMutedAttr === 'true' ||
           button.classList.contains('muted');
  }

  private clickMuteButton(button: HTMLElement): void {
    this.log('Attempting to click mute button:', button);
    
    // Multiple click strategies - Meet's button handling can be inconsistent
    
    // Strategy 1: Standard DOM click
    try {
      button.click();
      this.log('Direct click() method called');
    } catch (e) {
      this.log('Direct click failed:', e);
    }
    
    // Strategy 2: Full mouse event sequence
    try {
      const mouseEvents = ['mousedown', 'mouseup', 'click'];
      mouseEvents.forEach(eventType => {
        const event = new MouseEvent(eventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1,
          button: 0
        });
        button.dispatchEvent(event);
      });
      this.log('Mouse events dispatched');
    } catch (e) {
      this.log('Mouse events failed:', e);
    }
    
    // Strategy 3: Modern pointer events for touch compatibility
    try {
      const pointerDownEvent = new PointerEvent('pointerdown', {
        view: window,
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'mouse'
      });
      
      const pointerUpEvent = new PointerEvent('pointerup', {
        view: window,
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'mouse'
      });

      button.dispatchEvent(pointerDownEvent);
      setTimeout(() => {
        button.dispatchEvent(pointerUpEvent);
        this.log('Pointer events dispatched');
      }, TIMING_CONSTANTS.POINTER_EVENT_DELAY);
    } catch (e) {
      this.log('Pointer events failed:', e);
    }
    
    // Strategy 4: Keyboard activation for accessibility handlers
    try {
      button.focus();
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true
      });
      button.dispatchEvent(keyEvent);
      this.log('Focus and keyboard events dispatched');
    } catch (e) {
      this.log('Focus/keyboard events failed:', e);
    }
  }


  private checkAutoMuteOnJoin(): void {
    if (!this.settings.autoMuteOnJoin || this.muteState.hasAutoMutedOnJoin) {
      return;
    }

    // Wait for UI to stabilize before auto-muting
    setTimeout(() => {
      this.scheduleAutoMute();
    }, TIMING_CONSTANTS.UI_STABILIZATION_DELAY + this.settings.autoUnmuteDelay);
  }

  private scheduleAutoMute(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.performAutoMute();
    }, 0);
  }

  private async performAutoMute(): Promise<void> {
    if (this.muteState.hasAutoMutedOnJoin) {
      return;
    }

    await this.performMuteChange('mute', 'AUTO MUTE ON JOIN', () => {
      this.muteState.hasAutoMutedOnJoin = true;
    });
  }


  private log(...args: unknown[]): void {
    if (this.settings.debugMode) {
      console.log('[Meet Auto-Unmute]', ...args);
    }
  }

  private logError(...args: unknown[]): void {
    console.error('[Meet Auto-Unmute]', ...args);
  }

}

try {
  new MeetAutoUnmute();
} catch (error) {
  console.error('[Meet Auto-Unmute] Failed to create MeetAutoUnmute instance:', error);
}