export interface DailyVerseReminderConfig {
  enabled: boolean;
  time: string; // e.g., '06:00' (Fajr) or '20:30' (Esha) or custom
  fridayJummahReminder: boolean;
  notifyWithAudio: boolean;
}

const STORAGE_KEY = 'al_muneer_daily_verse_reminder_config';

export function getDailyVerseReminderConfig(): DailyVerseReminderConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    enabled: true,
    time: '06:30',
    fridayJummahReminder: true,
    notifyWithAudio: true,
  };
}

export function saveDailyVerseReminderConfig(config: DailyVerseReminderConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function sendDailyVerseNotification(title: string, body: string): void {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'daily-verse-reminder',
      });
    } catch {}
  }
}
