import React, { useEffect, useRef } from 'react';

export const FuturisticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      life: number;
    }> = [];

    const colors = [
      'hsl(260, 95%, 65%)', // neon purple
      'hsl(200, 85%, 60%)', // cyber blue
      'hsl(320, 85%, 70%)', // holographic pink
      'hsl(142, 85%, 55%)', // success green
    ];

    // Create particles
    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 300 + 200,
      };
    };

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.opacity = Math.max(0, particle.opacity - 0.005);

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        // Glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        ctx.restore();

        // Remove dead particles
        if (particle.life <= 0 || particle.opacity <= 0 || particle.y < -50) {
          particles.splice(i, 1);
          particles.push(createParticle());
        }
      }

      // Draw neural network connections
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-60 dark:opacity-40"
      />
      
      {/* Floating holographic elements */}
      <div className="absolute inset-0">
        {/* Top holographic wave */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-wave" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        
        {/* Geometric patterns */}
        <div className="absolute top-16 right-16 w-8 h-8 border border-primary/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-32 left-16 w-6 h-6 border border-secondary/20 animate-spin" style={{ animationDuration: '15s' }} />
        <div className="absolute top-1/3 right-1/2 w-4 h-4 bg-accent/20 rounded-full animate-pulse" />
        
        {/* Light streaks */}
        <div className="absolute top-0 right-1/4 w-px h-64 bg-gradient-to-b from-primary/40 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-px h-48 bg-gradient-to-t from-secondary/40 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};