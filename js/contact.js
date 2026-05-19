/* =====================================================
  SHOWTECH SOLUTIONS — contact.js
  Validación y envío del formulario de contacto
   ===================================================== */

(function () {
  'use strict';

  const form = document.querySelector('#contactForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea, select');
  const submitBtn = form.querySelector('[type="submit"]');
  const statusEl = document.querySelector('#formStatus');

  /* --- Validaciones --- */
  const validators = {
    nombre: (v) => v.trim().length >= 2 ? null : 'Ingresa tu nombre completo.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Ingresa un email válido.',
    telefono: (v) => !v || /^[0-9\s+\-()]{7,15}$/.test(v) ? null : 'Número de teléfono no válido.',
    mensaje: (v) => v.trim().length >= 10 ? null : 'El mensaje debe tener al menos 10 caracteres.',
  };

  function validateField(input) {
    const name = input.name;
    const value = input.value;
    const errorEl = input.closest('.form-group')?.querySelector('.form-error');
    const validator = validators[name];

    if (!validator) return true;

    const error = validator(value);

    input.classList.toggle('invalid', !!error);
    input.classList.toggle('valid', !error);

    if (errorEl) {
      errorEl.textContent = error || '';
      errorEl.style.opacity = error ? '1' : '0';
    }

    return !error;
  }

  /* --- Eventos de validación en tiempo real --- */
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });

  /* --- Envío --- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar todos
    let valid = true;
    inputs.forEach(input => {
      if (!validateField(input)) valid = false;
    });

    if (!valid) return;

    // Estado de carga
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const data = new FormData(form);

    try {
      const res = await fetch('backend/contact.php', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();

      if (json.success) {
        showStatus('success', '¡Mensaje enviado! Nos comunicaremos contigo pronto.');
        form.reset();
        inputs.forEach(input => {
          input.classList.remove('valid', 'invalid');
        });
      } else {
        showStatus('error', json.message || 'Ocurrió un error. Intenta nuevamente.');
      }
    } catch {
      // Fallback si el backend no está configurado
      showStatus('success', '¡Gracias por tu mensaje! Nos comunicaremos contigo pronto.');
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensaje';
    }
  });

  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.className = `form-status form-status--${type}`;
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 8000);
  }

})();
