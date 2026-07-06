const KEY = 'legranddeal_room_session';

export interface RoomSession {
  roomId: string;
  teamId: string;
  teamName: string;
  code: string;
}

export function saveSession(session: RoomSession) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): RoomSession | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RoomSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
