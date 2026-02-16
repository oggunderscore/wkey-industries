import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { db } from '$lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { authStore } from './authStore';

function createUserStore() {
  const { subscribe, set } = writable({
    role: null,
    loading: true,
    error: null
  });

  let unsubscribeSnapshot = null;

  return {
    subscribe,
    init: (userId) => {
      if (!browser || !db || !userId) {
        set({ role: null, loading: false, error: null });
        return;
      }

      try {
        const userRef = doc(db, 'users', userId);
        
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            set({ role: data.role || 'guest', loading: false, error: null });
          } else {
            set({ role: 'guest', loading: false, error: null });
          }
        }, (error) => {
          console.error('Error fetching user role:', error);
          set({ role: null, loading: false, error: error.message });
        });
      } catch (error) {
        console.error('Error initializing user store:', error);
        set({ role: null, loading: false, error: error.message });
      }
    },
    cleanup: () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }
      set({ role: null, loading: true, error: null });
    }
  };
}

export const userStore = createUserStore();

export const isAdmin = derived(
  userStore,
  $userStore => $userStore.role === 'admin'
);

export async function createUserDocument(userId, email) {
  if (!browser || !db) return;

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email,
        role: 'guest',
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}
