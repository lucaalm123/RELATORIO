const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = [...document.querySelectorAll('.nav a')];
const progress = document.getElementById('scrollProgress');
const backTop = document.querySelector('.back-top');
const glow = document.querySelector('.cursor-glow');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    body.classList.toggle('menu-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  });
}, { rootMargin: '-35% 0px -58% 0px' });

document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progress) progress.style.height = `${Math.min(100, Math.max(0, pct))}%`;
  if (backTop) backTop.classList.toggle('show', window.scrollY > 620);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const heatFrame = document.getElementById('heatmapFrame');
document.querySelectorAll('[data-heat]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-heat]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (heatFrame) heatFrame.classList.toggle('is-heat', btn.dataset.heat === 'on');
  });
});

function handleImageFallback(holder) {
  const img = holder.querySelector('img');
  const placeholder = holder.querySelector('.image-placeholder');
  if (!img || !placeholder) return;

  const showImage = () => {
    holder.classList.add('image-ok');
    holder.classList.remove('image-error');
    img.hidden = false;
    placeholder.hidden = true;
  };

  const showPlaceholder = () => {
    holder.classList.add('image-error');
    holder.classList.remove('image-ok');
    img.hidden = true;
    placeholder.hidden = false;
  };

  img.addEventListener('load', showImage);
  img.addEventListener('error', showPlaceholder);

  // GitHub Pages é case-sensitive e pode atrasar o deploy.
  // Se a imagem já estiver em cache, validamos imediatamente.
  if (img.complete && img.naturalWidth > 0) showImage();
  if (img.complete && img.naturalWidth === 0) showPlaceholder();
}
document.querySelectorAll('.image-holder').forEach(handleImageFallback);

// Spotlight visual sem interferir na navegação.
if (window.matchMedia('(pointer: fine)').matches && glow) {
  body.classList.add('has-pointer');
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

// Cards com leve movimento 3D.
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('pointermove', (event) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// Botões com microinteração magnética.
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('pointermove', (event) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });
  btn.addEventListener('pointerleave', () => {
    btn.style.transform = '';
  });
});
