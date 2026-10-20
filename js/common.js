/**
 * OmniTools - Common Shared JavaScript
 * Shared navigation, mobile menu, accordion, toasts, clipboard, and cookie banner.
 */
(function() {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Toast Notification Utility
  // -------------------------------------------------------------------------
  function ensureToastContainer() {
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  }

  window.showToast = function(message, type, duration) {
    type = type || 'success';
    duration = duration || 3200;

    var container = ensureToastContainer();
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    var iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = iconSvg + '<span></span>';
    toast.querySelector('span').textContent = message;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    // Remove toast after duration
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  };

  // -------------------------------------------------------------------------
  // 2. Copy to Clipboard Utility
  // -------------------------------------------------------------------------
  window.copyToClipboard = function(text, successMsg) {
    successMsg = successMsg || 'Copied to clipboard!';
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function() {
        window.showToast(successMsg, 'success');
      }).catch(function() {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  };

  function fallbackCopyText(text, successMsg) {
    try {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      var successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        window.showToast(successMsg, 'success');
      } else {
        window.showToast('Unable to copy automatically. Please copy manually.', 'error');
      }
    } catch (err) {
      window.showToast('Copy failed. Please copy manually.', 'error');
    }
  }

  // -------------------------------------------------------------------------
  // 3. Main Init on DOMContentLoaded
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    initStickyHeader();
    initActiveNavLinks();
    initMobileNav();
    initFaqAccordion();
    initBackToTop();
    initCookieBanner();
    initDynamicYear();
  });

  // Sticky Header Effect
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function checkScroll() {
      if (window.scrollY > 15) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // Active Navigation Links
  function initActiveNavLinks() {
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';

    var links = document.querySelectorAll('.nav-link, .mobile-nav-link');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop().split('#')[0];
      if (linkPage === page) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Mobile Navigation Drawer
  function initMobileNav() {
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var drawer = document.querySelector('.mobile-nav-drawer');
    if (!menuBtn || !drawer) return;

    function openMenu() {
      drawer.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    }

    function closeMenu() {
      drawer.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }

    menuBtn.addEventListener('click', function() {
      var isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close on clicking links
    var drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // FAQ Accordion
  function initFaqAccordion() {
    var questions = document.querySelectorAll('.faq-question');
    questions.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = btn.closest('.faq-item');
        var answer = item.querySelector('.faq-answer');
        var isOpen = item.classList.contains('open');

        // Close all items in this list if desired, or allow multiple
        item.classList.toggle('open');
        btn.setAttribute('aria-expanded', !isOpen);

        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    });
  }

  // Back to Top Button
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Dynamic Year in Footer
  function initDynamicYear() {
    var yearSpans = document.querySelectorAll('#current-year, .current-year');
    var year = new Date().getFullYear();
    yearSpans.forEach(function(el) {
      el.textContent = year;
    });
  }

  // Cookie Consent Banner
  function initCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;

    var consent = localStorage.getItem('omnitools_cookie_consent');
    if (!consent) {
      setTimeout(function() {
        banner.classList.add('show');
      }, 1000);
    }

    var acceptAllBtn = document.getElementById('cookie-accept-all');
    var acceptEssentialBtn = document.getElementById('cookie-accept-essential');

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', function() {
        localStorage.setItem('omnitools_cookie_consent', 'all');
        banner.classList.remove('show');
        window.showToast('Cookie preferences saved.', 'info');
      });
    }

    if (acceptEssentialBtn) {
      acceptEssentialBtn.addEventListener('click', function() {
        localStorage.setItem('omnitools_cookie_consent', 'essential');
        banner.classList.remove('show');
        window.showToast('Essential cookies accepted.', 'info');
      });
    }
  }

})();
