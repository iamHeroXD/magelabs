import { createBrowserClient } from '@supabase/ssr';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  isGuest?: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

const GUEST_STORAGE_KEY = 'magelabs_guest_user';

export function getLocalUserSession(): UserProfile {
  if (typeof window === 'undefined') {
    return {
      id: 'usr_guest',
      email: 'student@magelabs.local',
      displayName: 'Lab Student',
      role: 'student',
      isGuest: true
    };
  }

  const stored = window.localStorage.getItem(GUEST_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  const newGuest: UserProfile = {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    email: 'guest@magelabs.edu',
    displayName: 'Student Researcher',
    role: 'student',
    isGuest: true
  };

  window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newGuest));
  return newGuest;
}

export function updateLocalUserSession(updates: Partial<UserProfile>): UserProfile {
  const current = getLocalUserSession();
  const updated = { ...current, ...updates };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
