// ─────────────────────────────────────────────
// PARTICLE BACKGROUND
// ─────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor(W * H / 14000);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.3,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? '#00D4C8' : '#FF8C00'
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,140,0,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  drawParticles();
})();


// ─────────────────────────────────────────────
// DNA HELIX
// ─────────────────────────────────────────────
function drawDNA() {
  const svg = document.getElementById('dna-svg');
  if (!svg) return;

  svg.innerHTML = '';

  const W = 180;
  const H = 420;
  const cx = W / 2;
  const steps = 24;
  const amplitude = 60;
  const spacing = H / steps;

  function makeCircle(x, y, color, r = 7) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', r);
    c.setAttribute('fill', color);
    c.setAttribute('opacity', '0.85');

    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    anim.setAttribute('attributeName', 'opacity');
    anim.setAttribute('values', '0.85;0.4;0.85');
    anim.setAttribute('dur', `${2 + Math.random() * 2}s`);
    anim.setAttribute('repeatCount', 'indefinite');

    c.appendChild(anim);
    return c;
  }

  // Rungs
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 4;
    const y = i * spacing + spacing / 2;
    const x1 = cx + Math.sin(angle) * amplitude;
    const x2 = cx + Math.sin(angle + Math.PI) * amplitude;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(255,140,0,0.2)');
    line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);

    svg.appendChild(makeCircle(x1, y, '#FF8C00', 6));
    svg.appendChild(makeCircle(x2, y, '#00D4C8', 6));
  }

  // Strands
  const strand1 = [];
  const strand2 = [];

  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const angle = t * Math.PI * 4;
    const y = t * H;

    strand1.push(`${cx + Math.sin(angle) * amplitude},${y}`);
    strand2.push(`${cx + Math.sin(angle + Math.PI) * amplitude},${y}`);
  }

  function makePath(points, color) {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    p.setAttribute('points', points.join(' '));
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', color);
    p.setAttribute('stroke-width', '2');
    p.setAttribute('opacity', '0.6');
    return p;
  }

  svg.insertBefore(makePath(strand1, '#FF8C00'), svg.firstChild);
  svg.insertBefore(makePath(strand2, '#00D4C8'), svg.firstChild);
}

drawDNA();


// ─────────────────────────────────────────────
// SCATTER CANVAS
// ─────────────────────────────────────────────
function drawScatter() {
  const c = document.getElementById('scatter-canvas');
  if (!c) return;

  c.width = c.offsetWidth * window.devicePixelRatio;
  c.height = 300 * window.devicePixelRatio;
  c.style.height = '300px';

  const ctx = c.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const W = c.offsetWidth;
  const H = 300;

  const pts = [];
  for (let i = 0; i < 80; i++) {
    pts.push({
      x: Math.random() * (W - 40) + 20,
      y: Math.random() * (H - 40) + 20,
      r: Math.random() * 4 + 2,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  ctx.fillStyle = '#0A0A12';
  ctx.fillRect(0, 0, W, H);

  pts.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,140,0,${p.alpha})`;
    ctx.fill();
  });

  ctx.fillStyle = 'rgba(240,238,232,0.25)';
  ctx.font = '500 10px Space Mono, monospace';
  ctx.fillText('SCATTERED · SILOED · DISCONNECTED', 12, H - 12);
}


// ─────────────────────────────────────────────
// EMBED CANVAS
// ─────────────────────────────────────────────
function drawEmbed() {
  const c = document.getElementById('embed-canvas');
  if (!c) return;

  const rect = c.parentElement.getBoundingClientRect();

  c.width = (rect.width || 400) * window.devicePixelRatio;
  c.height = 320 * window.devicePixelRatio;
  c.style.width = '100%';
  c.style.height = '320px';

  const ctx = c.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const W = rect.width || 400;
  const H = 320;

  const clusters = [
    { cx: W * 0.22, cy: H * 0.3, color: '#FF8C00', label: 'STRATEGY', n: 20 },
    { cx: W * 0.62, cy: H * 0.2, color: '#00D4C8', label: 'CAMPAIGNS', n: 18 },
    { cx: W * 0.42, cy: H * 0.68, color: '#FFB347', label: 'REPORTS', n: 22 },
    { cx: W * 0.78, cy: H * 0.62, color: '#7B68EE', label: 'CLIENTS', n: 15 },
  ];

  ctx.fillStyle = '#12121E';
  ctx.fillRect(0, 0, W, H);

  clusters.forEach(cl => {
    for (let i = 0; i < cl.n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (W * 0.1);
      const x = cl.cx + Math.cos(angle) * dist;
      const y = cl.cy + Math.sin(angle) * dist;
      const r = Math.random() * 4 + 2;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);

      const hex = cl.color.replace('#', '');
      const rr = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      ctx.fillStyle = `rgba(${rr},${g},${b},${Math.random() * 0.5 + 0.4})`;
      ctx.fill();
    }

    ctx.font = '600 9px Space Mono, monospace';
    ctx.fillStyle = cl.color;
    ctx.fillText(cl.label, cl.cx - 20, cl.cy - (W * 0.12));
  });

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(240,238,232,0.2)';
  ctx.font = '9px Space Mono, monospace';
  ctx.fillText('KNOWLEDGE NUGGETS · CLUSTERED BY SEMANTIC MEANING', 10, H - 10);
}


// ─────────────────────────────────────────────
// SLIDE VISIBILITY + NAVIGATION
// ─────────────────────────────────────────────
const slides = document.querySelectorAll('.slide');
const navDots = document.getElementById('nav-dots');
let canvasDrawn = { scatter: false, embed: false };

slides.forEach((slide, i) => {
  const dot = document.createElement('div');
  dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => {
    slide.scrollIntoView({ behavior: 'smooth' });
  });
  navDots.appendChild(dot);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const idx = [...slides].indexOf(entry.target);

      document.querySelectorAll('.nav-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });

      const slideId = entry.target.id;

      if (slideId === 'slide-2' && !canvasDrawn.scatter) {
        canvasDrawn.scatter = true;
        setTimeout(drawScatter, 300);
      }

      if (slideId === 'slide-5' && !canvasDrawn.embed) {
        canvasDrawn.embed = true;
        setTimeout(drawEmbed, 300);
      }
    }
  });
}, { threshold: 0.35 });

slides.forEach(s => observer.observe(s));



// ─────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct = Math.min(100, (scrolled / maxScroll) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
});


// ─────────────────────────────────────────────
// INITIAL LOAD
// ─────────────────────────────────────────────
setTimeout(() => {
  slides[0].classList.add('visible');
  drawScatter();
}, 100);