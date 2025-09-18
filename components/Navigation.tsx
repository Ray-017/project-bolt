'use client';

import { useState } from 'react';
import { Heart, Search, User, Settings, Home, MessageCircle } from 'lucide-react';
import { seedDefaultUsers } from '@/lib/seedUsers';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Discover' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'matches', icon: Heart, label: 'Matches' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="text-3xl">🧋</div>
            <h1 className="text-2xl font-bold gradient-text">Boba and Kiss</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => seedDefaultUsers()}
              className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
            >
              Add Demo Users
            </button>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-pink-300 to-purple-300 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-pink-400 hover:bg-pink-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}