'use client';

import { useState } from 'react';
import { Heart, ArrowRight, ArrowLeft, Coffee, Music, Camera, BookOpen } from 'lucide-react';
import { signUp } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    interests: [] as string[],
    bio: '',
    location: ''
  });
  const { refreshProfile } = useAuth();

  const interests = [
    { id: 'coffee', icon: Coffee, label: 'Coffee Dates' },
    { id: 'music', icon: Music, label: 'Music Lover' },
    { id: 'photography', icon: Camera, label: 'Photography' },
    { id: 'reading', icon: BookOpen, label: 'Book Worm' },
    { id: 'boba', icon: '🧋', label: 'Boba Addict' },
    { id: 'travel', icon: '✈️', label: 'Travel Bug' },
    { id: 'foodie', icon: '🍜', label: 'Foodie' },
    { id: 'fitness', icon: '💪', label: 'Fitness' }
  ];

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        age: parseInt(formData.age),
        location: formData.location,
        bio: formData.bio,
        interests: formData.interests,
        photos: [
          'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
      });
      
      await refreshProfile();
      onComplete();
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Welcome to LoveBoba! 💕',
      subtitle: 'Let\'s find your perfect match',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </div>
      )
    },
    {
      title: 'Tell us about yourself',
      subtitle: 'Help others get to know you',
      content: (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
      )
    },
    {
      title: 'What are you passionate about?',
      subtitle: 'Select your interests (choose at least 3)',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {interests.map((interest) => {
            const Icon = typeof interest.icon === 'string' ? null : interest.icon;
            const isSelected = formData.interests.includes(interest.id);
            return (
              <button
                key={interest.id}
                onClick={() => {
                  const newInterests = isSelected
                    ? formData.interests.filter(i => i !== interest.id)
                    : [...formData.interests, interest.id];
                  setFormData({ ...formData, interests: newInterests });
                }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-green-400 bg-green-100 scale-105 shadow-lg'
                    : 'border-green-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="text-center">
                  {Icon ? <Icon size={32} className="mx-auto mb-2 text-green-600" /> : 
                   <div className="text-3xl mb-2">{interest.icon}</div>}
                  <div className="text-sm font-medium text-gray-700">{interest.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      )
    },
    {
      title: 'Write a cute bio 📝',
      subtitle: 'Share something fun about yourself',
      content: (
        <div className="space-y-4">
          <textarea
            placeholder="Tell everyone what makes you special! Maybe your favorite boba order? 🧋"
            rows={6}
            className="w-full p-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors resize-none"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
          <div className="text-right text-sm text-gray-500">
            {formData.bio.length}/300
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleSignUp();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              {Array.from({ length: steps.length }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <h2 className="text-3xl font-bold mb-2 gradient-text">
              {steps[step].title}
            </h2>
            <p className="text-gray-600 text-lg">{steps[step].subtitle}</p>
          </div>

          <div className="mb-8">
            {steps[step].content}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                step === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-pink-400 hover:bg-pink-50'
              }`}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            
            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center space-x-2 btn-primary"
            >
              <span>
                {loading ? 'Creating Account...' : step === steps.length - 1 ? 'Get Started!' : 'Continue'}
              </span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}