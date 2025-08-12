import { ExtensionSettings, DEFAULT_SETTINGS } from '../types/settings';

class PopupController {
  private settings: ExtensionSettings = DEFAULT_SETTINGS;
  private saveDebounceTimer: number | null = null;

  private elements = {
    enableToggle: null as HTMLInputElement | null,
    autoMuteToggle: null as HTMLInputElement | null,
    delaySlider: null as HTMLInputElement | null,
    delayValue: null as HTMLSpanElement | null,
    welcomeBanner: null as HTMLElement | null,
    dismissWelcome: null as HTMLButtonElement | null
  };

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Load settings first, then populate HTML with correct initial states
    await this.loadSettings();
    this.populateSettingsHTML();
    await this.loadElements();
    this.setupEventListeners();
    this.checkWelcomeScreen();
  }

  private async loadElements(): Promise<void> {
    this.elements.enableToggle = document.getElementById('enableToggle') as HTMLInputElement;
    this.elements.autoMuteToggle = document.getElementById('autoMuteToggle') as HTMLInputElement;
    this.elements.delaySlider = document.getElementById('delaySlider') as HTMLInputElement;
    this.elements.delayValue = document.getElementById('delayValue') as HTMLSpanElement;
    this.elements.welcomeBanner = document.getElementById('welcomeBanner');
    this.elements.dismissWelcome = document.getElementById('dismissWelcome') as HTMLButtonElement;
  }

  private async loadSettings(): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
      if (response) {
        this.settings = response;
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  private populateSettingsHTML(): void {
    const settingsSection = document.getElementById('settingsSection');
    if (!settingsSection) { return; }

    settingsSection.innerHTML = `
      <div class="setting-item">
        <label class="toggle-switch">
          <input type="checkbox" id="enableToggle" ${this.settings.enabled ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
        <div class="setting-info">
          <span class="setting-label">Auto-Unmute on Large Calls</span>
        </div>
      </div>

      <div class="setting-item">
        <label class="toggle-switch">
          <input type="checkbox" id="autoMuteToggle" ${this.settings.autoMuteOnJoin ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
        <div class="setting-info">
          <span class="setting-label">Auto-Mute on All Calls</span>
        </div>
      </div>

      <div class="setting-item slider-setting">
        <div class="setting-info">
          <span class="setting-label">Action Delay</span>
          <span class="setting-description">This delay may be required to allow the page to load. If you're having issues, increase this by 100-200ms.</span>
        </div>
        <div class="slider-container">
          <input type="range" id="delaySlider" min="0" max="3000" step="100" value="${this.settings.autoUnmuteDelay}">
          <span class="slider-value" id="delayValue">${this.settings.autoUnmuteDelay}ms</span>
        </div>
      </div>
    `;

    // Make settings visible immediately since they're now correct
    settingsSection.style.visibility = 'visible';
  }


  private setupEventListeners(): void {
    this.elements.enableToggle?.addEventListener('change', () => {
      this.settings.enabled = this.elements.enableToggle?.checked ?? false;
      // Mutual exclusion: auto-unmute and auto-mute can't both be active
      if (this.settings.enabled && this.settings.autoMuteOnJoin) {
        this.settings.autoMuteOnJoin = false;
        if (this.elements.autoMuteToggle) {
          this.elements.autoMuteToggle.checked = false;
        }
      }
      this.saveSettings();
    });

    this.elements.autoMuteToggle?.addEventListener('change', () => {
      this.settings.autoMuteOnJoin = this.elements.autoMuteToggle?.checked ?? false;
      // Mutual exclusion: auto-mute and auto-unmute can't both be active
      if (this.settings.autoMuteOnJoin && this.settings.enabled) {
        this.settings.enabled = false;
        if (this.elements.enableToggle) {
          this.elements.enableToggle.checked = false;
        }
      }
      this.saveSettings();
    });


    this.elements.delaySlider?.addEventListener('input', () => {
      this.settings.autoUnmuteDelay = parseInt(this.elements.delaySlider?.value ?? '500', 10);
      this.updateDelayDisplay();
      this.debouncedSave();
    });


    this.elements.dismissWelcome?.addEventListener('click', () => {
      this.dismissWelcome();
    });
  }

  private checkWelcomeScreen(): void {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === 'true' && this.elements.welcomeBanner) {
      this.elements.welcomeBanner.style.display = 'flex';
    }
  }

  private dismissWelcome(): void {
    if (this.elements.welcomeBanner) {
      this.elements.welcomeBanner.style.display = 'none';
    }
  }

  private updateDelayDisplay(): void {
    if (this.elements.delayValue && this.elements.delaySlider) {
      const value = this.elements.delaySlider.value;
      this.elements.delayValue.textContent = `${value}ms`;
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      await chrome.runtime.sendMessage({
        type: 'SET_SETTINGS',
        data: this.settings
      });
      
      this.showSavedIndicator();
      
      const tabs = await chrome.tabs.query({ url: 'https://meet.google.com/*' });
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'SET_SETTINGS',
            data: this.settings
          }).catch(() => {});
        }
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  private debouncedSave(): void {
    // Debounce slider changes to avoid excessive saves during dragging
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
    }
    
    this.saveDebounceTimer = setTimeout(() => {
      this.saveSettings();
    }, 300);
  }

  private showSavedIndicator(): void {
    const indicator = document.createElement('div');
    indicator.className = 'saved-indicator';
    indicator.textContent = 'Settings saved!';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.style.animation = 'slideDown 0.3s ease-out reverse';
      setTimeout(() => {
        indicator.remove();
      }, 300);
    }, 2000);
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});