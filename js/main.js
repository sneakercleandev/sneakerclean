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
