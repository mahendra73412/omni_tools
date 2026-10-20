/**
 * OmniTools - Percentage Calculator Tool
 * Multi-calculator suite:
 * 1. What is P% of X?
 * 2. X is what percent of Y?
 * 3. Percentage increase/decrease from X to Y
 * 4. Add/Subtract P% to/from X
 */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Calculator 1: What is P% of X?
  var calc1P = document.getElementById('c1-p');
  var calc1X = document.getElementById('c1-x');
  var calc1Result = document.getElementById('c1-result');
  var calc1Formula = document.getElementById('c1-formula');
  var calc1Copy = document.getElementById('c1-btn-copy');

  function updateCalc1() {
    var p = parseFloat(calc1P.value);
    var x = parseFloat(calc1X.value);

    if (isNaN(p) || isNaN(x)) {
      calc1Result.textContent = '—';
      if (calc1Formula) calc1Formula.textContent = 'Enter values above';
      return;
    }

    var result = (p / 100) * x;
    var formatted = formatNumber(result);
    calc1Result.textContent = formatted;
    if (calc1Formula) {
      calc1Formula.textContent = '(' + p + ' / 100) × ' + x + ' = ' + formatted;
    }
  }

  // Calculator 2: X is what percent of Y?
  var calc2X = document.getElementById('c2-x');
  var calc2Y = document.getElementById('c2-y');
  var calc2Result = document.getElementById('c2-result');
  var calc2Formula = document.getElementById('c2-formula');
  var calc2Copy = document.getElementById('c2-btn-copy');

  function updateCalc2() {
    var x = parseFloat(calc2X.value);
    var y = parseFloat(calc2Y.value);

    if (isNaN(x) || isNaN(y)) {
      calc2Result.textContent = '—';
      if (calc2Formula) calc2Formula.textContent = 'Enter values above';
      return;
    }

    if (y === 0) {
      calc2Result.textContent = 'Error: Cannot divide by zero';
      if (calc2Formula) calc2Formula.textContent = 'Division by zero is undefined';
      return;
    }

    var result = (x / y) * 100;
    var formatted = formatNumber(result) + '%';
    calc2Result.textContent = formatted;
    if (calc2Formula) {
      calc2Formula.textContent = '(' + x + ' / ' + y + ') × 100 = ' + formatted;
    }
  }

  // Calculator 3: Percentage Change (Increase / Decrease)
  var calc3From = document.getElementById('c3-from');
  var calc3To = document.getElementById('c3-to');
  var calc3Result = document.getElementById('c3-result');
  var calc3Formula = document.getElementById('c3-formula');
  var calc3Copy = document.getElementById('c3-btn-copy');

  function updateCalc3() {
    var from = parseFloat(calc3From.value);
    var to = parseFloat(calc3To.value);

    if (isNaN(from) || isNaN(to)) {
      calc3Result.textContent = '—';
      if (calc3Formula) calc3Formula.textContent = 'Enter initial and final values';
      return;
    }

    if (from === 0) {
      calc3Result.textContent = 'Error: Base value cannot be zero';
      if (calc3Formula) calc3Formula.textContent = 'Relative change from 0 is undefined';
      return;
    }

    var diff = to - from;
    var percentChange = (diff / Math.abs(from)) * 100;
    var formatted = formatNumber(Math.abs(percentChange)) + '%';
    var direction = diff >= 0 ? 'Increase' : 'Decrease';
    var sign = diff >= 0 ? '+' : '-';

    calc3Result.textContent = sign + formatted + ' (' + direction + ')';
    if (calc3Formula) {
      calc3Formula.textContent = '((' + to + ' - ' + from + ') / |' + from + '|) × 100 = ' + sign + formatted;
    }
  }

  // Calculator 4: Add / Subtract P% from X
  var calc4Val = document.getElementById('c4-val');
  var calc4Pct = document.getElementById('c4-pct');
  var calc4Mode = document.getElementById('c4-mode'); // add or subtract
  var calc4Result = document.getElementById('c4-result');
  var calc4Formula = document.getElementById('c4-formula');
  var calc4Copy = document.getElementById('c4-btn-copy');

  function updateCalc4() {
    var val = parseFloat(calc4Val.value);
    var pct = parseFloat(calc4Pct.value);
    var mode = calc4Mode ? calc4Mode.value : 'add';

    if (isNaN(val) || isNaN(pct)) {
      calc4Result.textContent = '—';
      if (calc4Formula) calc4Formula.textContent = 'Enter value and percentage';
      return;
    }

    var delta = (pct / 100) * val;
    var finalVal = mode === 'add' ? val + delta : val - delta;
    var formatted = formatNumber(finalVal);
    var sign = mode === 'add' ? '+' : '-';

    calc4Result.textContent = formatted;
    if (calc4Formula) {
      calc4Formula.textContent = val + ' ' + sign + ' ' + formatNumber(delta) + ' (' + pct + '%) = ' + formatted;
    }
  }

  function formatNumber(num) {
    if (Number.isInteger(num)) {
      return num.toLocaleString();
    }
    // Limit to 4 decimal places without trailing zeros
    return parseFloat(num.toFixed(4)).toLocaleString(undefined, { maximumFractionDigits: 4 });
  }

  // Attach event listeners for real-time calculation
  if (calc1P && calc1X) {
    calc1P.addEventListener('input', updateCalc1);
    calc1X.addEventListener('input', updateCalc1);
  }
  if (calc2X && calc2Y) {
    calc2X.addEventListener('input', updateCalc2);
    calc2Y.addEventListener('input', updateCalc2);
  }
  if (calc3From && calc3To) {
    calc3From.addEventListener('input', updateCalc3);
    calc3To.addEventListener('input', updateCalc3);
  }
  if (calc4Val && calc4Pct) {
    calc4Val.addEventListener('input', updateCalc4);
    calc4Pct.addEventListener('input', updateCalc4);
    if (calc4Mode) calc4Mode.addEventListener('change', updateCalc4);
  }

  // Copy button listeners
  function setupCopyBtn(btn, targetEl) {
    if (!btn || !targetEl) return;
    btn.addEventListener('click', function() {
      var val = targetEl.textContent.trim();
      if (!val || val === '—' || val.startsWith('Error')) {
        window.showToast('No valid calculation result to copy.', 'info');
        return;
      }
      window.copyToClipboard(val, 'Result copied: ' + val);
    });
  }

  setupCopyBtn(calc1Copy, calc1Result);
  setupCopyBtn(calc2Copy, calc2Result);
  setupCopyBtn(calc3Copy, calc3Result);
  setupCopyBtn(calc4Copy, calc4Result);

  // Global Reset Button
  var btnResetAll = document.getElementById('pc-btn-reset');
  if (btnResetAll) {
    btnResetAll.addEventListener('click', function() {
      if (calc1P) calc1P.value = '';
      if (calc1X) calc1X.value = '';
      if (calc2X) calc2X.value = '';
      if (calc2Y) calc2Y.value = '';
      if (calc3From) calc3From.value = '';
      if (calc3To) calc3To.value = '';
      if (calc4Val) calc4Val.value = '';
      if (calc4Pct) calc4Pct.value = '';
      updateCalc1();
      updateCalc2();
      updateCalc3();
      updateCalc4();
      window.showToast('All calculators reset.', 'info');
    });
  }

  // Example Buttons
  var btnExample = document.getElementById('pc-btn-example');
  if (btnExample) {
    btnExample.addEventListener('click', function() {
      if (calc1P) calc1P.value = '15';
      if (calc1X) calc1X.value = '250';
      if (calc2X) calc2X.value = '45';
      if (calc2Y) calc2Y.value = '180';
      if (calc3From) calc3From.value = '80';
      if (calc3To) calc3To.value = '120';
      if (calc4Val) calc4Val.value = '150';
      if (calc4Pct) calc4Pct.value = '20';
      if (calc4Mode) calc4Mode.value = 'add';
      updateCalc1();
      updateCalc2();
      updateCalc3();
      updateCalc4();
      window.showToast('Loaded example calculations.', 'success');
    });
  }

  // Initialize with initial defaults if preset or empty
  updateCalc1();
  updateCalc2();
  updateCalc3();
  updateCalc4();
});
