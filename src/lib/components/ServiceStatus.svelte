<script>
  import { onMount } from 'svelte';

  export let url;
  export let healthUrl = null; // Optional dedicated health endpoint

  let status = 'checking'; // 'checking', 'online', 'offline'
  let checkInterval;

  async function checkStatus() {
    const target = healthUrl || url;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(target, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal,
        cache: 'no-store'
      });

      clearTimeout(timeoutId);
      // Immich /api/server/ping returns 200 with {"res":"pong"}
      // Nextcloud /status.php returns 200 with JSON
      status = response.ok ? 'online' : 'offline';
    } catch (error) {
      // CORS or network failure — fall back to no-cors probe
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
        await fetch(target, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller2.signal
        });
        clearTimeout(timeoutId2);
        // no-cors opaque response means we at least got a network response
        status = 'online';
      } catch {
        status = 'offline';
      }
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

<div class="status-indicator" class:online={status === 'online'} class:offline={status === 'offline'} class:checking={status === 'checking'} title={status}>
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
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  @keyframes pulse-online {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }
</style>
