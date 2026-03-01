<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let canvas;
  let ctx;
  let particles = [];
  let animationId;
  let resizeTimeout;

  class Particle {
    constructor(canvasWidth, canvasHeight) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.waveOffset = Math.random() * Math.PI * 2;
      this.waveSpeed = Math.random() * 0.02 + 0.01;
      this.waveAmplitude = Math.random() * 30 + 20;
    }

    update(time, canvasWidth, canvasHeight) {
      this.x += this.speedX;
      this.y += this.speedY + Math.sin(time * this.waveSpeed + this.waveOffset) * 0.5;

      // Keep particles within bounds
      if (this.x < 0) this.x = 0;
      if (this.x > canvasWidth) this.x = canvasWidth;
      if (this.y < 0) this.y = 0;
      if (this.y > canvasHeight) this.y = canvasHeight;

      if (this.x <= 0 || this.x >= canvasWidth) this.speedX *= -1;
      if (this.y <= 0 || this.y >= canvasHeight) this.speedY *= -1;
    }

    draw(ctx) {
      ctx.fillStyle = `rgba(136, 85, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    reposition(oldWidth, oldHeight, newWidth, newHeight) {
      // Scale particle position to new canvas size
      this.x = (this.x / oldWidth) * newWidth;
      this.y = (this.y / oldHeight) * newHeight;
    }
  }

  onMount(() => {
    if (!browser) return;

    ctx = canvas.getContext('2d');
    let currentWidth = window.innerWidth;
    let currentHeight = window.innerHeight;
    
    function resize() {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Reposition existing particles instead of recreating them
      if (particles.length > 0) {
        particles.forEach(particle => {
          particle.reposition(oldWidth, oldHeight, newWidth, newHeight);
        });
      }

      // Adjust particle count based on new size
      const targetCount = Math.floor((canvas.width * canvas.height) / 8000);
      
      if (particles.length < targetCount) {
        // Add more particles
        for (let i = particles.length; i < targetCount; i++) {
          particles.push(new Particle(canvas.width, canvas.height));
        }
      } else if (particles.length > targetCount) {
        // Remove excess particles
        particles = particles.slice(0, targetCount);
      }

      currentWidth = newWidth;
      currentHeight = newHeight;
    }

    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    }

    resize();
    window.addEventListener('resize', handleResize);

    let time = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.016;

      particles.forEach((particle, i) => {
        particle.update(time, canvas.width, canvas.height);
        particle.draw(ctx);

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = `rgba(136, 85, 255, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationId) cancelAnimationFrame(animationId);
    };
  });
</script>

<canvas bind:this={canvas} class="particle-canvas"></canvas>
<div class="content-wrapper">
  <slot />
</div>

<style>
  .particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .content-wrapper {
    position: relative;
    z-index: 1;
  }
</style>
