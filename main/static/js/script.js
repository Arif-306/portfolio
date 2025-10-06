// script.js
// Handles GSAP animations (orbit rotation, subtle parallax, menu toggles, and card video modal).



document.addEventListener('DOMContentLoaded', () => {
  // set copyright years
  document.getElementById('year')?.replaceWith(document.createTextNode(new Date().getFullYear()));
  document.getElementById('year2')?.replaceWith(document.createTextNode(new Date().getFullYear()));

  // MOBILE MENU TOGGLE
  const mobileToggle = document.querySelectorAll('.mobile-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileToggle.forEach(btn => btn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-hidden', mobileMenu.classList.contains('active') ? 'false' : 'true');
  }));
  document.querySelectorAll('.close-mobile').forEach(b => b?.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  }));

  // ORBIT ANIMATION WITH GSAP
  // Place orbit items on their circles and animate rotation & slight bobbing for realism.
  const items = document.querySelectorAll('.orbit-item');

  // helper to place items around center
  function placeOrbitItems() {
    const wrap = document.getElementById('orbitWrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    items.forEach((el, idx) => {
      const orbit = Number(el.dataset.orbit) || 140; // radius from data attribute
      // choose an angle per item so they are distributed
      const angle = (idx / items.length) * Math.PI * 2;
      // initial coordinates
      const x = cx + Math.cos(angle) * orbit - el.offsetWidth / 2;
      const y = cy + Math.sin(angle) * orbit - el.offsetHeight / 2;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    });
  }
  // initial placement
  placeOrbitItems();
  // recalc on resize
  window.addEventListener('resize', placeOrbitItems);

  // Use GSAP timeline to rotate each ring of items at different speeds & directions for realistic motion.
  // We'll animate each element along a circular motion using MotionPathPlugin
  gsap.registerPlugin(MotionPathPlugin);

  // Build timelines by orbit radius
  const tl = gsap.timeline({repeat:-1, defaults:{ease:'none'}});

  // create separate groups by radius
  const groups = {
    200: [],
    140: [],
    80: []
  };
  items.forEach((it) => {
    const r = it.dataset.orbit;
    if (groups[r]) groups[r].push(it);
  });

  // animate each group with slightly different speeds and directions
  Object.keys(groups).forEach((r, i) => {
    const radius = Number(r);
    const group = groups[r];
    if (!group.length) return;
    group.forEach((el, idx) => {
      const duration = 20 - (i * 4) + (idx % 3); // slightly differing durations
      // Use gsap.to with motionPath relative to the wrap's center
      gsap.to(el, {
        motionPath: {
          path: [{
            x: 260, y: 260
          }],
          align: false,
          autoRotate: false,
          end: 1
        },
        rotation: 0.01,
        repeat: -1,
        duration: duration,
        ease: "linear",
        // We'll use modifier to compute circle coordinates each tick (simulate circular path)
        onUpdate: function() {},
        // we'll instead update manually below with onUpdate via a small internal clock
      });

      // Instead of MotionPath heavy path, implement manual angle animation for smooth circular motion:
      const startAngle = (idx / group.length) * Math.PI * 2;
      gsap.to(el, {
        angle: "+=360",
        duration: duration,
        repeat: -1,
        ease: "none",
        onUpdate: function() {
          // compute angle from tween's progress
          const ang = (this.targets()[0].__gsap?.ratio || this.progress()) * Math.PI * 2 + startAngle;
          const wrap = document.getElementById('orbitWrap');
          if (!wrap) return;
          const w = wrap.clientWidth, h = wrap.clientHeight;
          const cx = w/2, cy = h/2;
          const rpx = radius;
          const x = cx + Math.cos(ang) * rpx - el.offsetWidth/2;
          const y = cy + Math.sin(ang) * rpx - el.offsetHeight/2;
          el.style.left = x + 'px';
          el.style.top = y + 'px';
          // small z effect: scale based on sin for depth
          const scale = 0.86 + (Math.sin(ang) * 0.12);
          el.style.transform = `scale(${scale})`;
        }
      });
    });
  });

  // subtle parallax on mouse move for realism
  const wrap = document.getElementById('orbitWrap');
  if (wrap) {
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to('.orbit-center', {x: mx * 10, y: my * 10, duration:0.6, ease:'power3.out'});
      gsap.to('.orbits', {x: mx * -6, y: my * -6, duration:0.6, ease:'power3.out'});
    });
    wrap.addEventListener('mouseleave', () => {
      gsap.to('.orbit-center', {x:0, y:0, duration:0.8, ease:'power2.out'});
      gsap.to('.orbits', {x:0, y:0, duration:0.8, ease:'power2.out'});
    });
  }


  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      // Open modal and play a demo video — replace source URL with your project's video file path
      const demo = `assets/demo${(idx%3)+1}.mp4`; // placeholder pattern — replace with your own mapping
      projectVideo.src = demo;
      videoModal.classList.add('active');
      videoModal.setAttribute('aria-hidden', 'false');
      projectVideo.play().catch(()=>{/* autoplay blocked sometimes */});
    });
  });

  closeModal?.addEventListener('click', () => {
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    projectVideo.pause();
    projectVideo.src = '';
  });

  // close modal on background click
  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeModal?.click();
    }
  });

});







// -- SKILLS DATA (customize) --
// Adjusted to match the screenshot: Django 85, Machine Learning 78, HTML/CSS 95, JavaScript 90
const skillsData = [
  { name: 'Python', pct: 90, projects: [{ title: ' GANs (Generative Adversarial Networks) to generate synthetic human faces!', link: 'https://www.linkedin.com/posts/arif-anis-1742b6341_deeplearning-gan-artificialintelligence-activity-7356291280403927040-Sn7d?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFWmzGgBDaZQvor3kVET-5ffdP8q0hPQljo' }] },
  { name: 'Machine Learning', pct: 80, projects: [{ title: 'AI Visual Painter', link: 'https://www.linkedin.com/posts/arif-anis-1742b6341_ai-artificialintelligence-python-activity-7354198341737459712-HXjW?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFWmzGgBDaZQvor3kVET-5ffdP8q0hPQljo' }] },
  { name: 'HTML/CSS', pct: 95, projects: [{ title: 'ISP Website', link: 'https://www.linkedin.com/posts/arif-anis-1742b6341_webdevelopment-django-fullstackproject-activity-7356932213323583488-Id3P?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFWmzGgBDaZQvor3kVET-5ffdP8q0hPQljo' }] },
  { name: 'Django', pct: 70, projects: [{ title: 'Provisioning System', link: 'https://www.linkedin.com/posts/arif-anis-1742b6341_ai-machinelearning-automation-activity-7363135216325967874-qBd6?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFWmzGgBDaZQvor3kVET-5ffdP8q0hPQljo' }] }
];

// Render skills only into the existing #skillsGrid
// (previous code targeted #skills-container which doesn't exist and caused JS errors)

const skillsGrid = document.getElementById('skillsGrid');
if (!skillsGrid) {
  console.warn('#skillsGrid not found — skills cards will not be rendered.');
} else {
  // generate cards
  skillsData.forEach((s, idx) => {
    const card = document.createElement('article');
    card.className = 'skill-card';
    card.setAttribute('data-skill', s.name);
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="skill-visual">
            <svg class="radial" viewBox="0 0 120 120" role="img" aria-label="${s.name} ${s.pct}%">
              <circle class="radial-bg" cx="60" cy="60" r="52"></circle>
              <circle class="radial-progress" cx="60" cy="60" r="52" data-pct="${s.pct}"></circle>
              <text x="50%" y="50%" class="radial-text">${s.pct}%</text>
            </svg>
          </div>
          <h3 class="skill-name">${s.name}</h3>
        </div>

        <div class="card-back" aria-hidden="true">
          <h4>Projects</h4>
          <ul class="proj-list">
            ${s.projects.map(p=>`<li><a href="${p.link}" target="_blank" rel="noopener">${p.title}</a></li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    skillsGrid.appendChild(card);

    // mobile click flip
    card.querySelector('.card-front').addEventListener('click', () => {
      if (window.matchMedia('(hover: none)').matches) {
        card.classList.toggle('is-flipped');
        const back = card.querySelector('.card-back');
        back.setAttribute('aria-hidden', card.classList.contains('is-flipped') ? 'false' : 'true');
      }
    });
  });
}





// (Rendering moved above with a single responsibility and null-check)

// observe & animate when visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const prog = card.querySelector('.radial-progress');
      if (prog && !prog.dataset.animated) {
        const pct = Number(prog.getAttribute('data-pct') || 0);
        const r = prog.getAttribute('r');
        const circumference = 2 * Math.PI * r;
        prog.style.strokeDasharray = circumference;
        // start from full offset (empty)
        prog.style.strokeDashoffset = circumference;
        // animate to target
        gsap.to(prog, {
          strokeDashoffset: circumference * (1 - pct/100),
          duration: 1.6,
          ease: "power2.out"
        });
        prog.dataset.animated = 'true';
      }
      observer.unobserve(card);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.skill-card').forEach(c => observer.observe(c));






// PARALLAX STARS GENERATOR + GSAP ScrollTrigger
(function() {
  // ensure GSAP + ScrollTrigger available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // if ScrollTrigger is loaded deferred, wait a tick
    console.warn('GSAP or ScrollTrigger not ready yet.');
  }

  // register plugin (safe to call even if already registered)
  try { gsap.registerPlugin(ScrollTrigger); } catch(e){}

  const layers = [
    { selector: '.layer-back', count: 60, sizeRange: [1,3], className: 'small' , depth: 10 },
    { selector: '.layer-mid',  count: 36, sizeRange: [2,4], className: 'medium', depth: 25 },
    { selector: '.layer-front',count: 18, sizeRange: [3,6], className: 'large', depth: 50 }
  ];

  // reduce counts on mobile
  const mq = window.matchMedia('(max-width: 768px)');
  if (mq.matches) {
    layers[0].count = 30;
    layers[1].count = 18;
    layers[2].count = 8;
  }

  function rand(min, max){ return Math.random() * (max - min) + min; }

  layers.forEach(layer => {
    const el = document.querySelector(layer.selector);
    if (!el) return;
    // clear if any previous
    el.innerHTML = '';
    for (let i = 0; i < layer.count; i++) {
      const s = document.createElement('span');
      const sz = Math.round(rand(layer.sizeRange[0], layer.sizeRange[1]));
      s.className = 'star ' + layer.className;
      s.style.width = sz + 'px';
      s.style.height = sz + 'px';
      // random position
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      // random opacity / subtle animation delay
      s.style.opacity = (rand(0.5, 1)).toFixed(2);
      s.style.transform = `translate3d(0,0,0)`;
      el.appendChild(s);
    }
  });

  // Create ScrollTrigger animations for parallax — layers move different amounts.
  // We use yPercent so movement is relative to element height.
  // Negative values move upward when scrolling down.

  // small tweak: start from top to bottom of document
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  // If page is short (no scroll), don't animate violently
  const endValue = docHeight > 0 ? 'bottom top' : '+=1';

  // Back (subtle)
  gsap.to('.layer-back', {
    yPercent: -layers[0].depth,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8
    }
  });

  // Mid
  gsap.to('.layer-mid', {
    yPercent: -layers[1].depth,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Front (moves most)
  gsap.to('.layer-front', {
    yPercent: -layers[2].depth,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    }
  });

  // Optional: subtle floating animation (continuous slow float) for visual life
  gsap.utils.toArray('.star').forEach((st, i) => {
    const r = Math.random() * 6 + 4;
    gsap.to(st, {
      y: `+=${(Math.random() * 6) - 3}px`, // tiny up/down
      x: `+=${(Math.random() * 6) - 3}px`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      duration: r,
      delay: Math.random() * 3
    });
  });

})();
