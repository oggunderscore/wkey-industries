<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import AuthModal from '$lib/components/AuthModal.svelte';

  let showAuthModal = false;
  let mounted = false;

  onMount(() => {
    authStore.init();
    mounted = true;
  });

  const services = [
    {
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      title: 'Photos',
      description: 'Photo & Video Management',
      url: 'https://photos.wkey-industries.net',
      requiresAuth: false
    },
    {
      icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
      title: 'Cloud',
      description: 'File Storage & Collaboration',
      url: 'https://cloud.wkey-industries.net',
      requiresAuth: true
    },
    {
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      title: 'Map',
      description: 'Interactive Mapping Service',
      url: 'https://map.wkey-industries.net',
      requiresAuth: true
    }
  ];

  function handleServiceClick(service, event) {
    if (service.requiresAuth && !$authStore.user) {
      event.preventDefault();
      showAuthModal = true;
    }
  }
</script>

<main>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        <h1>WKEY Industries</h1>
        <p class="subtitle">Personal Cloud Services</p>
      </div>
      
      {#if mounted}
        <button class="auth-btn" on:click={() => showAuthModal = true}>
          {#if $authStore.loading}
            <span class="loading-dot"></span>
          {:else if $authStore.user}
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
            <span>Account</span>
          {:else}
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
            </svg>
            <span>Sign In</span>
          {/if}
        </button>
      {/if}
    </div>
    
    <div class="services">
      {#each services as service}
        <a 
          href={service.url} 
          class="service-card"
          class:locked={service.requiresAuth && !$authStore.user}
          on:click={(e) => handleServiceClick(service, e)}
        >
          <div class="card-content">
            <svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d={service.icon}/>
            </svg>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            {#if service.requiresAuth && !$authStore.user}
              <span class="lock-badge">
                <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
    
    <footer>
      <p>&copy; 2026 WKEY Industries. All rights reserved.</p>
    </footer>
  </div>
</main>

<AuthModal bind:show={showAuthModal} />

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
    padding: 48px 40px;
    max-width: 640px;
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

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    gap: 20px;
  }

  .logo-section {
    flex: 1;
  }
  
  h1 {
    color: var(--accent-primary);
    font-size: 2.5em;
    margin-bottom: 6px;
    font-weight: 700;
    letter-spacing: -1px;
    background: linear-gradient(135deg, var(--accent-primary), #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    color: var(--text-secondary);
    font-size: 1em;
    font-weight: 400;
  }

  .auth-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    white-space: nowrap;
  }

  .auth-btn:hover {
    background: var(--hover-color);
    border-color: var(--accent-primary);
    transform: translateY(-1px);
  }

  .auth-btn .icon {
    width: 18px;
    height: 18px;
  }

  .loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-primary);
    animation: blink 1.4s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  .services {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  
  .service-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0;
    border-radius: 12px;
    text-decoration: none;
    display: block;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .card-content {
    padding: 24px 28px;
    position: relative;
    z-index: 1;
  }
  
  .service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(168, 85, 247, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }
  
  .service-card:hover:not(.locked) {
    background: var(--hover-color);
    border-color: var(--accent-primary);
    box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
    transform: translateY(-2px);
  }
  
  .service-card:hover:not(.locked)::before {
    opacity: 1;
  }

  .service-card.locked {
    opacity: 0.6;
    cursor: pointer;
  }

  .service-card.locked:hover {
    opacity: 0.8;
    border-color: var(--border-color);
  }

  .service-icon {
    width: 32px;
    height: 32px;
    color: var(--accent-primary);
    margin-bottom: 12px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .service-card:hover:not(.locked) .service-icon {
    transform: scale(1.1);
  }
  
  .service-card h2 {
    font-size: 1.4em;
    margin-bottom: 6px;
    font-weight: 600;
    color: var(--text-primary);
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .service-card:hover:not(.locked) h2 {
    color: var(--accent-primary);
  }
  
  .service-card p {
    font-size: 0.9em;
    color: var(--text-secondary);
    font-weight: 400;
    margin: 0;
  }

  .lock-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    background: rgba(168, 85, 247, 0.1);
    border: 1px solid rgba(168, 85, 247, 0.3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lock-icon {
    width: 16px;
    height: 16px;
    color: var(--accent-primary);
  }
  
  footer {
    margin-top: 40px;
    color: var(--text-muted);
    font-size: 0.85em;
    font-weight: 400;
    text-align: center;
  }
  
  @media (max-width: 600px) {
    .container {
      padding: 32px 24px;
    }

    .header {
      flex-direction: column;
      align-items: stretch;
    }

    .auth-btn {
      justify-content: center;
    }
    
    h1 {
      font-size: 2em;
    }

    .subtitle {
      font-size: 0.95em;
    }
    
    .card-content {
      padding: 20px 24px;
    }

    .service-icon {
      width: 28px;
      height: 28px;
    }

    .service-card h2 {
      font-size: 1.25em;
    }
  }
</style>
