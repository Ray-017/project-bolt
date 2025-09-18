import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { UserProfile } from './auth';

const defaultUsers: Partial<UserProfile>[] = [
  {
    name: "Mochi",
    age: 23,
    location: "San Francisco",
    bio: "Boba enthusiast 🧋 | Looking for someone to share bubble tea adventures with!",
    interests: ["Boba tea", "Anime", "Photography", "Coffee shops", "Art"],
    photos: [
      "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1382730/pexels-photo-1382730.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    isOnline: true
  },
  {
    name: "Taro",
    age: 25,
    location: "Los Angeles",
    bio: "Professional boba taster 😋 | Let's find our favorite boba shop together!",
    interests: ["Cooking", "Travel", "Music", "Boba", "Movies"],
    photos: [
      "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2269873/pexels-photo-2269873.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2269874/pexels-photo-2269874.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    isOnline: true
  },
  {
    name: "Matcha",
    age: 24,
    location: "Seattle",
    bio: "Green tea lover 💚 | Searching for my boba soulmate",
    interests: ["Tea ceremony", "Hiking", "Reading", "Yoga", "Boba"],
    photos: [
      "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1858174/pexels-photo-1858174.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1858176/pexels-photo-1858176.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    isOnline: false
  },
  {
    name: "Pearl",
    age: 26,
    location: "New York",
    bio: "Sweet like brown sugar boba 🧋✨ | Let's share some boba and stories!",
    interests: ["Dancing", "Food", "Fashion", "Boba", "Travel"],
    photos: [
      "https://images.pexels.com/photos/1821095/pexels-photo-1821095.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1821096/pexels-photo-1821096.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1821097/pexels-photo-1821097.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    isOnline: true
  },
  {
    name: "Jasmine",
    age: 22,
    location: "Chicago",
    bio: "Tea connoisseur 🍵 | Looking for someone to explore new boba cafes with",
    interests: ["Photography", "Art", "Music", "Boba", "Cats"],
    photos: [
      "https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1898556/pexels-photo-1898556.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1898557/pexels-photo-1898557.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    isOnline: false
  }
];

export const seedDefaultUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    
    for (const userData of defaultUsers) {
      const userId = Math.random().toString(36).substr(2, 9);
      const userDoc = doc(usersCollection, userId);
      
      await setDoc(userDoc, {
        ...userData,
        uid: userId,
        email: `${userData.name?.toLowerCase()}@example.com`,
        createdAt: new Date(),
        lastActive: new Date()
      });
    }
    
    console.log('Default users added successfully!');
  } catch (error) {
    console.error('Error adding default users:', error);
  }
};
