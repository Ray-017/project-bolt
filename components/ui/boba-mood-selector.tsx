'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface BobaMood {
  emoji: string;
  flavor: string;
  description: string;
  gradient: string;
  hoverGradient: string;
}

const MOODS: BobaMood[] = [
  {
    emoji: "🍓",
    flavor: "Strawberry",
    description: "I'm here to laugh, flirt, and maybe steal your hoodie.",
    gradient: "from-pink-200 to-red-200",
    hoverGradient: "from-pink-300 to-red-300"
  },
  {
    emoji: "🍵",
    flavor: "Matcha",
    description: "Vibing slow today, let's keep it lowkey.",
    gradient: "from-green-200 to-emerald-200",
    hoverGradient: "from-green-300 to-emerald-300"
  },
  {
    emoji: "☕",
    flavor: "Coffee",
    description: "Busy bee but still open for good convo.",
    gradient: "from-amber-200 to-brown-200",
    hoverGradient: "from-amber-300 to-brown-300"
  },
  {
    emoji: "🍫",
    flavor: "Chocolate",
    description: "In my soft era, looking for someone to share warmth with.",
    gradient: "from-amber-200 to-yellow-200",
    hoverGradient: "from-amber-300 to-yellow-300"
  },
  {
    emoji: "🫐",
    flavor: "Blueberry",
    description: "Down for random plans and midnight chats.",
    gradient: "from-blue-200 to-indigo-200",
    hoverGradient: "from-blue-300 to-indigo-300"
  },
  {
    emoji: "🥭",
    flavor: "Mango",
    description: "I know what I want and I'm not afraid to say it.",
    gradient: "from-orange-200 to-yellow-200",
    hoverGradient: "from-orange-300 to-yellow-300"
  },
  {
    emoji: "🍋",
    flavor: "Lemon",
    description: "Full of zest today — try to keep up😉.",
    gradient: "from-yellow-200 to-lime-200",
    hoverGradient: "from-yellow-300 to-lime-300"
  },
  {
    emoji: "🍑",
    flavor: "Peach",
    description: "Soft, gentle vibes — let's talk about everything and nothing.",
    gradient: "from-orange-200 to-rose-200",
    hoverGradient: "from-orange-300 to-rose-300"
  },
  {
    emoji: "🌈",
    flavor: "Rainbow Jelly",
    description: "Exploring, experimenting, seeing where things go.",
    gradient: "from-purple-200 via-pink-200 to-blue-200",
    hoverGradient: "from-purple-300 via-pink-300 to-blue-300"
  },
  {
    emoji: "🥥",
    flavor: "Coconut",
    description: "Hard shell, soft inside — can you crack me open?",
    gradient: "from-neutral-200 to-zinc-200",
    hoverGradient: "from-neutral-300 to-zinc-300"
  }
];

export interface BobaMoodSelectorProps {
  currentMood?: string;
  onMoodSelect: (mood: BobaMood) => void;
}

export function BobaMoodSelector({ currentMood, onMoodSelect }: BobaMoodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentMoodData = MOODS.find(m => m.flavor === currentMood);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Mood Display */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {/* Cute Boba Cup */}
              <div className="w-12 h-16 relative">
                <div className="absolute inset-x-0 top-2 bottom-0 bg-white/90 rounded-xl shadow-inner">
                  <div className={`absolute inset-x-1 top-1 bottom-4 rounded-lg bg-gradient-to-br 
                    ${currentMoodData?.gradient || 'from-gray-200 to-gray-300'} opacity-80`}
                  />
                  <div className="absolute inset-x-2 bottom-1 flex justify-around">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-black/70" />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-x-1 top-0 h-4 bg-white/90 rounded-t-lg shadow-sm" />
                <div className="absolute left-1/2 top-1 -translate-x-1/2 w-2 h-12 bg-white/90 rounded-full transform -rotate-3" />
              </div>
              
              {/* Current Mood Emoji */}
              <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <span className="text-sm">{currentMoodData?.emoji || '🧋'}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-600">Today's Mood</div>
              <div className="font-semibold">
                {currentMoodData?.flavor || 'Select your mood'}
              </div>
            </div>
          </div>
          
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 py-2 bg-white rounded-2xl shadow-xl z-50 border border-gray-100 max-h-[400px] overflow-y-auto animate-slideDown">
          <div className="p-2 grid grid-cols-2 gap-2">
            {MOODS.map((mood) => (
              <div
                key={mood.flavor}
                onClick={() => {
                  onMoodSelect(mood);
                  setIsOpen(false);
                }}
                className={`relative group cursor-pointer p-3 rounded-xl transition-all duration-200
                  ${currentMood === mood.flavor 
                    ? 'bg-gradient-to-br ' + mood.gradient + ' shadow-md scale-105' 
                    : 'hover:bg-gray-50 hover:scale-102'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200">
                    {mood.emoji}
                  </span>
                  <span className={`font-medium ${currentMood === mood.flavor ? 'text-white' : 'text-gray-700'}`}>
                    {mood.flavor}
                  </span>
                </div>
                <p className={`text-xs mt-1 line-clamp-2 ${currentMood === mood.flavor ? 'text-white/90' : 'text-gray-500'}`}>
                  {mood.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
