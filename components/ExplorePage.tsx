'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Heart, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPotentialMatches, searchUsers, likeUser } from '@/lib/firestore';
import { UserProfile } from '@/lib/auth';

const calculateCompatibility = (user1: UserProfile, user2: UserProfile) => {
  const commonInterests = user1.interests.filter(interest => 
    user2.interests.includes(interest)
  ).length;
  
  const totalInterests = Math.max(user1.interests.length, user2.interests.length);
  const baseCompatibility = totalInterests > 0 ? (commonInterests / totalInterests) * 100 : 50;
  
  // Add some randomness for variety
  const randomFactor = Math.random() * 20 - 10; // -10 to +10
  return Math.max(60, Math.min(99, Math.round(baseCompatibility + randomFactor)));
};

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const { user, profile } = useAuth();

  useEffect(() => {
    const loadProfiles = async () => {
      if (user) {
        try {
          let results: UserProfile[] = [];
          
          if (searchQuery.trim()) {
            results = await searchUsers(searchQuery, user.uid);
          } else {
            results = await getPotentialMatches(user.uid);
          }
          
          setProfiles(results);
        } catch (error) {
          console.error('Error loading profiles:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfiles();
  }, [user, searchQuery]);

  const handleLike = async (targetUserId: string) => {
    if (!user || likedProfiles.has(targetUserId)) return;
    
    try {
      await likeUser(user.uid, targetUserId);
      setLikedProfiles(prev => new Set([...prev, targetUserId]));
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-4 pt-20 text-center">Loading profiles...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pt-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-2">Explore & Discover</h2>
        <p className="text-gray-600">Find amazing people near you</p>
      </div>

      {/* Search and Filters */}
      <div className="glass-effect rounded-2xl p-4 mb-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or interests..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-2xl transition-colors"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {['all', 'nearby', 'online', 'new'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-2xl transition-colors capitalize ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Star className="text-yellow-400 mr-2" />
          Recommended for You
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {profiles.slice(0, 3).map(userProfile => {
            const compatibility = profile ? calculateCompatibility(profile, userProfile) : 85;
            const isLiked = likedProfiles.has(userProfile.uid);
            
            return (
            <div
              key={userProfile.uid}
              className="glass-effect rounded-3xl overflow-hidden shadow-xl card-hover"
            >
              <div className="relative">
                <img
                  src={userProfile.photos[0] || 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={userProfile.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {compatibility}% Match
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass-effect rounded-2xl p-3">
                    <h4 className="text-white font-bold text-lg">{userProfile.name}, {userProfile.age}</h4>
                    <div className="flex items-center text-white/80 text-sm">
                      <MapPin size={14} />
                      <span className="ml-1">{userProfile.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {userProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleLike(userProfile.uid)}
                    disabled={isLiked}
                    className={`flex-1 ${isLiked ? 'bg-gray-300 text-gray-500' : 'btn-primary'}`}
                  >
                    <Heart size={16} className="mr-2" />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button className="flex-1 btn-secondary">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>

      {/* Browse All */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Browse All</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {profiles.map(userProfile => {
            const compatibility = profile ? calculateCompatibility(profile, userProfile) : 85;
            const isLiked = likedProfiles.has(userProfile.uid);
            
            return (
            <div
              key={userProfile.uid}
              className="glass-effect rounded-2xl overflow-hidden shadow-lg card-hover"
            >
              <div className="relative">
                <img
                  src={userProfile.photos[0] || 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={userProfile.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {compatibility}%
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-sm text-gray-800">{userProfile.name}, {userProfile.age}</h4>
                <div className="flex items-center text-gray-500 text-xs mb-2">
                  <MapPin size={10} />
                  <span className="ml-1">{userProfile.location}</span>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleLike(userProfile.uid)}
                    disabled={isLiked}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs transition-colors ${
                      isLiked 
                        ? 'bg-gray-200 text-gray-500' 
                        : 'bg-pink-100 hover:bg-pink-200 text-pink-600'
                    }`}
                  >
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-600 py-1 px-2 rounded-lg text-xs transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}