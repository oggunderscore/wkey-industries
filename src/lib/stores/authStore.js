import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { auth } from '$lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function createAuthStore() {
  const { subscribe, set } = writable({
    user: null,
    loading: true,
    initialized: false,
    error: null
  });

  return {
    subscribe,
    init: () => {
      if (browser && auth) {
        try {
          onAuthStateChanged(auth, (user) => {
            set({ user, loading: false, initialized: true, error: null });
          }, (error) => {
            console.error('Auth state change error:', error);
            set({ user: null, loading: false, initialized: true, error: error.message });
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ user: null, loading: false, initialized: true, error: error.message });
        }
      } else {
        set({ user: null, loading: false, initialized: true, error: null });
      }
    },
    setUser: (user) => set({ user, loading: false, initialized: true, error: null })
  };
}

export const authStore = createAuthStore();
