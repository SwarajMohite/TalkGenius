export function qs(id) { return document.getElementById(id); }

export function getParams() {
  const u = new URL(location.href);
  return {
    roomId: u.searchParams.get('room'),
    name: u.searchParams.get('name')
  };
}

// Build ICE server list from env echoed by server (simple inline for demo)
export function getIceServers() {
  const STUN = (window.STUN_URL || 'stun:stun.l.google.com:19302');
  const TURN = window.TURN_URL;
  const cfg = [{ urls: STUN }];
  if (TURN && window.TURN_USER && window.TURN_PASS) {
    cfg.push({ urls: TURN, username: window.TURN_USER, credential: window.TURN_PASS });
  }
  return cfg;
}
