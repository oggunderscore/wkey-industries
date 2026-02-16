<script>
  import { createEventDispatcher } from 'svelte';
  import { auth } from '$lib/firebase';
  import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut 
  } from 'firebase/auth';
  import { authStore } from '$lib/stores/authStore';

  export let show = false;
  
  let isLogin = true;
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  const dispatch = createEventDispatcher();

  function closeModal() {
    show = false;
    error = '';
    email = '';
    password = '';
    dispatch('close');
  }

  async function handleSubmit() {
    error = '';
    loading = true;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      closeModal();
    } catch (err) {
      error = err.message.replace('Firebase: ', '').replace(/\(auth.*\)/, '');
    } finally {
      loading = false;
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      closeModal();
    } catch (err) {
      error = err.message;
    }
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = '';
  }

</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" on:click={closeModal} role="presentation">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div class="modal" on:click|stopPropagation role="dialog" aria-modal="true" tabindex="0">
      {#if $authStore.user}
        <div class="auth-content">
          <h2>Account</h2>
          <p class="user-email">{$authStore.user.email}</p>
          <button class="btn btn-secondary" on:click={handleLogout}>
            Sign Out
          </button>
        </div>
      {:else}
        <div class="auth-content">
          <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
          
          <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
              <input
                type="email"
                placeholder="Email"
                bind:value={email}
                required
                disabled={loading}
              />
            </div>
            
            <div class="form-group">
              <input
                type="password"
                placeholder="Password"
                bind:value={password}
                required
                disabled={loading}
                minlength="6"
              />
            </div>

            {#if error}
              <p class="error">{error}</p>
            {/if}

            <button type="submit" class="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <button class="link-btn" on:click={toggleMode} disabled={loading}>
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 40px;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(168, 85, 247, 0.1);
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .auth-content h2 {
    color: var(--accent-primary);
    font-size: 1.8em;
    margin-bottom: 24px;
    font-weight: 600;
    text-align: center;
  }

  .user-email {
    color: var(--text-secondary);
    text-align: center;
    margin-bottom: 24px;
    font-size: 0.95em;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  input {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 14px 16px;
    border-radius: 8px;
    font-size: 0.95em;
    font-family: inherit;
    transition: all 0.2s ease;
    outline: none;
  }

  input:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn {
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 0.95em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-family: inherit;
    width: 100%;
  }

  .btn-primary {
    background: var(--accent-primary);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--accent-secondary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
  }

  .btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--hover-color);
    border-color: var(--accent-primary);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 0.9em;
    cursor: pointer;
    margin-top: 16px;
    padding: 8px;
    transition: color 0.2s ease;
    font-family: inherit;
  }

  .link-btn:hover:not(:disabled) {
    color: var(--accent-primary);
  }

  .error {
    color: #ef4444;
    font-size: 0.85em;
    text-align: center;
    margin: 0;
  }
</style>
