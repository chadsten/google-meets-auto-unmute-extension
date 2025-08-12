// Core extension settings - all user-configurable options
export interface ExtensionSettings {
  enabled: boolean; // Auto-unmute when muted in Google Meet
  autoUnmuteDelay: number; // Milliseconds to wait before auto-actions
  debugMode: boolean; // Enable console logging for troubleshooting
  autoMuteOnJoin: boolean; // Auto-mute when joining any meeting
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true, // Start with auto-unmute enabled
  autoUnmuteDelay: 500, // Half-second delay for UI stability
  debugMode: false, // Debug off by default for clean production console
  autoMuteOnJoin: false // Don't auto-mute by default
};

// Message structure for extension component communication
export interface MessagePayload {
  type: 'GET_SETTINGS' | 'SET_SETTINGS' | 'AUTO_UNMUTED' | 'AUTO_MUTED' | 'PING';
  data?: unknown;
}

// Track mute state and timing to prevent loops and conflicts
export interface MuteState {
  isMuted: boolean; // Current microphone state
  lastUnmuteTime: number; // Timestamp of last unmute to prevent rapid loops
  hasAutoMutedOnJoin: boolean; // Prevent multiple auto-mutes on join
}