/**
 * OmniTools - QR Code Generator Tool
 * Client-side QR generation using bundled QRCode.js engine.
 * Customizable sizes, error correction levels, colors, and direct PNG download.
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var inputArea = document.getElementById('qr-input');
  var qrCanvasContainer = document.getElementById('qr-canvas-container');
  var sizeSelect = document.getElementById('qr-size');
  var ecSelect = document.getElementById('qr-ec-level');
  var colorDarkInput = document.getElementById('qr-color-dark');
  var colorLightInput = document.getElementById('qr-color-light');

  var btnGenerate = document.getElementById('qr-btn-generate');
  var btnDownload = document.getElementById('qr-btn-download');
  var btnClear = document.getElementById('qr-btn-clear');
  var btnCopy = document.getElementById('qr-btn-copy');

  var quickTypeButtons = document.querySelectorAll('.qr-type-btn');
  var qrStatus = document.getElementById('qr-status-msg');

  if (!inputArea || !qrCanvasContainer) return;

  var currentQRCodeInstance = null;

  function getErrorCorrectionLevel(val) {
    if (typeof QRCode === 'undefined' || !QRCode.CorrectLevel) {
      return 2; // H
    }
    switch (val) {
      case 'L': return QRCode.CorrectLevel.L;
      case 'M': return QRCode.CorrectLevel.M;
      case 'Q': return QRCode.CorrectLevel.Q;
      case 'H': return QRCode.CorrectLevel.H;
      default: return QRCode.CorrectLevel.H;
    }
  }

  function generateQRCode() {
    var text = inputArea.value.trim();

    if (!text) {
      qrCanvasContainer.innerHTML = '<div class="qr-placeholder"><p>Enter text or a URL above to generate your QR Code</p></div>';
      if (qrStatus) qrStatus.textContent = 'Waiting for input...';
      return;
    }

    var size = parseInt(sizeSelect ? sizeSelect.value : 256, 10) || 256;
    var ecLevel = getErrorCorrectionLevel(ecSelect ? ecSelect.value : 'H');
    var darkColor = colorDarkInput ? colorDarkInput.value : '#000000';
    var lightColor = colorLightInput ? colorLightInput.value : '#ffffff';

    qrCanvasContainer.innerHTML = '';

    try {
      if (typeof QRCode === 'undefined') {
        throw new Error('QRCode library is loading or missing.');
      }

      currentQRCodeInstance = new QRCode(qrCanvasContainer, {
        text: text,
        width: size,
        height: size,
        colorDark: darkColor,
        colorLight: lightColor,
        correctLevel: ecLevel
      });

      if (qrStatus) {
        qrStatus.textContent = 'QR Code generated (' + size + 'x' + size + ' px)';
      }
    } catch (err) {
      qrCanvasContainer.innerHTML = '<div class="qr-placeholder"><p style="color:var(--color-danger);">Generation failed: ' + err.message + '</p></div>';
      if (qrStatus) qrStatus.textContent = 'Error: ' + err.message;
    }
  }

  // Live generate with debounce
  var inputDebounce = null;
  inputArea.addEventListener('input', function() {
    clearTimeout(inputDebounce);
    inputDebounce = setTimeout(generateQRCode, 250);
  });

  // Settings change
  if (sizeSelect) sizeSelect.addEventListener('change', generateQRCode);
  if (ecSelect) ecSelect.addEventListener('change', generateQRCode);
  if (colorDarkInput) colorDarkInput.addEventListener('input', generateQRCode);
  if (colorLightInput) colorLightInput.addEventListener('input', generateQRCode);

  if (btnGenerate) {
    btnGenerate.addEventListener('click', function() {
      generateQRCode();
      window.showToast('QR Code generated!', 'success');
    });
  }

  // Clear button
  if (btnClear) {
    btnClear.addEventListener('click', function() {
      inputArea.value = '';
      generateQRCode();
      inputArea.focus();
      window.showToast('Input cleared.', 'info');
    });
  }

  // Download button
  if (btnDownload) {
    btnDownload.addEventListener('click', function() {
      var canvas = qrCanvasContainer.querySelector('canvas');
      if (!canvas) {
        window.showToast('Please generate a QR Code first.', 'info');
        return;
      }

      try {
        var dataUrl = canvas.toDataURL('image/png');
        var link = document.createElement('a');
        link.download = 'omnitools-qrcode.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.showToast('QR Code downloaded as PNG!', 'success');
      } catch (err) {
        window.showToast('Failed to download QR image.', 'error');
      }
    });
  }

  // Copy Image to Clipboard
  if (btnCopy) {
    btnCopy.addEventListener('click', function() {
      var canvas = qrCanvasContainer.querySelector('canvas');
      if (!canvas) {
        window.showToast('Please generate a QR Code first.', 'info');
        return;
      }

      if (canvas.toBlob && navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(function(blob) {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]).then(function() {
            window.showToast('QR Code copied to clipboard!', 'success');
          }).catch(function() {
            window.showToast('Unable to copy image directly. Use Download instead.', 'info');
          });
        }, 'image/png');
      } else {
        window.showToast('Direct image copy not supported by your browser. Use Download instead.', 'info');
      }
    });
  }

  // Quick preset templates
  quickTypeButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      quickTypeButtons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var type = btn.getAttribute('data-type');
      if (type === 'url') {
        inputArea.value = 'https://example.com';
      } else if (type === 'wifi') {
        inputArea.value = 'WIFI:S:MyHomeNetwork;T:WPA;P:SuperSecretPassword;;';
      } else if (type === 'email') {
        inputArea.value = 'mailto:contact@example.com?subject=Inquiry&body=Hello%20OmniTools';
      } else if (type === 'phone') {
        inputArea.value = 'tel:+1234567890';
      } else if (type === 'text') {
        inputArea.value = 'Hello from OmniTools! Fast, private, browser-based utilities.';
      }
      generateQRCode();
    });
  });

  // Initial render
  if (inputArea.value) {
    generateQRCode();
  } else {
    inputArea.value = 'https://omnitools.example.com';
    generateQRCode();
  }
});
