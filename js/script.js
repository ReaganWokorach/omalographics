/* =========================================================
   OMALO GRAPHICS CENTRE LTD — site script
   Vanilla JS, no dependencies. Progressively enhances the
   markup in index/about/services/approach/market/contact/404.
   ========================================================= */
(function () {
  'use strict';

  /* ===================== MOBILE NAV ===================== */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    var closeNav = function () {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };
    var openNav = function () {
      mainNav.classList.add('is-open');
      navToggle.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    };

    navToggle.addEventListener('click', function () {
      if (mainNav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    Array.prototype.forEach.call(mainNav.querySelectorAll('a'), function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // If the viewport is resized back to desktop while the mobile
    // menu is open, reset everything so it doesn't get stuck.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ===================== BACK TO TOP ===================== */
  var toTop = document.getElementById('toTop');

  if (toTop) {
    var toggleToTop = function () {
      if (window.scrollY > 420) {
        toTop.classList.add('is-visible');
      } else {
        toTop.classList.remove('is-visible');
      }
    };
    window.addEventListener('scroll', toggleToTop, { passive: true });
    toggleToTop();

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===================== ANIMATED STAT COUNTERS ===================== */
  var counters = document.querySelectorAll('[data-count-to]');

  if (counters.length) {
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      var duration = 1100;
      var start = null;

      var step = function (timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      };
      window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      Array.prototype.forEach.call(counters, function (el) {
        counterObserver.observe(el);
      });
    } else {
      Array.prototype.forEach.call(counters, animateCount);
    }
  }

  /* ===================== REVEAL ON SCROLL ===================== */
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      Array.prototype.forEach.call(reveals, function (el) {
        revealObserver.observe(el);
      });
    } else {
      Array.prototype.forEach.call(reveals, function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  /* ===================== SERVICES TABS (services.html) ===================== */
  var tabsNav = document.getElementById('tabsNav');

  if (tabsNav) {
    var tabButtons = tabsNav.querySelectorAll('.tab-btn');
    var panels = document.querySelectorAll('.tab-panel');
    var tabMediaImgs = document.querySelectorAll('.tab-media img[data-for-tab]');
    var tabMediaLabel = document.querySelector('.tab-media-label');

    var activateTab = function (key) {
      Array.prototype.forEach.call(tabButtons, function (btn) {
        var active = btn.getAttribute('data-tab') === key;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
        if (active && tabMediaLabel) tabMediaLabel.textContent = btn.textContent;
      });
      Array.prototype.forEach.call(panels, function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-panel') === key);
      });
      Array.prototype.forEach.call(tabMediaImgs, function (img) {
        img.classList.toggle('is-active', img.getAttribute('data-for-tab') === key);
      });
    };

    Array.prototype.forEach.call(tabButtons, function (btn) {
      btn.addEventListener('click', function () {
        activateTab(btn.getAttribute('data-tab'));
      });
    });
  }

  /* ===================== SERVICE DETAIL MODAL (services.html) ===================== */
  var serviceModal = document.getElementById('serviceModal');

  if (serviceModal) {
    var modalIcon = document.getElementById('serviceModalIcon');
    var modalCat = document.getElementById('serviceModalCat');
    var modalTitle = document.getElementById('serviceModalTitle');
    var modalDesc = document.getElementById('serviceModalDesc');
    var lastFocused = null;

    var openServiceModal = function (btn) {
      var icon = btn.getAttribute('data-icon');
      if (modalIcon && icon) modalIcon.setAttribute('href', '#icon-' + icon);
      if (modalCat) modalCat.textContent = btn.getAttribute('data-cat') || '';
      if (modalTitle) modalTitle.textContent = btn.getAttribute('data-title') || '';
      if (modalDesc) modalDesc.textContent = btn.getAttribute('data-desc') || '';

      lastFocused = document.activeElement;
      serviceModal.classList.add('is-open');
      serviceModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');

      var closeBtn = serviceModal.querySelector('.service-modal-close');
      if (closeBtn) closeBtn.focus();
    };

    var closeServiceModal = function () {
      serviceModal.classList.remove('is-open');
      serviceModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    Array.prototype.forEach.call(document.querySelectorAll('.service-item'), function (btn) {
      btn.addEventListener('click', function () {
        openServiceModal(btn);
      });
    });

    Array.prototype.forEach.call(serviceModal.querySelectorAll('[data-close-modal]'), function (el) {
      el.addEventListener('click', closeServiceModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && serviceModal.classList.contains('is-open')) closeServiceModal();
    });
  }

  /* ===================== GALLERY LIGHTBOX (index.html) ===================== */
  var lightbox = document.getElementById('lightbox');

  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var lightboxCap = lightbox.querySelector('.lightbox-cap');
    var lightboxClose = lightbox.querySelector('.lightbox-close');

    var openLightbox = function (item) {
      var img = item.querySelector('img');
      var cap = item.querySelector('.cap');
      if (!img || !lightboxImg) return;

      lightboxImg.src = img.getAttribute('data-full') || img.src;
      lightboxImg.alt = img.alt || '';
      if (lightboxCap) lightboxCap.textContent = cap ? cap.textContent : '';

      lightbox.classList.add('is-open');
      document.body.classList.add('nav-open');
    };

    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      if (lightboxImg) lightboxImg.src = '';
    };

    Array.prototype.forEach.call(document.querySelectorAll('.gallery-item'), function (item) {
      item.style.cursor = 'zoom-in';
      item.addEventListener('click', function () {
        openLightbox(item);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ===================== CONTACT FORM (contact.html) ===================== */
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    var formStatus = document.getElementById('formStatus');
    var submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: real visitors never see or fill this field.
      var honeypot = contactForm.querySelector('#website');
      if (honeypot && honeypot.value) {
        if (formStatus) formStatus.textContent = 'Thanks — we will be in touch shortly.';
        contactForm.reset();
        return;
      }

      var nameField = contactForm.querySelector('#name');
      var emailField = contactForm.querySelector('#email');
      if ((nameField && !nameField.value.trim()) || (emailField && !emailField.value.trim())) {
        if (formStatus) formStatus.textContent = 'Please fill in your name and a way to reach you.';
        return;
      }

      var formData = new FormData(contactForm);
      var payload = {};
      formData.forEach(function (value, key) { payload[key] = value; });

      if (submitBtn) submitBtn.disabled = true;
      if (formStatus) formStatus.textContent = 'Sending…';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          if (formStatus) formStatus.textContent = 'Thanks — your message has been sent. We will be in touch shortly.';
          contactForm.reset();
          if (window.turnstile && typeof window.turnstile.reset === 'function') {
            window.turnstile.reset();
          }
        })
        .catch(function () {
          if (formStatus) {
            formStatus.textContent = 'Something went wrong sending your message. Please try again, or reach us directly by phone.';
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

})();
