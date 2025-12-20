// User data management
// In production, this would connect to a database (Firebase, Supabase, MongoDB, etc.)

export interface User {
  id: string;
  email: string;
  name?: string;
  photo?: string; // Base64 encoded image or data URL
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
    name: user.name !== undefined ? user.name : existingUser?.name,
    photo: user.photo !== undefined ? user.photo : existingUser?.photo,
    // Use provided watchlist if it exists, otherwise use existing, otherwise empty array
    watchlist: user.watchlist !== undefined ? user.watchlist : (existingUser?.watchlist || []),
    preferences: user.preferences || existingUser?.preferences || {
      theme: 'dark',
      notifications: true,
      defaultView: 'grid',
    },
    createdAt: existingUser?.createdAt || new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  return newUser;
}

/**
 * Add investment to watchlist
 */
export function addToWatchlist(symbol: string): boolean {
  try {
    const user = getCurrentUser();
    if (!user) {
      // Create guest user with the symbol in watchlist
      const newUser = saveUser({ 
        email: 'guest@example.com',
        name: 'Guest User',
        watchlist: [symbol],
        preferences: {
          theme: 'dark',
          notifications: true,
          defaultView: 'grid',
        },
      });
      return newUser.watchlist.includes(symbol);
    }

    if (!user.watchlist.includes(symbol)) {
      const updatedWatchlist = [...user.watchlist, symbol];
      const updatedUser = saveUser({ ...user, watchlist: updatedWatchlist });
      return updatedUser.watchlist.includes(symbol);
    }
    return false;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
}

/**
 * Remove investment from watchlist
 */
export function removeFromWatchlist(symbol: string): boolean {
  try {
    const user = getCurrentUser();
    if (!user) return false;

    const index = user.watchlist.indexOf(symbol);
    if (index > -1) {
      const updatedWatchlist = user.watchlist.filter(s => s !== symbol);
      const updatedUser = saveUser({ ...user, watchlist: updatedWatchlist });
      return !updatedUser.watchlist.includes(symbol);
    }
    return false;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
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




