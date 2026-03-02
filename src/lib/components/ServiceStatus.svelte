<script>
  import { onMount } from 'svelte';
  
  export let url;
  
  let status = 'checking'; // 'checking', 'online', 'offline'
  let checkInterval;
  
  async function checkStatus() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      status = 'online';
    } catch (error) {
      status = 'offline';
    }
  }
  
  onMount(() => {
    checkStatus();
    checkInterval = setInterval(checkStatus, 30000); // Check every 30 seconds
    
    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  });
</script>

<div class="status-indicator" class:online={status === 'online'} class:offline={status === 'offline'} class:checking={status === 'checking'}>
  <span class="dot"></span>
</div>

<style>
  .status-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
  }
  
  .checking .dot {
    background: var(--text-muted);
    animation: pulse-checking 1.5s ease-in-out infinite;
  }
  
  .online .dot {
    background: #10b981;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    animation: pulse-online 2s ease-in-out infinite;
  }
  
  .offline .dot {
    background: #ef4444;
  }
  
  @keyframes pulse-checking {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }
  
  @keyframes pulse-online {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
</style>
