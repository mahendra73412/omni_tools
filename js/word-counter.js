/**
 * OmniTools - Word Counter Tool
 * Real-time text analysis, word/character/sentence/paragraph counting,
 * reading time estimates, text formatting, and clipboard utilities.
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var textArea = document.getElementById('wc-input');
  var valWords = document.getElementById('stat-words');
  var valCharsWithSpaces = document.getElementById('stat-chars-spaces');
  var valCharsNoSpaces = document.getElementById('stat-chars-no-spaces');
  var valSentences = document.getElementById('stat-sentences');
  var valParagraphs = document.getElementById('stat-paragraphs');
  var valReadingTime = document.getElementById('stat-reading-time');
  var valSpeakingTime = document.getElementById('stat-speaking-time');

  var btnCopy = document.getElementById('wc-btn-copy');
  var btnClear = document.getElementById('wc-btn-clear');
  var btnPaste = document.getElementById('wc-btn-paste');
  var btnSample = document.getElementById('wc-btn-sample');

  var btnUppercase = document.getElementById('wc-btn-uppercase');
  var btnLowercase = document.getElementById('wc-btn-lowercase');
  var btnTitlecase = document.getElementById('wc-btn-titlecase');
  var btnSentencecase = document.getElementById('wc-btn-sentencecase');
  var btnCleanSpaces = document.getElementById('wc-btn-clean-spaces');

  if (!textArea) return;

  var SAMPLE_TEXT = 
    "OmniTools provides modern, fast, and privacy-focused online tools that operate entirely within your browser.\n\n" +
    "Whether you are writing an essay, resizing high-resolution photos, or formatting complex JSON data, " +
    "your confidential information is never transmitted to an external server. You enjoy maximum speed, complete autonomy, and peace of mind.\n\n" +
    "Try typing or pasting your own text to inspect real-time word and character counts!";

  function updateStats() {
    var text = textArea.value;

    // Characters with spaces
    var charsWithSpaces = text.length;

    // Characters without spaces
    var charsNoSpaces = text.replace(/\s/g, '').length;

    // Words count (properly splitting on whitespace and ignoring empty entries)
    var trimmed = text.trim();
    var words = 0;
    if (trimmed.length > 0) {
      words = trimmed.split(/\s+/).length;
    }

    // Sentences count (splitting on '.', '!', '?' followed by space or end)
    var sentences = 0;
    if (trimmed.length > 0) {
      var sentenceMatches = trimmed.match(/[^.!?]+[.!?]+(\s|$)/g);
      sentences = sentenceMatches ? sentenceMatches.length : (trimmed.length > 0 ? 1 : 0);
    }

    // Paragraphs count (splitting by one or more newlines)
    var paragraphs = 0;
    if (trimmed.length > 0) {
      var pMatches = text.split(/\n+/).filter(function(p) {
        return p.trim().length > 0;
      });
      paragraphs = pMatches.length;
    }

    // Reading time: avg 200 words per minute
    var readingMinutes = Math.ceil(words / 200);
    var readingStr = words === 0 ? '0 min' : (readingMinutes === 1 ? '< 1 min' : readingMinutes + ' min');

    // Speaking time: avg 130 words per minute
    var speakingMinutes = Math.ceil(words / 130);
    var speakingStr = words === 0 ? '0 min' : (speakingMinutes === 1 ? '< 1 min' : speakingMinutes + ' min');

    // Update DOM
    if (valWords) valWords.textContent = words.toLocaleString();
    if (valCharsWithSpaces) valCharsWithSpaces.textContent = charsWithSpaces.toLocaleString();
    if (valCharsNoSpaces) valCharsNoSpaces.textContent = charsNoSpaces.toLocaleString();
    if (valSentences) valSentences.textContent = sentences.toLocaleString();
    if (valParagraphs) valParagraphs.textContent = paragraphs.toLocaleString();
    if (valReadingTime) valReadingTime.textContent = readingStr;
    if (valSpeakingTime) valSpeakingTime.textContent = speakingStr;
  }

  // Live input listening
  textArea.addEventListener('input', updateStats);
  textArea.addEventListener('change', updateStats);

  // Copy button
  if (btnCopy) {
    btnCopy.addEventListener('click', function() {
      if (!textArea.value) {
        window.showToast('Text area is empty.', 'info');
        return;
      }
      window.copyToClipboard(textArea.value, 'Text copied to clipboard!');
    });
  }

  // Clear button
  if (btnClear) {
    btnClear.addEventListener('click', function() {
      if (!textArea.value) return;
      textArea.value = '';
      updateStats();
      textArea.focus();
      window.showToast('Text cleared.', 'info');
    });
  }

  // Paste button
  if (btnPaste) {
    btnPaste.addEventListener('click', function() {
      if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function(clipText) {
          textArea.value = clipText;
          updateStats();
          window.showToast('Pasted from clipboard!', 'success');
        }).catch(function() {
          window.showToast('Clipboard access denied. Please paste manually.', 'error');
        });
      } else {
        window.showToast('Clipboard API unavailable. Please press Ctrl+V / Cmd+V.', 'info');
      }
    });
  }

  // Sample text button
  if (btnSample) {
    btnSample.addEventListener('click', function() {
      textArea.value = SAMPLE_TEXT;
      updateStats();
      window.showToast('Sample text loaded.', 'success');
    });
  }

  // Text Transform Utilities
  if (btnUppercase) {
    btnUppercase.addEventListener('click', function() {
      if (!textArea.value) return;
      textArea.value = textArea.value.toUpperCase();
      updateStats();
    });
  }

  if (btnLowercase) {
    btnLowercase.addEventListener('click', function() {
      if (!textArea.value) return;
      textArea.value = textArea.value.toLowerCase();
      updateStats();
    });
  }

  if (btnTitlecase) {
    btnTitlecase.addEventListener('click', function() {
      if (!textArea.value) return;
      textArea.value = textArea.value.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
      });
      updateStats();
    });
  }

  if (btnSentencecase) {
    btnSentencecase.addEventListener('click', function() {
      if (!textArea.value) return;
      var text = textArea.value.toLowerCase();
      textArea.value = text.replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) {
        return c.toUpperCase();
      });
      updateStats();
    });
  }

  if (btnCleanSpaces) {
    btnCleanSpaces.addEventListener('click', function() {
      if (!textArea.value) return;
      textArea.value = textArea.value
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
      updateStats();
      window.showToast('Extra spaces cleaned!', 'success');
    });
  }

  // Initial calculation
  updateStats();
});
