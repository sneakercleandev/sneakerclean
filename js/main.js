/* Navbar: add .scrolled class on scroll */
window.addEventListener('scroll', () => {
  document.querySelector('.site-header')
    .classList.toggle('scrolled', window.scrollY > 40);
});

/* Fade-up on scroll via IntersectionObserver */
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
fadeEls.forEach((el) => observer.observe(el));

/* ─────────────────────────────────────────────
   EXAMPLES MULTI-CARD SLIDER
   • Responsive visible-card count: 3 / 2 / 1
   • Auto-advances every 2 s; pauses on hover
   • Left/right arrows + dot indicators
───────────────────────────────────────────── */
(function () {
  const track    = document.getElementById('exTrack');
  const dotsWrap = document.getElementById('exDots');
  const prevBtn  = document.getElementById('exPrev');
  const nextBtn  = document.getElementById('exNext');
  const slider   = document.getElementById('exSlider');

  if (!track) return; // guard: section not present

  const cards   = Array.from(track.querySelectorAll('.ex-card'));
  const total   = cards.length;
  const GAP_PX  = 20; // must match the gap in CSS (.ex-track { gap: 1.25rem })
  let   current = 0;  // index of the leftmost visible card
  let   timer   = null;

  /* How many cards are visible depends on viewport width */
  function visibleCount() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 576) return 2;
    return 1;
  }

  /* Set each card's width so exactly visibleCount() fit inside the viewport */
  function sizeCards() {
    const visible  = visibleCount();
    const vpWidth  = track.parentElement.clientWidth; // .ex-viewport width
    const cardWidth = (vpWidth - GAP_PX * (visible - 1)) / visible;
    cards.forEach((c) => { c.style.width = cardWidth + 'px'; });
  }

  /* Slide the track to reveal the card at index `idx` */
  function goTo(idx) {
    const visible   = visibleCount();
    const maxIndex  = total - visible;

    /* Clamp so we never scroll past the last card */
    current = Math.max(0, Math.min(idx, maxIndex));

    const vpWidth   = track.parentElement.clientWidth;
    const cardWidth = (vpWidth - GAP_PX * (visible - 1)) / visible;
    const offset    = current * (cardWidth + GAP_PX);

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  /* Build one dot per "page" (each step moves by 1 card) */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const maxIndex = total - visibleCount();
    for (let i = 0; i <= maxIndex; i++) {
      const btn = document.createElement('button');
      btn.className = 'ex-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Слайд ${i + 1}`);
      btn.addEventListener('click', () => { goTo(i); restartTimer(); });
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    Array.from(dotsWrap.querySelectorAll('.ex-dot')).forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  /* Auto-advance timer */
  function startTimer() {
    timer = setInterval(() => {
      const maxIndex = total - visibleCount();
      goTo(current >= maxIndex ? 0 : current + 1);
    }, 2500);
  }
  function stopTimer()    { clearInterval(timer); }
  function restartTimer() { stopTimer(); startTimer(); }

  /* Arrow clicks */
  prevBtn.addEventListener('click', () => { goTo(current - 1); restartTimer(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); restartTimer(); });

  /* Pause auto-play while user hovers over the whole slider block */
  slider.addEventListener('mouseenter', stopTimer);
  slider.addEventListener('mouseleave', startTimer);

  /* Re-size cards and re-clamp position when the window is resized */
  window.addEventListener('resize', () => {
    sizeCards();
    buildDots();   // dot count may change if visible count changes
    goTo(current); // re-clamp and recalculate offset
  });

  /* Initial setup */
  sizeCards();
  buildDots();
  goTo(0);
  startTimer();
}());

/* ─────────────────────────────────────────────
   ORDER FORM — interactive controls
───────────────────────────────────────────── */

/* Service toggle-buttons: clicking one makes it active, deactivates the rest */
(function () {
  const group  = document.querySelector('.service-toggle-group');
  const hidden = document.getElementById('serviceValue');
  if (!group || !hidden) return;

  group.addEventListener('click', (e) => {
    const btn = e.target.closest('.svc-btn');
    if (!btn) return;

    /* Remove active from all siblings, set on the clicked one */
    group.querySelectorAll('.svc-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    hidden.value = btn.dataset.svc;
  });
}());

/* ─────────────────────────────────────────────
   PRICE MODALS — Чистка / Ремонт
───────────────────────────────────────────── */
(function () {
  function openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Open buttons inside feature card */
  document.querySelectorAll('.price-btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.modal));
  });

  /* Close on × button or overlay click */
  document.querySelectorAll('.price-modal-overlay').forEach((overlay) => {
    overlay.querySelector('.price-modal-close').addEventListener('click', () => closeModal(overlay));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  /* Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.price-modal-overlay.open').forEach(closeModal);
    }
  });

  /* Tab switching */
  document.querySelectorAll('.price-modal-tabs').forEach((tabsEl) => {
    tabsEl.addEventListener('click', (e) => {
      const tab = e.target.closest('.pmt-tab');
      if (!tab) return;
      const modal = tabsEl.closest('.price-modal');
      modal.querySelectorAll('.pmt-tab').forEach((t) => t.classList.remove('active'));
      modal.querySelectorAll('.pmt-page').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      modal.querySelector('#' + tab.dataset.tab).classList.add('active');
    });
  });
}());

/* File upload label: update the visible text to list chosen file names */
(function () {
  const input      = document.getElementById('shoeMedia');
  const labelText  = document.getElementById('fileUploadText');
  if (!input || !labelText) return;

  input.addEventListener('change', () => {
    const files = Array.from(input.files);
    if (!files.length) {
      labelText.textContent = 'Загрузите фотографии или видео';
      return;
    }
    /* Show up to 2 file names, then "+ N ещё" if there are more */
    const names   = files.slice(0, 2).map((f) => f.name).join(', ');
    const extra   = files.length > 2 ? ` + ещё ${files.length - 2}` : '';
    labelText.textContent = names + extra;
  });
}());

