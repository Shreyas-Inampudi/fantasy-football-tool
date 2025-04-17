import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection references
const playersCollection = collection(db, 'players');
const statsCollection = collection(db, 'player_stats');

// Player operations
export const addPlayer = async (playerData) => {
  try {
    const docRef = await addDoc(playersCollection, {
      ...playerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

export const getPlayer = async (playerId) => {
  try {
    const q = query(playersCollection, where('id', '==', playerId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('Error getting player:', error);
    throw error;
  }
};

// Stats operations
export const addPlayerStats = async (statsData) => {
  try {
    const docRef = await addDoc(statsCollection, {
      ...statsData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding player stats:', error);
    throw error;
  }
};

export const getPlayerStats = async (playerId, year) => {
  try {
    const q = query(
      statsCollection,
      where('playerId', '==', playerId),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('Error getting player stats:', error);
    throw error;
  }
};

export const updatePlayerStats = async (statsId, statsData) => {
  try {
    const statsRef = doc(db, 'player_stats', statsId);
    await updateDoc(statsRef, {
      ...statsData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw error;
  }
};

// Batch operations
export const importPlayerStats = async (statsArray) => {
  try {
    const batch = [];
    for (const stats of statsArray) {
      batch.push(addPlayerStats(stats));
    }
    await Promise.all(batch);
  } catch (error) {
    console.error('Error importing player stats:', error);
    throw error;
  }
};

// Search operations
export const searchPlayers = async (searchTerm) => {
  try {
    const q = query(
      playersCollection,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching players:', error);
    throw error;
  }
};

export const getPlayersByTeam = async (teamId) => {
  try {
    const q = query(playersCollection, where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting players by team:', error);
    throw error;
  }
}; 