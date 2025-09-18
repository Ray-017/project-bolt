'use client';

import { useState } from 'react';
import { Shield, Bell, Eye, Heart, MapPin, Trash2, HelpCircle, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      matches: true,
      messages: true,
      likes: false,
      marketing: false
    },
    privacy: {
      showAge: true,
      showDistance: true,
      showOnline: true,
      incognito: false
    },
    preferences: {
      ageRange: [22, 30],
      maxDistance: 25,
      showMe: 'everyone'
    }
  });

  const [showReportModal, setShowReportModal] = useState(false);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-2">Settings</h2>
        <p className="text-gray-600">Customize your LoveBoba experience</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="glass-effect rounded-3xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="text-pink-400" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-700 capitalize">
                  {key === 'marketing' ? 'Marketing Emails' : key}
                </label>
                <button
                  onClick={() => updateSetting('notifications', key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="glass-effect rounded-3xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Eye className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Privacy</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-700">
                  {key === 'showAge' && 'Show My Age'}
                  {key === 'showDistance' && 'Show Distance'}
                  {key === 'showOnline' && 'Show Online Status'}
                  {key === 'incognito' && 'Incognito Mode'}
                </label>
                <button
                  onClick={() => updateSetting('privacy', key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-gradient-to-r from-green-400 to-blue-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dating Preferences */}
        <div className="glass-effect rounded-3xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Heart className="text-red-400" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Dating Preferences</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Age Range</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="18"
                  max="50"
                  value={settings.preferences.ageRange[0]}
                  onChange={(e) => updateSetting('preferences', 'ageRange', [parseInt(e.target.value), settings.preferences.ageRange[1]])}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-16">
                  {settings.preferences.ageRange[0]} - {settings.preferences.ageRange[1]}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Maximum Distance</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.preferences.maxDistance}
                  onChange={(e) => updateSetting('preferences', 'maxDistance', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-16">
                  {settings.preferences.maxDistance} mi
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Show Me</label>
              <select
                value={settings.preferences.showMe}
                onChange={(e) => updateSetting('preferences', 'showMe', e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
              >
                <option value="everyone">Everyone</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="glass-effect rounded-3xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="text-green-400" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Account & Safety</h3>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setShowReportModal(true)}
              className="w-full flex items-center space-x-3 p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-2xl transition-colors"
            >
              <Shield size={20} />
              <span>Report a User</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl transition-colors">
              <HelpCircle size={20} />
              <span>Help & Support</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl transition-colors">
              <Trash2 size={20} />
              <span>Delete Account</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl transition-colors">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Report a User</h3>
            <p className="text-gray-600 mb-6">
              Help us keep Boba and Kiss safe by reporting inappropriate behavior.
            </p>
            
            <div className="space-y-3 mb-6">
              {[
                'Inappropriate photos',
                'Harassment or bullying',
                'Spam or scam',
                'Fake profile',
                'Other'
              ].map(reason => (
                <button
                  key={reason}
                  className="w-full text-left p-3 hover:bg-pink-50 rounded-2xl transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 btn-primary"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}