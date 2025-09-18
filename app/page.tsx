'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import OnboardingFlow from '@/components/OnboardingFlow';
import HomePage from '@/components/HomePage';
import ExplorePage from '@/components/ExplorePage';
import ProfilePage from '@/components/ProfilePage';
import SettingsPage from '@/components/SettingsPage';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, loading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setActiveTab('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧋</div>
          <h2 className="text-2xl font-bold gradient-text">Loading LoveBoba...</h2>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    if (!user || !hasCompletedOnboarding) {
      return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'matches':
        return (
          <div className="max-w-4xl mx-auto p-4 pt-20 text-center">
            <h2 className="text-4xl font-bold gradient-text mb-4">Your Matches</h2>
            <p className="text-gray-600">Coming soon! 💕</p>
          </div>
        );
      case 'chat':
        return (
          <div className="max-w-4xl mx-auto p-4 pt-20 text-center">
            <h2 className="text-4xl font-bold gradient-text mb-4">Messages</h2>
            <p className="text-gray-600">Start conversations with your matches! 💬</p>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <main className="min-h-screen">
      {user && hasCompletedOnboarding && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      {renderCurrentView()}
    </main>
  );
}