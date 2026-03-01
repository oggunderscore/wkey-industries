<script>
  import { auth, db } from '$lib/firebase';
  import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendEmailVerification
  } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let email = '';
  let password = '';
  let isLoading = false;
  let error = '';
  let success = '';
  let isSignUp = false;

  async function handleSubmit() {
    if (!email || !password) {
      error = 'Please enter both email and password';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }

    isLoading = true;
    error = '';
    success = '';

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document in Firestore with guest role
        if (db) {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: userCredential.user.email,
            role: 'guest',
            createdAt: new Date().toISOString()
          });
        }

        // Send verification email
        await sendEmailVerification(userCredential.user);
        
        success = 'Account created! Please check your email to verify your account before signing in.';
        email = '';
        password = '';
        isSignUp = false;
        isLoading = false;
        return;
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          error = 'Please verify your email before signing in. Check your inbox for the verification link.';
          isLoading = false;
          return;
        }

        goto('/');
      }
    } catch (err) {
      error = formatFirebaseError(err);
    } finally {
      isLoading = false;
    }
  }

  function formatFirebaseError(err) {
    const code = err.code || '';
    const message = err.message || 'An error occurred';

    const errorMap = {
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-credential': 'Incorrect email or password',
      'auth/user-not-found': 'No account found with this email',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/requires-recent-login': 'Please sign out and sign in again to perform this action',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/operation-not-allowed': 'This operation is not allowed',
      'auth/user-disabled': 'This account has been disabled'
    };

    // Clean up the message by removing brackets and Firebase prefixes
    let cleanMessage = errorMap[code] || message
      .replace('Firebase: ', '')
      .replace(/\(auth.*?\)\.?/g, '')
      .replace(/\[|\]/g, '')
      .trim();

    return cleanMessage || 'An error occurred';
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  function toggleMode() {
    isSignUp = !isSignUp;
    error = '';
    success = '';
  }

  onMount(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  });
</script>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <h1>wKey Industries</h1>
      <p>Stealth. Precision. Dominance.
</p>
    </div>

    <form class="login-form" on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          class="form-input"
          placeholder="Enter your email"
          disabled={isLoading}
        />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          class="form-input"
          placeholder="Enter your password"
          disabled={isLoading}
        />
      </div>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      {#if success}
        <div class="success-message">{success}</div>
      {/if}

      <button type="submit" class="btn btn-primary login-btn" disabled={isLoading}>
        {#if isLoading}
          <LoadingSpinner type="dots" size="small" color="var(--bg-primary)" inline={true} text={isSignUp ? "Creating account..." : "Signing in..."} />
        {:else}
          {isSignUp ? 'Create Account' : 'Sign In'}
        {/if}
      </button>

      <button type="button" class="link-btn" on:click={toggleMode} disabled={isLoading}>
        {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
      </button>
    </form>

    <div class="creator">Created by ogg_</div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    overflow: hidden;
  }

  .login-container::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(136, 85, 255, 0.15) 0%, rgba(136, 85, 255, 0.05) 40%, transparent 70%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    animation: breathe 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes breathe {
    0%, 100% {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.6;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.05);
      opacity: 0.8;
    }
  }

  .login-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 60px 50px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 20px 40px var(--shadow-color);
    position: relative;
    transition: all 0.2s ease;
    will-change: box-shadow, transform;
    z-index: 2;
  }

  .login-card:hover,
  .login-card:focus-within {
    box-shadow: 0 15px 30px var(--shadow-color), 0 0 20px rgba(136, 85, 255, 0.3);
    border-color: var(--accent-primary);
    transform: translateY(-2px);
  }

  .login-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
    opacity: 0.3;
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .login-header h1 {
    font-size: 3rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin-bottom: 12px;
    letter-spacing: 1px;
  }

  .login-header p {
    color: var(--text-secondary);
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 15px;
    font-family: inherit;
    transition: all 0.2s ease;
    outline: none;
  }

  .form-input:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(136, 85, 255, 0.1);
  }

  .form-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .form-input::placeholder {
    color: var(--text-muted);
  }

  .btn {
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 16px;
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

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .login-btn {
    margin-top: 8px;
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    margin-top: 8px;
    padding: 8px;
    transition: color 0.2s ease;
    font-family: inherit;
  }

  .link-btn:hover:not(:disabled) {
    color: var(--accent-primary);
  }

  .error-message {
    color: #ef4444;
    font-size: 14px;
    text-align: center;
    padding: 10px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 6px;
  }

  .success-message {
    color: #10b981;
    font-size: 14px;
    text-align: center;
    padding: 10px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 6px;
  }

  .creator {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.8em;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
  }

  @media (max-width: 600px) {
    .login-container {
      padding: 20px;
    }

    .login-card {
      padding: 40px 30px;
    }

    .login-header h1 {
      font-size: 2.5rem;
    }
  }
</style>
