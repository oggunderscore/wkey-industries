<script>
  import { page } from '$app/stores';
  
  $: status = $page.status;
  $: message = $page.error?.message || 'An unexpected error occurred';
</script>

<main>
  <div class="container">
    <div class="error-content">
      <div class="error-icon">
        {#if status === 404}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        {/if}
      </div>
      
      <h1>{status}</h1>
      
      <h2>
        {#if status === 404}
          Page Not Found
        {:else if status === 500}
          Internal Server Error
        {:else}
          Something Went Wrong
        {/if}
      </h2>
      
      <p class="error-message">{message}</p>
      
      <a href="/" class="home-button">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Back to Home
      </a>
    </div>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  main::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
    animation: pulse 8s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
  
  .container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 60px 40px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(168, 85, 247, 0.1);
    position: relative;
    z-index: 1;
    animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .error-content {
    text-align: center;
  }

  .error-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    color: var(--accent-primary);
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .error-icon svg {
    width: 100%;
    height: 100%;
  }

  h1 {
    font-size: 4em;
    font-weight: 700;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--accent-primary), #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -2px;
  }

  h2 {
    font-size: 1.8em;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
  }

  .error-message {
    color: var(--text-secondary);
    font-size: 1em;
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .home-button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--accent-primary);
    color: white;
    padding: 14px 28px;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1em;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
  }

  .home-button:hover {
    background: #9333ea;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
  }

  .home-button .icon {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 600px) {
    .container {
      padding: 40px 24px;
    }

    h1 {
      font-size: 3em;
    }

    h2 {
      font-size: 1.5em;
    }

    .error-icon {
      width: 60px;
      height: 60px;
    }
  }
</style>
