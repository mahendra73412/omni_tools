/**
 * OmniTools - Image Resizer Tool
 * Client-side browser image processing using Canvas API.
 * Zero server uploads, instant previews, format conversion, and memory safety.
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var dropzone = document.getElementById('ir-dropzone');
  var fileInput = document.getElementById('ir-file-input');
  var workspace = document.getElementById('ir-controls-panel');
  var previewImg = document.getElementById('ir-preview-img');

  var widthInput = document.getElementById('ir-width');
  var heightInput = document.getElementById('ir-height');
  var lockAspectCheckbox = document.getElementById('ir-lock-aspect');
  var formatSelect = document.getElementById('ir-format');
  var qualitySlider = document.getElementById('ir-quality');
  var qualityVal = document.getElementById('ir-quality-val');
  var qualityGroup = document.getElementById('ir-quality-group');

  var origDimText = document.getElementById('ir-orig-dim');
  var origSizeText = document.getElementById('ir-orig-size');
  var newDimText = document.getElementById('ir-new-dim');
  var estSizeText = document.getElementById('ir-est-size');

  var btnDownload = document.getElementById('ir-btn-download');
  var btnReset = document.getElementById('ir-btn-reset');
  var presetButtons = document.querySelectorAll('.ir-preset-btn');

  // State variables
  var loadedImage = null;
  var originalWidth = 0;
  var originalHeight = 0;
  var originalFileSize = 0;
  var originalFileName = 'image';
  var aspectRatio = 1;
  var currentObjectUrl = null;
  var downloadUrl = null;

  if (!dropzone || !fileInput) return;

  // File drag & drop events
  ['dragenter', 'dragover'].forEach(function(eventName) {
    dropzone.addEventListener(eventName, function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(function(eventName) {
    dropzone.addEventListener(eventName, function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', function(e) {
    var dt = e.dataTransfer;
    var files = dt.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  });

  dropzone.addEventListener('click', function() {
    fileInput.click();
  });

  fileInput.addEventListener('change', function() {
    if (fileInput.files && fileInput.files.length > 0) {
      handleFile(fileInput.files[0]);
    }
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function handleFile(file) {
    if (!file.type.match(/^image\//)) {
      window.showToast('Please upload a valid image file (PNG, JPG, WebP, etc.).', 'error');
      return;
    }

    // Revoke previous object URLs to prevent leaks
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
    }
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }

    originalFileSize = file.size;
    originalFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        loadedImage = img;
        originalWidth = img.naturalWidth || img.width;
        originalHeight = img.naturalHeight || img.height;
        aspectRatio = originalWidth / originalHeight;

        // Populate inputs
        widthInput.value = originalWidth;
        heightInput.value = originalHeight;

        // Info display
        if (origDimText) origDimText.textContent = originalWidth + ' x ' + originalHeight + ' px';
        if (origSizeText) origSizeText.textContent = formatBytes(originalFileSize);

        // Preview
        previewImg.src = e.target.result;
        workspace.style.display = 'block';
        dropzone.style.display = 'none';

        updateOutputPreview();
        window.showToast('Image loaded successfully!', 'success');
      };
      img.onerror = function() {
        window.showToast('Failed to parse image file.', 'error');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Dimension changes
  widthInput.addEventListener('input', function() {
    var w = parseInt(widthInput.value, 10);
    if (!w || w <= 0) return;
    if (lockAspectCheckbox.checked && aspectRatio > 0) {
      var newH = Math.round(w / aspectRatio);
      heightInput.value = newH;
    }
    updateOutputPreview();
  });

  heightInput.addEventListener('input', function() {
    var h = parseInt(heightInput.value, 10);
    if (!h || h <= 0) return;
    if (lockAspectCheckbox.checked && aspectRatio > 0) {
      var newW = Math.round(h * aspectRatio);
      widthInput.value = newW;
    }
    updateOutputPreview();
  });

  // Format and quality controls
  if (formatSelect) {
    formatSelect.addEventListener('change', function() {
      var isLosslessPng = formatSelect.value === 'image/png';
      if (qualityGroup) {
        qualityGroup.style.display = isLosslessPng ? 'none' : 'block';
      }
      updateOutputPreview();
    });
  }

  if (qualitySlider) {
    qualitySlider.addEventListener('input', function() {
      if (qualityVal) {
        qualityVal.textContent = qualitySlider.value + '%';
      }
      updateOutputPreview();
    });
  }

  // Preset percentage/resolution buttons
  presetButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (!loadedImage) return;

      var preset = btn.getAttribute('data-preset');
      if (preset === '25') {
        widthInput.value = Math.max(1, Math.round(originalWidth * 0.25));
        heightInput.value = Math.max(1, Math.round(originalHeight * 0.25));
      } else if (preset === '50') {
        widthInput.value = Math.max(1, Math.round(originalWidth * 0.50));
        heightInput.value = Math.max(1, Math.round(originalHeight * 0.50));
      } else if (preset === '75') {
        widthInput.value = Math.max(1, Math.round(originalWidth * 0.75));
        heightInput.value = Math.max(1, Math.round(originalHeight * 0.75));
      } else if (preset === '100') {
        widthInput.value = originalWidth;
        heightInput.value = originalHeight;
      } else if (preset === '1080p') {
        widthInput.value = 1920;
        heightInput.value = 1080;
      } else if (preset === 'square') {
        var minDim = Math.min(originalWidth, originalHeight);
        widthInput.value = minDim;
        heightInput.value = minDim;
      }
      updateOutputPreview();
    });
  });

  // Debounce canvas processing
  var renderTimeout = null;
  function updateOutputPreview() {
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(renderResizedImage, 150);
  }

  function renderResizedImage() {
    if (!loadedImage) return;

    var targetW = parseInt(widthInput.value, 10);
    var targetH = parseInt(heightInput.value, 10);

    if (!targetW || targetW <= 0 || !targetH || targetH <= 0) {
      return;
    }

    if (newDimText) {
      newDimText.textContent = targetW + ' x ' + targetH + ' px';
    }

    var canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    var ctx = canvas.getContext('2d');

    // High quality bicubic scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(loadedImage, 0, 0, targetW, targetH);

    var mimeType = formatSelect ? formatSelect.value : 'image/png';
    var quality = qualitySlider ? (parseInt(qualitySlider.value, 10) / 100) : 0.9;

    canvas.toBlob(function(blob) {
      if (!blob) return;

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      downloadUrl = URL.createObjectURL(blob);

      if (estSizeText) {
        estSizeText.textContent = formatBytes(blob.size);
      }
    }, mimeType, quality);
  }

  // Download trigger
  if (btnDownload) {
    btnDownload.addEventListener('click', function() {
      if (!loadedImage) {
        window.showToast('Please upload an image first.', 'info');
        return;
      }

      var targetW = parseInt(widthInput.value, 10);
      var targetH = parseInt(heightInput.value, 10);
      var mimeType = formatSelect ? formatSelect.value : 'image/png';
      var ext = 'png';
      if (mimeType === 'image/jpeg') ext = 'jpg';
      if (mimeType === 'image/webp') ext = 'webp';

      var canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      var ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(loadedImage, 0, 0, targetW, targetH);

      var quality = qualitySlider ? (parseInt(qualitySlider.value, 10) / 100) : 0.9;

      canvas.toBlob(function(blob) {
        if (!blob) return;
        var tempUrl = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.download = originalFileName + '-resized-' + targetW + 'x' + targetH + '.' + ext;
        link.href = tempUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(function() {
          URL.revokeObjectURL(tempUrl);
        }, 1000);

        window.showToast('Resized image downloaded!', 'success');
      }, mimeType, quality);
    });
  }

  // Reset tool
  if (btnReset) {
    btnReset.addEventListener('click', function() {
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      currentObjectUrl = null;
      downloadUrl = null;
      loadedImage = null;
      fileInput.value = '';
      workspace.style.display = 'none';
      dropzone.style.display = 'block';
      window.showToast('Reset complete.', 'info');
    });
  }
});
