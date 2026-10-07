export const NOTICE_KEY = 'astra:updates:seen:v1';

const idsFrom = raw => {
  try {
    const value = JSON.parse(raw ?? '[]');
    return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string' && /^[a-z0-9-]{5,100}$/.test(id)))] : [];
  } catch { return []; }
};

// Storage can be blocked or full. Never show a repeating notice when nothing
// can remember it; the Updates navigation remains available in that case.
export function openNoticeMemory(sources) {
  let inherited = [];
  for (const getStorage of sources) {
    try {
      const storage = getStorage();
      inherited = [...new Set([...inherited, ...idsFrom(storage.getItem(NOTICE_KEY))])];
      storage.setItem(NOTICE_KEY, JSON.stringify(inherited));
      return {
        read() {
          try { return idsFrom(storage.getItem(NOTICE_KEY)); } catch { return null; }
        },
        remember(entries) {
          try {
            const seen = this.read();
            if (seen === null) return false;
            storage.setItem(NOTICE_KEY, JSON.stringify([...new Set([...seen, ...entries.map(e => e.id)])]));
            return true;
          } catch { return false; }
        },
      };
    } catch { /* Try sessionStorage when persistent storage is unavailable. */ }
  }
  return null;
}

export function noticeEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.filter(e => e && typeof e.id === 'string' && /^[a-z0-9-]{5,100}$/.test(e.id) && typeof e.title === 'string' && e.title.trim() && e.title.length <= 1200 && typeof e.summary === 'string' && e.summary.length <= 1200 && Array.isArray(e.scopes) && e.scopes.length > 0 && e.scopes.every(s => ['app', 'docs'].includes(s)) && ['development', 'distributed', 'documentation'].includes(e.availability));
}

export function nextNotice(entries, seen) {
  if (seen === null) return null;
  const unread = entries.filter(e => !seen.includes(e.id));
  return unread.length ? { entry: unread[0], count: seen.length ? unread.length : 1 } : null;
}
