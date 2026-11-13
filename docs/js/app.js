/* WAAD Design Studio — holding page */
(function () {
  'use strict';

  var stage   = document.getElementById('stage');
  var modal   = document.getElementById('modal');

  // Two compositions live in the DOM: the desktop set and the studio's
  // separate mobile set. Only one is on screen, and the carousel runs
  // whichever that is.
  var sets = {
    desktop: document.querySelector('.set--desktop'),
    mobile: document.querySelector('.set--mobile')
  };
  var portrait = window.matchMedia('(max-aspect-ratio: 4/5)');
  var slides = [];
  var openers = document.querySelectorAll('.js-open');
  var closers = document.querySelectorAll('.js-close');
  var prevBtn = document.querySelector('.arrow--prev');
  var nextBtn = document.querySelector('.arrow--next');

  var index = 0;
  var timer = null;
  var lastFocus = null;

  // Visitors who ask for reduced motion still get the carousel — a slow
  // cross-fade is gentle — but it dwells longer, and CSS keeps the
  // scrolling marquee still for them.
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DWELL = calm ? 9000 : 6000;   // ms a slide stays on screen

  /* ---------- images ---------- */

  function load(slide) {
    if (!slide) return;

    var sources = slide.querySelectorAll('source[data-srcset]');
    Array.prototype.forEach.call(sources, function (s) {
      s.srcset = s.dataset.srcset;
      delete s.dataset.srcset;
    });

    var imgs = slide.querySelectorAll('img[data-src]');
    Array.prototype.forEach.call(imgs, function (img) {
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
      delete img.dataset.src;
      delete img.dataset.srcset;
    });
  }

  function preloadAround(i) {
    load(slides[i]);
    load(slides[(i + 1) % slides.length]);
    load(slides[(i - 1 + slides.length) % slides.length]);
  }

  /* ---------- slides ---------- */

  function paintBody() {
    // the body colour backs the cross-fade, so it follows whichever
    // composition is on screen: the slide itself, or the mobile panel
    var panel = slides[index].querySelector('.panel');
    document.body.style.background =
      getComputedStyle(panel || slides[index]).backgroundColor || '#4B242C';
  }

  function show(next) {
    next = (next + slides.length) % slides.length;
    if (next === index) return;
    slides[index].classList.remove('is-active');
    slides[index].setAttribute('aria-hidden', 'true');
    index = next;
    slides[index].classList.add('is-active');
    slides[index].setAttribute('aria-hidden', 'false');
    preloadAround(index);
    paintBody();
  }

  // Adopt the set that matches the current viewport, keeping the position
  // in the sequence so a rotation doesn't throw the visitor back to slide 1.
  function adopt() {
    var set = portrait.matches ? sets.mobile : sets.desktop;
    var next = Array.prototype.slice.call(set.querySelectorAll('.slide'));
    var keep = slides.length ? index % next.length : 0;

    var all = document.querySelectorAll('.slide');
    Array.prototype.forEach.call(all, function (s) {
      s.classList.remove('is-active');
      s.setAttribute('aria-hidden', 'true');
    });

    slides = next;
    index = keep;
    slides[index].classList.add('is-active');
    slides[index].setAttribute('aria-hidden', 'false');
    preloadAround(index);
    paintBody();
  }

  function step() { show(index + 1); }

  function start() {
    stop();
    timer = window.setInterval(step, DWELL);
  }

  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  function nudge(dir) {
    show(index + dir);
    start();                       // restart the clock after a manual move
  }

  /* ---------- popup ---------- */

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    stop();
    window.requestAnimationFrame(function () {
      modal.classList.add('is-open');
    });
    var first = modal.querySelector('.ico');
    if (first) first.focus({ preventScroll: true });
  }

  function closeModal() {
    modal.classList.remove('is-open');
    window.setTimeout(function () {
      modal.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      start();
    }, calm ? 0 : 420);
  }

  function trap(e) {
    if (modal.hidden || e.key !== 'Tab') return;
    var f = modal.querySelectorAll('a[href], button');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- wiring ---------- */

  Array.prototype.forEach.call(openers, function (b) {
    b.addEventListener('click', openModal);
  });
  Array.prototype.forEach.call(closers, function (b) {
    b.addEventListener('click', closeModal);
  });

  prevBtn.addEventListener('click', function () { nudge(-1); });
  nextBtn.addEventListener('click', function () { nudge(1); });

  document.addEventListener('keydown', function (e) {
    if (!modal.hidden) {
      if (e.key === 'Escape') closeModal();
      trap(e);
      return;
    }
    if (e.key === 'ArrowRight') nudge(1);
    if (e.key === 'ArrowLeft') nudge(-1);
  });

  var x0 = null;
  stage.addEventListener('touchstart', function (e) {
    x0 = e.changedTouches[0].clientX;
  }, { passive: true });

  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) nudge(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (modal.hidden) start();
  });

  if (portrait.addEventListener) {
    portrait.addEventListener('change', function () { adopt(); start(); });
  } else if (portrait.addListener) {
    portrait.addListener(function () { adopt(); start(); });
  }

  adopt();
  start();
})();

