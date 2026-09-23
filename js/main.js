/* =========================================================
   Excel Minds Academy — interaction & motion
   One easing family (expo.out), one pinned section, all
   transforms/opacity. Content is fully visible without JS
   and under prefers-reduced-motion.
   ========================================================= */
(() => {
  const d = document;
  const html = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Without GSAP (blocked CDN, old browser) fall back to a static, fully visible page.
  if (!hasGsap) html.classList.remove('js');

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);
    if (!reduce && window.Lenis) {
      lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------------- mobile menu ---------------- */
  const toggle = $('.menu-toggle');
  const menu = $('#menu');
  let menuOpen = false;

  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    $('.menu-toggle__label', toggle).textContent = open ? 'Close' : 'Menu';
    html.classList.toggle('menu-open', open);
    html.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();

    const links = $$('.menu__links a, .menu__foot > *', menu);
    if (open) {
      menu.hidden = false;
      if (hasGsap && !reduce) {
        gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.out' });
        gsap.fromTo(links, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: 'expo.out', delay: 0.1 });
      }
      $('.menu__links a', menu).focus({ preventScroll: true });
    } else {
      const done = () => { menu.hidden = true; };
      if (hasGsap && !reduce) gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: done });
      else done();
    }
  }
  toggle.addEventListener('click', () => setMenu(!menuOpen));
  d.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); toggle.focus(); }
    // simple focus trap while the menu is open
    if (e.key === 'Tab' && menuOpen) {
      const f = [toggle, ...$$('a', menu)];
      const i = f.indexOf(d.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------------- in-page anchors ---------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = id === 'top' ? 0 : d.getElementById(id);
      if (target === null) return;
      e.preventDefault();
      if (menuOpen) setMenu(false);
      scrollToTarget(target);
      if (target !== 0) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ---------------- hero video ---------------- */
  const video = $('.hero__video');
  if (video) {
    video.muted = true;
    // The clip closes on a logo card and a fade to black (~23.8s onward);
    // loop only the live-action montage so the background never blanks out.
    const LOOP_END = 23.5;
    video.addEventListener('timeupdate', () => { if (video.currentTime >= LOOP_END) video.currentTime = 0; });
    if (reduce) {
      // motion-sensitive visitors get the still poster and skip the download
      video.pause();
      $$('source', video).forEach((s) => s.remove());
      video.removeAttribute('preload');
      video.load();
    } else {
      const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => { /* autoplay blocked: poster stays */ }); };
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : video.pause()), { threshold: 0.05 }).observe(video);
      d.addEventListener('visibilitychange', () => { if (d.hidden) video.pause(); });
    }
  }

  /* ---------------- draggable gallery (marquee 2) ---------------- */
  function gallery() {
    const root = $('.gallery');
    const track = $('.gallery__track', root);
    if (!root || !track) return;
    const originals = [...track.children];

    // Clone the set until the strip is comfortably wider than the viewport.
    const addSet = () => originals.forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      $$('img', c).forEach((img) => { img.alt = ''; });
      track.appendChild(c);
    });
    addSet(); addSet();

    let setW = 0;
    const measure = () => { setW = track.children[originals.length].offsetLeft - originals[0].offsetLeft; };
    measure();
    addEventListener('resize', measure);

    const wrap = (v) => (setW ? ((v % setW) - setW) % setW : v);
    const cardStep = () => originals[1].offsetLeft - originals[0].offsetLeft;

    let x = 0, momentum = 0, dragging = false, moved = 0, lastX = 0, lastT = 0, vel = 0;
    let hover = false, focus = false, visible = true, glide = null;
    const autoSpeed = reduce ? 0 : 0.03; // px per ms

    root.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true; moved = 0; glide = null; momentum = 0;
      lastX = e.clientX; lastT = performance.now(); vel = 0;
      root.classList.add('is-dragging');
    });
    root.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      if (Math.abs(dx) > 0 && !root.hasPointerCapture(e.pointerId)) root.setPointerCapture(e.pointerId);
      x += dx; moved += Math.abs(dx);
      vel = dx / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      momentum = reduce ? 0 : vel * 16;
      root.classList.remove('is-dragging');
    };
    root.addEventListener('pointerup', end);
    root.addEventListener('pointercancel', end);
    root.addEventListener('lostpointercapture', end);
    root.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover = true; });
    root.addEventListener('pointerleave', () => { hover = false; });
    root.addEventListener('focusin', () => { focus = true; });
    root.addEventListener('focusout', () => { focus = false; });

    const step = (dir) => { glide = { from: x, to: x - dir * cardStep() * 2, t0: performance.now(), dur: reduce ? 1 : 900 }; momentum = 0; };
    $$('[data-gal]').forEach((b) => b.addEventListener('click', () => step(b.dataset.gal === 'next' ? 1 : -1)));
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });

    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(root);

    const easeOut = (t) => 1 - Math.pow(2, -10 * t);
    let prev = performance.now();
    const loop = (now) => {
      const dt = Math.min(64, now - prev); prev = now;
      if (visible) {
        if (glide) {
          const t = Math.min(1, (now - glide.t0) / glide.dur);
          x = glide.from + (glide.to - glide.from) * easeOut(t);
          if (t === 1) glide = null;
        } else if (!dragging) {
          x += momentum; momentum *= 0.93;
          if (Math.abs(momentum) < 0.05) momentum = 0;
          if (!hover && !focus) x -= autoSpeed * dt;
        }
        const wrapped = wrap(x);
        if (glide) { glide.from += wrapped - x; glide.to += wrapped - x; }
        x = wrapped;
        track.style.transform = `translate3d(${x}px,0,0)`;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // Drag cursor for mouse users
    const cursor = $('.cursor');
    if (hasGsap && finePointer && cursor) {
      const cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' });
      const cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' });
      root.addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); });
      root.addEventListener('pointerenter', (e) => {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' });
        root.style.cursor = 'none';
      });
      root.addEventListener('pointerleave', () => gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.4, ease: 'expo.out' }));
      root.addEventListener('pointerdown', () => gsap.to(cursor, { scale: 0.8, duration: 0.3 }));
      root.addEventListener('pointerup', () => gsap.to(cursor, { scale: 1, duration: 0.4 }));
    }
  }
  gallery();

  /* ---------------- mobile "way" carousel progress ---------------- */
  const wayTrack = $('.way__track');
  const wayBar = $('.way__progress i');
  const onWayScroll = () => {
    const max = wayTrack.scrollWidth - wayTrack.clientWidth;
    wayBar.style.transform = `scaleX(${max > 0 ? Math.max(0.08, wayTrack.scrollLeft / max) : 1})`;
  };
  wayTrack.addEventListener('scroll', onWayScroll, { passive: true });
  onWayScroll();

  if (!hasGsap) {
    const nav = $('.nav');
    addEventListener('scroll', () => nav.classList.toggle('is-scrolled', scrollY > 40), { passive: true });
    return;
  }

  /* =========================================================
     Everything below is GSAP-driven motion
     ========================================================= */

  /* ---------------- nav state ---------------- */
  const nav = $('.nav');
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', self.direction === 1 && y > innerHeight * 0.7 && !menuOpen && !nav.contains(d.activeElement));
    },
  });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  $$('[data-nav="light"]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: () => `top ${nav.offsetHeight / 2}px`, end: () => `bottom ${nav.offsetHeight / 2}px`,
      toggleClass: { targets: nav, className: 'on-light' },
    });
  });
  $$('.nav__links a').forEach((a) => {
    const sec = d.getElementById(a.getAttribute('href').slice(1));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', toggleClass: { targets: a, className: 'is-active' } });
  });

  /* ---------------- reduced motion: static page, done ---------------- */
  if (reduce) {
    wayBar.style.transform = 'scaleX(1)';
    return;
  }

  /* ---------------- entrance ---------------- */
  function intro() {
    const loader = $('.loader');
    const desktop = matchMedia('(min-width: 900px)').matches;
    const lockScroll = scrollY < 10;
    if (lockScroll) { html.style.overflow = 'hidden'; if (lenis) lenis.stop(); }
    const release = () => { html.style.overflow = ''; if (lenis) lenis.start(); };

    // wrap hero lines for masked reveal
    $$('.hero__title .line').forEach((l) => {
      l.innerHTML = `<span class="line__in">${l.innerHTML}</span>`;
    });

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo('.loader__crest', { opacity: 0, scale: 0.85, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.8 })
      .to('.loader__word span', { y: 0, duration: 0.8 }, 0.15)
      .to('.loader__inner', { opacity: 0, y: -24, duration: 0.5, ease: 'power2.in' }, 0.95)
      .to('.loader__panel', { scaleY: 0, duration: 1.0, ease: 'expo.inOut' }, 1.1)
      .set(loader, { display: 'none' })
      .add('hero', 1.45);

    if (desktop) {
      tl.fromTo('.hero__frame', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 'hero-=0.45')
        .fromTo('.hero__video', { scale: 1.45 }, { scale: 1.2, duration: 2.0 }, 'hero-=0.3');
    } else {
      tl.fromTo('.hero__frame', { scale: 1.14 }, { scale: 1, duration: 2.2 }, 'hero-=0.6');
    }
    tl.from('.hero__title .line__in', { yPercent: 115, rotate: 2, duration: 1.3, stagger: 0.1 }, 'hero')
      .to('.hero__eyebrow', { opacity: 1, duration: 1 }, 'hero+=0.1')
      .from('.hero__eyebrow', { y: 16, duration: 1 }, '<')
      .to(['.hero__lede', '.hero__ctas', '.hero__foot'], { opacity: 1, duration: 1.1, stagger: 0.08 }, 'hero+=0.35')
      .from(['.hero__lede', '.hero__ctas'], { y: 22, duration: 1.1, stagger: 0.08 }, '<')
      .from('.nav > *', { y: -30, opacity: 0, duration: 1.1, stagger: 0.06 }, 'hero+=0.2')
      .add(release, 'hero+=0.4');
    return tl;
  }
  try { intro(); } catch (err) {
    // never leave the page hidden behind a failed intro
    html.classList.remove('js'); html.style.overflow = '';
    const l = $('.loader'); if (l) l.style.display = 'none';
  }

  /* ---------------- scroll choreography ---------------- */
  const mm = gsap.matchMedia();

  mm.add({ desk: '(min-width: 900px)', mob: '(max-width: 899px)' }, (ctx) => {
    const { desk } = ctx.conditions;

    // Hero exit
    if (desk) {
      gsap.to('.hero__media', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__content', { yPercent: 18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    } else {
      gsap.to('.hero__content', { y: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true } });
      gsap.to('.hero__video', { scale: 1.34, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // The Excel Minds way — pinned horizontal rail on desktop
    if (desk) {
      const rail = $('.way__rail');
      wayTrack.removeAttribute('tabindex');
      const dist = () => Math.max(0, rail.scrollWidth - innerWidth);
      const railTween = gsap.to(rail, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.way', start: 'top top', end: () => `+=${dist()}`,
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => { wayBar.style.transform = `scaleX(${self.progress})`; },
        },
      });
      $$('.panel').forEach((p) => {
        const fig = $('.panel__fig', p);
        const img = $('img', fig);
        gsap.fromTo(fig, { clipPath: 'inset(0% 0% 0% 100%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: p, containerAnimation: railTween, start: 'left 92%', toggleActions: 'play none none none' },
        });
        gsap.fromTo(img, { xPercent: -7 }, {
          xPercent: 7, ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: railTween, start: 'left right', end: 'right left', scrub: true },
        });
        gsap.from($$('.panel__body > *', p), {
          y: 30, opacity: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out',
          scrollTrigger: { trigger: p, containerAnimation: railTween, start: 'left 85%' },
        });
      });
      return () => { wayTrack.setAttribute('tabindex', '0'); };
    }

    // mobile: panels rise in as the carousel enters
    gsap.from('.panel', {
      y: 50, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: '.way__track', start: 'top 85%' },
    });
    return undefined;
  });

  /* ---------------- marquee 1: velocity-reactive ticker ---------------- */
  (function ticker() {
    const track = $('.ticker__track');
    const row = $('.ticker__row', track);
    let rowW = 0;
    const build = () => {
      $$('.ticker__row', track).slice(1).forEach((r) => r.remove());
      rowW = row.offsetWidth;
      const n = Math.ceil((innerWidth * 1.5) / rowW) + 1;
      for (let i = 0; i < n; i++) track.appendChild(row.cloneNode(true));
    };
    build();
    let lastW = innerWidth;
    addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; build(); } });

    const setX = gsap.quickSetter(track, 'x', 'px');
    let x = 0, boost = 0, dir = 1, active = true;
    ScrollTrigger.create({
      trigger: '.ticker', start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { active = self.isActive; },
    });
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        dir = self.direction;
        boost = Math.min(Math.abs(self.getVelocity()) / 250, 7);
      },
    });
    gsap.ticker.add((t, dt) => {
      if (!active) return;
      x -= (0.055 * (1 + boost)) * dt * dir;
      x = ((x % rowW) - rowW) % rowW;
      setX(x);
      boost *= 0.93;
    });
  })();

  /* ---------------- fonts ready: text splits ---------------- */
  (d.fonts ? d.fonts.ready : Promise.resolve()).then(() => {
    if (window.SplitText) {
      // Manifesto: words light up with scroll; image pills open inline
      const m = $('[data-manifesto]');
      const split = SplitText.create(m, { type: 'words', wordsClass: 'word' });
      gsap.fromTo(split.words, { opacity: 0.14 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: m, start: 'top 78%', end: 'bottom 52%', scrub: true },
      });
      $$('.pill', m).forEach((pill) => {
        gsap.fromTo(pill, { width: 0, marginLeft: 0, marginRight: 0 }, {
          width: '1.9em', marginLeft: '.06em', marginRight: '.06em', ease: 'none',
          scrollTrigger: { trigger: pill, start: 'top 88%', end: 'top 58%', scrub: true },
        });
        gsap.fromTo($('img', pill), { scale: 1.5 }, {
          scale: 1, ease: 'none', scrollTrigger: { trigger: pill, start: 'top 88%', end: 'top 58%', scrub: true },
        });
      });

      // Headline line reveals
      $$('[data-reveal="lines"]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines', mask: 'lines', autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 115, duration: 1.3, stagger: 0.09, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }),
        });
      });
    }
    ScrollTrigger.refresh();
  });

  /* ---------------- generic fades ---------------- */
  ScrollTrigger.batch('[data-reveal="fade"]', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out' }),
  });

  /* ---------------- campus collage ---------------- */
  $$('[data-shot]').forEach((shot) => {
    const inner = $('.shot__in', shot);
    const speed = parseFloat(inner.dataset.speed) || 0;
    gsap.fromTo(shot, { clipPath: 'inset(14% 8% 14% 8%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: shot, start: 'top 88%', once: true },
    });
    gsap.fromTo($('img', shot), { scale: 1.25 }, {
      scale: 1, duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: shot, start: 'top 88%', once: true },
    });
    gsap.fromTo(inner, { yPercent: -speed }, {
      yPercent: speed, ease: 'none',
      scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // gallery strip rises in
  gsap.from('.gallery .card', {
    y: 60, opacity: 0, duration: 1.2, stagger: 0.05, ease: 'expo.out',
    scrollTrigger: { trigger: '.gallery', start: 'top 90%', once: true },
  });

  /* ---------------- closing type ---------------- */
  $$('[data-closer]').forEach((row) => {
    const dir = parseFloat(row.dataset.closer);
    gsap.fromTo(row, { xPercent: dir > 0 ? 0 : -8 }, {
      xPercent: dir > 0 ? -22 : 10, ease: 'none',
      scrollTrigger: { trigger: '.closer', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* ---------------- magnetic buttons ---------------- */
  if (finePointer) {
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.28);
        yTo((e.clientY - r.top - r.height / 2) * 0.38);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
