/**
 * Cross-tab Authentication Synchronization Utility
 * Enables instant synchronization of authentication state across multiple browser tabs
 * via BroadcastChannel and window storage events.
 */

export type AuthSyncEvent =
  | { type: "LOGIN"; user: any; timestamp: number }
  | { type: "LOGOUT"; timestamp: number };

const AUTH_CHANNEL_NAME = "gc_auth_channel";
const AUTH_SYNC_STORAGE_KEY = "gc_auth_sync_event";

/**
 * Broadcast an authentication state change to all other tabs
 */
export function broadcastAuthChange(type: "LOGIN" | "LOGOUT", user?: any): void {
  if (typeof window === "undefined") return;

  const event: AuthSyncEvent = {
    type,
    user: type === "LOGIN" ? user : undefined,
    timestamp: Date.now(),
  };

  // 1. BroadcastChannel (modern browsers, instant cross-tab message)
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.postMessage(event);
      channel.close();
    }
  } catch {
    // Fallback gracefully if BroadcastChannel fails
  }

  // 2. Storage event trigger (triggers window 'storage' event in all other tabs)
  try {
    localStorage.setItem(AUTH_SYNC_STORAGE_KEY, JSON.stringify(event));
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

/**
 * Subscribe to cross-tab authentication events
 */
export function subscribeToAuthChanges(
  onAuthChange: (event: AuthSyncEvent) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  let channel: BroadcastChannel | null = null;

  // 1. Listen via BroadcastChannel
  try {
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.onmessage = (msg: MessageEvent<AuthSyncEvent>) => {
        if (msg.data && (msg.data.type === "LOGIN" || msg.data.type === "LOGOUT")) {
          onAuthChange(msg.data);
        }
      };
    }
  } catch {
    channel = null;
  }

  // 2. Listen via storage event (handles standard cross-tab localStorage changes)
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === AUTH_SYNC_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && (parsed.type === "LOGIN" || parsed.type === "LOGOUT")) {
          onAuthChange(parsed);
        }
      } catch {
        // Ignore parse error
      }
    } else if (e.key === "gc_user") {
      if (e.newValue) {
        try {
          const user = JSON.parse(e.newValue);
          onAuthChange({ type: "LOGIN", user, timestamp: Date.now() });
        } catch {
          // Ignore
        }
      } else {
        onAuthChange({ type: "LOGOUT", timestamp: Date.now() });
      }
    }
  };

  window.addEventListener("storage", handleStorageEvent);

  // Return unsubscribe cleanup function
  return () => {
    window.removeEventListener("storage", handleStorageEvent);
    if (channel) {
      try {
        channel.close();
      } catch {
        // Ignore
      }
    }
  };
}
