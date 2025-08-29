import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: p5.Color;
  life: number;
  maxLife: number;
}

const P5Background = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p: p5) => {
      let particles: Particle[] = [];
      let mouseX = 0;
      let mouseY = 0;
      let hue = 0;

      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent(canvasRef.current!);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.noStroke();
        
        // Initialize particles
        for (let i = 0; i < 50; i++) {
          particles.push(createParticle());
        }
      };

      p.draw = () => {
        p.background(0, 0, 0, 0.1);
        
        // Update mouse position
        mouseX = p.mouseX;
        mouseY = p.mouseY;
        
        // Update and draw particles
        particles.forEach((particle, index) => {
          // Attract to mouse
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = p.dist(mouseX, mouseY, particle.x, particle.y);
          
          if (distance < 200) {
            const force = (200 - distance) / 200;
            particle.vx += dx * force * 0.001;
            particle.vy += dy * force * 0.001;
          }
          
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Add friction
          particle.vx *= 0.99;
          particle.vy *= 0.99;
          
          // Wrap around edges
          if (particle.x < 0) particle.x = p.width;
          if (particle.x > p.width) particle.x = 0;
          if (particle.y < 0) particle.y = p.height;
          if (particle.y > p.height) particle.y = 0;
          
          // Update life
          particle.life--;
          
          // Draw particle
          const alpha = particle.life / particle.maxLife;
          p.fill(particle.color.levels[0], particle.color.levels[1], particle.color.levels[2], alpha);
          p.circle(particle.x, particle.y, particle.size * alpha);
          
          // Remove dead particles and create new ones
          if (particle.life <= 0) {
            particles[index] = createParticle();
          }
        });
        
        // Draw connections between nearby particles
        p.stroke(200, 50, 100, 0.3);
        p.strokeWeight(1);
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const distance = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            if (distance < 100) {
              const alpha = (100 - distance) / 100;
              p.stroke(200, 50, 100, alpha * 0.3);
              p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            }
          }
        }
        
        // Update hue for color cycling
        hue = (hue + 0.5) % 360;
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };

      const createParticle = (): Particle => ({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-1, 1),
        vy: p.random(-1, 1),
        size: p.random(2, 8),
        color: p.color(hue, 70, 100),
        life: p.random(100, 200),
        maxLife: 200,
      });
    };

    p5InstanceRef.current = new p5(sketch);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
    />
  );
};

export default P5Background; 