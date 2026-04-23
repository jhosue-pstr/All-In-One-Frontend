export const BloqueCountdown = {
  id: 'bloque-countdown',
  label: 'Cuenta Regresiva (Countdown)',
  attributes: {
    class: 'fa fa-clock',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="countdown-container" style="font-family: sans-serif; max-width: 600px; margin: 20px auto; text-align: center; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);">
  <h3 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Oferta por tiempo limitado</h3>
  <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
    <div class="countdown-item" style="min-width: 80px;">
      <div style="font-size: 42px; font-weight: 700; line-height: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);" id="countdown-days">02</div>
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; opacity: 0.9;">Días</div>
    </div>
    <div style="font-size: 36px; font-weight: 300; align-self: center; opacity: 0.7;">:</div>
    <div class="countdown-item" style="min-width: 80px;">
      <div style="font-size: 42px; font-weight: 700; line-height: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);" id="countdown-hours">15</div>
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; opacity: 0.9;">Horas</div>
    </div>
    <div style="font-size: 36px; font-weight: 300; align-self: center; opacity: 0.7;">:</div>
    <div class="countdown-item" style="min-width: 80px;">
      <div style="font-size: 42px; font-weight: 700; line-height: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);" id="countdown-minutes">42</div>
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; opacity: 0.9;">Minutos</div>
    </div>
    <div style="font-size: 36px; font-weight: 300; align-self: center; opacity: 0.7;">:</div>
    <div class="countdown-item" style="min-width: 80px;">
      <div style="font-size: 42px; font-weight: 700; line-height: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);" id="countdown-seconds">09</div>
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; opacity: 0.9;">Segundos</div>
    </div>
  </div>
  <p style="margin: 20px 0 0 0; font-size: 14px; opacity: 0.9;">¡No te lo pierdas! La oferta termina pronto.</p>
</div>

<script>
(function() {
  // Set target date to 2 days, 15 hours, 42 minutes, 9 seconds from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  targetDate.setHours(targetDate.getHours() + 15);
  targetDate.setMinutes(targetDate.getMinutes() + 42);
  targetDate.setSeconds(targetDate.getSeconds() + 9);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('countdown-days').textContent = '00';
      document.getElementById('countdown-hours').textContent = '00';
      document.getElementById('countdown-minutes').textContent = '00';
      document.getElementById('countdown-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
</script>`
}
