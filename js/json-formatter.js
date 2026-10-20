/**
 * OmniTools - JSON Formatter & Validator Tool
 * Fast, private, browser-based JSON beautifier, minifier, validator,
 * with customizable indentation, error detection, and file export.
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var inputArea = document.getElementById('jf-input');
  var outputArea = document.getElementById('jf-output');
  var statusBadge = document.getElementById('jf-status');
  var errorMessageEl = document.getElementById('jf-error-message');
  var indentSelect = document.getElementById('jf-indent');

  var btnFormat = document.getElementById('jf-btn-format');
  var btnMinify = document.getElementById('jf-btn-minify');
  var btnValidate = document.getElementById('jf-btn-validate');
  var btnCopy = document.getElementById('jf-btn-copy');
  var btnClear = document.getElementById('jf-btn-clear');
  var btnSample = document.getElementById('jf-btn-sample');
  var btnDownload = document.getElementById('jf-btn-download');

  var statInputSize = document.getElementById('jf-stat-input-size');
  var statOutputSize = document.getElementById('jf-stat-output-size');

  if (!inputArea || !outputArea) return;

  var SAMPLE_JSON = JSON.stringify({
    appName: "OmniTools Suite",
    version: "2.4.0",
    isClientSide: true,
    privacyFocused: true,
    features: [
      "Word Counter & Text Analyzer",
      "Canvas Image Resizer",
      "Percentage Calculator",
      "JSON Formatter & Validator",
      "Offline QR Code Generator"
    ],
    metadata: {
      author: "OmniTools Team",
      license: "MIT",
      requiresBackend: false,
      adSenseCompliant: true
    },
    userPreferences: {
      theme: "dark",
      autoFormat: true,
      cookieConsent: true
    }
  }, null, 2);

  function getIndentSetting() {
    var val = indentSelect ? indentSelect.value : '2';
    if (val === 'tab') return '\t';
    return parseInt(val, 10) || 2;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function updateSizes(inStr, outStr) {
    if (statInputSize) {
      statInputSize.textContent = formatBytes(new Blob([inStr]).size);
    }
    if (statOutputSize) {
      statOutputSize.textContent = formatBytes(new Blob([outStr]).size);
    }
  }

  function setStatus(isValid, message) {
    if (!statusBadge) return;
    if (isValid === null) {
      statusBadge.textContent = 'Waiting for input';
      statusBadge.className = 'badge badge-secondary';
      if (errorMessageEl) errorMessageEl.style.display = 'none';
    } else if (isValid) {
      statusBadge.textContent = 'Valid JSON';
      statusBadge.className = 'badge badge-success';
      if (errorMessageEl) errorMessageEl.style.display = 'none';
    } else {
      statusBadge.textContent = 'Invalid JSON';
      statusBadge.className = 'badge badge-primary';
      if (errorMessageEl) {
        errorMessageEl.style.display = 'block';
        errorMessageEl.textContent = message || 'Syntax error in JSON string.';
      }
    }
  }

  function formatJSON() {
    var raw = inputArea.value.trim();
    if (!raw) {
      outputArea.value = '';
      setStatus(null);
      updateSizes('', '');
      return;
    }

    try {
      var parsed = JSON.parse(raw);
      var indent = getIndentSetting();
      var formatted = JSON.stringify(parsed, null, indent);
      outputArea.value = formatted;
      setStatus(true);
      updateSizes(raw, formatted);
      window.showToast('JSON formatted successfully!', 'success');
    } catch (err) {
      setStatus(false, err.message);
      outputArea.value = '';
      updateSizes(raw, '');
      window.showToast('Invalid JSON: ' + err.message, 'error');
    }
  }

  function minifyJSON() {
    var raw = inputArea.value.trim();
    if (!raw) {
      outputArea.value = '';
      setStatus(null);
      updateSizes('', '');
      return;
    }

    try {
      var parsed = JSON.parse(raw);
      var minified = JSON.stringify(parsed);
      outputArea.value = minified;
      setStatus(true);
      updateSizes(raw, minified);
      window.showToast('JSON minified successfully!', 'success');
    } catch (err) {
      setStatus(false, err.message);
      outputArea.value = '';
      updateSizes(raw, '');
      window.showToast('Invalid JSON: ' + err.message, 'error');
    }
  }

  function validateJSONOnly() {
    var raw = inputArea.value.trim();
    if (!raw) {
      setStatus(null);
      window.showToast('Please enter some JSON to validate.', 'info');
      return;
    }

    try {
      JSON.parse(raw);
      setStatus(true);
      window.showToast('Syntax is valid JSON!', 'success');
    } catch (err) {
      setStatus(false, err.message);
      window.showToast('Invalid JSON: ' + err.message, 'error');
    }
  }

  // Button Listeners
  if (btnFormat) btnFormat.addEventListener('click', formatJSON);
  if (btnMinify) btnMinify.addEventListener('click', minifyJSON);
  if (btnValidate) btnValidate.addEventListener('click', validateJSONOnly);

  if (indentSelect) {
    indentSelect.addEventListener('change', function() {
      if (outputArea.value) {
        formatJSON();
      }
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', function() {
      var text = outputArea.value;
      if (!text) {
        window.showToast('No formatted JSON to copy.', 'info');
        return;
      }
      window.copyToClipboard(text, 'Formatted JSON copied to clipboard!');
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', function() {
      inputArea.value = '';
      outputArea.value = '';
      setStatus(null);
      updateSizes('', '');
      inputArea.focus();
      window.showToast('Input cleared.', 'info');
    });
  }

  if (btnSample) {
    btnSample.addEventListener('click', function() {
      inputArea.value = SAMPLE_JSON;
      formatJSON();
    });
  }

  if (btnDownload) {
    btnDownload.addEventListener('click', function() {
      var text = outputArea.value || inputArea.value;
      if (!text) {
        window.showToast('No JSON available to download.', 'info');
        return;
      }

      var blob = new Blob([text], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 1000);

      window.showToast('Downloaded JSON file!', 'success');
    });
  }

  // Auto-indent on Tab key in editor
  inputArea.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
      this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
    }
  });

  // Initial state
  setStatus(null);
});
