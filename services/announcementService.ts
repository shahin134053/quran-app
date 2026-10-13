import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot, 
  query, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Announcement, NotificationPreferences, UserMessage, UserMessageCategory } from '../types';

const ANNOUNCEMENTS_COLLECTION = 'announcements';
const USER_MESSAGES_COLLECTION = 'user_messages';
const READ_STORAGE_KEY = 'al_muneer_read_announcements';
const PREFS_STORAGE_KEY = 'al_muneer_notification_prefs';

/** 24 Hours in Milliseconds for Auto-Cleanup (0 KB Backend Policy) */
export const TTL_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * Bengali numeral converter for beautiful localized countdowns
 */
export function toBengaliNumerals(num: number | string): string {
  const banglaDigits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).replace(/[0-9]/g, (w) => banglaDigits[w] || w);
}

export interface ExpiryStatus {
  isRead: boolean;
  isExpired: boolean;
  remainingMs: number;
  remainingHours: number;
  remainingMinutes: number;
  formattedTextBn: string;
  formattedTextEn: string;
}

/**
 * Calculate 24-hour countdown after a message has been read
 */
export function calculateExpiryStatus(readAt?: string): ExpiryStatus {
  if (!readAt) {
    return {
      isRead: false,
      isExpired: false,
      remainingMs: TTL_DURATION_MS,
      remainingHours: 24,
      remainingMinutes: 0,
      formattedTextBn: 'অপঠিত (পড়ার পর ২৪ ঘণ্টা কাউন্টডাউন শুরু হবে)',
      formattedTextEn: 'Unread (24h countdown starts when read)'
    };
  }

  const readTime = new Date(readAt).getTime();
  if (isNaN(readTime)) {
    return {
      isRead: false,
      isExpired: false,
      remainingMs: TTL_DURATION_MS,
      remainingHours: 24,
      remainingMinutes: 0,
      formattedTextBn: 'অপঠিত',
      formattedTextEn: 'Unread'
    };
  }

  const elapsed = Date.now() - readTime;
  const remainingMs = Math.max(0, TTL_DURATION_MS - elapsed);

  if (remainingMs <= 0) {
    return {
      isRead: true,
      isExpired: true,
      remainingMs: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      formattedTextBn: 'মেয়াদোত্তীর্ণ (সার্ভার থেকে স্বয়ংক্রিয়ভাবে মুছে যাচ্ছে...)',
      formattedTextEn: 'Expired (Auto-cleaning from server...)'
    };
  }

  const totalMinutes = Math.floor(remainingMs / (60 * 1000));
  const remainingHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const bnHours = toBengaliNumerals(remainingHours);
  const bnMinutes = toBengaliNumerals(remainingMinutes);

  return {
    isRead: true,
    isExpired: false,
    remainingMs,
    remainingHours,
    remainingMinutes,
    formattedTextBn: remainingHours > 0 
      ? `পঠিত: আর ${bnHours} ঘণ্টা ${bnMinutes} মিনিট পর ০ কেবি ফ্রি করতে রিমুভ হবে`
      : `পঠিত: আর ${bnMinutes} মিনিট পর ০ কেবি ফ্রি করতে রিমুভ হবে`,
    formattedTextEn: remainingHours > 0
      ? `Read: auto-deletes in ${remainingHours}h ${remainingMinutes}m (0 KB policy)`
      : `Read: auto-deletes in ${remainingMinutes}m (0 KB policy)`
  };
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  doNotDisturb: false, // বিরক্তি-মুক্ত মোড (DND)
  occasions: true, // ঈদ, রমাদান, জুমু'আ শুভেচ্ছা
  dailyHadithAyah: true, // হাদিস ও কুরআনের আয়াত
  appUpdates: true, // আপডেট তথ্য
  urgentOnly: false, // শুধু অতীব জরুরি বার্তা
  soundEnabled: false, // কোনো অযাচিত শব্দ যেন বিরক্ত না করে
  bannerPopup: true, // স্ক্রিনে শালীন ব্যানার দেখানো
};

export function getNotificationPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to load notification preferences:', err);
  }
  return DEFAULT_NOTIFICATION_PREFERENCES;
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save notification preferences:', err);
  }
}

/**
 * Filter announcements based on user preference to prevent annoyance
 */
export function shouldShowAnnouncement(
  announcement: Announcement, 
  prefs: NotificationPreferences
): boolean {
  if (!prefs.enabled) return false;
  if (prefs.doNotDisturb && announcement.priority !== 'urgent') return false;
  if (prefs.urgentOnly && announcement.priority !== 'urgent') return false;

  if (!prefs.occasions && ['eid', 'ramadan', 'jummah'].includes(announcement.occasion)) {
    return false;
  }
  if (!prefs.dailyHadithAyah && announcement.occasion === 'hadith') {
    return false;
  }
  if (!prefs.appUpdates && announcement.occasion === 'update') {
    return false;
  }

  return true;
}

export function getReadAnnouncementIds(): string[] {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Mark announcement as read by user: saves to local cache and records readAt in Firestore to begin 24h countdown
 */
export async function markAnnouncementAsRead(id: string): Promise<void> {
  try {
    const current = getReadAnnouncementIds();
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(current));
    }

    // Record readAt in Firestore so the 24-hour auto-removal countdown begins
    const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (!data.readAt) {
        await updateDoc(docRef, { readAt: new Date().toISOString() });
      }
    }
  } catch (err) {
    console.error('Failed to mark announcement as read:', err);
  }
}

export async function markAllAnnouncementsAsRead(ids: string[]): Promise<void> {
  try {
    const current = new Set(getReadAnnouncementIds());
    ids.forEach(id => current.add(id));
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(current)));

    const now = new Date().toISOString();
    for (const id of ids) {
      try {
        const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && !docSnap.data().readAt) {
          await updateDoc(docRef, { readAt: now });
        }
      } catch (e) {
        console.warn(`Could not sync read status for ${id}:`, e);
      }
    }
  } catch (err) {
    console.error('Failed to mark all as read:', err);
  }
}

/**
 * Real-time listener for announcements sent by admin/backend
 * Auto-filters and deletes any announcements that exceeded 24 hours after being read
 */
export function subscribeAnnouncements(
  onUpdate: (announcements: Announcement[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const colRef = collection(db, ANNOUNCEMENTS_COLLECTION);
    const q = query(colRef, limit(50));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: Announcement[] = [];
        const now = Date.now();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();

          // 24-Hour Auto Removal Check: If user already read it and 24 hours have passed, permanently delete from server!
          if (data.readAt) {
            const readTime = new Date(data.readAt).getTime();
            if (!isNaN(readTime) && (now - readTime) >= TTL_DURATION_MS) {
              // Automatically delete from Firestore backend to ensure 0 KB server storage!
              deleteDoc(doc(db, ANNOUNCEMENTS_COLLECTION, docSnap.id)).catch(() => {});
              return; // Skip adding expired announcement
            }
          }

          list.push({
            id: docSnap.id,
            title: data.title || '',
            message: data.message || '',
            occasion: data.occasion || 'general',
            priority: data.priority || 'normal',
            senderName: data.senderName || 'Al-Muneer Admin',
            senderEmail: data.senderEmail || '',
            createdAt: data.createdAt || new Date().toISOString(),
            readAt: data.readAt || undefined,
            targetTab: data.targetTab,
            isActive: data.isActive !== false,
          });
        });

        // Sort descending by createdAt
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);

        const hasInitialSeeded = typeof window !== 'undefined' ? localStorage.getItem('al_muneer_initial_announcement_seeded') : 'true';
        if (snapshot.empty && !hasInitialSeeded) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('al_muneer_initial_announcement_seeded', 'true');
          }
          // Auto-seed initial official welcome announcement ONLY ONCE EVER on pristine install
          addDoc(colRef, {
            title: 'আল-মুনীর অ্যাপে স্বাগতম ও বরকতময় শুভেচ্ছা! 🌙✨',
            message: 'আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ। আল-মুনীর ইসলামিক প্ল্যাটফর্মে আপনাকে স্বাগতম। এখানে আপনি পবিত্র কুরআন তিলাওয়াত, সহীহ হাদিস, নামাজের সঠিক সময়সূচি এবং অ্যাডমিনের প্রেরিত যেকোনো অকেশনের তাৎক্ষণিক নোটিফিকেশন পাবেন।',
            occasion: 'ramadan',
            priority: 'high',
            senderName: 'Md Shahin (Admin)',
            senderEmail: 'shahin.prpl@gmail.com',
            targetTab: 'home',
            isActive: true,
            createdAt: new Date().toISOString(),
          }).catch((e) => console.warn('Could not auto-seed announcement:', e));
        }
      },
      (err) => {
        console.error('Announcements subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error('Failed to init subscription:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Admin: Broadcast a new message / announcement to all users
 */
export async function sendAnnouncement(payload: {
  title: string;
  message: string;
  occasion: string;
  priority: 'normal' | 'high' | 'urgent';
  senderName: string;
  senderEmail: string;
  targetTab?: string;
}): Promise<string> {
  const colRef = collection(db, ANNOUNCEMENTS_COLLECTION);
  const docRef = await addDoc(colRef, {
    title: payload.title.trim(),
    message: payload.message.trim(),
    occasion: payload.occasion,
    priority: payload.priority,
    senderName: payload.senderName || 'Al-Muneer Admin',
    senderEmail: payload.senderEmail || 'shahin.prpl@gmail.com',
    targetTab: payload.targetTab || '',
    isActive: true,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Admin: Delete an announcement
 */
export async function deleteAnnouncement(id: string): Promise<void> {
  const docRef = doc(db, ANNOUNCEMENTS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Trigger browser/system notification on user's phone or desktop
 */
export async function requestSystemNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return await Notification.requestPermission();
}

export function triggerSystemNotification(title: string, body: string, icon = '/icons/icon-192.png') {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200],
      } as any);
    } catch (e) {
      // Fallback for mobile browser ServiceWorker registration if direct new Notification throws
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon,
          });
        }).catch(() => {});
      }
    }
  }
}

/**
 * Play a calm, polite, subtle sound chime (never harsh or annoying)
 */
export function playPoliteChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime); // Very gentle volume
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch {
    // Ignore audio context errors if blocked by browser policy
  }
}

/**
 * User: Send a message, prayer request, feedback, or inquiry to Admin
 */
export async function sendUserMessageToAdmin(payload: {
  senderName: string;
  senderEmail: string;
  category: UserMessageCategory;
  subject: string;
  message: string;
}): Promise<string> {
  const colRef = collection(db, USER_MESSAGES_COLLECTION);
  const docRef = await addDoc(colRef, {
    senderName: payload.senderName.trim() || 'বেনামী ব্যবহারকারী (User)',
    senderEmail: payload.senderEmail.trim(),
    category: payload.category || 'general',
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    status: 'unread',
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Admin: Real-time listener for incoming messages from app users
 * Automatically purges messages that exceeded 24 hours after being read by admin
 */
export function subscribeUserMessages(
  onUpdate: (messages: UserMessage[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const colRef = collection(db, USER_MESSAGES_COLLECTION);
    const q = query(colRef, limit(100));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: UserMessage[] = [];
        const now = Date.now();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();

          // 24-Hour Auto Removal Check: If admin already read it and 24 hours have elapsed, permanently delete from server!
          if (data.readAt) {
            const readTime = new Date(data.readAt).getTime();
            if (!isNaN(readTime) && (now - readTime) >= TTL_DURATION_MS) {
              deleteDoc(doc(db, USER_MESSAGES_COLLECTION, docSnap.id)).catch(() => {});
              return; // Skip adding expired message
            }
          }

          list.push({
            id: docSnap.id,
            senderName: data.senderName || 'ব্যবহারকারী',
            senderEmail: data.senderEmail || '',
            category: data.category || 'general',
            subject: data.subject || '',
            message: data.message || '',
            status: data.status || 'unread',
            createdAt: data.createdAt || new Date().toISOString(),
            readAt: data.readAt || undefined,
          });
        });

        // Sort descending
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      },
      (err) => {
        console.error('User messages subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error('Failed to init user messages subscription:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Admin: Update message review status (marks read or replied, starts 24h countdown)
 */
export async function updateUserMessageStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<void> {
  const docRef = doc(db, USER_MESSAGES_COLLECTION, id);
  const updates: Record<string, any> = { status };
  
  if (status === 'read' || status === 'replied') {
    // Check if readAt already exists; if not, stamp it now to start the 24-hour countdown
    const snap = await getDoc(docRef);
    if (snap.exists() && !snap.data().readAt) {
      updates.readAt = new Date().toISOString();
    }
  } else if (status === 'unread') {
    // If marked unread, reset readAt
    updates.readAt = null;
  }

  await updateDoc(docRef, updates);
}

export async function markUserMessageAsRead(id: string): Promise<void> {
  await updateUserMessageStatus(id, 'read');
}

/**
 * Admin: Delete a user message manually
 */
export async function deleteUserMessage(id: string): Promise<void> {
  const docRef = doc(db, USER_MESSAGES_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Sweep and permanently delete any expired announcements (>24 hours after read)
 * and expired user messages (>24 hours after admin read) from backend Firestore
 */
export async function cleanupAllExpiredData(): Promise<{
  cleanedAnnouncements: number;
  cleanedMessages: number;
  freedKb: number;
}> {
  const now = Date.now();
  let cleanedAnnouncements = 0;
  let cleanedMessages = 0;

  try {
    const annSnap = await getDocs(collection(db, ANNOUNCEMENTS_COLLECTION));
    for (const d of annSnap.docs) {
      const data = d.data();
      if (data.readAt) {
        const readTime = new Date(data.readAt).getTime();
        if (!isNaN(readTime) && (now - readTime) >= TTL_DURATION_MS) {
          await deleteDoc(doc(db, ANNOUNCEMENTS_COLLECTION, d.id));
          cleanedAnnouncements++;
        }
      }
    }
  } catch (err) {
    console.warn('Cleanup announcements sweep error:', err);
  }

  try {
    const msgSnap = await getDocs(collection(db, USER_MESSAGES_COLLECTION));
    for (const d of msgSnap.docs) {
      const data = d.data();
      if (data.readAt) {
        const readTime = new Date(data.readAt).getTime();
        if (!isNaN(readTime) && (now - readTime) >= TTL_DURATION_MS) {
          await deleteDoc(doc(db, USER_MESSAGES_COLLECTION, d.id));
          cleanedMessages++;
        }
      }
    }
  } catch (err) {
    console.warn('Cleanup user messages sweep error:', err);
  }

  const freedKb = Math.round((cleanedAnnouncements + cleanedMessages) * 1.5 * 10) / 10;
  return { cleanedAnnouncements, cleanedMessages, freedKb };
}

let cleanupWorkerInterval: any = null;

/**
 * Starts automatic 24h expiration sweeper ensuring 0 KB backend retention
 */
export function startAutoCleanupWorker(intervalMs = 4 * 60 * 60 * 1000): () => void {
  // Check if cleaned in the last 4 hours to avoid Firestore rate limits & quota exhaustion
  try {
    const lastCleanup = localStorage.getItem('last_firestore_cleanup_time');
    const now = Date.now();
    if (!lastCleanup || now - parseInt(lastCleanup, 10) > 4 * 60 * 60 * 1000) {
      cleanupAllExpiredData().then(() => {
        try { localStorage.setItem('last_firestore_cleanup_time', String(Date.now())); } catch (e) {}
      }).catch(() => {});
    }
  } catch (e) {}

  if (cleanupWorkerInterval) clearInterval(cleanupWorkerInterval);
  cleanupWorkerInterval = setInterval(() => {
    cleanupAllExpiredData().then(() => {
      try { localStorage.setItem('last_firestore_cleanup_time', String(Date.now())); } catch (e) {}
    }).catch(() => {});
  }, intervalMs);

  return () => {
    if (cleanupWorkerInterval) clearInterval(cleanupWorkerInterval);
  };
}
