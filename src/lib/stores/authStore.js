import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { auth } from '$lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function createAuthStore() {
  const { subscribe, set } = writable({
    user: null,
    loading: true,
    initialized: false
  });

  return {
    subscribe,
    init: () => {
      if (browser && auth) {
        onAuthStateChanged(auth, (user) => {
          set({ user, loading: false, initialized: true });
        });
      } else {
        set({ user: null, loading: false, initialized: true });
      }
    },
    setUser: (user) => set({ user, loading: false, initialized: true })
  };
}

export const authStore = createAuthStore();
