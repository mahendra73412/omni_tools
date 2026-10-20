/**
 * OmniTools - Tool Search and Discovery Script
 * Handles real-time search, category filtering, and empty states.
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var searchInput = document.getElementById('tool-search-input');
  var clearSearchBtn = document.getElementById('search-clear-btn');
  var filterPills = document.querySelectorAll('.filter-pill');
  var toolCards = document.querySelectorAll('.tool-card');
  var emptyState = document.getElementById('tools-empty-state');
  var emptyQueryText = document.getElementById('empty-query-text');
  var resetFiltersBtn = document.getElementById('reset-filters-btn');

  var currentCategory = 'all';
  var currentSearchQuery = '';

  function filterTools() {
    var query = currentSearchQuery.trim().toLowerCase();
    var visibleCount = 0;

    toolCards.forEach(function(card) {
      var title = (card.querySelector('.tool-card-title') || {}).textContent || '';
      var desc = (card.querySelector('.tool-card-description') || {}).textContent || '';
      var category = card.getAttribute('data-category') || '';

      var matchesCategory = (currentCategory === 'all' || category === currentCategory);
      var matchesSearch = (!query || title.toLowerCase().includes(query) || desc.toLowerCase().includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = 'block';
        if (emptyQueryText) {
          emptyQueryText.textContent = query ? '"' + query + '"' : 'selected category';
        }
      } else {
        emptyState.style.display = 'none';
      }
    }
  }

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      currentSearchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearchQuery ? 'block' : 'none';
      }
      filterTools();
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        currentSearchQuery = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        filterTools();
      });
    }
  }

  // Category filter buttons
  filterPills.forEach(function(pill) {
    pill.addEventListener('click', function(e) {
      e.preventDefault();
      filterPills.forEach(function(p) { p.classList.remove('active'); });
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category') || 'all';
      filterTools();
    });
  });

  // Reset filters button in empty state
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function() {
      if (searchInput) {
        searchInput.value = '';
        currentSearchQuery = '';
      }
      if (clearSearchBtn) {
        clearSearchBtn.style.display = 'none';
      }
      currentCategory = 'all';
      filterPills.forEach(function(p) {
        if (p.getAttribute('data-category') === 'all') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
      filterTools();
    });
  }
});
