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
   LIGHTBOX — click ex-img to view full size
───────────────────────────────────────────── */
(function () {
  const overlay = document.getElementById('lightbox');
  const img     = document.getElementById('lightboxImg');
  if (!overlay || !img) return;

  function open(src, alt) {
    img.src = src;
    img.alt = alt;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  }

  document.querySelectorAll('.ex-img').forEach((el) => {
    el.addEventListener('click', () => open(el.src, el.alt));
  });

  overlay.querySelector('.lightbox-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
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

/* ─────────────────────────────────────────────
   ORDER FORM — validation + submit
───────────────────────────────────────────── */
(function () {
  const form      = document.getElementById('orderForm');
  const submitBtn = form ? form.querySelector('[type="submit"]') : null;
  if (!form) return;

  const API_URL = 'http://localhost:5000/api/order'; // local backend endpoint

  /* ── Toast helper ── */
  let toastEl = null;
  let toastTimer = null;
  function showToast(msg, type /* 'success' | 'error' */) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'form-toast';
      document.body.appendChild(toastEl);
    }
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.className = 'form-toast toast-' + type;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 4000);
  }

  /* ── Field-level error helpers ── */
  /* Anchor the error message to the nearest block-level wrapper so it
     always sits below the full input (even inside flex containers like .phone-wrap). */
  function errorAnchor(el) {
    return el.closest('.phone-wrap') ? el.closest('.phone-wrap').parentElement : el.parentElement;
  }
  function setError(el, msg) {
    el.classList.add('fc-invalid');
    const anchor = errorAnchor(el);
    let err = anchor.querySelector(':scope > .fc-error-msg');
    if (!err) {
      err = document.createElement('span');
      err.className = 'fc-error-msg';
      anchor.appendChild(err);
    }
    err.textContent = msg;
  }
  function clearError(el) {
    el.classList.remove('fc-invalid');
    const anchor = errorAnchor(el);
    const err = anchor.querySelector(':scope > .fc-error-msg');
    if (err) err.textContent = '';
  }

  /* ── Validation rules ── */
  function validate() {
    let ok = true;

    const firstName = form.querySelector('[name="firstName"]');
    if (!firstName.value.trim()) {
      setError(firstName, 'Введите имя');
      ok = false;
    } else clearError(firstName);

    const lastName = form.querySelector('[name="lastName"]');
    if (!lastName.value.trim()) {
      setError(lastName, 'Введите фамилию');
      ok = false;
    } else clearError(lastName);

    const phone = form.querySelector('[name="deliveryPhone"]');
    const phoneDigits = phone.value.replace(/\D/g, '');
    if (!phoneDigits) {
      setError(phone, 'Введите номер телефона');
      ok = false;
    } else if (phoneDigits.length < 9) {
      setError(phone, 'Номер слишком короткий');
      ok = false;
    } else clearError(phone);

    const pickupAddress = form.querySelector('[name="pickupAddress"]');
    if (!pickupAddress.value.trim()) {
      setError(pickupAddress, 'Укажите адрес получения');
      ok = false;
    } else clearError(pickupAddress);

    const deliveryFull = form.querySelector('[name="deliveryFull"]');
    if (!deliveryFull.value.trim()) {
      setError(deliveryFull, 'Укажите полный адрес доставки');
      ok = false;
    } else clearError(deliveryFull);

    const zone = form.querySelector('[name="deliveryZone"]');
    if (!zone.value) {
      setError(zone, 'Выберите район доставки');
      ok = false;
    } else clearError(zone);

    const date = form.querySelector('[name="deliveryDate"]');
    if (!date.value) {
      setError(date, 'Укажите день');
      ok = false;
    } else clearError(date);

    const timeFrom = form.querySelector('[name="deliveryTimeFrom"]');
    if (!timeFrom.value) {
      setError(timeFrom, 'Укажите время');
      ok = false;
    } else clearError(timeFrom);

    const timeTo = form.querySelector('[name="deliveryTimeTo"]');
    if (!timeTo.value) {
      setError(timeTo, 'Укажите время');
      ok = false;
    } else if (timeFrom.value && timeTo.value <= timeFrom.value) {
      setError(timeTo, 'Должно быть позже "Время (с)"');
      ok = false;
    } else clearError(timeTo);

    return ok;
  }

  /* Clear error on input */
  form.querySelectorAll('.fc-dark').forEach((el) => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  /* ── Submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    /* Build multipart payload (supports file attachments) */
    const data = new FormData(form);
    /* Append full phone with prefix for convenience */
    data.set('deliveryPhone', '+375' + form.querySelector('[name="deliveryPhone"]').value.replace(/\D/g, ''));

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';

    try {
      const res = await fetch(API_URL, { method: 'POST', body: data });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      showToast('Заявка отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
      form.reset();
      form.querySelector('[name="firstName"]') && form.querySelectorAll('.fc-dark').forEach(clearError);
      /* Reset service toggle to first button */
      const btns = form.querySelectorAll('.svc-btn');
      btns.forEach((b) => b.classList.remove('active'));
      btns[0] && btns[0].classList.add('active');
      document.getElementById('serviceValue').value = btns[0] ? btns[0].dataset.svc : '';
      document.getElementById('fileUploadText').textContent = 'Загрузите фотографии или видео';
    } catch (err) {
      showToast('Ошибка отправки. Проверьте соединение и попробуйте снова.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
    }
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

