// Timing constants - all time-based values in milliseconds
export const TIMING_CONSTANTS = {
  MEETING_DETECTION_TIMEOUT: 30000, // 30 seconds to wait for meeting to load
  RAPID_UNMUTE_PREVENTION_DELAY: 3000, // 3 second cooldown between unmutes
  MEETING_POLL_INTERVAL: 1000, // 1 second polling for meeting detection
  OPERATION_VERIFICATION_DELAY: 500, // Post-action verification wait
  DEBOUNCE_TIMEOUT: 300, // Debounce delay for UI interactions
  NOTIFICATION_DISPLAY_TIME: 2000, // How long to show success notifications
  POINTER_EVENT_DELAY: 50, // Delay between pointer down/up events
  UI_STABILIZATION_DELAY: 100 // Delay to allow UI to stabilize
} as const;

// UI constants - slider and interface constraints
export const UI_CONSTANTS = {
  SLIDER_MIN_VALUE: 0,
  SLIDER_MAX_VALUE: 3000,
  SLIDER_STEP_SIZE: 50
} as const;

// Message types for extension component communication
export const MESSAGE_TYPES = {
  GET_SETTINGS: 'GET_SETTINGS',
  SET_SETTINGS: 'SET_SETTINGS', 
  AUTO_UNMUTED: 'AUTO_UNMUTED',
  AUTO_MUTED: 'AUTO_MUTED',
  PING: 'PING'
} as const;

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
  type: keyof typeof MESSAGE_TYPES;
  data?: unknown;
}

// Track mute state and timing to prevent loops and conflicts
export interface MuteState {
  isMuted: boolean; // Current microphone state
  lastUnmuteTime: number; // Timestamp of last unmute to prevent rapid loops
  hasAutoMutedOnJoin: boolean; // Prevent multiple auto-mutes on join
}