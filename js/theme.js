/**
 * OmniTools - Theme Manager (Light / Dark Mode)
 * Accessible, zero-flash, system-preference aware.
 */
(function() {
  'use strict';

  var THEME_KEY = 'omnitools_theme';

  /**
   * Determine preferred theme:
   * 1. Check localStorage for user override
   * 2. Fall back to system color scheme preference
   */
  function getPreferredTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Apply theme to <html> element and update toggles
   */
  function applyTheme(theme) {
    var isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }

    // Update all theme toggle buttons on page
    var toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(function(btn) {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });

    // Notify any components that care about theme changes
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme, isDark: isDark } }));
  }

  /**
   * Set theme explicitly and persist
   */
  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  /**
   * Toggle between light and dark
   */
  function toggleTheme() {
    var current = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  // Initial apply
  applyTheme(getPreferredTheme());

  // Listen for system theme changes if user has not set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Setup DOM event handlers when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    var toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
      });
    });

    // Re-sync UI state
    applyTheme(getPreferredTheme());
  });

  // Expose global methods
  window.getPreferredTheme = getPreferredTheme;
  window.setTheme = setTheme;
  window.toggleTheme = toggleTheme;
})();
