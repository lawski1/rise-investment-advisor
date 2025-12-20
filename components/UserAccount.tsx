'use client';

import { useState, useEffect } from 'react';
import { User, Star, Settings, LogOut, Mail, Calendar } from 'lucide-react';
import { getCurrentUser, updatePreferences, clearUserData } from '@/lib/userData';
import { User as UserType } from '@/lib/userData';
import WatchlistPanel from './WatchlistPanel';
import { Investment } from '@/lib/types';

interface UserAccountProps {
  investments: Investment[];
}

export default function UserAccount({ investments }: UserAccountProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'watchlist' | 'settings'>('profile');

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handlePreferenceChange = (key: keyof UserType['preferences'], value: any) => {
    if (user) {
      updatePreferences({ [key]: value });
      setUser({ ...user, preferences: { ...user.preferences, [key]: value } });
    }
  };

  const handleLogout = () => {
    clearUserData();
    setUser(null);
    window.location.reload();
  };

  if (!user) {
    // Guest mode - create guest user
    const guestUser = {
      id: `guest_${Date.now()}`,
      email: 'guest@example.com',
      name: 'Guest User',
      watchlist: [],
      preferences: {
        theme: 'dark' as const,
        notifications: true,
        defaultView: 'grid' as const,
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setUser(guestUser);
    return null;
  }

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-yellow-50 flex items-center gap-2">
          <User className="w-6 h-6 text-orange-400" />
          My Account
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700/50">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'text-orange-400 border-b-2 border-orange-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'watchlist'
              ? 'text-orange-400 border-b-2 border-orange-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Watchlist
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'settings'
              ? 'text-orange-400 border-b-2 border-orange-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/30">
                <User className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-yellow-50">{user.name || 'Guest User'}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Member Since</p>
                <p className="text-yellow-50 font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Last Login</p>
                <p className="text-yellow-50 font-semibold">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Watchlist Items</p>
                <p className="text-yellow-50 font-semibold">{user.watchlist.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Watchlist Tab */}
      {activeTab === 'watchlist' && (
        <WatchlistPanel investments={investments} />
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
            <h4 className="text-lg font-semibold text-yellow-50 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-400" />
              Preferences
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                <select
                  value={user.preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-600/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default View</label>
                <select
                  value={user.preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-600/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Email Notifications</label>
                <button
                  onClick={() => handlePreferenceChange('notifications', !user.preferences.notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    user.preferences.notifications ? 'bg-orange-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      user.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 border border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            Clear Data / Logout
          </button>
        </div>
      )}
    </div>
  );
}




