import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  GeoPoint
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from './auth';

export interface Match {
  id: string;
  user1: string;
  user2: string;
  createdAt: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
}

export interface Like {
  id: string;
  fromUser: string;
  toUser: string;
  createdAt: Date;
  isMatch: boolean;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  read: boolean;
}

// Get potential matches for a user
export const getPotentialMatches = async (currentUserId: string, preferences: any = {}) => {
  try {
    const usersRef = collection(db, 'users');
    let q = query(
      usersRef,
      where('uid', '!=', currentUserId),
      orderBy('lastActive', 'desc'),
      limit(20)
    );

    const querySnapshot = await getDocs(q);
    const profiles: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      profiles.push({
        ...data,
        createdAt: data.createdAt.toDate(),
        lastActive: data.lastActive.toDate()
      } as UserProfile);
    });
    
    return profiles;
  } catch (error) {
    console.error('Error getting potential matches:', error);
    return [];
  }
};

// Like a user
export const likeUser = async (fromUserId: string, toUserId: string) => {
  try {
    // Check if the other user already liked this user
    const likesRef = collection(db, 'likes');
    const existingLikeQuery = query(
      likesRef,
      where('fromUser', '==', toUserId),
      where('toUser', '==', fromUserId)
    );
    
    const existingLikeSnapshot = await getDocs(existingLikeQuery);
    const isMatch = !existingLikeSnapshot.empty;
    
    // Add the like
    const likeData: Omit<Like, 'id'> = {
      fromUser: fromUserId,
      toUser: toUserId,
      createdAt: new Date(),
      isMatch
    };
    
    const likeDoc = await addDoc(likesRef, likeData);
    
    // If it's a match, create a match document
    if (isMatch) {
      const matchData: Omit<Match, 'id'> = {
        user1: fromUserId,
        user2: toUserId,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'matches'), matchData);
      
      // Update the existing like to mark it as a match
      if (!existingLikeSnapshot.empty) {
        const existingLikeDoc = existingLikeSnapshot.docs[0];
        await updateDoc(existingLikeDoc.ref, { isMatch: true });
      }
    }
    
    return { likeId: likeDoc.id, isMatch };
  } catch (error) {
    console.error('Error liking user:', error);
    throw error;
  }
};

// Get user's matches
export const getUserMatches = async (userId: string) => {
  try {
    const matchesRef = collection(db, 'matches');
    const q = query(
      matchesRef,
      where('user1', '==', userId)
    );
    
    const q2 = query(
      matchesRef,
      where('user2', '==', userId)
    );
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q),
      getDocs(q2)
    ]);
    
    const matches: Match[] = [];
    
    [...snapshot1.docs, ...snapshot2.docs].forEach((doc) => {
      const data = doc.data();
      matches.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        lastMessageTime: data.lastMessageTime?.toDate()
      } as Match);
    });
    
    return matches;
  } catch (error) {
    console.error('Error getting matches:', error);
    return [];
  }
};

// Send a message
export const sendMessage = async (matchId: string, senderId: string, text: string) => {
  try {
    const messageData: Omit<Message, 'id'> = {
      matchId,
      senderId,
      text,
      createdAt: new Date(),
      read: false
    };
    
    const messageDoc = await addDoc(collection(db, 'messages'), messageData);
    
    // Update the match with last message info
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      lastMessage: text,
      lastMessageTime: new Date()
    });
    
    return messageDoc.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages for a match
export const getMessages = async (matchId: string) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('matchId', '==', matchId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as Message);
    });
    
    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Real-time listener for messages
export const subscribeToMessages = (matchId: string, callback: (messages: Message[]) => void) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('matchId', '==', matchId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as Message);
    });
    callback(messages);
  });
};

// Search users
export const searchUsers = async (searchTerm: string, currentUserId: string) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('uid', '!=', currentUserId),
      orderBy('name'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    const profiles: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const profile = {
        ...data,
        createdAt: data.createdAt.toDate(),
        lastActive: data.lastActive.toDate()
      } as UserProfile;
      
      // Filter by search term
      if (
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.interests.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        profiles.push(profile);
      }
    });
    
    return profiles;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};