const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = [...document.querySelectorAll('.nav a')];
const topButton = document.querySelector('.back-top');
const heatFrame = document.querySelector('#heatmapFrame');
const heatButtons = [...document.querySelectorAll('[data-heat]')];
const imageHolders = [...document.querySelectorAll('.image-holder')];

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav a[href="#${id}"]`);
    if (entry.isIntersecting && link) {
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  if (window.scrollY > 700) {
    topButton?.classList.add('show');
  } else {
    topButton?.classList.remove('show');
  }
});

topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

heatButtons.forEach(button => {
  button.addEventListener('click', () => {
    heatButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const showHeat = button.dataset.heat === 'on';
    heatFrame?.classList.toggle('is-hot', showHeat);
  });
});

imageHolders.forEach(holder => {
  const img = holder.querySelector('img');
  const placeholder = holder.querySelector('.image-placeholder');
  if (!img || !placeholder) return;

  img.addEventListener('error', () => {
    img.hidden = true;
    placeholder.hidden = false;
  });
});

// Lightweight keyboard support for heatmap buttons
heatButtons.forEach(button => {
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.click();
    }
  });
});
