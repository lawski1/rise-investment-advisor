'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Star, Settings, LogOut, Mail, Calendar, Camera, Edit2, Save, X, UserPlus } from 'lucide-react';
import { getCurrentUser, updatePreferences, clearUserData, saveUser } from '@/lib/userData';
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setEditedName(currentUser.name || '');
    }
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
    setIsCreatingUser(true);
  };

  const handleCreateUser = () => {
    const newUser = saveUser({
      email: 'user@example.com',
      name: 'New User',
      watchlist: [],
      preferences: {
        theme: 'dark',
        notifications: true,
        defaultView: 'grid',
      },
    });
    setUser(newUser);
    setEditedName(newUser.name || '');
    setIsCreatingUser(false);
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (user) {
      const updatedUser = saveUser({ ...user, name: editedName.trim() || 'User' });
      setUser(updatedUser);
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setEditedName(user?.name || '');
    setIsEditingName(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const photoDataUrl = reader.result as string;
      const updatedUser = saveUser({ ...user, photo: photoDataUrl });
      setUser(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (user) {
      const updatedUser = saveUser({ ...user, photo: undefined });
      setUser(updatedUser);
    }
  };

  // Show create user interface if no user exists
  if (!user || isCreatingUser) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-strong p-8 border-2 border-orange-500/50">
        <div className="text-center">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500/30">
            <UserPlus className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-yellow-50 mb-2">Create Your Account</h3>
          <p className="text-gray-300 mb-6">
            Get started by creating your account to save watchlists, track investments, and personalize your experience.
          </p>
          <button
            onClick={handleCreateUser}
            className="px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Your data is stored locally in your browser
          </p>
        </div>
      </div>
    );
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
            <div className="flex items-center gap-4 mb-4">
              {/* Photo Upload Area */}
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-600/50 bg-slate-800/50 flex items-center justify-center">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-orange-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-2 border-slate-800"
                  title="Upload photo"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {user.photo && (
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-600/50 border border-slate-600/50 rounded-lg text-yellow-50 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSave();
                        if (e.key === 'Escape') handleNameCancel();
                      }}
                    />
                    <button
                      onClick={handleNameSave}
                      className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                      title="Save"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNameCancel}
                      className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-yellow-50">{user.name || 'User'}</h4>
                    <button
                      onClick={handleNameEdit}
                      className="p-1 text-gray-400 hover:text-orange-400 transition-colors"
                      title="Edit name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
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




