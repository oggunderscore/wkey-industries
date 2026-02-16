<script>
  import Login from '$lib/components/Login.svelte';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';

  onMount(() => {
    authStore.init();
    
    // Redirect if already logged in
    const unsubscribe = authStore.subscribe(state => {
      if (state.initialized && state.user) {
        goto('/');
      }
    });

    return unsubscribe;
  });
</script>

<Login />
