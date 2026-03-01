<script>
  import { createEventDispatcher } from 'svelte';
  import { auth } from '$lib/firebase';
  import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification
  } from 'firebase/auth';
  import { authStore } from '$lib/stores/authStore';

  export let show = false;
  
  let isLogin = true;
  let email = '';
  let password = '';
  let error = '';
  let success = '';
  let loading = false;
  
  // Account update fields
  let showUpdateEmail = false;
  let showUpdatePassword = false;
  let newEmail = '';
  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';

  const dispatch = createEventDispatcher();

  function closeModal() {
    show = false;
    resetForm();
    dispatch('close');
  }

  function resetForm() {
    error = '';
    success = '';
    email = '';
    password = '';
    newEmail = '';
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    showUpdateEmail = false;
    showUpdatePassword = false;
  }

  async function handleSubmit() {
    error = '';
    loading = true;

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          error = 'Please verify your email before signing in. Check your inbox for the verification link.';
          await signOut(auth);
          loading = false;
          return;
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Send verification email
        await sendEmailVerification(userCredential.user);
        
        // Sign out immediately after signup
        await signOut(auth);
        
        success = 'Account created! Please check your email to verify your account before signing in.';
        email = '';
        password = '';
        isLogin = true;
        loading = false;
        return;
      }
      closeModal();
    } catch (err) {
      error = formatFirebaseError(err);
    } finally {
      loading = false;
    }
  }

  async function handleUpdateEmail() {
    if (!newEmail || !currentPassword) {
      error = 'Please fill in all fields';
      return;
    }

    error = '';
    success = '';
    loading = true;

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      
      success = 'Email updated successfully';
      newEmail = '';
      currentPassword = '';
      showUpdateEmail = false;
    } catch (err) {
      error = formatFirebaseError(err);
    } finally {
      loading = false;
    }
  }

  async function handleUpdatePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }

    if (newPassword.length < 6) {
      error = 'New password must be at least 6 characters';
      return;
    }

    if (newPassword !== confirmPassword) {
      error = 'New passwords do not match';
      return;
    }

    error = '';
    success = '';
    loading = true;

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      // Sign out user after password change
      await signOut(auth);
      closeModal();
    } catch (err) {
      error = formatFirebaseError(err);
      loading = false;
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      closeModal();
    } catch (err) {
      error = formatFirebaseError(err);
    }
  }

  function formatFirebaseError(err) {
    const code = err.code || '';
    const message = err.message || 'An error occurred';

    // Map Firebase error codes to user-friendly messages
    const errorMap = {
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-credential': 'Incorrect password',
      'auth/user-not-found': 'User not found',
      'auth/email-already-in-use': 'Email is already in use',
      'auth/invalid-email': 'Invalid email address',
      'auth/weak-password': 'Password is too weak',
      'auth/requires-recent-login': 'Please sign out and sign in again to perform this action',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection'
    };

    // Clean up the message by removing brackets and Firebase prefixes
    let cleanMessage = errorMap[code] || message
      .replace('Firebase: ', '')
      .replace(/\(auth.*?\)\.?/g, '')
      .replace(/\[|\]/g, '')
      .trim();

    return cleanMessage || 'An error occurred';
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = '';
  }

  function toggleUpdateEmail() {
    showUpdateEmail = !showUpdateEmail;
    showUpdatePassword = false;
    error = '';
    success = '';
  }

  function toggleUpdatePassword() {
    showUpdatePassword = !showUpdatePassword;
    showUpdateEmail = false;
    error = '';
    success = '';
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

          {#if success}
            <p class="success">{success}</p>
          {/if}

          {#if error}
            <p class="error">{error}</p>
          {/if}

          {#if !showUpdateEmail && !showUpdatePassword}
            <div class="account-actions">
              <button class="btn btn-secondary" on:click={toggleUpdateEmail}>
                Update Email
              </button>
              <button class="btn btn-secondary" on:click={toggleUpdatePassword}>
                Update Password
              </button>
              <button class="btn btn-secondary logout-btn" on:click={handleLogout}>
                Sign Out
              </button>
            </div>
          {/if}

          {#if showUpdateEmail}
            <form on:submit|preventDefault={handleUpdateEmail} class="update-form">
              <h3>Update Email</h3>
              <div class="form-group">
                <input
                  type="email"
                  placeholder="New email address"
                  bind:value={newEmail}
                  required
                  disabled={loading}
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  placeholder="Current password"
                  bind:value={currentPassword}
                  required
                  disabled={loading}
                />
              </div>
              <div class="button-group">
                <button type="submit" class="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Email'}
                </button>
                <button type="button" class="btn btn-secondary" on:click={toggleUpdateEmail} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          {/if}

          {#if showUpdatePassword}
            <form on:submit|preventDefault={handleUpdatePassword} class="update-form">
              <h3>Update Password</h3>
              <div class="form-group">
                <input
                  type="password"
                  placeholder="Current password"
                  bind:value={currentPassword}
                  required
                  disabled={loading}
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  placeholder="New password (min 6 characters)"
                  bind:value={newPassword}
                  required
                  disabled={loading}
                  minlength="6"
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  placeholder="Confirm new password"
                  bind:value={confirmPassword}
                  required
                  disabled={loading}
                />
              </div>
              <div class="button-group">
                <button type="submit" class="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button type="button" class="btn btn-secondary" on:click={toggleUpdatePassword} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          {/if}
        </div>
      {:else}
        <div class="auth-content">
          <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
          
          {#if success}
            <p class="success">{success}</p>
          {/if}
          
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
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(136, 85, 255, 0.1);
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
    box-shadow: 0 0 0 3px rgba(136, 85, 255, 0.1);
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
    box-shadow: 0 4px 12px rgba(136, 85, 255, 0.4);
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
    margin: 0 0 16px 0;
    padding: 10px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 6px;
  }

  .success {
    color: #10b981;
    font-size: 0.85em;
    text-align: center;
    margin: 0 0 16px 0;
    padding: 10px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 6px;
  }

  .account-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .logout-btn {
    margin-top: 8px;
    border-color: rgba(239, 68, 68, 0.3);
  }

  .logout-btn:hover:not(:disabled) {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  .update-form {
    margin-top: 16px;
  }

  .update-form h3 {
    color: var(--text-primary);
    font-size: 1.1em;
    margin-bottom: 16px;
    font-weight: 500;
  }

  .button-group {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }

  .button-group .btn {
    flex: 1;
  }
</style>
