'use client';

import { useState, useEffect } from 'react';
import { Heart, X, Star, MapPin, Clock, Coffee } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getPotentialMatches, likeUser } from '@/lib/firestore';
import { UserProfile } from '@/lib/auth';

const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }
};

export default function HomePage() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadProfiles = async () => {
      if (user) {
        try {
          const potentialMatches = await getPotentialMatches(user.uid);
          setProfiles(potentialMatches);
        } catch (error) {
          console.error('Error loading profiles:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfiles();
  }, [user]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    const currentProfile = profiles[currentCard];
    if (!currentProfile || !user) return;
    
    setIsAnimating(true);
    const card = document.getElementById(`card-${currentCard}`);
    if (card) {
      card.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right');
    }
    
    // Handle like action
    if (direction === 'right') {
      try {
        const result = await likeUser(user.uid, currentProfile.uid);
        if (result.isMatch) {
          setShowMatch(true);
          setTimeout(() => setShowMatch(false), 3000);
        }
      } catch (error) {
        console.error('Error liking user:', error);
      }
    }
    
    setTimeout(() => {
      setCurrentCard(prev => prev + 1);
      setIsAnimating(false);
    }, 500);
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-4 pt-20 text-center">Loading amazing people...</div>;
  }

  const currentProfile = profiles[currentCard];

  return (
    <div className="max-w-6xl mx-auto p-4 pt-20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Discover Amazing People</h2>
        <p className="text-gray-600 text-lg">Swipe right to like, left to pass</p>
      </div>

      {showMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-effect rounded-3xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">💕</div>
            <h3 className="text-3xl font-bold gradient-text mb-2">It's a Match!</h3>
            <p className="text-gray-600">You and {currentProfile?.name} liked each other!</p>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        {currentProfile ? (
        <div className="relative">
          {/* Card Stack Effect */}
          <div className="absolute inset-0 glass-effect rounded-3xl transform rotate-1 scale-95 opacity-50"></div>
          <div className="absolute inset-0 glass-effect rounded-3xl transform -rotate-1 scale-97 opacity-75"></div>
          
          {/* Main Card */}
          <div
            id={`card-${currentCard}`}
            className="relative w-96 glass-effect rounded-3xl overflow-hidden shadow-2xl card-hover"
          >
            <div className="relative">
              <img
                src={currentProfile.photos[0] || 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={currentProfile.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 glass-effect px-3 py-1 rounded-full">
                <div className={`flex items-center space-x-1 ${currentProfile.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${currentProfile.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium">{currentProfile.isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-bold text-gray-800">{currentProfile.name}</h3>
                  <span className="text-xl text-gray-600">{currentProfile.age}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin size={16} />
                  <span className="text-sm">{currentProfile.location}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{currentProfile.bio}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {currentProfile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500 mb-6">
                <Clock size={14} />
                <span className="text-sm">Active {getTimeAgo(currentProfile.lastActive)}</span>
              </div>
            </div>
          </div>
        </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold gradient-text mb-2">No more profiles!</h3>
            <p className="text-gray-600">Check back later for more amazing people to discover!</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {currentProfile && (
      <div className="flex justify-center space-x-6 mt-8">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          disabled={isAnimating}
        >
          <X size={24} className="text-gray-600" />
        </button>
        
        <button
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl pulse-heart"
          disabled={isAnimating}
        >
          <Heart size={28} className="text-white" fill="currentColor" />
        </button>
        
        <button
          className="w-16 h-16 bg-gradient-to-r from-yellow-300 to-orange-300 hover:from-yellow-400 hover:to-orange-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          disabled={isAnimating}
        >
          <Star size={24} className="text-white" />
        </button>
      </div>
      )}
    </div>
  );
}