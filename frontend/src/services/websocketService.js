/**
 * WebSocket Service
 * Provides full-duplex communication with FastAPI backend for continuous authentication.
 * Handles auto-reconnect, heartbeat ping/pong, and message event listeners.
 */

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = null;
    this.listeners = new Map();
    this.reconnectTimer = null;
    this.isConnected = false;
    this.isExplicitlyClosed = false;
  }

  connect(token) {
    const defaultWsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/continuous-auth';
    this.url = token ? `${defaultWsUrl}?token=${token}` : defaultWsUrl;
    this.isExplicitlyClosed = false;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.emit('connection_change', { status: 'connected' });
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type || 'message', data.payload || data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      this.ws.onerror = (error) => {
        this.emit('error', error);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit('connection_change', { status: 'disconnected' });
        if (!this.isExplicitlyClosed) {
          this.reconnectTimer = setTimeout(() => {
            this.connect(token);
          }, 3000);
        }
      };
    } catch (err) {
      console.warn('WebSocket connection attempt failed:', err);
      this.isConnected = false;
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload, timestamp: Date.now() }));
      return true;
    }
    return false;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in listener for ${event}:`, err);
        }
      });
    }
  }

  disconnect() {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const wsService = new WebSocketService();
export default wsService;
