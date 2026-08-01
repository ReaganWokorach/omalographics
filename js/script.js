// Omalo Graphics Centre Ltd — site interactivity

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Services tabs ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const tabImages = document.querySelectorAll('.tab-media img');
  const tabMediaLabel = document.getElementById('tabMediaLabel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach(panel => {
        panel.classList.toggle('is-active', panel.dataset.panel === target);
      });

      if (tabImages.length) {
        tabImages.forEach(img => img.classList.toggle('is-active', img.dataset.forTab === target));
      }
      if (tabMediaLabel) {
        tabMediaLabel.textContent = btn.textContent;
      }
    });
  });

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.countTo);
      const suffix = el.dataset.suffix || '';
      const duration = 1100;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(el => counterObserver.observe(el));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Gallery lightbox ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCap = lightbox.querySelector('.lightbox-cap');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const openLightbox = (item) => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.cap');
      lightboxImg.src = img.dataset.full || img.src;
      lightboxImg.alt = img.alt;
      lightboxCap.textContent = cap ? cap.textContent : img.alt;
      lightbox.classList.add('is-open');
      document.body.classList.add('nav-open');
    };
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
    });
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-title, .value-card, .stat-card, .vm-card, .why-item, .market-card, .tt-card, .process-list li, .gallery-item, .media-copy-media, .media-copy-copy'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();
      const website = document.getElementById('website') ? document.getElementById('website').value : '';
      const turnstileToken = typeof turnstile !== 'undefined'
        ? turnstile.getResponse()
        : (contactForm.querySelector('[name="cf-turnstile-response"]') || {}).value;

      const setStatus = (text, isError) => {
        if (!formStatus) return;
        formStatus.textContent = text;
        formStatus.classList.toggle('is-error', !!isError);
      };

      if (!turnstileToken) {
        setStatus('Please complete the verification challenge before sending.', true);
        return;
      }

      submitBtn.disabled = true;
      setStatus('Sending your message…', false);

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name, email, service, message, website, turnstileToken }),
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          setStatus(`Thanks${name ? ', ' + name : ''}. Your message has been sent — we will get back to you soon.`, false);
          contactForm.reset();
          if (typeof turnstile !== 'undefined') turnstile.reset();
        } else {
          setStatus(data.error || 'Something went wrong. Please try again.', true);
          if (typeof turnstile !== 'undefined') turnstile.reset();
        }
      } catch (err) {
        setStatus('Could not send your message. Please check your connection and try again.', true);
        if (typeof turnstile !== 'undefined') turnstile.reset();
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

});
