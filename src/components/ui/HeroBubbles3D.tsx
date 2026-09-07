import React, { useEffect, useRef } from 'react';
import { useToolora } from '../../context/TooloraContext';

interface Bubble {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  vx: number;
  vy: number;
  floatSpeed: number;
  floatAmp: number;
  phase: number;
  hue: number;
  opacity: number;
  specularAngle: number;
  depth: number; // 0.3 (far) to 1.0 (near)
}

interface HeroBubbles3DProps {
  className?: string;
}

export default function HeroBubbles3D({ className = '' }: HeroBubbles3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useToolora();
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize 3D Spheres with depth layers
    const bubbleCount = Math.max(12, Math.min(Math.floor(width / 60), 22));
    const bubbles: Bubble[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      const depth = 0.35 + Math.random() * 0.65; // depth scale
      const radius = (18 + Math.random() * 55) * depth;
      const x = Math.random() * width;
      const y = Math.random() * height;

      bubbles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius,
        vx: (Math.random() - 0.5) * 0.3 * depth,
        vy: -0.2 - Math.random() * 0.3 * depth,
        floatSpeed: 0.001 + Math.random() * 0.002,
        floatAmp: 12 + Math.random() * 24,
        phase: Math.random() * Math.PI * 2,
        hue: 20 + Math.random() * 25, // warm orange/amber spectrum
        opacity: 0.15 + depth * 0.45,
        specularAngle: Math.PI * 0.25,
        depth
      });
    }

    // Mouse move tracking for interactive 3D repulsion
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');

      // Sort by depth for correct 3D perspective layering
      bubbles.sort((a, b) => a.depth - b.depth);

      bubbles.forEach((b) => {
        // Floating sinusoidal movement
        b.baseY += b.vy;
        b.baseX += b.vx;

        // Wrap around boundaries smoothly
        if (b.baseY < -b.radius * 2) {
          b.baseY = height + b.radius * 2;
          b.baseX = Math.random() * width;
        }
        if (b.baseX < -b.radius * 2) b.baseX = width + b.radius * 2;
        if (b.baseX > width + b.radius * 2) b.baseX = -b.radius * 2;

        const floatOffsetX = Math.cos(time * b.floatSpeed + b.phase) * (b.floatAmp * 0.6);
        const floatOffsetY = Math.sin(time * b.floatSpeed + b.phase) * b.floatAmp;

        let targetX = b.baseX + floatOffsetX;
        let targetY = b.baseY + floatOffsetY;

        // Interactive mouse physics
        if (mouseRef.current.active) {
          const dx = targetX - mouseRef.current.x;
          const dy = targetY - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180 * b.depth;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 35 * b.depth;
            targetX += (dx / dist) * force;
            targetY += (dy / dist) * force;
          }
        }

        b.x += (targetX - b.x) * 0.06;
        b.y += (targetY - b.y) * 0.06;

        // Draw 3D Glass Sphere
        ctx.save();
        ctx.translate(b.x, b.y);

        const r = b.radius;

        // 1. Soft Ambient Drop Glow
        const haloGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 1.8);
        if (isDark) {
          haloGrad.addColorStop(0, `rgba(249, 115, 22, ${0.12 * b.depth})`);
          haloGrad.addColorStop(0.5, `rgba(234, 88, 12, ${0.05 * b.depth})`);
          haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          haloGrad.addColorStop(0, `rgba(249, 115, 22, ${0.08 * b.depth})`);
          haloGrad.addColorStop(0.6, `rgba(251, 146, 60, ${0.03 * b.depth})`);
          haloGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();

        // 2. 3D Spherical Volume Body (Internal Refraction & Shadow)
        const lightX = -r * 0.35;
        const lightY = -r * 0.35;
        const sphereGrad = ctx.createRadialGradient(lightX, lightY, r * 0.1, 0, 0, r);

        if (isDark) {
          sphereGrad.addColorStop(0, `rgba(255, 237, 213, ${0.35 * b.opacity})`);
          sphereGrad.addColorStop(0.3, `rgba(251, 146, 60, ${0.22 * b.opacity})`);
          sphereGrad.addColorStop(0.7, `rgba(234, 88, 12, ${0.12 * b.opacity})`);
          sphereGrad.addColorStop(0.95, `rgba(15, 23, 42, ${0.45 * b.opacity})`);
          sphereGrad.addColorStop(1, `rgba(249, 115, 22, ${0.6 * b.opacity})`); // rim glow
        } else {
          sphereGrad.addColorStop(0, `rgba(255, 255, 255, ${0.75 * b.opacity})`);
          sphereGrad.addColorStop(0.35, `rgba(255, 237, 213, ${0.35 * b.opacity})`);
          sphereGrad.addColorStop(0.75, `rgba(251, 146, 60, ${0.18 * b.opacity})`);
          sphereGrad.addColorStop(0.95, `rgba(226, 232, 240, ${0.3 * b.opacity})`);
          sphereGrad.addColorStop(1, `rgba(249, 115, 22, ${0.45 * b.opacity})`); // rim glow
        }

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // 3. Delicate Glass Outer Rim Stroke
        ctx.lineWidth = Math.max(0.8, 1.4 * b.depth);
        ctx.strokeStyle = isDark
          ? `rgba(251, 146, 60, ${0.4 * b.depth})`
          : `rgba(234, 88, 12, ${0.3 * b.depth})`;
        ctx.stroke();

        // 4. Primary 3D Specular Curved Highlight
        const specX = -r * 0.38;
        const specY = -r * 0.38;
        const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, r * 0.55);
        specGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * b.depth})`);
        specGrad.addColorStop(0.4, `rgba(255, 255, 255, ${0.45 * b.depth})`);
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.rotate(-Math.PI * 0.15);
        ctx.beginPath();
        ctx.ellipse(specX, specY, r * 0.36, r * 0.18, Math.PI * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = specGrad;
        ctx.fill();
        ctx.restore();

        // 5. Secondary Rim Reflection (Bottom-Right bounce light)
        const rimGrad = ctx.createRadialGradient(r * 0.45, r * 0.45, 0, r * 0.45, r * 0.45, r * 0.4);
        rimGrad.addColorStop(0, `rgba(251, 146, 60, ${0.4 * b.depth})`);
        rimGrad.addColorStop(1, 'rgba(251, 146, 60, 0)');

        ctx.beginPath();
        ctx.arc(r * 0.4, r * 0.4, r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = rimGrad;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}
