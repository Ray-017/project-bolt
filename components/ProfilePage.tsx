'use client';

import { useState } from 'react';
import { MapPin, Heart, Star, Camera, Edit, Coffee, Music, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/auth';
import { BobaMoodSelector } from '@/components/ui/boba-mood-selector';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile, user, refreshProfile } = useAuth();
  const [editedProfile, setEditedProfile] = useState(profile ? { ...profile } : null);
  const [currentMood, setCurrentMood] = useState<string | undefined>(undefined);

  const handleMoodSelect = async (mood: { flavor: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        ...profile,
        mood: mood.flavor
      });
      setCurrentMood(mood.flavor);
      await refreshProfile();
    } catch (error) {
      console.error('Error updating mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const interestIcons: Record<string, any> = {
    Boba: '🧋',
    Coding: '💻',
    Photography: Camera,
    Hiking: '🏔️',
    Cooking: '👨‍🍳',
    Music: Music,
    Coffee: Coffee,
    Books: BookOpen
  };

  const handleSave = async () => {
    if (!user || !editedProfile) return;
    
    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        name: editedProfile.name,
        age: editedProfile.age,
        location: editedProfile.location,
        bio: editedProfile.bio,
        interests: editedProfile.interests
      });
      
      await refreshProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div className="max-w-4xl mx-auto p-4 pt-20 text-center">Loading profile...</div>;
  }

  const currentProfile = editedProfile || profile;
  const photos = currentProfile.photos.length > 0 ? currentProfile.photos : [
    'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 pt-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-2">Your Profile</h2>
        <p className="text-gray-600">Make your profile shine! ✨</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="md:col-span-2">
          <div className="glass-effect rounded-3xl p-6 shadow-xl">
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={photos[0]}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-r from-pink-300 to-purple-300"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-pink-400 hover:bg-pink-500 rounded-full flex items-center justify-center text-white transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{currentProfile.name}, {currentProfile.age}</h3>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin size={16} />
                    <span>{currentProfile.location}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                    setEditedProfile(profile);
                  }
                }}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-2xl transition-colors"
              >
                <Edit size={16} />
                <span>{loading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}</span>
              </button>
            </div>

            {/* Bio Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">About Me</h4>
              {isEditing ? (
                <textarea
                  value={editedProfile?.bio || ''}
                  onChange={(e) => setEditedProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                  className="w-full p-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{currentProfile.bio}</p>
              )}
            </div>

            {/* Mood Section */}
            <div className="mb-6">
              <BobaMoodSelector
                currentMood={currentProfile.mood}
                onMoodSelect={handleMoodSelect}
              />
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">My Interests</h4>
              <div className="flex flex-wrap gap-3">
                {currentProfile.interests.map((interest, index) => {
                  const Icon = interestIcons[interest];
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full font-medium"
                    >
                      {Icon ? (
                        typeof Icon === 'string' ? (
                          <span className="text-lg">{Icon}</span>
                        ) : (
                          <Icon size={16} />
                        )
                      ) : (
                        <span className="text-lg">🎯</span>
                      )}
                      <span>{interest}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photo Gallery */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">My Photos</h4>
              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-2xl transition-all duration-300 flex items-center justify-center">
                      <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <div className="glass-effect rounded-3xl p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Profile Stats</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="text-pink-400" size={20} />
                  <span className="text-gray-600">Likes</span>
                </div>
                <span className="font-bold text-pink-600">127</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-400" size={20} />
                  <span className="text-gray-600">Super Likes</span>
                </div>
                <span className="font-bold text-yellow-600">23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-600">Matches</span>
                </div>
                <span className="font-bold text-purple-600">45</span>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="glass-effect rounded-3xl p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Profile Completion</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-green-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-sm text-gray-500">Add more photos to complete your profile!</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-effect rounded-3xl p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full btn-primary text-left">
                Boost Profile
              </button>
              <button className="w-full btn-secondary text-left">
                View Who Liked Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}