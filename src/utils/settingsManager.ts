import { ExtensionSettings, DEFAULT_SETTINGS } from '../types/settings';

/**
 * Centralized settings management utility to eliminate duplicate Chrome storage code
 */
export class SettingsManager {
  private static readonly STORAGE_KEY = 'settings';

  /**
   * Load settings from Chrome storage, merging with defaults
   */
  static async loadSettings(): Promise<ExtensionSettings> {
    try {
      const result = await chrome.storage.sync.get(SettingsManager.STORAGE_KEY);
      if (result.settings) {
        return { ...DEFAULT_SETTINGS, ...result.settings };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Save settings to Chrome storage
   */
  static async saveSettings(settings: ExtensionSettings): Promise<void> {
    try {
      await chrome.storage.sync.set({ [SettingsManager.STORAGE_KEY]: settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  /**
   * Initialize default settings if none exist
   */
  static async initializeDefaults(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(SettingsManager.STORAGE_KEY);
      if (!result.settings) {
        await SettingsManager.saveSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Failed to initialize default settings:', error);
      throw error;
    }
  }
}