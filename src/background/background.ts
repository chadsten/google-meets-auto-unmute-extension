import { ExtensionSettings, DEFAULT_SETTINGS, MessagePayload, MESSAGE_TYPES } from '../types/settings';
import { SettingsManager } from '../utils/settingsManager';

class BackgroundService {

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    await this.initializeSettings();
    this.setupMessageListeners();
    this.setupInstallHandler();
    this.setupTabListeners();
  }

  private async initializeSettings(): Promise<void> {
    try {
      await SettingsManager.initializeDefaults();
      if (DEFAULT_SETTINGS.debugMode) {
        console.log('Initialized default settings');
      }
    } catch (error) {
      console.error('Failed to initialize settings:', error);
    }
  }

  private setupMessageListeners(): void {
    // Central message router for extension communication
    chrome.runtime.onMessage.addListener((request: MessagePayload, _sender, sendResponse) => {
      switch (request.type) {
        case MESSAGE_TYPES.AUTO_UNMUTED:
        case MESSAGE_TYPES.AUTO_MUTED:
          // Events logged by content script
          return false;
        
        case MESSAGE_TYPES.GET_SETTINGS:
          this.getSettings().then(sendResponse);
          return true;
        
        case MESSAGE_TYPES.SET_SETTINGS:
          this.setSettings(request.data as ExtensionSettings).then(sendResponse);
          return true;
        
        
        case MESSAGE_TYPES.PING:
          return false;
        
        default:
          return false;
      }
    });
  }

  private setupInstallHandler(): void {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        if (DEFAULT_SETTINGS.debugMode) {
          console.log('Extension installed');
        }
        this.openWelcomePage();
      } else if (details.reason === 'update') {
        if (DEFAULT_SETTINGS.debugMode) {
          console.log('Extension updated to version', chrome.runtime.getManifest().version);
        }
      }
    });
  }

  private setupTabListeners(): void {
    // Auto-inject content script when Meet tabs finish loading
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url?.includes('meet.google.com')) {
        this.injectContentScriptIfNeeded(tabId);
      }
    });

  }

  private async injectContentScriptIfNeeded(tabId: number): Promise<void> {
    // Ping-test to avoid duplicate injection - inject only if script not responding
    try {
      await chrome.tabs.sendMessage(tabId, { type: MESSAGE_TYPES.PING });
    } catch {
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['content.js']
        });
        if (DEFAULT_SETTINGS.debugMode) {
          console.log('Content script injected into tab', tabId);
        }
      } catch (injectError) {
        console.error('Failed to inject content script:', injectError);
      }
    }
  }


  private async getSettings(): Promise<ExtensionSettings> {
    return await SettingsManager.loadSettings();
  }

  private async setSettings(settings: ExtensionSettings): Promise<void> {
    try {
      await SettingsManager.saveSettings(settings);
      if (DEFAULT_SETTINGS.debugMode) {
        console.log('Settings saved:', settings);
      }
      
      // Broadcast settings to all active Meet tabs for real-time updates
      const tabs = await chrome.tabs.query({ url: 'https://meet.google.com/*' });
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: MESSAGE_TYPES.SET_SETTINGS,
            data: settings
          }).catch(() => {});
        }
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }



  private openWelcomePage(): void {
    // Open popup in new tab with welcome banner on first install
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html?welcome=true')
    });
  }

}

new BackgroundService();