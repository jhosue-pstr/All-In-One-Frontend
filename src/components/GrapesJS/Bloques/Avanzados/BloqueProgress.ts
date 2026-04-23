export const BloqueProgress = {
  id: 'bloque-progress',
  label: 'Barra de Progreso',
  attributes: {
    class: 'fa fa-tasks',
    'data-gjs-type': 'advanced',
    'data-category': 'Avanzados'
  },
  content: `<div class="progress-container" style="font-family: sans-serif; max-width: 600px; margin: 20px auto; display: flex; flex-direction: column; gap: 20px;">
  <!-- Simple Progress -->
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #333;">
      <span>Carga de archivo</span>
      <span>75%</span>
    </div>
    <div style="height: 12px; background: #e9ecef; border-radius: 6px; overflow: hidden;">
      <div style="height: 100%; width: 75%; background: linear-gradient(90deg, #28a745, #20c997); border-radius: 6px; transition: width 0.5s ease; box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);"></div>
    </div>
  </div>

  <!-- Striped Progress -->
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #333;">
      <span>Procesamiento</span>
      <span>45%</span>
    </div>
    <div style="height: 12px; background: #e9ecef; border-radius: 6px; overflow: hidden;">
      <div style="height: 100%; width: 45%; background: linear-gradient(90deg, #ffc107, #ff9800); border-radius: 6px; transition: width 0.5s ease; position: relative;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px);"></div>
      </div>
    </div>
  </div>

  <!-- Animated Progress -->
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; font-weight: 500; color: #333;">
      <span>Instalación</span>
      <span>90%</span>
    </div>
    <div style="height: 12px; background: #e9ecef; border-radius: 6px; overflow: hidden;">
      <div style="height: 100%; width: 90%; background: linear-gradient(90deg, #007bff, #0056b3); border-radius: 6px; transition: width 0.5s ease; animation: progress-animation 2s ease-in-out infinite;"></div>
    </div>
  </div>
</div>

<style>
@keyframes progress-animation {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
</style>

<script>
// Optional interactive demo: animate progress bars on hover
setTimeout(() => {
  document.currentScript.previousElementSibling.querySelectorAll('div[style*="width: "]').forEach(bar => {
    const currentWidth = parseInt(bar.style.width);
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = currentWidth + '%';
    }, 100);
  });
}, 500);
</script>`
}
