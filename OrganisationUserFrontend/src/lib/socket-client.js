import { io } from 'socket.io-client';
import { BACKEND_URL } from 'src/lib/v2-endpoints';

let socket = null;
let heartbeatInterval = null;

// ─── Connection ─────────────────────────────────────────────────────────────

export function connect(token) {
  if (socket?.connected) return socket;

  socket = io(BACKEND_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
  });

  return socket;
}

export function disconnect() {
  stopHeartbeat();
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

// ─── Room management ────────────────────────────────────────────────────────

export function joinTestRoom(testId) {
  if (socket?.connected) {
    socket.emit('join:test', testId);
  }
}

export function leaveTestRoom(testId) {
  if (socket?.connected) {
    socket.emit('leave:test', testId);
  }
}

export function joinMonitorRoom(testId) {
  if (socket?.connected) {
    socket.emit('join:monitor', testId);
  }
}

export function leaveMonitorRoom(testId) {
  if (socket?.connected) {
    socket.emit('leave:monitor', testId);
  }
}

// ─── Event subscription ─────────────────────────────────────────────────────

export function on(event, callback) {
  if (socket) {
    socket.on(event, callback);
  }
}

export function off(event, callback) {
  if (socket) {
    socket.off(event, callback);
  }
}

// ─── Heartbeat ──────────────────────────────────────────────────────────────

export function startHeartbeat(testId, getCurrentState) {
  stopHeartbeat();
  heartbeatInterval = setInterval(() => {
    if (socket?.connected) {
      const state = getCurrentState();
      socket.emit('attempt:heartbeat', {
        testId,
        currentQuestion: state.currentQuestion || 0,
        sectionIndex: state.sectionIndex || 0,
      });
    }
  }, 30000);
}

export function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

// ─── Answer notification ────────────────────────────────────────────────────

export function notifyAnswer(testId, questionId) {
  if (socket?.connected) {
    socket.emit('attempt:answer', { testId, questionId });
  }
}
