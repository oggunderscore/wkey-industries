<script>
  export let size = 'medium';
  export let type = 'dots';
  export let color = 'var(--accent-primary)';
  export let text = '';
  export let inline = false;

  const sizeClasses = {
    small: 'loading-small',
    medium: 'loading-medium',
    large: 'loading-large'
  };

  const typeClasses = {
    spinner: 'loading-spinner',
    dots: 'loading-dots',
    pulse: 'loading-pulse',
    bars: 'loading-bars'
  };
</script>

<div class="loading-container" class:inline>
  <div class="loading {sizeClasses[size]} {typeClasses[type]}" style="--loading-color: {color}">
    {#if type === 'spinner'}
      <div class="spinner-circle"></div>
    {:else if type === 'dots'}
      <div class="dots-container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    {:else if type === 'pulse'}
      <div class="pulse-circle"></div>
    {:else if type === 'bars'}
      <div class="bars-container">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    {/if}
  </div>
  {#if text}
    <div class="loading-text">{text}</div>
  {/if}
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px;
    justify-content: center;
  }

  .loading-container.inline {
    flex-direction: row;
    padding: 0;
    gap: 8px;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--loading-color);
  }

  .loading-small {
    width: 20px;
    height: 20px;
  }

  .loading-medium {
    width: 32px;
    height: 32px;
  }

  .loading-large {
    width: 48px;
    height: 48px;
  }

  .loading-spinner .spinner-circle {
    width: 100%;
    height: 100%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-top: 2px solid var(--loading-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-dots .dots-container {
    display: flex;
    gap: 4px;
    align-items: center;
    height: 100%;
  }

  .loading-dots .dot {
    width: 25%;
    height: 25%;
    background: var(--loading-color);
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite both;
  }

  .loading-dots .dot:nth-child(1) { animation-delay: -0.32s; }
  .loading-dots .dot:nth-child(2) { animation-delay: -0.16s; }
  .loading-dots .dot:nth-child(3) { animation-delay: 0s; }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .loading-pulse .pulse-circle {
    width: 100%;
    height: 100%;
    background: var(--loading-color);
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
    }
    100% {
      transform: scale(0.8);
      opacity: 1;
    }
  }

  .loading-bars .bars-container {
    display: flex;
    gap: 2px;
    align-items: center;
    height: 100%;
  }

  .loading-bars .bar {
    width: 3px;
    height: 100%;
    background: var(--loading-color);
    border-radius: 2px;
    animation: bars 1.2s ease-in-out infinite;
  }

  .loading-bars .bar:nth-child(1) { animation-delay: -0.24s; }
  .loading-bars .bar:nth-child(2) { animation-delay: -0.12s; }
  .loading-bars .bar:nth-child(3) { animation-delay: 0s; }
  .loading-bars .bar:nth-child(4) { animation-delay: 0.12s; }

  @keyframes bars {
    0%, 40%, 100% {
      transform: scaleY(0.4);
      opacity: 0.5;
    }
    20% {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  .loading-text {
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    animation: fadeInOut 2s ease-in-out infinite;
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading-container * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
