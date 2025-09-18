import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  photos: string[];
  createdAt: Date;
  lastActive: Date;
  isOnline: boolean;
  mood?: string;
}

export const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      name: profileData.name || '',
      age: profileData.age || 0,
      location: profileData.location || '',
      bio: profileData.bio || '',
      interests: profileData.interests || [],
      photos: profileData.photos || [],
      createdAt: new Date(),
      lastActive: new Date(),
      isOnline: true
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return { user, profile: userProfile };
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update last active and online status
    await updateDoc(doc(db, 'users', user.uid), {
      lastActive: new Date(),
      isOnline: true
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    if (auth.currentUser) {
      // Update online status before signing out
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: false,
        lastActive: new Date()
      });
    }
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        lastActive: data.lastActive.toDate()
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updates,
      lastActive: new Date()
    });
  } catch (error) {
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};