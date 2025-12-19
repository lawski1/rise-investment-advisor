// User data management
// In production, this would connect to a database (Firebase, Supabase, MongoDB, etc.)

export interface User {
  id: string;
  email: string;
  name?: string;
  watchlist: string[]; // Array of investment symbols
  preferences: {
    theme: 'dark' | 'light' | 'auto';
    notifications: boolean;
    defaultView: 'grid' | 'list';
  };
  createdAt: string;
  lastLogin: string;
}

// Local storage keys
const STORAGE_KEYS = {
  USER: 'rise_user',
  WATCHLIST: 'rise_watchlist',
  PREFERENCES: 'rise_preferences',
};

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error getting user:', error);
  }
  
  return null;
}

/**
 * Create or update user
 */
export function saveUser(user: Partial<User>): User {
  const existingUser = getCurrentUser();
  const newUser: User = {
    id: existingUser?.id || `user_${Date.now()}`,
    email: user.email || existingUser?.email || 'guest@example.com',
    name: user.name || existingUser?.name,
    watchlist: user.watchlist || existingUser?.watchlist || [],
    preferences: user.preferences || existingUser?.preferences || {
      theme: 'dark',
      notifications: true,
      defaultView: 'grid',
    },
    createdAt: existingUser?.createdAt || new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  }

  return newUser;
}

/**
 * Add investment to watchlist
 */
export function addToWatchlist(symbol: string): boolean {
  const user = getCurrentUser();
  if (!user) {
    // Create guest user
    saveUser({ watchlist: [symbol] });
    return true;
  }

  if (!user.watchlist.includes(symbol)) {
    user.watchlist.push(symbol);
    saveUser(user);
    return true;
  }
  return false;
}

/**
 * Remove investment from watchlist
 */
export function removeFromWatchlist(symbol: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;

  const index = user.watchlist.indexOf(symbol);
  if (index > -1) {
    user.watchlist.splice(index, 1);
    saveUser(user);
    return true;
  }
  return false;
}

/**
 * Check if investment is in watchlist
 */
export function isInWatchlist(symbol: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.watchlist.includes(symbol);
}

/**
 * Get watchlist
 */
export function getWatchlist(): string[] {
  const user = getCurrentUser();
  return user?.watchlist || [];
}

/**
 * Update user preferences
 */
export function updatePreferences(preferences: Partial<User['preferences']>): void {
  const user = getCurrentUser();
  if (user) {
    saveUser({
      ...user,
      preferences: { ...user.preferences, ...preferences },
    });
  } else {
    saveUser({
      preferences: {
        theme: 'dark',
        notifications: true,
        defaultView: 'grid',
        ...preferences,
      },
    });
  }
}

/**
 * Clear user data (logout)
 */
export function clearUserData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  }
}


